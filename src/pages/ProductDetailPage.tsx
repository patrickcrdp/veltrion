import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { shopifyService, ShopifyProduct } from '../services/shopifyService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import { pixelService } from '../services/pixelService';
import { Suspense, lazy } from 'react';

// Lazy load components
const SecondaryCarousel = lazy(() => import('../components/SecondaryCarousel'));
const Footer = lazy(() => import('../components/Footer'));

const SectionLoader = () => (
    <div className="w-full h-48 flex items-center justify-center text-accent-cyan/30 animate-pulse font-mono text-[10px] uppercase tracking-[0.3em]">
        [ Scanning For Recommendations ]
    </div>
);

// Mapa de cores para exibição visual
const COLOR_MAP: Record<string, string> = {
    // === PRETO & ESCUROS ===
    'preto': '#111111',
    'black': '#111111',
    'jet black': '#0a0a0a',
    'matte black': '#1a1a1b',
    'graphite black': '#242424',
    'space black': '#111111',
    'cosmic black': '#0d0d0d',
    'phantom black': '#1a1a1a',
    'carbon black': '#1c1c1c',
    'matte carbon': '#2b2b2b',
    'midnight': '#191970',
    'meia-noite': '#191970',

    // === BRANCO & CLAROS ===
    'branco': '#f8f8f8',
    'white': '#f8f8f8',
    'pure white': '#ffffff',
    'pearl white': '#f0f0f0',
    'snow white': '#fafafe',
    'chalk white': '#f2f2f2',
    'starlight': '#f5f5f0',
    'estelar': '#f5f5f0',

    // === CINZA & PRATA ===
    'cinza': '#808080',
    'gray': '#808080',
    'grey': '#808080',
    'space gray': '#343d46',
    'cinza espacial': '#343d46',
    'titanium gray': '#54585a',
    'cosmic gray': '#4d4d4d',
    'silver': '#c0c0c0',
    'prata': '#c0c0c0',
    'stellar silver': '#b1b1b1',
    'graphite': '#3c3c3c',
    'grafite': '#3c3c3c',
    'platinum': '#e5e4e2',
    'sterling silver': '#c0c0c0',
    'gunmetal': '#2c3539',
    'graphite steel': '#4a4a4a',
    'slate': '#708090',
    'sandstone': '#c2b280',

    // === DOURADO & PREMIUM ===
    'dourado': '#d4af37',
    'gold': '#d4af37',
    'champagne gold': '#f7e7ce',
    'mystic bronze': '#996633',
    'bege': '#d1bb9e',
    'beige': '#d1bb9e',
    'natural': '#d9d3c1',

    // === ROSA & ROSÉ ===
    'rosa': '#f7c8da',
    'pink': '#f7c8da',
    'rosa gold': '#e6b0aa',
    'rose gold': '#e6b0aa',
    'rose pink': '#ff66cc',
    'rose quartz': '#aa98a9',

    // === AZUL ===
    'azul': '#0070c9',
    'blue': '#0070c9',
    'midnight blue': '#191970',
    'navy': '#000080',
    'azul marinho': '#000080',
    'deep blue': '#00008b',
    'sky blue': '#87ceeb',
    'glacier blue': '#9fb5c7',
    'cosmic blue': '#2e5a88',
    'ocean blue': '#0077be',
    'sierra blue': '#9fb5c7',
    'pacific blue': '#215d76',

    // === VERDE ===
    'verde': '#315043',
    'green': '#315043',
    'forest green': '#228b22',
    'olive green': '#556b2f',
    'mint green': '#98ff98',
    'ocean green': '#48bf91',
    'midnight green': '#4e584a',
    'verde alpino': '#4e584a',
    'emerald': '#50c878',

    // === ROXO / LILÁS ===
    'roxo': '#594f6d',
    'purple': '#594f6d',
    'lavender': '#e6e6fa',
    'lilac': '#c8a2c8',

    // === VERMELHO ===
    'vermelho': '#ba0c2f',
    'red': '#ba0c2f',
    'product red': '#ba0c2f',
    'product(red)': '#ba0c2f',
    'cherry red': '#990000',
    'sunset red': '#ff4500',
    'burgundy': '#800020',

    // === OUTROS ===
    'amarelo': '#f1c40f',
    'yellow': '#f1c40f',
    'laranja': '#e67e22',
    'orange': '#e67e22',
    'sunset orange': '#ff8c00',
    'marrom': '#5d4037',
    'brown': '#5d4037'
};

// Componente Profissional de Zoom de Imagem
const ImageZoom: React.FC<{ src: string, alt: string }> = ({ src, alt }) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [showZoom, setShowZoom] = useState(false);
    const zoomLevel = 2.5; // Controle do nível de zoom

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

        // Calcula a posição percentual do cursor dentro do container
        const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));

        setPosition({ x, y });
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden cursor-zoom-in rounded-[40px] bg-white group/zoom"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out p-8 md:p-16 ${showZoom ? 'scale-[2.5]' : 'scale-100'}`}
                style={{
                    transformOrigin: `${position.x}% ${position.y}%`,
                    // Transição ultra suave ao entrar/sair, mas instantânea ao seguir o mouse para performance
                    transition: showZoom ? 'transform 0.1s ease-out' : 'transform 0.5s ease-in-out',
                    transform: showZoom ? `scale(${zoomLevel})` : 'scale(1)'
                }}
            />

            {/* Overlay sutil para indicar o zoom */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showZoom ? 'opacity-0' : 'opacity-10'}`}>
                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md rounded-full p-2">
                    <span className="material-icons-round text-white text-sm">zoom_in</span>
                </div>
            </div>
        </div>
    );
};

const ProductDetailPage: React.FC = () => {
    const { handle } = useParams<{ handle: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ShopifyProduct | null>(null);
    const [related, setRelated] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const { addToCart } = useCart();
    const { canPurchase, promptLogin } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProductData = async () => {
            if (!handle) return;
            setLoading(true);
            try {
                const data = await shopifyService.getProductByHandle(handle);
                if (data) {
                    setProduct(data);

                    // Inicializa seleções (melhorado para detectar mais variantes de "Default Title" de forma case-insensitive)
                    const initialSelections: Record<string, string> = {};
                    data.options.forEach(opt => {
                        const nameLower = opt.name.toLowerCase();
                        const valLower = opt.values[0].toLowerCase();
                        const isDefault = (nameLower === 'title' || nameLower === 'título') &&
                            (valLower.includes('default title') || valLower.includes('título padrão'));

                        if (!isDefault) {
                            initialSelections[opt.name] = opt.values[0];
                        }
                    });
                    setSelectedOptions(initialSelections);

                    // Imagem inicial
                    setActiveImage(data.images[0] || '');

                    // Busca relacionados
                    const allProducts = await shopifyService.getProducts(8);
                    setRelated(allProducts.filter(p => p.handle !== handle));

                    // 📊 Rastrear visualização do produto em todos os pixels
                    pixelService.trackViewContent({
                        id: data.id,
                        name: data.title,
                        price: parseFloat(data.price),
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [handle]);

    // Encontra a variante atual baseada nas seleções
    const selectedVariant = useMemo(() => {
        if (!product || !product.variants) return null;

        // Se não houver opções reais, retorna a primeira variante
        if (Object.keys(selectedOptions).length === 0) return product.variants[0];

        return product.variants.find(variant => {
            return variant.selectedOptions.every(opt =>
                selectedOptions[opt.name] === opt.value
            );
        }) || product.variants[0];
    }, [product, selectedOptions]);

    // Atualiza imagem quando a variante muda
    useEffect(() => {
        if (selectedVariant?.image) {
            setActiveImage(selectedVariant.image);
        }
    }, [selectedVariant]);

    const handleOptionSelect = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Navbar />
                <DigitalRain />
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-full border-4 border-t-accent-cyan animate-spin"></div>
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-accent-cyan">Sincronizando Veltrion...</span>
                </div>
            </div>
        );
    }

    if (!product || !selectedVariant) {
        return (
            <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center">
                <Navbar />
                <DigitalRain />
                <h2 className="text-4xl font-black text-white mb-4">Produto não encontrado</h2>
                <Link to="/" className="px-8 py-4 bg-accent-cyan text-white rounded-full font-bold uppercase tracking-widest transition-all">Voltar para a loja</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-white font-sans pt-24 relative overflow-hidden">
            <Navbar />
            <DigitalRain />

            {/* SUB-HEADER FIXO */}
            <div className="sticky top-[80px] z-40 w-full bg-background-dark/80 backdrop-blur-xl border-b border-white/10 py-4">
                <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-white/10 rounded-full transition-all group shrink-0"
                        >
                            <span className="material-icons-round text-secondary/60 group-hover:text-accent-cyan transition-colors">arrow_back</span>
                        </button>
                        <h1 className="text-sm sm:text-lg md:text-2xl font-black tracking-tight text-white truncate max-w-[150px] sm:max-w-none">{product.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-lg font-black text-accent-cyan">{shopifyService.formatMoney(selectedVariant.price)}</span>
                        </div>
                        <button
                            onClick={() => {
                                if (!canPurchase) {
                                    promptLogin();
                                    return;
                                }
                                if (selectedVariant.availableForSale) {
                                    addToCart({ ...product, variantId: selectedVariant.id, price: selectedVariant.price, images: [selectedVariant.image || product.images[0]] } as ShopifyProduct);
                                }
                            }}
                            disabled={!selectedVariant.availableForSale}
                            className={`p-3 rounded-full transition-all group shrink-0 shadow-lg border ${selectedVariant.availableForSale
                                    ? 'bg-white/5 hover:bg-white/10 text-white border-white/5'
                                    : 'bg-white/5 text-secondary/20 border-white/5 cursor-not-allowed opacity-40'
                                }`}
                            title={selectedVariant.availableForSale ? (canPurchase ? 'Adicionar à Sacola' : 'Faça login e aceite os termos') : 'Indisponível'}
                        >
                            <span className={`material-icons-round transition-colors ${selectedVariant.availableForSale
                                    ? 'text-secondary/60 group-hover:text-accent-cyan'
                                    : 'text-secondary/20'
                                }`}>add_shopping_cart</span>
                        </button>
                        <button
                            onClick={() => {
                                if (!canPurchase) {
                                    promptLogin();
                                    return;
                                }
                                if (selectedVariant.availableForSale) {
                                    shopifyService.buyNow(selectedVariant.id);
                                }
                            }}
                            disabled={!selectedVariant.availableForSale}
                            className={`px-6 md:px-10 py-3 font-black rounded-full text-[10px] md:text-sm uppercase tracking-widest transition-all shadow-lg ${selectedVariant.availableForSale
                                    ? canPurchase
                                        ? 'bg-accent-cyan hover:bg-white text-white hover:text-black active:scale-95 shadow-accent-cyan/20 shadow-[0_10px_30px_rgba(0,149,255,0.3)]'
                                        : 'bg-white/10 text-white hover:bg-white/20 hover:text-white border border-white/10'
                                    : 'bg-white/10 text-secondary/30 cursor-not-allowed'
                                }`}
                        >
                            {selectedVariant.availableForSale ? (canPurchase ? 'Comprar agora' : 'Fazer Login para Comprar') : 'Indisponível'}
                        </button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-10 md:gap-16">

                    {/* GALERIA */}
                    <div className="lg:col-span-1 xl:col-span-7">
                        <div className="lg:sticky lg:top-40 space-y-6 md:space-y-8">
                            <div className="aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-white rounded-[30px] md:rounded-[40px] flex items-center justify-center shadow-2xl shadow-black/50 overflow-hidden">
                                <ImageZoom src={activeImage} alt={product.title} />
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`w-24 h-24 flex-shrink-0 bg-white border-2 rounded-2xl overflow-hidden transition-all ${activeImage === img ? 'border-accent-cyan shadow-xl shadow-accent-cyan/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-contain mix-blend-multiply p-2" alt={`${product.title} - ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* INFOS E OPÇÕES */}
                    <div className="lg:col-span-1 xl:col-span-5 space-y-10 md:space-y-12">

                        {/* 1. Preço e Destaque */}
                        <div className="bg-card-dark/40 backdrop-blur-xl border border-white/5 rounded-[30px] md:rounded-[40px] p-6 sm:p-8 md:p-12 space-y-6 shadow-2xl">
                            <div className="space-y-2 text-center md:text-left">
                                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter">
                                    {shopifyService.formatMoney(selectedVariant.price)}
                                </p>
                                <p className="text-[10px] sm:text-xs font-bold text-accent-cyan uppercase tracking-[0.3em]">
                                    Ou 18x de {shopifyService.calculateInstallment(selectedVariant.price)} sem juros
                                </p>
                            </div>

                            {/* Badger Vendedor */}
                            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-3xl">
                                <div className="w-10 h-10 bg-accent-cyan rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,149,255,0.4)]">
                                    <span className="text-white font-black text-xs">V</span>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-secondary/40">Vendido e entregue por</p>
                                    <p className="text-xs font-black text-white uppercase tracking-wider">Veltrion Premium</p>
                                </div>
                            </div>

                            {/* Alternativas Compactas */}
                            <div className="pt-8 border-t border-white/5">
                                <h3 className="text-sm font-black text-secondary/40 uppercase tracking-widest mb-6">Sugestões Mi Prime</h3>
                                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                    {related.slice(0, 4).map((item) => (
                                        <Link key={item.id} to={`/produto/${item.handle}`} className="min-w-[120px] bg-white/5 p-3 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                                            <div className="aspect-square bg-white rounded-xl p-2 mb-3">
                                                <img src={item.images[0]} className="w-full h-full object-contain mix-blend-multiply" alt={item.title} />
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-white truncate">{item.title}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. Seleção de Variantes */}
                        <div className="space-y-10 px-2 lg:px-4">
                            {product.options.map(opt => {
                                // Pular opção "Title" se for a única e for "Default Title"
                                if (opt.name === 'Title' && opt.values[0] === 'Default Title') return null;

                                return (
                                    <div key={opt.name} className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary/40">{opt.name}</h4>
                                            <span className="text-[10px] font-bold text-accent-cyan uppercase">{selectedOptions[opt.name]}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            {opt.values.map(val => {
                                                const isSelected = selectedOptions[opt.name] === val;
                                                const isColor = opt.name.toLowerCase().includes('cor') || opt.name.toLowerCase().includes('color');
                                                const hexColor = isColor ? (COLOR_MAP[val.toLowerCase()] || '#555555') : null;

                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => handleOptionSelect(opt.name, val)}
                                                        className={`transition-all duration-500 relative ${isColor
                                                            ? `w-12 h-12 rounded-full ring-2 ring-offset-4 ring-offset-background-dark ${isSelected ? 'ring-accent-cyan scale-110 shadow-[0_0_20px_rgba(0,149,255,0.4)]' : 'ring-transparent opacity-40 hover:opacity-100'}`
                                                            : `px-8 py-4 rounded-full border-2 font-black text-xs uppercase tracking-widest ${isSelected ? 'border-accent-cyan text-white bg-accent-cyan/10 shadow-[0_0_15px_rgba(0,149,255,0.2)]' : 'border-white/10 text-secondary/40 hover:border-white/20 hover:text-white'}`
                                                            }`}
                                                        style={isColor && hexColor ? { backgroundColor: hexColor } : {}}
                                                        title={val}
                                                    >
                                                        {!hexColor && val}
                                                        {isColor && isSelected && (
                                                            <span className="absolute inset-0 flex items-center justify-center">
                                                                <span className="material-icons-round text-white text-lg drop-shadow-md">check</span>
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 3. Especificações do Produto (Metafields) */}
                        {product.metafields && product.metafields.length > 0 && (
                            <div className="px-2 lg:px-4 pt-12 border-t border-white/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary/40">Especificações Técnicas</h4>
                                    <div className="h-[1px] flex-1 bg-white/5"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {product.metafields.map((mf, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-1 p-4 bg-[#111111]/40 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-accent-cyan/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,149,255,0.6)]"></span>
                                                <span className="text-[9px] font-black text-secondary/40 uppercase tracking-widest group-hover:text-accent-cyan transition-colors">
                                                    {mf.label}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-white/90 pl-3">
                                                {mf.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. Descrição */}
                        <div className="px-2 lg:px-4 pt-12 border-t border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary/40">Informações Adicionais</h4>
                                <div className="h-[1px] flex-1 bg-white/5"></div>
                            </div>
                            <div
                                className="prose prose-invert max-w-none text-secondary/70 leading-relaxed text-sm font-medium prose-p:mb-6 prose-strong:text-white"
                                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* SEÇÃO DE RECOMENDADOS - Abaixo do conteúdo principal com espaçamento premium */}
            <div className="mt-32 pb-32 relative z-10 border-t border-white/5 pt-32">
                <Suspense fallback={<SectionLoader />}>
                    <SecondaryCarousel
                        collectionHandle="mais-vendidos"
                        title="Recomendado para você"
                        subtitle="Selecionamos inovações que combinam com seu estilo"
                    />
                </Suspense>
            </div>

            {/* Footer com suporte a suspense */}
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
};

export default ProductDetailPage;
