import React, { useState, useEffect } from 'react';

const AccessibilityMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [contrast, setContrast] = useState(false);
    const [grayscale, setGrayscale] = useState(false);
    const [dyslexic, setDyslexic] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        root.style.fontSize = `${fontSize}%`;

        if (contrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        if (grayscale) {
            root.style.filter = 'grayscale(100%)';
        } else {
            root.style.filter = 'none';
        }

        if (dyslexic) {
            root.classList.add('dyslexic-font');
        } else {
            root.classList.remove('dyslexic-font');
        }
    }, [fontSize, contrast, grayscale, dyslexic]);

    const handleReset = () => {
        setFontSize(100);
        setContrast(false);
        setGrayscale(false);
        setDyslexic(false);
    };

    return (
        <>
            {/* Botão Flutuante */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-accent-cyan text-white p-3 rounded-l-2xl shadow-2xl hover:scale-110 transition-all flex items-center justify-center border-l border-t border-b border-white/20"
                    title="Menu de Acessibilidade"
                >
                    <span className="material-icons-round text-2xl">accessibility</span>
                </button>
            </div>

            {/* Painel do Menu */}
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-end p-4 pointer-events-none">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsOpen(false)} />

                    <div className="relative w-full max-w-sm bg-background-dark/95 border border-white/10 rounded-[32px] shadow-3xl p-8 pointer-events-auto animate-in fade-in slide-in-from-right-10 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <span className="material-icons-round text-accent-cyan">accessibility_new</span>
                                Acessibilidade
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <span className="material-icons-round text-2xl">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Tamanho da Fonte */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Tamanho da Fonte: {fontSize}%</label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setFontSize(Math.max(80, fontSize - 10))} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-accent-cyan hover:border-accent-cyan transition-all text-sm font-bold">A-</button>
                                    <button onClick={() => setFontSize(100)} className="px-4 py-3 bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">Normal</button>
                                    <button onClick={() => setFontSize(Math.min(150, fontSize + 10))} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-accent-cyan hover:border-accent-cyan transition-all text-sm font-bold">A+</button>
                                </div>
                            </div>

                            {/* Contraste */}
                            <button
                                onClick={() => setContrast(!contrast)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${contrast ? 'bg-accent-cyan border-accent-cyan text-white' : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'}`}
                            >
                                <span className="font-bold">Alto Contraste</span>
                                <span className="material-icons-round">{contrast ? 'toggle_on' : 'toggle_off'}</span>
                            </button>

                            {/* Grayscale */}
                            <button
                                onClick={() => setGrayscale(!grayscale)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${grayscale ? 'bg-accent-cyan border-accent-cyan text-white' : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'}`}
                            >
                                <span className="font-bold">Modo Escuro / Cinza</span>
                                <span className="material-icons-round">{grayscale ? 'toggle_on' : 'toggle_off'}</span>
                            </button>

                            {/* Fonte Clara */}
                            <button
                                onClick={() => setDyslexic(!dyslexic)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${dyslexic ? 'bg-accent-cyan border-accent-cyan text-white' : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'}`}
                            >
                                <span className="font-bold">Legibilidade (Fonte Clara)</span>
                                <span className="material-icons-round">{dyslexic ? 'toggle_on' : 'toggle_off'}</span>
                            </button>

                            {/* Reset */}
                            <button
                                onClick={handleReset}
                                className="w-full py-4 mt-4 border border-accent-cyan/20 text-accent-cyan font-black rounded-full text-[10px] uppercase tracking-[0.3em] hover:bg-accent-cyan hover:text-white transition-all"
                            >
                                Resetar Configurações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .high-contrast {
                    filter: contrast(125%) brightness(110%);
                }
                .high-contrast img {
                    filter: contrast(110%);
                }
                /* Aplica a fonte apenas se NÃO for um ícone */
                .dyslexic-font *:not(.material-icons-round) {
                    font-family: 'Inter', sans-serif !important;
                    letter-spacing: 0.03em !important;
                    text-transform: none !important;
                }
            `}</style>
        </>
    );
};

export default AccessibilityMenu;
