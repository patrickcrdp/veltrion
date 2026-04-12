import React from 'react';
import { Link } from 'react-router-dom';
import { shopifyService, ShopifyProduct } from '../services/shopifyService';
import { useAuth } from '../context/AuthContext';

const FeatureSection: React.FC = () => {
    const [products, setProducts] = React.useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { canPurchase, promptLogin } = useAuth();

    React.useEffect(() => {
        shopifyService.getProducts(2).then(data => {
            if (data) setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading || products.length === 0) return null;

    return (
        <section className="relative w-full pt-32 pb-8 md:pt-48 md:pb-16 overflow-hidden bg-transparent perspective-1000">
            {/* Background Parallax Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-accent-cyan/10 blur-[180px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                
                {/* Moving Light Lines (Parallax Background) */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-accent-cyan to-transparent top-1/4 -skew-y-12 animate-slide-right"></div>
                    <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent top-2/3 skew-y-12 animate-slide-left" style={{ animationDelay: '1s' }}></div>
                </div>
            </div>

            {products.map((product, index) => (
                <div key={product.id} className="container mx-auto px-6 relative z-10 mb-64 last:mb-0">
                    <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-20 lg:gap-32`}>
                        
                        {/* Content Side */}
                        <div className="lg:w-1/2 space-y-12 order-2 lg:order-none">
                            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl group hover:border-accent-cyan/40 transition-all duration-500">
                                <span className="flex h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_15px_rgba(0,149,255,0.8)] animate-pulse"></span>
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90">Inovação Veltrion</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.0] tracking-tighter drop-shadow-2xl">
                                    {product.title}
                                </h2>
                                <div className="h-1.5 w-20 bg-accent-cyan rounded-full shadow-[0_0_20px_rgba(0,149,255,1)]"></div>
                            </div>

                            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-xl leading-relaxed italic">
                                "{product.description.split('.')[0]}."
                            </p>

                            <div className="flex flex-col sm:flex-row gap-8 pt-6">
                                <button
                                    onClick={() => {
                                        if (!canPurchase) {
                                            promptLogin();
                                            return;
                                        }
                                        shopifyService.buyNow(product.variantId);
                                    }}
                                    className="group relative px-14 py-6 bg-white text-black font-black rounded-full text-[12px] uppercase tracking-[0.3em] transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(0,149,255,0.4)] overflow-hidden"
                                >
                                    <span className="relative z-10">{canPurchase ? 'Comprar Agora' : 'Fazer Login para Comprar'}</span>
                                    <div className="absolute inset-0 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-black z-20">
                                        {canPurchase ? 'Comprar Agora' : 'Fazer Login para Comprar'}
                                    </span>
                                </button>
                                
                                <Link 
                                    to={`/produto/${product.handle}`}
                                    className="px-10 py-6 bg-transparent border border-white/20 text-white font-black rounded-full text-[11px] uppercase tracking-[0.3em] hover:bg-white/5 hover:border-white/40 transition-all active:scale-95 text-center"
                                >
                                    Especificações
                                </Link>
                            </div>
                        </div>

                        {/* 3D Product Side */}
                        <div className="lg:w-1/2 relative group perspective-1000 order-1 lg:order-none">
                            {/* Cinematic Glow Background */}
                            <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/20 to-transparent blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            
                            {/* Main Product Container with 3D Float */}
                            <div className="relative z-10 p-4 transform-gpu transition-all duration-[1.5s] [transition-timing-function:cubic-bezier(0.2,0,0,1)] hover:rotate-x-3 hover:rotate-y-[-5deg] animate-float-slow">
                                
                                {/* Elegant Rounded Container (No Shimmer) */}
                                <div className="relative overflow-hidden rounded-[40px] md:rounded-[64px] bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 p-4 sm:p-8 md:p-12 lg:p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] group-hover:border-accent-cyan/20 transition-all duration-[2s]">
                                    <img
                                        src={product.images[0]}
                                        className="w-full h-auto scale-[1.15] md:scale-100 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] group-hover:scale-110 md:group-hover:scale-[1.15] transition-transform duration-[3s] [transition-timing-function:cubic-bezier(0.2,0,0,1)] select-none"
                                        alt={product.title}
                                    />
                                </div>

                                {/* Floating Realistic Shadow Below */}
                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-black/40 blur-[40px] rounded-[100%] group-hover:scale-110 group-hover:bg-black/60 transition-all duration-[2.5s] z-0"></div>
                            </div>

                            {/* Volumetric Light Rays (Subtle Extra Layers) */}
                            <div className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] bg-gradient-conic from-accent-cyan/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-spin-slow"></div>
                        </div>

                    </div>
                </div>
            ))}

            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-30px); }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                @keyframes slide-right {
                    0% { transform: translateX(-100%) skew(-12deg); }
                    100% { transform: translateX(100%) skew(-12deg); }
                }
                @keyframes slide-left {
                    0% { transform: translateX(100%) skew(12deg); }
                    100% { transform: translateX(-100%) skew(12deg); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
                .animate-shimmer { animation: shimmer 3s infinite; }
                .animate-pulse-slow { animation: pulse-slow 10s infinite; }
                .animate-slide-right { animation: slide-right 15s linear infinite; }
                .animate-slide-left { animation: slide-left 15s linear infinite; }
                .animate-spin-slow { animation: spin-slow 30s linear infinite; }
                .perspective-1000 { perspective: 1000px; }
            `}</style>
        </section>
    );
};

export default FeatureSection;
