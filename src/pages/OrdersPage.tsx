import React, { Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import { shopifyService } from '../services/shopifyService';

const Footer = lazy(() => import('../components/Footer'));

const OrderCard = ({ id, date, processedAt, total, totalPrice, status, items, invoiceUrl, trackingUrl }: { id: string, date?: string, processedAt?: string, total?: string, totalPrice?: string, status: string, items: any[], invoiceUrl?: string, trackingUrl?: string }) => {
    const displayDate = date || processedAt || '';
    const displayTotal = total || totalPrice || '0';
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-accent-cyan/30 transition-all duration-700 relative overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-black uppercase tracking-widest">
                            Pedido #{id}
                        </span>
                        <span className="text-secondary/40 text-[10px] font-black uppercase tracking-widest">{displayDate}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {items.map((item, i) => (
                                <div key={i} title={item.title} className="w-12 h-12 rounded-2xl border-2 border-background-dark bg-white p-1 overflow-hidden transition-transform group-hover:scale-110">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-sm font-black text-white uppercase tracking-tighter">
                                {items.length} {items.length === 1 ? 'Produto' : 'Produtos'}
                            </p>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                                Total Final: <span className="text-accent-cyan">{shopifyService.formatMoney(displayTotal)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                        status === 'Entregue' 
                        ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20' 
                        : 'bg-white/5 text-white border-white/10'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${status === 'Entregue' ? 'bg-accent-cyan' : 'bg-white animate-pulse'}`}></span>
                        {status}
                    </div>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full md:w-auto px-8 py-3 rounded-full bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border border-white/5"
                    >
                        {isExpanded ? 'Esconder Detalhes' : 'Detalhes do Pedido'}
                    </button>
                </div>
            </div>

            {/* Expansão de Detalhes do Pedido */}
            {isExpanded && (
                <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-4 mb-6">
                        {items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white p-1">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase">{item.title}</p>
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Qtd: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-accent-cyan">{shopifyService.formatMoney(item.price)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Botão de NF-e e Link */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {invoiceUrl && (
                            <a 
                                href={invoiceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 px-8 py-4 rounded-full bg-accent-cyan text-black text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-cyan/20 flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-round text-sm">description</span>
                                Baixar Nota Fiscal (NF-e)
                            </a>
                        )}
                        <button 
                            onClick={() => trackingUrl ? window.open(trackingUrl, '_blank') : alert('O rastreio estará disponível em breve.')}
                            className={`flex-1 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2 ${!trackingUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-icons-round text-sm">local_shipping</span>
                            {trackingUrl ? 'Rastrear Entrega' : 'Aguardando Despacho'}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-accent-cyan opacity-0 group-hover:opacity-[0.02] blur-[100px] transition-opacity duration-1000 pointer-events-none"></div>
        </div>
    );
};

function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                // Tentando buscar dados reais se tivermos um token (Mock real-time simulation por enquanto)
                const customerToken = localStorage.getItem('shopify_customer_token');
                
                if (customerToken) {
                    try {
                        const realOrders = await shopifyService.getCustomerOrders(customerToken);
                        if (realOrders && realOrders.length > 0) {
                            setOrders(realOrders);
                        } else {
                            // Se falhar ou não tiver token, simulamos os dados reais para design
                            setOrders(mockData);
                        }
                    } catch (e) {
                        setOrders(mockData);
                    }
                } else {
                    setOrders(mockData);
                }
            }
            setIsLoading(false);
        };
        fetchOrders();
    }, [user]);

    // Dados de exemplo que usam o design final da Shopify
    const mockData = [
        {
            id: "VT-09827",
            date: "20 DE MARÇO, 2024",
            total: "6890.00",
            status: "Processando",
            items: [
                { title: "iPhone 15 Pro Titanium", image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=200" }
            ]
        }
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 text-center">
                <DigitalRain />
                <div className="relative z-10 space-y-6">
                    <span className="material-icons-round text-6xl text-accent-cyan animate-pulse">login</span>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Conector de Identidade</h2>
                    <p className="text-slate-400 font-medium">Logue no sistema para acessar sua central de pedidos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent overflow-x-hidden">
            <DigitalRain />
            <Navbar />

            <main className="relative pt-40 pb-24 px-6 md:px-12 lg:px-48">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-16 space-y-4">
                        <div className="flex items-center gap-4 text-accent-cyan mb-2">
                            <span className="material-icons-round text-3xl">shopping_bag</span>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Logística Global Veltrion</h4>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Suas <span className="text-accent-cyan italic">Aquisições.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-bold max-w-xl italic leading-relaxed">
                            "Monitoramento em tempo real da tecnologia que redefine o seu futuro."
                        </p>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                                <div className="w-12 h-12 border-4 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Sincronizando com Shopify...</p>
                            </div>
                        ) : orders.length > 0 ? (
                            orders.map((order: any) => (
                                <OrderCard key={order.id} {...order} />
                            ))
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[50px]">
                                <p className="text-slate-500 font-bold uppercase tracking-widest">Nenhum registro de aquisição detectado</p>
                            </div>
                        )}
                    </div>

                    {/* Support Call-to-action */}
                    <div className="mt-12 p-10 rounded-[50px] bg-accent-cyan/5 border border-accent-cyan/10 text-center space-y-6">
                        <span className="material-icons-round text-4xl text-accent-cyan opacity-40">support_agent</span>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Precisa de assistência logística?</h3>
                        <p className="text-slate-400 font-medium max-w-lg mx-auto">Nossos agentes de IA e especialistas globais estão prontos para garantir que cada centímetro do envio seja perfeito.</p>
                        <button className="px-12 py-4 rounded-full bg-accent-cyan text-black text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-cyan/20">
                            Falar com suporte
                        </button>
                    </div>
                </div>
            </main>

            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default OrdersPage;
