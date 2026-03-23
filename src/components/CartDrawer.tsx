import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { shopifyService } from '../services/shopifyService';

export const CartDrawer: React.FC = () => {
    const {
        items,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        checkout,
        isCheckingOut,
        isSyncing
    } = useCart();
    const { canPurchase, promptLogin } = useAuth();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-background-dark/95 backdrop-blur-2xl border-l border-white/5 shadow-3xl h-full flex flex-col animate-in slide-in-from-right duration-500">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <span className="material-icons-round text-accent-cyan">shopping_bag</span>
                            Sua Sacola
                            <span className="text-accent-cyan/50 text-xs ml-2">({cartCount})</span>
                        </h2>
                        {isSyncing && (
                            <div className="flex items-center gap-2 text-[9px] font-bold text-accent-cyan uppercase tracking-widest animate-pulse">
                                <span className="material-icons-round text-[10px]">cloud_sync</span>
                                Sincronizando com Perfil...
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <span className="material-icons-round text-2xl">close</span>
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/10 space-y-4">
                            <span className="material-icons-round text-8xl">shopping_cart</span>
                            <p className="font-black uppercase tracking-[0.3em] text-xs">Sua sacola está vazia</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.variantId} className="flex gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                <div className="w-24 h-24 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xs font-black text-white line-clamp-2 pr-4 uppercase tracking-tight leading-relaxed">{item.title}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.variantId)}
                                            className="text-white/20 hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-icons-round text-lg">delete_outline</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-4 bg-white/5 rounded-full px-3 py-1 border border-white/5">
                                            <button onClick={() => updateQuantity(item.variantId, -1)} className="text-white/40 hover:text-white text-lg font-bold transition-colors">-</button>
                                            <span className="text-white text-xs font-black w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.variantId, 1)} className="text-white/40 hover:text-white text-lg font-bold transition-colors">+</button>
                                        </div>
                                        <p className="font-black text-accent-cyan tracking-tighter text-sm">
                                            {shopifyService.formatMoney(item.price)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                    <div className="p-8 border-t border-white/5 bg-black/20 space-y-6">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-white/30 font-black text-[10px] uppercase tracking-[0.2em]">Subtotal Estipulado</span>
                                <p className="text-xs text-white/50 leading-none">Impostos e frete calculados no checkout</p>
                            </div>
                            <span className="text-3xl font-black text-white tracking-tighter">
                                {shopifyService.formatMoney(cartTotal.toString())}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                if (!canPurchase) {
                                    setIsCartOpen(false);
                                    promptLogin();
                                    return;
                                }
                                checkout();
                            }}
                            disabled={isCheckingOut || isSyncing}
                            className={`w-full py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group ${(isCheckingOut || isSyncing)
                                    ? 'bg-white/10 text-white/30 cursor-not-allowed'
                                    : canPurchase
                                        ? 'bg-accent-cyan text-white hover:scale-[1.02] active:scale-95 shadow-accent-cyan/20 shadow-[0_10px_30px_rgba(0,149,255,0.3)]'
                                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border border-white/10'
                                }`}
                        >
                            {isCheckingOut ? (
                                <>
                                    <span className="material-icons-round animate-spin text-sm">refresh</span>
                                    Enviando para Shopify...
                                </>
                            ) : !canPurchase ? (
                                <>
                                    <span className="material-icons-round text-sm">login</span>
                                    Fazer Login para Comprar
                                </>
                            ) : (
                                <>
                                    Finalizar Compra
                                    <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
