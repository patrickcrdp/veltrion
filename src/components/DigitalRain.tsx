import { useEffect, useRef } from 'react';

const DigitalRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width: number, height: number;
        interface RainLine {
            x: number;
            y: number;
            length: number;
            speed: number;
            originalX: number;
            opacity: number;
            color: string;
            glowColor: string;
            width: number;
        }
        let lines: RainLine[] = [];
        let animationFrameId: number;
        const mouse = { x: -1000, y: -1000 };

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            const isMobile = width < 768;
            const adaptiveCount = isMobile ? 60 : 150;

            lines = [];
            for (let i = 0; i < adaptiveCount; i++) {
                const isWhite = Math.random() > 0.8;
                const opacity = Math.random() * (0.3 - 0.1) + 0.1;
                const speedMult = Math.random() * (0.8 - 0.4) + 0.4;
                const line = {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    length: Math.random() * 300 + 150,
                    speed: (Math.random() * 2 + 1) * speedMult,
                    originalX: 0,
                    opacity: opacity,
                    color: isWhite ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 149, 255, ${opacity})`,
                    glowColor: isWhite ? `rgba(255, 255, 255, ${opacity * 0.4})` : `rgba(0, 75, 255, ${opacity * 0.4})`,
                    width: Math.random() * 0.6 + 0.2
                };
                line.originalX = line.x;
                lines.push(line);
            }
        };

        let lastTime = 0;
        const fpsInterval = 1000 / 30; // Limita a 30 FPS para salvar bateria/CPU em fundo

        const animate = (time: number) => {
            if (document.hidden) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            const elapsed = time - lastTime;
            if (elapsed > fpsInterval) {
                lastTime = time - (elapsed % fpsInterval);

                ctx.fillStyle = '#020617';
                ctx.fillRect(0, 0, width, height);

                lines.forEach(line => {
                    const dx = mouse.x - line.x;
                    const dy = mouse.y - line.y;
                    const distanceSquared = dx * dx + dy * dy;
                    let targetX = line.originalX;

                    if (distanceSquared < 10000) { // 100^2
                        const distance = Math.sqrt(distanceSquared);
                        const angle = Math.atan2(line.y - mouse.y, line.x - mouse.x);
                        targetX += Math.cos(angle) * (100 - distance) * 0.15;
                    }

                    line.x += (targetX - line.x) * 0.08;
                    line.y += line.speed;

                    if (line.y > height) {
                        line.y = -line.length;
                        line.x = Math.random() * width;
                        line.originalX = line.x;
                    }

                    const gradient = ctx.createLinearGradient(line.x, line.y, line.x, line.y + line.length);
                    gradient.addColorStop(0, 'transparent');
                    gradient.addColorStop(0.8, line.color);
                    gradient.addColorStop(1, '#fff');

                    ctx.beginPath();
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = line.width;
                    ctx.moveTo(line.x, line.y);
                    ctx.lineTo(line.x, line.y + line.length);
                    ctx.stroke();
                });
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            id="digitalRainCanvas"
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 bg-background-dark"
        />
    );
};

export default DigitalRain;
