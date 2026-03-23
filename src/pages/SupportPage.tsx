import { Suspense } from 'react';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SupportCard = ({ icon, title, value, type }: { icon: string | React.ReactNode, title: string, value: string, type: 'email' | 'tel' | 'general' }) => (
    <div className="group relative bg-card-dark/40 border border-white/5 rounded-[40px] p-10 transition-all duration-500 hover:border-accent-cyan/40 hover:scale-[1.02] flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan group-hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(0,149,255,0.1)] group-hover:shadow-[0_0_40px_rgba(0,149,255,0.3)]">
            {typeof icon === 'string' ? (
                <span className="material-icons-round text-4xl">{icon}</span>
            ) : (
                <div className="w-10 h-10 group-hover:invert transition-all duration-500">
                    {icon}
                </div>
            )}
        </div>
        <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-cyan/80">{title}</h3>
            <p className="text-xl font-black text-white tracking-tighter">{value}</p>
        </div>
        <a
            href={type === 'email' ? `mailto:${value}` : type === 'tel' ? `https://wa.me/556198063734` : '#'}
            target={type === 'tel' ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent-cyan hover:text-white hover:border-accent-cyan transition-all duration-300"
        >
            {type === 'tel' ? 'Chamar no WhatsApp' : 'Enviar Mensagem'}
        </a>
    </div>
);

function SupportPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent border-none overflow-x-hidden">
            <DigitalRain />
            <Navbar />

            <main className="relative pt-32 pb-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    {/* Header Section */}
                    <div className="text-center space-y-6 mb-24">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                            <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Suporte ao Cliente</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Como podemos <span className="text-accent-cyan italic">ajudar?</span>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto italic">
                            Nossa equipe técnica está pronta para resolver suas dúvidas e garantir que sua experiência Veltrion seja impecável.
                        </p>
                    </div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        <SupportCard
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shadow-[0_0_20px_rgba(37,211,102,0.4)] rounded-full">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.768-5.764-5.768zm3.393 8.225c-.149.423-.753.763-1.042.812-.294.05-.583.078-.969-.026-.237-.064-.537-.156-1.125-.395-2.094-.853-3.414-2.91-3.518-3.048-.103-.139-.838-1.114-.838-2.143 0-1.03.538-1.536.732-1.742.193-.205.421-.256.562-.256h.403c.125 0 .284-.005.419.324.143.348.487 1.189.53 1.275.041.085.069.185.012.298-.056.113-.083.185-.166.284l-.249.284c-.085.085-.175.18-.075.352.1.171.442.73.951 1.184.654.582 1.206.763 1.378.85s.273.064.373-.05.101-.114.437-.508.553-.68.117-.171.233-.143.393-.085.161.058 1.016.48 1.192.568s.292.133.336.208c.045.076.045.438-.104.861zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.653 1.444 5.158L2 22l5.003-1.315C8.428 21.516 10.141 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.63 0-3.146-.484-4.416-1.314l-.317-.209-2.981.785.798-2.913-.231-.368C4.01 14.73 3.5 13.42 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" fill="#25D366" />
                                </svg>
                            }
                            title="Atendimento Rápido"
                            value="+55 61 9806-3734"
                            type="tel"
                        />
                        <SupportCard
                            icon={
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shadow-[0_0_20px_rgba(234,67,53,0.3)]">
                                    <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.38l-9 6.75-9-6.75V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.4.15-.75.45-1.05.3-.3.65-.45 1.05-.45H3l9 6.75L21 3h1.5c.4 0 .75.15 1.05.45.3.3.45.65.45 1.05z" fill="#EA4335" />
                                </svg>
                            }
                            title="E-mail Oficial"
                            value="veltrioncell@gmail.com"
                            type="email"
                        />
                    </div>

                    {/* FAQ / Info Section */}
                    <div className="mt-32 p-12 bg-white/5 rounded-[48px] border border-white/10 backdrop-blur-2xl text-center space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-white italic tracking-tighter">Horário de Operação</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Segunda a Sexta — 09:00 - 18:00</p>
                        </div>
                        <div className="flex justify-center gap-12 text-slate-500">
                            <div className="flex items-center gap-2">
                                <span className="material-icons-round text-accent-cyan text-sm">verified</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Suporte Original</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-icons-round text-accent-cyan text-sm">speed</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Resposta Veloz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default SupportPage;
