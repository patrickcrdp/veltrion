import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { ShopifyProduct, shopifyService } from '../services/shopifyService';
import { firebaseService } from '../services/firebaseService';
import { useAuth } from './AuthContext';
import { pixelService } from '../services/pixelService';

export interface CartItem {
    variantId: string;
    productId: string;
    title: string;
    price: string;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: ShopifyProduct) => void;
    removeFromCart: (variantId: string) => void;
    updateQuantity: (variantId: string, delta: number) => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    cartCount: number;
    cartTotal: number;
    checkout: () => Promise<void>;
    isCheckingOut: boolean;
    isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const { user } = useAuth();
    const prevUserRef = useRef<string | null>(null);

    // ═══════════════════════════════════════════════════════
    //  SINCRONISMO PRINCIPAL: Firebase é a fonte da verdade
    // ═══════════════════════════════════════════════════════

    // Quando o usuário loga: carrega os itens do Firebase
    useEffect(() => {
        const currentEmail = user?.email || null;
        const prevEmail = prevUserRef.current;

        // Se deslogou → limpa tudo
        if (!currentEmail && prevEmail) {
            setItems([]);
            setCartId(null);
        }

        // Se logou (novo login) → puxa do Firebase
        if (currentEmail && currentEmail !== prevEmail) {
            const loadFromFirebase = async () => {
                setIsSyncing(true);
                try {
                    // 1. Carrega os itens salvos no Firebase
                    const firebaseItems = await firebaseService.getCartItems(currentEmail);
                    if (firebaseItems && firebaseItems.length > 0) {
                        setItems(firebaseItems);
                    }

                    // 2. Carrega o cartId da Shopify (para checkout e sync)
                    const cloudCartId = await firebaseService.getCartId(currentEmail);
                    if (cloudCartId) {
                        setCartId(cloudCartId);
                    }
                } catch (error) {
                    console.error("Erro ao carregar carrinho do Firebase:", error);
                } finally {
                    setIsSyncing(false);
                }
            };
            loadFromFirebase();
        }

        prevUserRef.current = currentEmail;
    }, [user]);

    // ═══════════════════════════════════════════════════════
    //  PERSISTÊNCIA: Salva no Firebase sempre que os itens mudam
    // ═══════════════════════════════════════════════════════

    useEffect(() => {
        if (user?.email && items.length >= 0) {
            // Debounce para não sobrecarregar o Firebase
            const timer = setTimeout(() => {
                firebaseService.saveCartItems(user.email, items);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [items, user]);

    // ═══════════════════════════════════════════════════════
    //  AÇÕES DO CARRINHO
    // ═══════════════════════════════════════════════════════

    const addToCart = async (product: ShopifyProduct) => {
        const newItem: CartItem = {
            variantId: product.variantId,
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0] || '',
            quantity: 1
        };

        setItems(current => {
            const existing = current.find(item => item.variantId === product.variantId);
            if (existing) {
                return current.map(item =>
                    item.variantId === product.variantId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...current, newItem];
        });
        setIsCartOpen(true);

        // 📊 Rastrear evento AddToCart em todos os pixels
        pixelService.trackAddToCart({
            id: product.id,
            name: product.title,
            price: parseFloat(product.price),
            quantity: 1,
        });

        // Sync com Shopify Cloud (para checkout funcionar)
        try {
            if (!cartId) {
                const cloudCart = await shopifyService.createCart([{ variantId: product.variantId, quantity: 1 }]);
                if (cloudCart) {
                    setCartId(cloudCart.id);
                    if (user?.email) await firebaseService.saveCartId(user.email, cloudCart.id);
                }
            } else {
                await shopifyService.addToCartCloud(cartId, product.variantId, 1);
            }
        } catch (e) { console.error("Erro sync Shopify:", e); }
    };

    const removeFromCart = async (variantId: string) => {
        const itemToRemove = items.find(i => i.variantId === variantId);
        setItems(current => current.filter(item => item.variantId !== variantId));

        if (cartId && (itemToRemove as any)?.lineId) {
            try {
                await shopifyService.removeFromCartCloud(cartId, [(itemToRemove as any).lineId]);
            } catch (e) { console.error(e); }
        }
    };

    const updateQuantity = async (variantId: string, delta: number) => {
        const item = items.find(i => i.variantId === variantId);
        if (!item) return;

        const newQty = Math.max(1, item.quantity + delta);
        setItems(current => current.map(item =>
            item.variantId === variantId ? { ...item, quantity: newQty } : item
        ));

        if (cartId && (item as any)?.lineId) {
            try {
                await shopifyService.updateCartCloud(cartId, (item as any).lineId, newQty);
            } catch (e) { console.error(e); }
        }
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

    const checkout = async () => {
        if (items.length === 0) return;
        setIsCheckingOut(true);
        try {
            let checkoutUrl = '';
            if (cartId) {
                const data = await shopifyService.getCart(cartId);
                checkoutUrl = data?.cart?.checkoutUrl;
            }

            if (!checkoutUrl) {
                checkoutUrl = await shopifyService.createCheckout(items) || '';
            }

            if (checkoutUrl) {
                // 📊 Rastrear evento InitiateCheckout em todos os pixels
                pixelService.trackInitiateCheckout(
                    cartTotal,
                    items.map(i => ({ id: i.productId, name: i.title, price: parseFloat(i.price), quantity: i.quantity }))
                );
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            isCartOpen,
            setIsCartOpen,
            cartCount,
            cartTotal,
            checkout,
            isCheckingOut,
            isSyncing
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
