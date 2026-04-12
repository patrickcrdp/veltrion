import { Suspense } from 'react';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AboutPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent border-none overflow-x-hidden">
            <DigitalRain />
            <Navbar />

            <main className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24">
                <div className="container mx-auto max-w-5xl">
                    {/* Hero Section */}
                    <div className="space-y-8 mb-32">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                            <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">A Nossa História</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
                            Inovação na <span className="text-accent-cyan italic">essência.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed italic">
                            "A Veltrion nasceu da vontade de democratizar o acesso à tecnologia de ponta, 
                            curando as melhores inovações globais para transformar a rotina dos nossos clientes."
                        </p>
                    </div>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div className="space-y-8 p-10 bg-white/5 rounded-[48px] border border-white/10 backdrop-blur-xl">
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Missão & Visão</h2>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Nossa missão é conectar pessoas ao futuro através de dispositivos que aliam design premium e performance excepcional. 
                                Visualizamos um mundo onde a tecnologia é transparente e potencializa a capacidade humana.
                            </p>
                        </div>
                        <div className="space-y-8 p-10 bg-white/5 rounded-[48px] border border-white/10 backdrop-blur-xl flex flex-col justify-center">
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">O Compromisso</h2>
                            <p className="text-slate-400 leading-relaxed text-sm italic">
                                "Garantimos não apenas o melhor hardware, mas uma experiência de suporte e curadoria única no mercado mobile."
                            </p>
                        </div>
                    </div>

                    {/* Stats or Facts */}
                    <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center py-16 border-y border-white/5">
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-white">+50k</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan/60">Clientes Felizes</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-white">200+</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan/60">Modelos Premium</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-black text-white">24/7</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan/60">Suporte Ativo</div>
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

export default AboutPage;
