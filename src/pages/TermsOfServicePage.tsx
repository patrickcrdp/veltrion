import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';

const Footer = lazy(() => import('../components/Footer'));

const Section = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
    <div id={id} className="mb-12 group transition-all duration-700">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-accent-cyan group-hover:w-16 transition-all duration-700"></span>
            {title}
        </h3>
        <div className="text-slate-400 font-medium leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

function TermsOfServicePage() {
    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent overflow-x-hidden">
            <DigitalRain />
            <Navbar />
            <ScrollToTop />

            <main className="relative pt-40 pb-24 px-6 md:px-12 lg:px-48">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-20 space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-4 text-accent-cyan mb-2">
                            <span className="material-icons-round text-3xl">gavel</span>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Acordo de Utilização Veltrion</h4>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Termos de <span className="text-accent-cyan italic">Serviço.</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4 italic">
                            Jurisdição Digital | Veltrion Cell
                        </p>
                    </div>

                    {/* Content Glassmorphism */}
                    <div className="p-10 md:p-16 rounded-[60px] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        
                        <Section title="Visão Geral" id="overview">
                            <p>Bem-vindo à VELTRION! Os termos “nós”, “nosso” e “nossos” referem-se à VELTRION. A VELTRION opera esta loja e site, oferecendo uma experiência de compra personalizada (os “Serviços”). A VELTRION é fornecida pela Shopify.</p>
                            <p>Ao visitar ou utilizar nossos Serviços, você concorda em cumprir estes Termos de Serviço e nossa <Link to="/politica-de-privacidade" className="text-accent-cyan underline">Política de Privacidade</Link>. Se você não concordar, não deve utilizar nossos Serviços.</p>
                        </Section>

                        <Section title="SEÇÃO 1 - Acesso e Conta" id="section1">
                            <p>Para utilizar os Serviços, você garante que todas as informações fornecidas são corretas e completas. Você é responsável pela segurança da sua conta e por todas as atividades realizadas nela.</p>
                        </Section>

                        <Section title="SEÇÃO 2 - Nossos Produtos" id="section2">
                            <p>Fazemos esforços para apresentar os produtos com precisão, mas cores e aparência podem variar conforme o dispositivo. As descrições podem ser alteradas sem aviso prévio.</p>
                        </Section>

                        <Section title="SEÇÃO 3 - Pedidos" id="section3">
                            <p>Ao fazer um pedido, você está fazendo uma oferta de compra. Compras seguem a <Link to="/politica-de-reembolso" className="text-accent-cyan underline">Política de Reembolso</Link>. Você declara que as compras são para uso pessoal, não revenda.</p>
                        </Section>

                        <Section title="SEÇÃO 4 - Preços e Cobrança" id="section4">
                            <p>Preços e promoções podem mudar sem aviso. Os preços não incluem impostos, frete ou taxas, salvo indicação contrária. Você garante que o método de pagamento é válido.</p>
                        </Section>

                        <Section title="SEÇÃO 6 - Propriedade Intelectual" id="section6">
                            <p>Todo conteúdo do site (marca, textos, imagens, vídeos, etc.) pertence à VELTRION ou licenciadores e é protegido por leis de propriedade intelectual. É proibido copiar ou distribuir sem autorização.</p>
                        </Section>

                        <Section title="SEÇÃO 13 - Usos Proibidos" id="section13">
                            <p>É expressamente proibido:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                <li>Violar leis ou fraudar sistemas;</li>
                                <li>Enviar spam ou invadir sistemas;</li>
                                <li>Usar bots, scraping ou Agentes não identificados;</li>
                                <li>Prejudicar outros usuários.</li>
                            </ul>
                        </Section>

                        <Section title="SEÇÃO 17 - Limitação de Responsabilidade" id="section17">
                            <p>Na máxima extensão da lei, não nos responsabilizamos por danos diretos ou indiretos, incluindo perda de lucros, dados ou outros prejuízos decorrentes do uso dos Serviços.</p>
                        </Section>

                        <Section title="Contato" id="contact">
                            <p>Dúvidas sobre os Termos de Serviço devem ser enviadas para:</p>
                            <p className="text-white font-black text-lg">
                                <a href="mailto:veltrioncell@gmail.com" className="text-accent-cyan underline hover:tracking-wider transition-all">veltrioncell@gmail.com</a>
                            </p>
                        </Section>
                    </div>
                </div>
            </main>

            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default TermsOfServicePage;
