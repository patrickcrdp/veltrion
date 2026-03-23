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

function RefundPolicyPage() {
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
                            <span className="material-icons-round text-3xl">verified_user</span>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Portal de Transparência Veltrion</h4>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Reembolso & <span className="text-accent-cyan italic">Devolução.</span>
                        </h1>
                    </div>

                    {/* Content Glassmorphism */}
                    <div className="p-10 md:p-16 rounded-[60px] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        
                        <Section title="Elegibilidade de 30 Dias">
                            <p>Temos uma política de devolução de 30 dias, o que significa que você tem 30 dias após receber seu item para solicitar uma devolução.</p>
                            <p>Para ser elegível para devolução, o item deve estar nas mesmas condições em que foi recebido, sem uso, com etiquetas e na embalagem original. Você também precisará do recibo ou comprovante de compra.</p>
                        </Section>

                        <Section title="Como Iniciar">
                            <p>Para iniciar uma devolução, você pode entrar em contato conosco pelo e-mail <a href="mailto:veltrioncell@gmail.com" className="text-accent-cyan underline">veltrioncell@gmail.com</a> ou pelo número <a href="tel:+5561998063734" className="text-accent-cyan underline">(+55) 61 9 9806-3734</a>.</p>
                            <p>Se sua devolução for aceita, enviaremos uma etiqueta de envio para devolução, bem como instruções sobre como e para onde enviar seu pacote. Itens enviados de volta sem solicitação prévia de devolução não serão aceitos.</p>
                        </Section>

                        <Section title="Danos e Problemas">
                            <p>Por favor, verifique seu pedido ao recebê-lo e entre em contato conosco imediatamente caso o item esteja com defeito, danificado ou se você recebeu o item errado, para que possamos avaliar o problema e resolvê-lo.</p>
                        </Section>

                        <Section title="Exceções não Retornáveis">
                            <p>Alguns tipos de itens não podem ser devolvidos, como produtos perecíveis, produtos personalizados e produtos de cuidados pessoais. Também não aceitamos devoluções de materiais perigosos, líquidos inflamáveis ou gases.</p>
                            <p className="text-white/60 italic font-black text-sm">Infelizmente, não podemos aceitar devoluções de itens em promoção ou cartões-presente.</p>
                        </Section>

                        <Section title="Trocas Eficientes">
                            <p>A maneira mais rápida de garantir que você receba o que deseja é devolver o item que você possui e, após a aceitação da devolução, realizar uma nova compra separadamente para o novo item.</p>
                        </Section>

                        <Section title="União Europeia">
                            <p>Não obstante o acima, se a mercadoria estiver sendo enviada para a União Europeia, você tem o direito de cancelar ou devolver seu pedido em até 14 dias, por qualquer motivo e sem necessidade de justificativa.</p>
                        </Section>

                        <Section title="Processamento de Reembolso">
                            <p>Notificaremos você assim que recebermos e analisarmos sua devolução, informando se o reembolso foi aprovado ou não.</p>
                            <p>Se aprovado, o valor será automaticamente reembolsado no método de pagamento original em até 10 dias úteis. Lembre-se de que pode levar algum tempo para que o banco ou a operadora do cartão de crédito processe o registro.</p>
                            <p>Se mais de 15 dias úteis tiverem se passado desde a aprovação, entre em contato pelo e-mail <a href="mailto:veltrioncell@gmail.com" className="text-accent-cyan underline">veltrioncell@gmail.com</a>.</p>
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

export default RefundPolicyPage;
