import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Importa todas as imagens da pasta especificada usando as funcionalidades do Vite
// Define o tipo do retorno como string, pois { as: 'url' } retorna as URLs diretas
const imageModules = import.meta.glob('../assets/imagens_scrooll/*.png', { eager: true, import: 'default' });
// As chaves do objeto não têm garantias 100% de ondem, então ordenamos os valores
const imageUrls = Object.values(imageModules).sort() as string[];

const ScrollImageSequence: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>(new Array(imageUrls.length));
    const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    // Variável que guarda o estado do frame do canvas para que o GSAP as anime
    const sequenceRef = useRef({ frame: 0 });
    const loadedCountRef = useRef(0);

    useEffect(() => {
        if (imageUrls.length === 0) return;

        // 1. Prioridade Máxima: Carrega os primeiros frames para visualização imediata
        const priorityFrames = [0, 1, 2, 3, 4, 5];

        const loadImage = (index: number) => {
            if (imagesRef.current[index]) return Promise.resolve();
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.src = imageUrls[index];
                img.onload = () => {
                    imagesRef.current[index] = img;
                    loadedCountRef.current++;

                    const p = Math.floor((loadedCountRef.current / imageUrls.length) * 100);
                    setProgress(p);

                    if (index === 0) {
                        setFirstFrameLoaded(true);
                        requestAnimationFrame(() => renderFrame(0));
                    }

                    resolve();
                };
            });
        };

        // Carrega frames prioritários primeiro
        const loadSequence = async () => {
            // Primeiro quadro
            await loadImage(0);

            // Quadros iniciais
            await Promise.all(priorityFrames.map(i => loadImage(i)));

            // Quadros "chave" (um a cada 10) para permitir o scroll básico rápido
            const keys = [];
            for (let i = 0; i < imageUrls.length; i += 10) keys.push(i);
            await Promise.all(keys.map(i => loadImage(i)));

            // Resto dos quadros
            for (let i = 0; i < imageUrls.length; i++) {
                if (!imagesRef.current[i]) {
                    loadImage(i);
                }
            }
        };

        loadSequence();
    }, []);

    const renderFrame = (index: number) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Encontra a imagem mais próxima carregada caso a solicitada ainda não esteja pronta
        let img = imagesRef.current[index];
        if (!img) {
            // Busca a imagem carregada mais próxima para evitar "piscadas"
            for (let i = index; i >= 0; i--) {
                if (imagesRef.current[i]) { img = imagesRef.current[i]; break; }
            }
        }

        if (!img) return;

        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);

        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    };

    useEffect(() => {
        // Inicializa o ScrollTrigger assim que tivermos o primeiro frame
        if (!firstFrameLoaded) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=400%",
                    scrub: 0.5,
                    pin: true,
                    invalidateOnRefresh: true,
                }
            });

            tl.to(sequenceRef.current, {
                frame: imageUrls.length - 1,
                snap: "frame",
                ease: "none",
                duration: 1,
                onUpdate: () => renderFrame(Math.floor(sequenceRef.current.frame))
            }, 0);

            tl.to('.text-1', { opacity: 0, y: -20, duration: 0.05 }, 0.15);
            tl.fromTo('.text-2', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.3);
            tl.to('.text-2', { opacity: 0, x: -50, duration: 0.08, ease: 'power2.in' }, 0.55);
            tl.fromTo('.text-3', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.65);
            tl.to('.text-3', { opacity: 0, x: 50, duration: 0.08, ease: 'power2.in' }, 0.85);
            tl.fromTo('.scroll-indicator', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.95);

        }, containerRef);

        return () => ctx.revert();
    }, [firstFrameLoaded]); // Inicia apenas após o primeiro frame carregar

    // Redimensionamento
    useEffect(() => {
        const resize = () => {
            if (canvasRef.current && firstFrameLoaded) {
                const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap em 2 para performance
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;
                renderFrame(Math.floor(sequenceRef.current.frame));
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [firstFrameLoaded]);

    return (
        <section ref={containerRef} className="relative w-full bg-[#050505]">
            <div className="w-full h-screen overflow-hidden bg-[#050505] relative">

                {/* Loader Inteligente: Desaparece assim que o primeiro frame entra */}
                {!firstFrameLoaded && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050505] text-white">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/5 border-2 border-t-accent-cyan rounded-full animate-spin mb-4" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50">Iniciando Experiência...</span>
                            <span className="text-[8px] mt-2 text-accent-cyan">{progress}%</span>
                        </div>
                    </div>
                )}

                {/* Canvas Renderizado */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Camadas de Interface (UI Overlays) */}
                <div className="absolute inset-0 container mx-auto px-6 pointer-events-none">

                    {/* Frame Inicial: Texto no Centro */}
                    <div className="text-1 absolute inset-0 flex flex-col items-center justify-center pt-24">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter text-center max-w-3xl drop-shadow-2xl">
                            O novo padrão de <span className="text-accent-cyan">performance</span>
                        </h2>
                    </div>

                    {/* Frame 40-70: Texto Fase Explosão (Processador) */}
                    <div className="text-2 absolute inset-y-0 left-6 lg:left-12 flex flex-col justify-center w-full md:w-1/2 lg:w-1/3">
                        <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <h3 className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.3em] mb-4">Potência Extrema</h3>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                                Processador Octa-core<br />e Memória RAM
                            </h2>
                            <p className="text-secondary/60 font-medium text-sm leading-relaxed">
                                Desempenho absoluto para qualquer tarefa. A arquitetura interna explode em velocidade, deixando lag e travamentos no passado.
                            </p>
                        </div>
                    </div>

                    {/* Frame 85-110: Texto Remontagem (Câmeras) */}
                    <div className="text-3 absolute inset-y-0 right-6 lg:right-12 flex flex-col justify-center w-full md:w-1/2 lg:w-1/3 items-end text-right">
                        <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <h3 className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.3em] mb-4">Capturas Perfeitas</h3>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                                Sistema de Câmeras<br />Profissional
                            </h2>
                            <p className="text-secondary/60 font-medium text-sm leading-relaxed">
                                Sensores de alta precisão realinhados milimetricamente para captar cada detalhe, seja na luz do dia ou no breu da noite.
                            </p>
                        </div>
                    </div>

                    {/* Final Frame (120): Botão */}
                    {/* Indicador de continuidade no final da sequência */}
                    <div className="scroll-indicator absolute bottom-20 inset-x-0 mx-auto flex flex-col items-center justify-center opacity-0 pointer-events-none">
                        <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.4em] mb-2">Deslize para ver mais</span>
                        <div className="animate-bounce">
                            <span className="material-icons-round text-white text-4xl">expand_more</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ScrollImageSequence;
