import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shopifyService, ShopifyProduct } from '../services/shopifyService';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductGridProps {
    collectionHandle?: string;
    title?: string;
}

const CarouselRowWrapper = ({ children, showArrows }: { children: React.ReactNode, showArrows: boolean }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const scrollAnimationRef = React.useRef<number | null>(null);

    const startAutoScroll = (direction: 'left' | 'right') => {
        stopAutoScroll();
        scrollAnimationRef.current = window.setInterval(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: direction === 'left' ? -10 : 10, behavior: 'auto' });
            }
        }, 20);
    };

    const stopAutoScroll = () => {
        if (scrollAnimationRef.current) {
            window.clearInterval(scrollAnimationRef.current);
            scrollAnimationRef.current = null;
        }
    };

    return (
        <div className="relative group py-8">
            {showArrows && (
                <>
                    <button
                        onMouseEnter={() => startAutoScroll('left')}
                        onMouseLeave={stopAutoScroll}
                        onMouseUp={stopAutoScroll}
                        className="absolute left-0 lg:left-2 top-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-accent-cyan/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-accent-cyan transition-all hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.3)] opacity-60 hover:opacity-100 hidden md:flex cursor-pointer"
                    >
                        <span className="material-icons-round text-3xl">chevron_left</span>
                    </button>
                    <button
                        onMouseEnter={() => startAutoScroll('right')}
                        onMouseLeave={stopAutoScroll}
                        onMouseUp={stopAutoScroll}
                        className="absolute right-0 lg:right-2 top-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-accent-cyan/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-accent-cyan transition-all hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.3)] opacity-60 hover:opacity-100 hidden md:flex cursor-pointer"
                    >
                        <span className="material-icons-round text-3xl">chevron_right</span>
                    </button>
                </>
            )}

            <div
                ref={scrollRef}
                className="overflow-x-auto no-scrollbar pb-4 px-4 lg:px-12"
            >
                <div className="flex gap-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ProductGrid: React.FC<ProductGridProps> = ({ collectionHandle, title = "Recomendado para você" }) => {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { searchQuery } = useSearch();
    const { addToCart } = useCart();
    const { canPurchase, promptLogin } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let data;
                const query = searchQuery ? `title:${searchQuery}*` : undefined;

                if (collectionHandle) {
                    data = await shopifyService.getProductsByCollection(collectionHandle, 60);
                } else {
                    data = await shopifyService.getProducts(60, query);
                }
                if (data) setProducts(data);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProducts();
        }, searchQuery ? 500 : 0);

        return () => clearTimeout(timer);
    }, [collectionHandle, searchQuery]);

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-24 text-center">
                <div className="animate-pulse text-accent-cyan font-black text-xs uppercase tracking-[0.4em]">
                    [ Sincronizando ]
                </div>
            </div>
        );
    }

    const productChunks = [];
    const itemsPerRow = 10;
    const maxRows = 3;
    for (let i = 0; i < products.length && productChunks.length < maxRows; i += itemsPerRow) {
        productChunks.push(products.slice(i, i + itemsPerRow));
    }

    const ProductCard = ({ product }: { product: ShopifyProduct }) => (
        <div key={product.id} className="min-w-[280px] md:min-w-[340px] w-[280px] md:w-[340px] group flex flex-col bg-[#F9F9F9] rounded-[32px] p-8 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 relative overflow-hidden flex-shrink-0">
            {/* Imagem */}
            <div className="relative aspect-[3/4] mb-8 flex items-center justify-center p-4 rounded-2xl bg-white group-hover:bg-slate-50 transition-all duration-700">
                <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-[1.5s] ease-out drop-shadow-xl"
                    loading="lazy"
                />
            </div>

            {/* Cores (Simulado) */}
            <div className="flex justify-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-slate-900 ring-1 ring-slate-100 ring-offset-1"></div>
                <div className="w-3 h-3 rounded-full bg-blue-300 ring-1 ring-slate-100 ring-offset-1"></div>
                <div className="w-3 h-3 rounded-full bg-slate-400 ring-1 ring-slate-100 ring-offset-1"></div>
            </div>

            {/* Título do Produto */}
            <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tighter line-clamp-2 min-h-[2.5rem] mb-4 group-hover:text-accent-cyan transition-colors duration-300">
                {product.title}
            </h3>

            {/* Preço e Botões */}
            <div className="text-center mt-auto space-y-6">
                <div className="flex flex-col">
                    <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">
                        {shopifyService.formatMoney(product.price)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-4 py-1 border border-slate-100 rounded-full inline-block mx-auto group-hover:border-accent-cyan/20 transition-colors">
                        Até 18x s/ juros
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            to={`/produto/${product.handle}`}
                            className="w-full block bg-transparent border border-black/10 text-black py-4 rounded-full font-black text-center text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-black/5 active:scale-95"
                        >
                            Ver mais
                        </Link>
                        <button
                            onClick={() => {
                                if (!canPurchase) {
                                    promptLogin();
                                    return;
                                }
                                addToCart(product);
                            }}
                            className={`w-full flex items-center justify-center gap-2 ${canPurchase ? 'bg-slate-900 hover:bg-black' : 'bg-slate-600'} text-white py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95`}
                        >
                            <span className="material-icons-round text-sm">add_shopping_cart</span>
                            Sacola
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            if (!canPurchase) {
                                promptLogin();
                                return;
                            }
                            shopifyService.buyNow(product.variantId);
                        }}
                        className={`w-full block ${canPurchase ? 'bg-accent-cyan shadow-xl shadow-accent-cyan/20 hover:bg-black' : 'bg-white/30 border border-white/10'} text-white py-4 rounded-full font-black text-center text-[11px] uppercase tracking-[0.3em] transition-all hover:text-white active:scale-95`}
                    >
                        {canPurchase ? 'Comprar agora' : 'Fazer Login para Comprar'}
                    </button>
                </div>
            </div>
        </div>
    );



    return (
        <section className="w-full px-0 lg:px-0 pb-16 md:pb-32 pt-12 md:pt-20 relative" id={collectionHandle ? `collection-${collectionHandle}` : "vitrine"}>
            {/* Título da Seção com Efeito Scroll Reveal */}
            <div className="mb-8 md:mb-16 relative z-30 flex flex-col items-start px-4 sm:px-6 lg:px-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex flex-col group/title w-full">
                    <span className="text-[9px] sm:text-[10px] font-black text-accent-cyan uppercase tracking-[0.5em] mb-2 sm:mb-4 opacity-50 group-hover/title:opacity-100 transition-opacity">
                        Descobertas Inteligentes
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                        {title}
                    </h2>
                    <div className="h-[2px] w-16 sm:w-24 bg-accent-cyan mt-3 sm:mt-4 rounded-full shadow-[0_0_20px_rgba(0,149,255,1)] group-hover/title:w-48 transition-all duration-700"></div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-in-from-bottom-8 {
                    from { transform: translateY(32px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-in {
                    animation-fill-mode: both;
                }
            `}</style>

            {products.length > 0 ? (
                <div className="space-y-6">
                    {productChunks.map((chunk, index) => (
                        <CarouselRowWrapper key={index} showArrows={chunk.length > 1}>
                            {chunk.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </CarouselRowWrapper>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/5 backdrop-blur-sm mx-6 lg:px-12">
                    <span className="material-icons-round text-5xl text-accent-cyan/20 mb-4">search_off</span>
                    <h3 className="text-xl font-bold text-white/50 lowercase italic tracking-widest">
                        Nenhum resultado para "{searchQuery}"
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.2em]">
                        Tente outros termos ou navegue por nossas categorias
                    </p>
                </div>
            )}
        </section>
    );
};

export default ProductGrid;
