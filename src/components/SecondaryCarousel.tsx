import React, { useEffect, useState } from 'react';
import { shopifyService, ShopifyProduct } from '../services/shopifyService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
        <div className="relative group py-6">
            {showArrows && (
                <>
                    <button
                        onMouseEnter={() => startAutoScroll('left')}
                        onMouseLeave={stopAutoScroll}
                        onMouseUp={stopAutoScroll}
                        className="absolute left-0 lg:left-2 top-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-accent-cyan/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-accent-cyan transition-all hover:scale-110 shadow-2xl opacity-60 hover:opacity-100 hidden md:flex cursor-pointer"
                    >
                        <span className="material-icons-round text-3xl">west</span>
                    </button>
                    <button
                        onMouseEnter={() => startAutoScroll('right')}
                        onMouseLeave={stopAutoScroll}
                        onMouseUp={stopAutoScroll}
                        className="absolute right-0 lg:right-2 top-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-accent-cyan/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-accent-cyan transition-all hover:scale-110 shadow-2xl opacity-60 hover:opacity-100 hidden md:flex cursor-pointer"
                    >
                        <span className="material-icons-round text-3xl">east</span>
                    </button>
                </>
            )}

            <div
                ref={scrollRef}
                className="overflow-x-auto no-scrollbar pb-4 px-4 lg:px-12"
            >
                <div className="flex gap-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface SecondaryCarouselProps {
    collectionHandle?: string;
    title?: string;
    subtitle?: string;
    reverse?: boolean;
}

const SecondaryCarousel: React.FC<SecondaryCarouselProps> = ({ 
    collectionHandle, 
    title = "Mais Produtos", 
    subtitle = "Complete seu ecossistema",
    reverse = true // Default is true (newest first)
}) => {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const { addToCart } = useCart();
    const { canPurchase, promptLogin } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            let data;
            // Note: Currently our service doesn't take reverse inside getProductsByCollection 
            // but we can slice or the service might need update
            if (collectionHandle) {
                data = await shopifyService.getProductsByCollection(collectionHandle, 60);
            } else {
                data = await shopifyService.getProducts(60);
            }
            
            if (data) {
                // If reverse is false, it means we want the oldest, 
                // but getProducts is already reverse:true (newest).
                // So if user wants oldest (reverse=false), we reverse the array if it's already newest.
                // Or better, we update the service. For now, let's reverse the array locally.
                const sortedData = reverse ? data : [...data].reverse();
                setProducts(sortedData);
            }
        };
        fetchProducts();
    }, [collectionHandle, reverse]);

    const productChunks = [];
    const itemsPerRow = 10;
    const maxRows = 3;
    for (let i = 0; i < products.length && productChunks.length < maxRows; i += itemsPerRow) {
        productChunks.push(products.slice(i, i + itemsPerRow));
    }

    if (products.length === 0) return null;

    return (
        <section className="w-full px-2 lg:px-4 py-24 mb-24 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 px-6 lg:px-12">
                <div>
                    <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.4em] mb-4 block">{subtitle}</span>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                        {title.split(' ').map((word, i, arr) => (
                            <span key={i}>
                                {word === arr[arr.length - 1] ? <span className="text-accent-cyan italic">{word}</span> : word + ' '}
                            </span>
                        ))}
                    </h2>
                </div>
            </div>

            <div className="space-y-4">
                {productChunks.map((chunk, index) => (
                    <CarouselRowWrapper key={index} showArrows={chunk.length > 1}>
                        {chunk.map(product => (
                            <div key={product.id} className="min-w-[300px] w-[300px] flex-shrink-0 bg-card-dark/40 border border-white/5 rounded-3xl p-6 relative group hover:border-accent-cyan/30 transition-all duration-500 flex flex-col">
                                <Link to={`/produto/${product.handle}`} className="relative mb-6 aspect-video bg-white rounded-2xl p-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 drop-shadow-lg"
                                        loading="lazy"
                                    />
                                </Link>

                                <div className="space-y-4 flex flex-col flex-1 justify-between">
                                    <Link to={`/produto/${product.handle}`} className="text-sm font-bold text-white hover:text-accent-cyan transition-colors leading-tight min-h-[40px] line-clamp-2">
                                        {product.title}
                                    </Link>

                                    <div className="flex items-center justify-between mt-auto pt-4">
                                        <span className="text-sm font-black text-white">
                                            {shopifyService.formatMoney(product.price)}
                                        </span>
                                        <button
                                            onClick={() => {
                                                if (!canPurchase) {
                                                    promptLogin();
                                                    return;
                                                }
                                                addToCart(product);
                                            }}
                                            className="p-3 bg-white text-black hover:bg-accent-cyan hover:text-white transition-all rounded-xl shadow-lg shadow-black/20"
                                        >
                                            <span className="material-icons-round text-lg">add_shopping_cart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CarouselRowWrapper>
                ))}
            </div>

            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </section>
    );
};

export default SecondaryCarousel;
