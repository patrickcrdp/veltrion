import React, { Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import { shopifyService } from '../services/shopifyService';

const Footer = lazy(() => import('../components/Footer'));

const ProfileCard = ({ label, value, icon, isLoading }: { label: string, value: string, icon: string, isLoading?: boolean }) => (
    <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-accent-cyan/30 transition-all duration-500 ${isLoading ? 'animate-pulse' : ''}`}>
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                <span className="material-icons-round">{icon}</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-white uppercase tracking-tighter">{value}</p>
            </div>
        </div>
    </div>
);

function ProfilePage() {
    const { user } = useAuth();
    const [lastOrderDate, setLastOrderDate] = React.useState('Calculando...');
    const [isSyncing, setIsSyncing] = React.useState(true);

    React.useEffect(() => {
        const fetchLastOrder = async () => {
            const token = localStorage.getItem('shopify_customer_token');
            if (token) {
                try {
                    const orders = await shopifyService.getCustomerOrders(token);
                    if (orders && orders.length > 0) {
                        setLastOrderDate(orders[0].processedAt);
                    } else {
                        setLastOrderDate('Nenhum registro');
                    }
                } catch (e) {
                    setLastOrderDate('Erro na rede');
                }
            } else {
                setLastOrderDate('Sem histórico');
            }
            setIsSyncing(false);
        };
        fetchLastOrder();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 text-center">
                <DigitalRain />
                <div className="relative z-10 space-y-6">
                    <span className="material-icons-round text-6xl text-accent-cyan animate-pulse">lock</span>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Acesso Restrito</h2>
                    <p className="text-slate-400 font-medium">Por favor, faça login para acessar seu perfil premium.</p>
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
                    {/* Header Social-Style */}
                    <div className="relative mb-16">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            <div className="relative">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1.5 border-4 border-accent-cyan/30 shadow-[0_0_50px_rgba(0,149,255,0.2)]">
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                                        <img 
                                            src={user.picture} 
                                            alt={user.name} 
                                            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-accent-cyan text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-accent-cyan/20">
                                    Premium
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                    <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-pulse"></span>
                                    <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">ID de Cliente Verificado</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                                    {user.name.split(' ')[0]} <span className="text-accent-cyan italic">{user.name.split(' ')[1] || 'Veltrion'}</span>
                                </h1>
                                <p className="text-slate-400 font-bold max-w-lg italic text-lg pr-0 md:pr-12">
                                    "Membro da comunidade Veltrion desde {new Date().getFullYear()}. Seu portal exclusivo para tecnologia de alta performance."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats/Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ProfileCard label="E-mail de Acesso" value={user.email} icon="alternate_email" />
                        <ProfileCard label="Nível de Fidelidade" value="Elite Black" icon="stars" />
                        <ProfileCard label="Localização" value="Brasil (Global)" icon="public" />
                        <ProfileCard 
                            label="Última Compra" 
                            value={lastOrderDate} 
                            icon="history" 
                            isLoading={isSyncing} 
                        />
                    </div>


                </div>
            </main>

            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default ProfilePage;
