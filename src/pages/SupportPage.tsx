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
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366" />
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
