import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPromptModal: React.FC = () => {
    const { showLoginPrompt, dismissLoginPrompt } = useAuth();

    // Auto-fechar após 8 segundos
    useEffect(() => {
        if (showLoginPrompt) {
            const timer = setTimeout(() => dismissLoginPrompt(), 8000);
            return () => clearTimeout(timer);
        }
    }, [showLoginPrompt]);

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') dismissLoginPrompt();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (!showLoginPrompt) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
                onClick={dismissLoginPrompt}
            ></div>

            {/* Card Premium */}
            <div className="relative max-w-md w-full animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan/20 via-purple-500/10 to-accent-cyan/20 rounded-[32px] blur-xl opacity-60 animate-pulse"></div>
                
                <div className="relative bg-background-dark/95 backdrop-blur-2xl border border-white/10 rounded-[28px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,149,255,0.3)]">
                    
                    {/* Header decorativo */}
                    <div className="relative h-2 w-full bg-gradient-to-r from-accent-cyan via-blue-400 to-purple-500"></div>
                    
                    {/* Conteúdo */}
                    <div className="p-8 md:p-10 flex flex-col items-center text-center gap-6">
                        
                        {/* Ícone animado */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent-cyan/20 blur-2xl rounded-full animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-accent-cyan/20 to-purple-500/10 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,149,255,0.2)]">
                                <span className="material-icons-round text-4xl text-accent-cyan">lock</span>
                            </div>
                        </div>

                        {/* Texto Principal */}
                        <div className="space-y-3">
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                                Acesso <span className="text-accent-cyan">Necessário</span>
                            </h3>
                            <p className="text-sm text-white/50 font-medium leading-relaxed max-w-xs mx-auto">
                                Para realizar compras na Veltrion, você precisa estar conectado e ter aceito nossos termos e políticas.
                            </p>
                        </div>

                        {/* Passos visuais */}
                        <div className="w-full space-y-3 py-2">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-accent-cyan/20 transition-all">
                                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-accent-cyan font-black text-sm">1</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black text-white uppercase tracking-wider">Aceitar Termos</p>
                                    <p className="text-[9px] text-white/30 font-medium">
                                        <Link to="/termos-de-servico" onClick={dismissLoginPrompt} className="text-accent-cyan/60 hover:text-accent-cyan underline">Termos de Serviço</Link>
                                        {' e '}
                                        <Link to="/politica-de-privacidade" onClick={dismissLoginPrompt} className="text-accent-cyan/60 hover:text-accent-cyan underline">Política de Privacidade</Link>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-accent-cyan/20 transition-all">
                                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-accent-cyan font-black text-sm">2</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black text-white uppercase tracking-wider">Conectar com Google</p>
                                    <p className="text-[9px] text-white/30 font-medium">Acesse com sua conta Google para uma experiência segura</p>
                                </div>
                            </div>
                        </div>

                        {/* Botão de Ação */}
                        <button
                            onClick={dismissLoginPrompt}
                            className="w-full py-4 bg-gradient-to-r from-accent-cyan to-blue-500 text-white font-black rounded-full text-[11px] uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_40px_rgba(0,149,255,0.3)] hover:shadow-[0_15px_50px_rgba(0,149,255,0.5)]"
                        >
                            Entendi, vou me conectar
                        </button>

                        {/* Texto de confiança */}
                        <div className="flex items-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">
                            <span className="material-icons-round text-[10px]">verified_user</span>
                            Ambiente 100% seguro · Veltrion Passport
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes zoom-in-95 {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes slide-in-from-bottom-4 {
                    from { transform: translateY(16px); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default LoginPromptModal;
