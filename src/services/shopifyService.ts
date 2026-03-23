const ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;
const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const API_URL = `https://${STORE_DOMAIN}/api/2024-04/graphql.json`;

const headers = {
  'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
  'Content-Type': 'application/json'
};

export interface ShopifyHeroBanner {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
  accentColor: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  image: string | null;
  productCount: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  image?: string;
}

export interface ShopifyMetafield {
  key: string;
  value: string;
  namespace: string;
  label: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  price: string;
  compareAtPrice?: string;
  images: string[];
  variantId: string;
  variants: ShopifyVariant[];
  options: { name: string; values: string[] }[];
  category?: string;
  tags?: string[];
  vendor?: string;
  availableForSale?: boolean;
  metafields?: ShopifyMetafield[];
}

export interface ShopifyOrder {
  id: string;
  orderNumber: string;
  processedAt: string;
  totalPrice: string;
  status: string;
  invoiceUrl?: string;
  trackingUrl?: string;
  items: {
    title: string;
    image: string;
    quantity: number;
    price: string;
  }[];
}

/**
 * Common taxonomy and custom metafields requested for tech products
 */
const METAFIELD_IDENTIFIERS = [
  { namespace: 'shopify', key: 'color' },
  { namespace: 'shopify', key: 'screen_size' },
  { namespace: 'shopify', key: 'screen_resolution' },
  { namespace: 'shopify', key: 'screen_technology' },
  { namespace: 'shopify', key: 'power_source' },
  { namespace: 'shopify', key: 'battery_type' },
  { namespace: 'shopify', key: 'battery_size' },
  { namespace: 'shopify', key: 'battery_technology' },
  { namespace: 'shopify', key: 'operating_system' },
  { namespace: 'shopify', key: 'data_network' },
  { namespace: 'shopify', key: 'sim_card_type_1' },
  { namespace: 'shopify', key: 'sim_card_type_2' },
  { namespace: 'shopify', key: 'sim_card_capacity' },
  { namespace: 'shopify', key: 'connectivity_technology' },
  { namespace: 'shopify', key: 'headphone_jack' },
  { namespace: 'shopify', key: 'cosmetic_condition' },
  { namespace: 'shopify', key: 'ip_rating' },
  { namespace: 'shopify', key: 'authentication_method' },
  { namespace: 'shopify', key: 'charging_interface_type' },
  { namespace: 'shopify', key: 'phone_shape' },
  { namespace: 'shopify', key: 'wireless_charging_standard' },
  { namespace: 'shopify', key: 'removable_storage_formats' },
  { namespace: 'shopify', key: 'subscription_type' },
  { namespace: 'custom', key: 'cor' }
];

const METAFIELD_LABELS: Record<string, string> = {
  'color': 'Cor',
  'screen_size': 'Tamanho da tela',
  'screen_resolution': 'Resolução de tela',
  'screen_technology': 'Tecnologia de tela',
  'power_source': 'Fonte de energia',
  'battery_type': 'Tipo de bateria',
  'battery_size': 'Tamanho da bateria',
  'battery_technology': 'Tecnologia de bateria',
  'operating_system': 'Sistemas operacionais',
  'data_network': 'Rede de dados',
  'sim_card_type_1': 'Cartão SIM 1',
  'sim_card_type_2': 'Cartão SIM 2',
  'sim_card_capacity': 'Capacidade SIM',
  'connectivity_technology': 'Conectividade',
  'headphone_jack': 'Saída fone',
  'cosmetic_condition': 'Condição',
  'ip_rating': 'Proteção (IP)',
  'authentication_method': 'Autenticação',
  'charging_interface_type': 'Interface de carga',
  'phone_shape': 'Formato',
  'wireless_charging_standard': 'Carga sem fio',
  'removable_storage_formats': 'Armazenamento',
  'subscription_type': 'Assinatura',
  'cor': 'Cor'
};

/**
 * Shopify Service Facade
 */
class ShopifyServiceFacade {
  private async fetchGraphQL(query: string, variables: any = {}) {
    try {
      const response = await fetch(`${API_URL}?t=${Date.now()}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        return null;
      }
      return result.data;
    } catch (error) {
      console.error("Shopify Service Fetch Error:", error);
      return null;
    }
  }

  private mapProduct(node: any): ShopifyProduct {
    const variants = node.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: edge.node.price.amount,
      compareAtPrice: edge.node.compareAtPrice?.amount || null,
      availableForSale: edge.node.availableForSale,
      selectedOptions: edge.node.selectedOptions,
      image: edge.node.image?.url || null
    }));

    const firstVariant = variants[0];

    // Mapeia metafields se existirem
    const metafields = node.metafields ? node.metafields
      .filter((m: any) => m !== null && m.value)
      .map((m: any) => ({
        key: m.key,
        value: m.value,
        namespace: m.namespace,
        label: METAFIELD_LABELS[m.key] || m.key.charAt(0).toUpperCase() + m.key.slice(1).replace(/_/g, ' ')
      })) : [];

    // Adiciona opções do produto (como Cor, Tamanho) aos dados estruturados
    // para garantir que apareçam mesmo sem metacampos configurados
    const extraSpecs = node.options ? node.options
      .filter((opt: any) => opt.name.toLowerCase() !== 'title' && opt.name.toLowerCase() !== 'título')
      .map((opt: any) => ({
        key: opt.name.toLowerCase(),
        value: opt.values.join(', '),
        namespace: 'option',
        label: opt.name
      })) : [];

    // Consolida tudo em uma lista única, evitando duplicatas se houver metafield com mesma chave
    const allSpecs = [...metafields];
    extraSpecs.forEach((spec: ShopifyMetafield) => {
      if (!allSpecs.some(s => s.label.toLowerCase() === spec.label.toLowerCase())) {
        allSpecs.push(spec);
      }
    });

    return {
      id: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description || "Descrição detalhada em desenvolvimento para este produto.",
      descriptionHtml: node.descriptionHtml || "<i>Descrição detalhada em desenvolvimento para este produto. Por favor, consulte nossa equipe via chat para especificações completas.</i>",
      price: firstVariant?.price || "0.00",
      compareAtPrice: firstVariant?.compareAtPrice || null,
      images: node.images.edges.map((img: any) => img.node.url),
      variantId: firstVariant?.id || "",
      variants: variants,
      options: node.options || [],
      category: node.productType || "todos",
      tags: node.tags || [],
      vendor: node.vendor,
      availableForSale: node.availableForSale,
      metafields: allSpecs
    };
  }

  async getProducts(count: number = 20, queryStr?: string): Promise<ShopifyProduct[]> {
    const query = `
        query GetProducts($first: Int!, $query: String, $metafields: [HasMetafieldsIdentifier!]!) {
          products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                id handle title description productType availableForSale
                options { name values }
                metafields(identifiers: $metafields) {
                  key value namespace
                }
                images(first: 5) { edges { node { url } } }
                variants(first: 20) { 
                  edges { 
                    node { 
                      id title availableForSale 
                      price { amount } 
                      compareAtPrice { amount }
                      selectedOptions { name value }
                      image { url }
                    } 
                  } 
                }
              }
            }
          }
        }`;

    const data = await this.fetchGraphQL(query, {
      first: count,
      query: queryStr,
      metafields: METAFIELD_IDENTIFIERS
    });
    if (!data || !data.products) return [];
    return data.products.edges.map((edge: any) => this.mapProduct(edge.node));
  }

  async getProductsByCollection(handle: string, count: number = 20): Promise<ShopifyProduct[]> {
    const query = `
        query GetProductsByCollection($handle: String!, $first: Int!, $metafields: [HasMetafieldsIdentifier!]!) {
          collection(handle: $handle) {
            products(first: $first, sortKey: CREATED, reverse: true) {
              edges {
                node {
                  id handle title description productType availableForSale
                  options { name values }
                  metafields(identifiers: $metafields) {
                    key value namespace
                  }
                  images(first: 5) { edges { node { url } } }
                  variants(first: 20) { 
                    edges { 
                      node { 
                        id title availableForSale 
                        price { amount } 
                        compareAtPrice { amount }
                        selectedOptions { name value }
                        image { url }
                      } 
                    } 
                  }
                }
              }
            }
          }
        }`;

    const data = await this.fetchGraphQL(query, {
      handle,
      first: count,
      metafields: METAFIELD_IDENTIFIERS
    });
    if (!data || !data.collection || !data.collection.products) return [];
    return data.collection.products.edges.map((edge: any) => this.mapProduct(edge.node));
  }

  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const query = `
        query GetProduct($handle: String!, $metafields: [HasMetafieldsIdentifier!]!) {
          product(handle: $handle) {
            id handle title description descriptionHtml productType availableForSale vendor tags
            options { name values }
            metafields(identifiers: $metafields) {
              key value namespace
            }
            images(first: 10) { edges { node { url } } }
            variants(first: 100) { 
              edges { 
                node { 
                  id title availableForSale 
                  price { amount } 
                  compareAtPrice { amount }
                  selectedOptions { name value }
                  image { url }
                } 
              } 
            }
          }
        }`;

    const data = await this.fetchGraphQL(query, {
      handle,
      metafields: METAFIELD_IDENTIFIERS
    });
    if (!data || !data.product) return null;
    return this.mapProduct(data.product);
  }

  async getCollections(count: number = 10): Promise<ShopifyCollection[]> {
    const query = `
      query GetCollections($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              id
              title
              handle
              image {
                url
              }
            }
          }
        }
      }
    `;

    const data = await this.fetchGraphQL(query, { first: count });
    if (!data || !data.collections) return [];

    return data.collections.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      image: edge.node.image?.url || null,
      productCount: 0 // totalCount removido por não ser suportado nesta versão da Storefront API
    }));
  }

  /**
   * Fetch Hero Banners from Shopify Metaobjects
   */
  async getHeroBanners(): Promise<ShopifyHeroBanner[]> {
    const query = `
      query GetHeroBanners {
        metaobjects(type: "hero_banner", first: 10) {
          edges {
            node {
              id
              fields {
                key
                value
                reference {
                  ... on MediaImage {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.fetchGraphQL(query);
    if (!data || !data.metaobjects) return [];

    return data.metaobjects.edges.map((edge: any) => {
      const fields = edge.node.fields;
      const getFieldValue = (key: string) => fields.find((f: any) => f.key === key)?.value;
      const getFieldImage = (key: string) => fields.find((f: any) => f.key === key)?.reference?.image?.url;

      return {
        id: edge.node.id,
        title: getFieldValue('title') || '',
        highlight: getFieldValue('highlight') || '',
        subtitle: getFieldValue('subtitle') || '',
        image: getFieldImage('image') || '',
        link: getFieldValue('link') || '/#vitrine',
        buttonText: getFieldValue('button_text') || 'Ver Detalhes',
        accentColor: getFieldValue('accent_color') || '#0095ff'
      };
    });
  }

  formatMoney(amount: string) {
    if (!amount) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(amount));
  }

  calculateInstallment(price: string, installments: number = 18) {
    const total = parseFloat(price);
    const value = total / installments;
    return this.formatMoney(value.toString());
  }

  private extractNumericId(variantId: string): string {
    let id = variantId;
    // 1. Decode Base64 if needed
    if (!id.includes('/') && !id.includes(':')) {
      try {
        id = atob(id);
      } catch (e) {
        console.warn("Falha ao decodificar Base64", e);
      }
    }

    // 2. Extract numeric part: gid://shopify/ProductVariant/12345678 -> 12345678
    const matches = id.match(/ProductVariant\/(\d+)/) || id.match(/\/(\d+)$/);
    if (matches && matches[1]) {
      return matches[1];
    }
    return id;
  }

  async createCart(items: { variantId: string, quantity: number }[]): Promise<{ id: string, checkoutUrl: string } | null> {
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const lines = items.map(i => ({
      merchandiseId: i.variantId.includes('gid://') ? i.variantId : `gid://shopify/ProductVariant/${i.variantId}`,
      quantity: i.quantity
    }));

    try {
      const data = await this.fetchGraphQL(query, { input: { lines } });
      if (data?.cartCreate?.cart) {
        return data.cartCreate.cart;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async addToCartCloud(cartId: string, variantId: string, quantity: number = 1) {
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { id checkoutUrl }
          userErrors { message }
        }
      }
    `;
    const lines = [{
      merchandiseId: variantId.includes('gid://') ? variantId : `gid://shopify/ProductVariant/${variantId}`,
      quantity
    }];
    return this.fetchGraphQL(query, { cartId, lines });
  }

  async updateCartCloud(cartId: string, lineId: string, quantity: number) {
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { id checkoutUrl }
        }
      }
    `;
    return this.fetchGraphQL(query, { cartId, lines: [{ id: lineId, quantity }] });
  }

  async removeFromCartCloud(cartId: string, lineIds: string[]) {
    const query = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { id checkoutUrl }
        }
      }
    `;
    return this.fetchGraphQL(query, { cartId, lineIds });
  }

  async getCart(cartId: string) {
    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount }
                    image { url }
                    product { id title handle }
                  }
                }
              }
            }
          }
          cost {
            totalAmount { amount }
          }
        }
      }
    `;
    return this.fetchGraphQL(query, { cartId });
  }

  async createCheckout(items: { variantId: string, quantity: number }[]): Promise<string | null> {
    // Mantido para compatibilidade, mas o cartCreate acima é preferível
    const cart = await this.createCart(items);
    return cart?.checkoutUrl || null;
  }

  async createCustomer(email: string, firstName: string, lastName: string, password: string) {
    const query = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer { id email }
          customerUserErrors { message }
        }
      }
    `;
    return this.fetchGraphQL(query, { input: { email, firstName, lastName, password, acceptsMarketing: true } });
  }

  async loginCustomer(email: string, password: string) {
    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken { accessToken expiresAt }
          customerUserErrors { message }
        }
      }
    `;
    const data = await this.fetchGraphQL(query, { input: { email, password } });
    return data?.customerAccessTokenCreate;
  }

  async getCustomerOrders(customerAccessToken: string): Promise<ShopifyOrder[]> {
    const query = `
      query getCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
            edges {
              node {
                id
                orderNumber
                processedAt
                totalPrice { 
                  amount 
                  currencyCode
                }
                fulfillmentStatus
                metafields(identifiers: [
                  {namespace: "bling", key: "nfe_url"},
                  {namespace: "notazz", key: "invoice_pdf"},
                  {namespace: "veltrion", key: "fiscal_note"}
                ]) {
                  key
                  value
                }
                successfulFulfillments(first: 1) {
                  trackingInfo {
                    number
                    url
                  }
                }
                lineItems(first: 5) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        price { amount }
                        image { url }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.fetchGraphQL(query, { customerAccessToken });
    if (!data?.customer?.orders) return [];

    return data.customer.orders.edges.map((edge: any) => {
      const order = edge.node;
      
      // Mapear itens primeiro para poder calcular o total se necessário
      const items = order.lineItems.edges.map((item: any) => ({
        title: item.node.title,
        image: item.node.variant?.image?.url || '',
        quantity: item.node.quantity,
        price: item.node.variant?.price?.amount || '0'
      }));

      // Lógica de Soma Inteligente (Failsafe)
      let totalAmount = order.totalPrice?.amount || '0';
      
      if (parseFloat(totalAmount) === 0 && items.length > 0) {
        const calculatedTotal = items.reduce((acc: number, item: any) => {
          return acc + (parseFloat(item.price) * item.quantity);
        }, 0);
        totalAmount = calculatedTotal.toString();
      }

      // Buscar o Link da Nota Fiscal (NF-e) nos metafields do pedido
      const invoiceUrl = order.metafields?.find((m: any) => 
        ['invoice_pdf', 'nfe_url', 'fiscal_note'].includes(m?.key)
      )?.value || null;
      
      // Buscar o Link de Rastreio (se estiver despachado)
      const trackingUrl = order.successfulFulfillments?.[0]?.trackingInfo?.[0]?.url || null;
      
      return {
        id: order.orderNumber.toString(),
        orderNumber: order.orderNumber.toString(),
        processedAt: new Date(order.processedAt).toLocaleDateString('pt-BR'),
        totalPrice: totalAmount,
        status: order.fulfillmentStatus === 'FULFILLED' ? 'Entregue' : 'Enviado',
        items: items,
        invoiceUrl: invoiceUrl,
        trackingUrl: trackingUrl
      };
    });
  }

  buyNow(variantId: string) {
    if (!variantId) return;
    const numericId = this.extractNumericId(variantId);
    window.location.href = `https://${STORE_DOMAIN}/cart/${numericId}:1`;
  }
}

export const shopifyService = new ShopifyServiceFacade();
