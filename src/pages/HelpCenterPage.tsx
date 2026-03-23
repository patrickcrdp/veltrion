import { Suspense } from 'react';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HelpCategory = ({ icon, title, items }: { icon: string, title: string, items: string[] }) => (
    <div className="group relative p-12 bg-white/5 rounded-[48px] border border-white/10 backdrop-blur-2xl transition-all duration-500 hover:border-accent-cyan/40 hover:scale-[1.02] space-y-8">
        <div className="w-16 h-16 rounded-3xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan group-hover:text-white transition-all duration-500">
            <span className="material-icons-round text-3xl">{icon}</span>
        </div>
        <div className="space-y-4">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{title}</h3>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group/item">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan opacity-40 group-hover/item:opacity-100 scale-0 group-hover/item:scale-100 transition-all"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

function HelpCenterPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent border-none overflow-x-hidden">
            <DigitalRain />
            <Navbar />

            <main className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center space-y-8 mb-32">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                            <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Serviço de Apoio</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Central de <span className="text-accent-cyan italic">Respostas.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto italic leading-relaxed">
                            "Soluções rápidas e suporte técnico detalhado para que você nunca perca o ritmo da inovação."
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <HelpCategory 
                            icon="shopping_bag" 
                            title="Pedidos" 
                            items={['Status da Entrega', 'Alterar Endereço', 'Cancelamentos', 'Formas de Pagamento']} 
                        />
                        <HelpCategory 
                            icon="settings_suggest" 
                            title="Técnico" 
                            items={['Configuração Inicial', 'Garantia Premium', 'Atualizações', 'Compatibilidade']} 
                        />
                        <HelpCategory 
                            icon="contact_support" 
                            title="Conta" 
                            items={['Segurança de Dados', 'Recuperar Senha', 'Histórico de Compras', 'Preferências']} 
                        />
                    </div>

                    {/* Quick Search Replacement Text */}
                    <div className="mt-32 p-16 bg-white/5 rounded-[64px] border border-white/10 text-center flex flex-col items-center gap-8">
                        <h2 className="text-3xl font-black text-white tracking-tighter italic">Não encontrou o que precisava?</h2>
                        <a 
                            href="/suporte"
                            className="px-12 py-6 rounded-full bg-accent-cyan text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(0,149,255,0.4)] active:scale-95"
                        >
                            Falar com um Especialista
                        </a>
                    </div>
                </div>
            </main>

            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default HelpCenterPage;
