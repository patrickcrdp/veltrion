import React from 'react';
import { shopifyService, ShopifyProduct } from '../services/shopifyService';
import { useAuth } from '../context/AuthContext';

const BannerSection: React.FC = () => {
    const [product, setProduct] = React.useState<ShopifyProduct | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { canPurchase, promptLogin } = useAuth();

    React.useEffect(() => {
        shopifyService.getProducts(1).then(data => {
            if (data && data.length > 0) setProduct(data[0]);
            setLoading(false);
        });
    }, []);

    if (loading || !product) return null;

    return (
        <section className="container mx-auto px-4 sm:px-6 py-6 md:py-12">
            <div className="relative overflow-hidden rounded-[30px] md:rounded-[40px] bg-card-dark border border-white/5 group shadow-2xl shadow-black/40 min-h-[500px] flex flex-col md:flex-row">
                
                {/* Background Shadow Overlay (Mobile Adaptation) */}
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-background-dark via-background-dark/80 md:via-background-dark/60 to-transparent z-10 pointer-events-none"></div>

                {/* Background Image / Decoration */}
                <div className="absolute inset-0 md:relative md:w-1/2 h-64 md:h-auto z-0 overflow-hidden order-1 md:order-2">
                    <div className="absolute inset-0 bg-accent-cyan/10 blur-[100px] rounded-full -right-20 -top-20"></div>
                    <img
                        src={product.images[0]}
                        className="w-full h-full object-cover opacity-60 md:opacity-80 group-hover:scale-110 transition-transform duration-1000 ease-out p-4 md:p-12 mix-blend-screen brightness-90 md:brightness-75 bg-transparent"
                        alt={product.title}
                    />
                </div>

                {/* Text Content */}
                <div className="relative z-20 p-6 sm:p-10 md:p-16 flex flex-col justify-center items-start md:w-1/2 order-2 md:order-1 flex-grow">
                    <span className="inline-block px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan/80 text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 border border-accent-cyan/20 backdrop-blur-sm">
                        Destaque da Semana
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tighter">
                        {product.title}
                        <br className="hidden md:block" />
                        <span className="text-white/40 group-hover:text-white/60 transition-colors duration-700 ml-2 md:ml-0">O Futuro na sua mão.</span>
                    </h2>
                    
                    <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                        {['Inovação de Ponta', 'Performance Extrema', 'Tecnologia Veltrion'].map((benefit, i) => (
                            <li key={i} className="flex items-center gap-3 text-secondary/80 text-xs sm:text-sm font-medium">
                                <span className="material-icons-round text-accent-cyan/40 text-base md:text-lg">check_circle</span>
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-8 mb-6 md:mb-8">
                        <div className="flex flex-col">
                            <span className="text-2xl sm:text-3xl font-black text-white">
                                {shopifyService.formatMoney(product.price)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (!canPurchase) {
                                promptLogin();
                                return;
                            }
                            shopifyService.buyNow(product.variantId);
                        }}
                        className="group relative w-full sm:w-auto px-10 py-4 bg-white text-black font-black rounded-full text-[10px] sm:text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                    >
                        <span className="relative z-10">{canPurchase ? 'Comprar Agora' : 'Fazer Login'}</span>
                        <div className="absolute inset-0 bg-accent-cyan -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white z-20">
                            {canPurchase ? 'Comprar Agora' : 'Login'}
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BannerSection;

