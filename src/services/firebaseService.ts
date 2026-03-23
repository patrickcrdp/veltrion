import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

// Configuração oficial da Loja Veltrion
const firebaseConfig = {
  apiKey: "AIzaSyBjYiIHzgO9dGn8ToGsUtkfmc25j-i5DME",
  authDomain: "loja-veltrion-336bb.firebaseapp.com",
  databaseURL: "https://loja-veltrion-336bb-default-rtdb.firebaseio.com",
  projectId: "loja-veltrion-336bb",
  storageBucket: "loja-veltrion-336bb.firebasestorage.app",
  messagingSenderId: "1010562069006",
  appId: "1:1010562069006:web:e8487734c732fc7f49825f"
};

// Inicialização
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Gera chave segura para o Firebase a partir do e-mail
const emailToKey = (email: string) => btoa(email).replace(/=/g, '');

export interface FirebaseCartItem {
  variantId: string;
  productId: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

export const firebaseService = {
  // ═══════════════════════════════════════════════════════
  //  CART ID — Sincronismo com Shopify Cart ID
  // ═══════════════════════════════════════════════════════

  saveCartId: async (email: string, cartId: string) => {
    try {
      const key = emailToKey(email);
      await set(ref(db, 'carts/' + key + '/cartId'), {
        id: cartId,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar cartId no Firebase:", error);
      return false;
    }
  },

  getCartId: async (email: string): Promise<string | null> => {
    try {
      const key = emailToKey(email);
      const snapshot = await get(ref(db, 'carts/' + key + '/cartId'));
      if (snapshot.exists()) {
        return snapshot.val().id;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar cartId no Firebase:", error);
      return null;
    }
  },

  // ═══════════════════════════════════════════════════════
  //  CART ITEMS — Persistência Cross-Device dos Itens Reais
  // ═══════════════════════════════════════════════════════

  // Salva os itens reais do carrinho no Firebase (fonte da verdade)
  saveCartItems: async (email: string, items: FirebaseCartItem[]) => {
    try {
      const key = emailToKey(email);
      await set(ref(db, 'carts/' + key + '/items'), {
        data: items,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar itens no Firebase:", error);
      return false;
    }
  },

  // Recupera os itens reais do carrinho do Firebase
  getCartItems: async (email: string): Promise<FirebaseCartItem[]> => {
    try {
      const key = emailToKey(email);
      const snapshot = await get(ref(db, 'carts/' + key + '/items'));
      if (snapshot.exists()) {
        const val = snapshot.val();
        return val.data || [];
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar itens no Firebase:", error);
      return [];
    }
  },

  // Limpa completamente o carrinho do usuário no Firebase
  clearCart: async (email: string) => {
    try {
      const key = emailToKey(email);
      await set(ref(db, 'carts/' + key), null);
      return true;
    } catch (error) {
      console.error("Erro ao limpar carrinho no Firebase:", error);
      return false;
    }
  }
};
