// ═══════════════════════════════════════════════════════════════════
//  VELTRION — Serviço Centralizado de Pixels de Tráfego Pago
//  
//  Como usar:
//  1. Substitua os IDs placeholder abaixo pelos seus IDs reais
//  2. Defina `enabled: true` para ativar cada plataforma
//  3. Os eventos serão disparados automaticamente nas ações do usuário
// ═══════════════════════════════════════════════════════════════════

// ╔═══════════════════════════════════════════════════════════════╗
// ║  CONFIGURAÇÃO — Troque os IDs abaixo pelos seus IDs reais   ║
// ╚═══════════════════════════════════════════════════════════════╝

export const PIXEL_CONFIG = {
  meta: {
    enabled: false, // ← Troque para true quando configurar
    pixelId: 'SEU_PIXEL_ID_META',  // Ex: '123456789012345'
  },
  googleAds: {
    enabled: false,
    conversionId: 'SEU_CONVERSION_ID_GOOGLE',  // Ex: 'AW-123456789'
    conversionLabel: 'SEU_CONVERSION_LABEL',   // Ex: 'abcDEFghiJKL'
  },
  googleAnalytics: {
    enabled: false,
    measurementId: 'SEU_GA4_MEASUREMENT_ID',  // Ex: 'G-XXXXXXXXXX'
  },
  tiktok: {
    enabled: false,
    pixelId: 'SEU_PIXEL_ID_TIKTOK',  // Ex: 'CXXXXXXXXXXXXXXXXX'
  },
  pinterest: {
    enabled: false,
    tagId: 'SEU_TAG_ID_PINTEREST',  // Ex: '1234567890123'
  },
};

// ═══════════════════════════════════════════════════════════════════
//  Tipagens
// ═══════════════════════════════════════════════════════════════════

interface ProductEventData {
  id: string;
  name: string;
  price: number;
  currency?: string;
  category?: string;
  quantity?: number;
}

interface PurchaseEventData {
  orderId?: string;
  value: number;
  currency?: string;
  items: ProductEventData[];
}

// Declarações de tipos globais para os pixels
declare global {
  interface Window {
    fbq: any;
    gtag: any;
    ttq: any;
    pintrk: any;
    dataLayer: any[];
  }
}

// ═══════════════════════════════════════════════════════════════════
//  INICIALIZAÇÃO DOS PIXELS (chamada uma vez ao carregar o app)
// ═══════════════════════════════════════════════════════════════════

export const pixelService = {

  // Inicializa todos os pixels ativos
  init: () => {
    pixelService.initMeta();
    pixelService.initGoogleAds();
    pixelService.initGoogleAnalytics();
    pixelService.initTikTok();
    pixelService.initPinterest();
    console.log('[Veltrion Pixels] Inicialização concluída.');
  },

  // ─────────────────────────────────────────────────────────────
  //  META (Facebook / Instagram) Pixel
  // ─────────────────────────────────────────────────────────────
  initMeta: () => {
    if (!PIXEL_CONFIG.meta.enabled) return;
    const { pixelId } = PIXEL_CONFIG.meta;

    // Script do Facebook Pixel
    (function(f: any, b: any, e: any, v: any) {
      let n: any, t: any, s: any;
      if (f.fbq) return;
      n = f.fbq = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  },

  // ─────────────────────────────────────────────────────────────
  //  GOOGLE ADS + GOOGLE ANALYTICS 4
  // ─────────────────────────────────────────────────────────────
  initGoogleAds: () => {
    if (!PIXEL_CONFIG.googleAds.enabled) return;
    const { conversionId } = PIXEL_CONFIG.googleAds;
    pixelService._loadGtag(conversionId);
  },

  initGoogleAnalytics: () => {
    if (!PIXEL_CONFIG.googleAnalytics.enabled) return;
    const { measurementId } = PIXEL_CONFIG.googleAnalytics;
    pixelService._loadGtag(measurementId);
  },

  _loadGtag: (id: string) => {
    // Evitar carregar o gtag.js duas vezes
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);
  },

  // ─────────────────────────────────────────────────────────────
  //  TIKTOK Pixel
  // ─────────────────────────────────────────────────────────────
  initTikTok: () => {
    if (!PIXEL_CONFIG.tiktok.enabled) return;
    const { pixelId } = PIXEL_CONFIG.tiktok;

    (function(w: any, _d: any, t: any) {
      w.TiktokAnalyticsObject = t;
      const ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
      ttq.setAndDefer = function(target: any, method: any) {
        target[method] = function() { target.push([method].concat(Array.prototype.slice.call(arguments, 0))); };
      };
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function(id: any) {
        const e = ttq._i[id] || [];
        for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function(e: any, n?: any) {
        const url = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = url; ttq._t = ttq._t || {};
        ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        const o = document.createElement("script"); o.type = "text/javascript"; o.async = true; o.src = url + "?sdkid=" + e + "&lib=" + t;
        const a = document.getElementsByTagName("script")[0]; a.parentNode!.insertBefore(o, a);
      };
      ttq.load(pixelId);
      ttq.page();
    })(window, document, 'ttq');
  },

  // ─────────────────────────────────────────────────────────────
  //  PINTEREST Tag
  // ─────────────────────────────────────────────────────────────
  initPinterest: () => {
    if (!PIXEL_CONFIG.pinterest.enabled) return;
    const { tagId } = PIXEL_CONFIG.pinterest;

    (function(src: string) {
      if (!window.pintrk) {
        window.pintrk = function() { window.pintrk.queue.push(Array.prototype.slice.call(arguments)); };
        const n = window.pintrk;
        n.queue = []; n.version = "3.0";
        const t = document.createElement("script"); t.async = true; t.src = src;
        const r = document.getElementsByTagName("script")[0]; r.parentNode!.insertBefore(t, r);
      }
    })("https://s.pinimg.com/ct/core.js");

    window.pintrk('load', tagId);
    window.pintrk('page');
  },

  // ═══════════════════════════════════════════════════════════════════
  //  EVENTOS DE E-COMMERCE (Chamados das páginas/componentes)
  // ═══════════════════════════════════════════════════════════════════

  // 📄 Visualização de Página (chamado ao navegar)
  trackPageView: (url?: string) => {
    if (PIXEL_CONFIG.meta.enabled && window.fbq) {
      window.fbq('track', 'PageView');
    }
    if (PIXEL_CONFIG.googleAnalytics.enabled && window.gtag) {
      window.gtag('event', 'page_view', { page_location: url || window.location.href });
    }
    if (PIXEL_CONFIG.tiktok.enabled && window.ttq) {
      window.ttq.page();
    }
    if (PIXEL_CONFIG.pinterest.enabled && window.pintrk) {
      window.pintrk('page');
    }
  },

  // 👀 Visualização de Produto (chamado na ProductDetailPage)
  trackViewContent: (product: ProductEventData) => {
    const currency = product.currency || 'BRL';

    if (PIXEL_CONFIG.meta.enabled && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency,
      });
    }
    if ((PIXEL_CONFIG.googleAds.enabled || PIXEL_CONFIG.googleAnalytics.enabled) && window.gtag) {
      window.gtag('event', 'view_item', {
        currency,
        value: product.price,
        items: [{ item_id: product.id, item_name: product.name, price: product.price }],
      });
    }
    if (PIXEL_CONFIG.tiktok.enabled && window.ttq) {
      window.ttq.track('ViewContent', {
        content_id: product.id,
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency,
      });
    }
    if (PIXEL_CONFIG.pinterest.enabled && window.pintrk) {
      window.pintrk('track', 'pagevisit', {
        line_items: [{ product_id: product.id, product_name: product.name, product_price: product.price }],
      });
    }
  },

  // 🛒 Adicionar ao Carrinho
  trackAddToCart: (product: ProductEventData) => {
    const currency = product.currency || 'BRL';

    if (PIXEL_CONFIG.meta.enabled && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency,
      });
    }
    if ((PIXEL_CONFIG.googleAds.enabled || PIXEL_CONFIG.googleAnalytics.enabled) && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency,
        value: product.price,
        items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: product.quantity || 1 }],
      });
    }
    if (PIXEL_CONFIG.tiktok.enabled && window.ttq) {
      window.ttq.track('AddToCart', {
        content_id: product.id,
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency,
        quantity: product.quantity || 1,
      });
    }
    if (PIXEL_CONFIG.pinterest.enabled && window.pintrk) {
      window.pintrk('track', 'addtocart', {
        value: product.price,
        currency,
        line_items: [{ product_id: product.id, product_name: product.name, product_price: product.price, product_quantity: product.quantity || 1 }],
      });
    }
  },

  // 💳 Início do Checkout
  trackInitiateCheckout: (value: number, items: ProductEventData[]) => {
    const currency = 'BRL';

    if (PIXEL_CONFIG.meta.enabled && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map(i => i.id),
        value,
        currency,
        num_items: items.length,
      });
    }
    if ((PIXEL_CONFIG.googleAds.enabled || PIXEL_CONFIG.googleAnalytics.enabled) && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency,
        value,
        items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity || 1 })),
      });
    }
    if (PIXEL_CONFIG.tiktok.enabled && window.ttq) {
      window.ttq.track('InitiateCheckout', {
        content_type: 'product',
        value,
        currency,
      });
    }
    if (PIXEL_CONFIG.pinterest.enabled && window.pintrk) {
      window.pintrk('track', 'checkout', {
        value,
        currency,
        line_items: items.map(i => ({ product_id: i.id, product_name: i.name, product_price: i.price, product_quantity: i.quantity || 1 })),
      });
    }
  },

  // ✅ Compra Concluída (conversão)
  trackPurchase: (data: PurchaseEventData) => {
    const currency = data.currency || 'BRL';

    if (PIXEL_CONFIG.meta.enabled && window.fbq) {
      window.fbq('track', 'Purchase', {
        content_ids: data.items.map(i => i.id),
        content_type: 'product',
        value: data.value,
        currency,
        num_items: data.items.length,
      });
    }
    if (PIXEL_CONFIG.googleAds.enabled && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: `${PIXEL_CONFIG.googleAds.conversionId}/${PIXEL_CONFIG.googleAds.conversionLabel}`,
        value: data.value,
        currency,
        transaction_id: data.orderId,
      });
    }
    if (PIXEL_CONFIG.googleAnalytics.enabled && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: data.orderId,
        value: data.value,
        currency,
        items: data.items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity || 1 })),
      });
    }
    if (PIXEL_CONFIG.tiktok.enabled && window.ttq) {
      window.ttq.track('CompletePayment', {
        content_type: 'product',
        value: data.value,
        currency,
      });
    }
    if (PIXEL_CONFIG.pinterest.enabled && window.pintrk) {
      window.pintrk('track', 'checkout', {
        value: data.value,
        currency,
        order_id: data.orderId,
        line_items: data.items.map(i => ({ product_id: i.id, product_name: i.name, product_price: i.price, product_quantity: i.quantity || 1 })),
      });
    }
  },

  // 🔍 Busca (quando o usuário pesquisa)
  trackSearch: (searchTerm: string) => {
    if (PIXEL_CONFIG.meta.enabled && window.fbq) {
      window.fbq('track', 'Search', { search_string: searchTerm });
    }
    if ((PIXEL_CONFIG.googleAds.enabled || PIXEL_CONFIG.googleAnalytics.enabled) && window.gtag) {
      window.gtag('event', 'search', { search_term: searchTerm });
    }
    if (PIXEL_CONFIG.tiktok.enabled && window.ttq) {
      window.ttq.track('Search', { query: searchTerm });
    }
    if (PIXEL_CONFIG.pinterest.enabled && window.pintrk) {
      window.pintrk('track', 'search', { search_query: searchTerm });
    }
  },
};
