import React, { Suspense, lazy } from 'react';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';

const Footer = lazy(() => import('../components/Footer'));

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-12 group transition-all duration-700">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-accent-cyan group-hover:w-16 transition-all duration-700"></span>
            {title}
        </h3>
        <div className="text-slate-400 font-medium leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

function PrivacyPolicyPage() {
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
                            <span className="material-icons-round text-3xl">policy</span>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Segurança de Dados Veltrion</h4>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Política de <span className="text-accent-cyan italic">Privacidade.</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4 italic">
                            Última atualização: 22 de março de 2026
                        </p>
                    </div>

                    {/* Content Glassmorphism */}
                    <div className="p-10 md:p-16 rounded-[60px] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        
                        <Section title="Visão Geral">
                            <p>A VELTRION opera esta loja e site, incluindo todas as informações, conteúdos, recursos, ferramentas, produtos e serviços relacionados, com o objetivo de oferecer a você, cliente, uma experiência de compra personalizada (os “Serviços”).</p>
                            <p>A VELTRION é fornecida pela Shopify, que nos permite disponibilizar os Serviços a você. Esta Política de Privacidade descreve como coletamos, usamos e divulgamos suas informações pessoais quando você visita, utiliza, realiza uma compra ou outra transação por meio dos Serviços.</p>
                        </Section>

                        <Section title="Informações Coletadas">
                            <p>Podemos coletar ou processar as seguintes categorias de informações pessoais, dependendo da sua interação:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                <li><strong>Dados de contato:</strong> nome, endereço, cobrança, entrega, telefone e e-mail.</li>
                                <li><strong>Informações financeiras:</strong> dados de cartão de crédito/débito, contas e transações.</li>
                                <li><strong>Informações da conta:</strong> nome de usuário, senha, preferências e configurações.</li>
                                <li><strong>Informações de transações:</strong> produtos visualizados, adicionados ao carrinho, favoritos e histórico.</li>
                                <li><strong>Informações do dispositivo:</strong> navegador, IP, conexão e identificadores únicos.</li>
                            </ul>
                        </Section>

                        <Section title="Uso das Informações">
                            <p>Podemos usar suas informações para:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                <li>Fornecer e melhorar os Serviços;</li>
                                <li>Marketing e publicidade personalizada;</li>
                                <li>Segurança e prevenção de fraudes;</li>
                                <li>Comunicação e suporte ao cliente;</li>
                                <li>Cumprimento de obrigações legais.</li>
                            </ul>
                        </Section>

                        <Section title="Relação com a Shopify">
                            <p>Os Serviços são hospedados pela Shopify, que processa seus dados para operar e melhorar os serviços. Seus dados podem ser transferidos para outros países. Para mais informações, acesse a Política de Privacidade da Shopify.</p>
                        </Section>

                        <Section title="Seus Direitos">
                            <p>Dependendo da sua localização, você pode ter direitos como:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                <li>Acesso aos dados e exclusão;</li>
                                <li>Correção e Portabilidade;</li>
                                <li>Cancelar comunicações de marketing.</li>
                            </ul>
                        </Section>

                        <Section title="Segurança">
                            <p>Nenhum sistema é totalmente seguro. O tempo de retenção dos dados depende da finalidade, obrigações legais e necessidade operacional.</p>
                        </Section>

                        <Section title="Contato">
                            <p>Se tiver dúvidas ou quiser exercer seus direitos, entre em contato:</p>
                            <p className="text-white font-black">E-mail: <a href="mailto:veltrioncell@gmail.com" className="text-accent-cyan underline">veltrioncell@gmail.com</a></p>
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

export default PrivacyPolicyPage;
