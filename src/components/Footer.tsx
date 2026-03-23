import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('sending');

        try {
            const response = await fetch("https://formsubmit.co/ajax/veltrioncell@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    message: "Novo cadastro na newsletter Veltrion!",
                    _subject: "🚀 Novo Lead: Newsletter Veltrion"
                })
            });

            if (response.ok) {
                setStatus('success');
                setEmail('');
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                throw new Error('Falha no envio');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <footer className="bg-transparent border-t border-border-dark pt-32 pb-16 relative z-10 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-cyan/5 blur-[150px] rounded-full translate-y-1/2"></div>

            <div className="container mx-auto px-6 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 mb-24">
                    {/* Brand & About */}
                    <div className="space-y-8">
                        <Link className="text-3xl font-black tracking-tighter text-white uppercase italic block" to="/">
                            Veltrion<span className="text-accent-cyan inline-block animate-pulse">.</span>
                        </Link>
                        <p className="text-secondary text-sm font-medium leading-relaxed max-w-xs">
                            A melhor experiência em tecnologia mobile com atendimento premium e a curadoria das melhores inovações do mercado.
                        </p>
                        <div className="flex gap-4">
                            {/* Facebook */}
                            <a className="group relative w-12 h-12 rounded-full bg-card-dark/50 border border-white/5 flex items-center justify-center transition-all duration-500 hover:border-[#1877F2]/50 hover:shadow-[0_0_20px_rgba(24,119,242,0.2)]" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5 group-hover:fill-[#1877F2] fill-slate-500 transition-colors" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a className="group relative w-12 h-12 rounded-full bg-card-dark/50 border border-white/5 flex items-center justify-center transition-all duration-500 hover:border-[#E4405F]/50 hover:shadow-[0_0_20px_rgba(228,64,95,0.2)]" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5 group-hover:fill-[#E4405F] fill-slate-500 transition-colors" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            {/* WhatsApp */}
                            <a className="group relative w-12 h-12 rounded-full bg-card-dark/50 border border-white/5 flex items-center justify-center transition-all duration-500 hover:border-[#25D366]/50 hover:shadow-[0_0_20px_rgba(37,211,102,0.2)]" href="https://wa.me/556198063734" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5 group-hover:fill-[#25D366] fill-slate-500 transition-colors" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.768-5.764-5.768zm3.393 8.225c-.149.423-.753.763-1.042.812-.294.05-.583.078-.969-.026-.237-.064-.537-.156-1.125-.395-2.094-.853-3.414-2.91-3.518-3.048-.103-.139-.838-1.114-.838-2.143 0-1.03.538-1.536.732-1.742.193-.205.421-.256.562-.256h.403c.125 0 .284-.005.419.324.143.348.487 1.189.53 1.275.041.085.069.185.012.298-.056.113-.083.185-.166.284l-.249.284c-.085.085-.175.18-.075.352.1.171.442.73.951 1.184.654.582 1.206.763 1.378.85s.273.064.373-.05.101-.114.437-.508.553-.68.117-.171.233-.143.393-.085.161.058 1.016.48 1.192.568s.292.133.336.208c.045.076.045.438-.104.861zM12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.653 1.444 5.158L2 22l5.003-1.315C8.428 21.516 10.141 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.63 0-3.146-.484-4.416-1.314l-.317-.209-2.981.785.798-2.913-.231-.368C4.01 14.73 3.5 13.42 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
                                </svg>
                            </a>
                            {/* Share Dynamic */}
                            <button onClick={() => navigator.share({ title: 'Veltrion', text: 'Confira as novidades na Veltrion!', url: window.location.href })} className="group relative w-12 h-12 rounded-full bg-card-dark/50 border border-white/5 flex items-center justify-center transition-all duration-500 hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-accent-cyan/10 cursor-pointer">
                                <span className="material-icons-round text-sm group-hover:text-accent-cyan transition-colors">share</span>
                                <div className="absolute -inset-1 rounded-full border border-accent-cyan/10 scale-0 group-hover:scale-100 transition-transform"></div>
                            </button>
                        </div>
                    </div>

                    {/* Middle Section: Navigation & Institutional */}
                    <div className="lg:col-span-2 flex flex-col md:flex-row justify-center gap-16 lg:gap-32">
                        {/* Links: Categories */}
                        <div className="flex flex-col items-center min-w-[140px]">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 border-b-2 border-accent-cyan pb-2 px-6 whitespace-nowrap">Navegação</h5>
                            <ul className="flex flex-col items-center gap-5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 text-center">
                                <li><Link className="hover:text-accent-cyan transition-all duration-300 hover:tracking-widest" to="/">Smartphones</Link></li>
                                <li><Link className="hover:text-accent-cyan transition-all duration-300 hover:tracking-widest" to="/acessorios">Acessórios</Link></li>
                                <li><Link className="hover:text-accent-cyan transition-all duration-300 hover:tracking-widest" to="/ofertas">Ofertas</Link></li>
                            </ul>
                        </div>

                        {/* Links: Support */}
                        <div className="flex flex-col items-center min-w-[140px]">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 border-b-2 border-accent-cyan pb-2 px-6 whitespace-nowrap">Institucional</h5>
                            <ul className="flex flex-col items-center gap-5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 text-center">
                                 <li><Link className="hover:text-accent-cyan transition-all duration-300 hover:tracking-widest" to="/sobre">Sobre a Veltrion</Link></li>
                                 <li><Link className="hover:text-accent-cyan transition-all duration-300 hover:tracking-widest" to="/suporte">Central de Ajuda</Link></li>
                                 <li><Link className="hover:text-accent-cyan transition-all duration-300 hover:tracking-widest" to="/politica-de-reembolso">Reembolso & Devolução</Link></li>
                                 <li><Link className="hover:text-accent-cyan transition-all duration-300 hover:tracking-widest" to="/politica-de-privacidade">Privacidade Digital</Link></li>
                                 <li><Link className="hover:text-accent-cyan transition-all duration-300 hover:tracking-widest" to="/termos-de-servico">Termos de Uso</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="flex flex-col items-center lg:items-start w-full">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 border-b-2 border-accent-cyan pb-2 px-6 whitespace-nowrap text-center lg:text-left">Atendimento</h5>
                        <p className="text-sm text-secondary mb-8 font-medium italic text-center lg:text-left">Segunda a Sexta: 09h às 18h <br /> <a href="mailto:veltrioncell@gmail.com" className="hover:text-accent-cyan transition-colors">veltrioncell@gmail.com</a></p>
                        
                        <form onSubmit={handleSubscribe} className="relative group w-full max-w-xs lg:max-w-none">
                            <input
                                className="w-full bg-card-dark/40 backdrop-blur-md border border-white/5 rounded-full py-4 px-6 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-accent-cyan text-white placeholder:text-slate-600 transition-all outline-none mb-4 disabled:opacity-50"
                                placeholder={status === 'success' ? "E-MAIL CADASTRADO!" : "CADASTRE SEU EMAIL"}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={status === 'sending' || status === 'success'}
                            />
                            <button 
                                type="submit"
                                disabled={status === 'sending' || status === 'success'}
                                className={`w-full py-4 font-black rounded-full text-[10px] uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-2xl shadow-black/50 ${
                                    status === 'success' ? 'bg-accent-cyan text-white' : 'bg-white text-black hover:bg-accent-cyan hover:text-white'
                                }`}
                            >
                                {status === 'sending' ? 'ENVIANDO...' : status === 'success' ? 'CADASTRADO ✅' : 'Inscrever'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Legal */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">
                            © 2026 Veltrion. Todos os direitos reservados.
                        </p>
                        <p className="text-[9px] text-slate-600 max-w-sm leading-relaxed">
                            VELTRION LTDA - CNPJ: 65.828.431/0001-96 <br />
                            Ceilândia Norte, Brasília - DF
                        </p>
                    </div>

                    <div className="flex gap-6 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        {['Visa', 'Mastercard', 'Pix', 'ApplePay'].map((payment) => (
                            <div key={payment} className="h-6 flex items-center justify-center font-black text-white/50 text-[10px] uppercase tracking-widest px-4 border border-white/5 rounded backdrop-blur">
                                {payment}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

