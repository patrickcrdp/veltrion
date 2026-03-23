import { Suspense } from 'react';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PolicySection = ({ title, content }: { title: string, content: string }) => (
    <div className="space-y-6 animate-fade-in group py-12 border-b border-white/5 last:border-none">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase group-hover:text-accent-cyan transition-colors duration-500">
            {title}
        </h2>
        <p className="text-slate-400 font-medium leading-relaxed italic text-lg pr-0 md:pr-12">
            {content}
        </p>
    </div>
);

function PoliciesPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent border-none overflow-x-hidden">
            <DigitalRain />
            <Navbar />

            <main className="relative pt-32 pb-24 px-6 md:px-12 lg:px-48">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-8 mb-24">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                            <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Transparência & Ética</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Políticas da <span className="text-accent-cyan italic">Veltrion.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-bold max-w-2xl italic leading-relaxed">
                            "Compromisso global com a segurança de dados, privacidade e excelência logística."
                        </p>
                    </div>

                    <div className="space-y-4">
                        <PolicySection 
                            title="Privacidade & Dados" 
                            content="A Veltrion utiliza protocolos de criptografia militar para proteger suas informações. Seus dados nunca são compartilhados com terceiros e são usados exclusivamente para garantir uma experiência de compra personalizada."
                        />
                        <PolicySection 
                            title="Envio & Logística" 
                            content="Trabalhamos com os parceiros mais rápidos do mercado global. O prazo médio de entrega é de 5 a 12 dias úteis, com rastreamento em tempo real garantido por satélite."
                        />
                        <PolicySection 
                            title="Sustentabilidade" 
                            content="Nossas embalagens são 100% biodegradáveis e nossas operações buscam a neutralidade de carbono, mantendo o compromisso com o futuro do planeta."
                        />
                        <PolicySection 
                            title="Segurança no Pagamento" 
                            content="Transações processadas via gateway certificado PCI-DSS. Aceitamos as principais bandeiras, Pix e cripto-ativos selecionados com confirmação imediata."
                        />
                    </div>

                    <div className="mt-24 p-12 rounded-[48px] bg-white/5 border border-white/10 text-center">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Ultima Atualização: Janeiro 2025</p>
                    </div>
                </div>
            </main>

            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default PoliciesPage;
