import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { shopifyService, ShopifyProduct } from '../services/shopifyService';

// Extensão de tipos para o Google GSI
declare global {
    interface Window {
        google: any;
    }
}

const Navbar: React.FC = () => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false); // Agora nasce desmarcado por padrão (Segurança Total)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { searchQuery, setSearchQuery } = useSearch();
    const { cartCount, isCartOpen, setIsCartOpen } = useCart();
    const { user, login, logout } = useAuth();

    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showUserMenu]);

    // Função para decodificar o token JWT do Google (sem bibliotecas externas)
    const parseJwt = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    const handleGoogleResponse = (response: any) => {
        const userData = parseJwt(response.credential);
        if (userData) {
            const profile = {
                name: userData.given_name || userData.name,
                email: userData.email,
                picture: userData.picture
            };
            login(profile);
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
    };

    // Inicialização base do Google (Ocorre apenas 1x)
    useEffect(() => {
        const initGoogle = () => {
            if (window.google && !window['gsi_initialized' as any]) {
                (window as any)['gsi_initialized'] = true;
                window.google.accounts.id.initialize({
                    client_id: '89437350200-ijq84t1nuaofq2n4lvvnsdafa652eof2.apps.googleusercontent.com',
                    callback: handleGoogleResponse
                });
            }
        };

        const checkScript = () => {
            if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
                initGoogle();
            } else {
                setTimeout(checkScript, 500);
            }
        };
        checkScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // Renderiza o botão customizado apenas quando o menu abre e a div existe
    useEffect(() => {
        if (showUserMenu && window.google) {
            const buttonDiv = document.getElementById('google-login-btn');
            if (buttonDiv) {
                // Aguarda um respiro do DOM
                setTimeout(() => {
                    try {
                        // Garantir que a configuração está fresca para essa montagem
                        window.google.accounts.id.initialize({
                            client_id: '89437350200-ijq84t1nuaofq2n4lvvnsdafa652eof2.apps.googleusercontent.com',
                            callback: handleGoogleResponse
                        });
                        
                        // Limpa pra reconstruir se precisar
                        buttonDiv.innerHTML = '';
                        window.google.accounts.id.renderButton(buttonDiv, {
                            type: 'standard',
                            shape: 'pill',
                            theme: 'filled_black',
                            size: 'large',
                            text: 'signin_with',
                            width: '240'
                        });
                    } catch (e) {
                         console.error("Erro ao renderizar Google Btn:", e);
                    }
                }, 100);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showUserMenu]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                // Fetch small amount for suggestions
                const query = `title:${searchQuery}*`;
                const data = await shopifyService.getProducts(5, query);
                setSearchResults(data);
            } catch (error) {
                console.error("Suggestion fetch error:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobileMenuOpen, isSearchFocused]);

    // Reseta todos os menus e overlays se o usuário navegar entre páginas (ex: botão voltar do celular)
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchFocused(false);
        setShowUserMenu(false);
        setIsCartOpen(false);
    }, [location.pathname, setIsCartOpen]);

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
        // Timeout garante que o ReactRouterDOM finalize qualquer renderização antes do scroll forçado
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    };

    const handleSmartphonesClick = (e: React.MouseEvent) => {
        setIsMobileMenuOpen(false);
        // Se a pessoa já estiver na página Home, evitamos recarregar e rolamos para a seção desejada nativamente.
        if (location.pathname === '/') {
            e.preventDefault();
        }
        setTimeout(() => {
            const section = document.getElementById('smartphones-section');
            if (section) {
                // Rola centralizando a seção suavemente
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${scrolled ? 'bg-background-dark/90 backdrop-blur-xl border-b border-white/5 shadow-2xl py-1' : 'bg-transparent py-4'
            }`}>
            {/* Top Bar - Hidden on mobile and on scroll for ultra-clean look */}
            <div className={`top-bar hidden sm:block border-b border-white/5 py-2 transition-all duration-500 overflow-hidden ${scrolled ? 'max-h-0 opacity-0 mb-0' : 'max-h-20 opacity-100 mb-2'
                }`}>
                <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-secondary/60">
                    <div className="flex gap-6">
                        <Link to="/suporte" className="hover:text-accent-cyan transition-all">Contato</Link>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Removido o seletor de idiomas */}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="main-header relative z-[90]">
                <div className="container mx-auto px-6 flex items-center justify-between gap-8">
                    {/* Logo clicável */}
                    <Link className="text-2xl font-black tracking-tighter text-white uppercase italic flex-shrink-0 group" to="/" onClick={handleNavClick}>
                        Veltrion<span className="text-accent-cyan inline-block group-hover:animate-bounce">.</span>
                    </Link>

                    {/* Menu de navegação principal */}
                    <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                        <Link className="hover:text-white transition-all duration-300 relative group" to="/" onClick={handleSmartphonesClick}>
                            Smartphones
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link className="hover:text-white transition-all duration-300 relative group" to="/acessorios" onClick={handleNavClick}>
                            Acessórios
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link className="hover:text-white transition-all duration-300 relative group" to="/ofertas" onClick={handleNavClick}>
                            Ofertas
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link className="hover:text-white transition-all duration-300 relative group" to="/suporte" onClick={handleNavClick}>
                            Suporte
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </nav>

                    {/* Campo de busca — Desktop: inline | Mobile: ícone + overlay */}

                    {/* Desktop Search (hidden on mobile) */}
                    <div className={`hidden md:block flex-1 max-w-md relative transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}>
                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                            search
                        </span>
                        <input
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-xs font-medium focus:ring-1 focus:ring-accent-cyan/50 focus:bg-white/10 text-white placeholder:text-slate-600 transition-all outline-none"
                            placeholder="BUSCAR INOVAÇÃO..."
                            type="text"
                        />

                        {/* Search Dropdown */}
                        {isSearchFocused && (searchQuery.length >= 2) && (
                            <div className="absolute top-full left-0 right-0 mt-4 bg-background-dark/95 backdrop-blur-2xl border border-white/10 rounded-[24px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                                {isSearching ? (
                                    <div className="p-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan/40 animate-pulse">
                                        Explorando sistema...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="p-2">
                                        <div className="px-4 py-2 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] border-b border-white/5 mb-2">
                                            Sugestões Encontradas
                                        </div>
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                to={`/produto/${product.handle}`}
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                                                onClick={() => setSearchQuery('')}
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-white p-1 flex-shrink-0">
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.title}
                                                        className="w-full h-full object-contain mix-blend-multiply"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[11px] font-black text-white uppercase tracking-tighter truncate group-hover:text-accent-cyan transition-colors">
                                                        {product.title}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-accent-cyan">
                                                        {shopifyService.formatMoney(product.price)}
                                                    </p>
                                                </div>
                                                <span className="material-icons-round text-white/20 text-sm group-hover:translate-x-1 group-hover:text-accent-cyan transition-all">
                                                    arrow_forward
                                                </span>
                                            </Link>
                                        ))}
                                        <div className="p-2 mt-2">
                                            <button
                                                className="w-full py-3 rounded-xl bg-accent-cyan/10 text-accent-cyan text-[9px] font-black uppercase tracking-[0.2em] hover:bg-accent-cyan hover:text-white transition-all shadow-lg shadow-accent-cyan/5"
                                                onClick={() => setIsSearchFocused(false)}
                                            >
                                                Ver Todos os Resultados
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <span className="material-icons-round text-white/10 text-3xl mb-2">search_off</span>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">
                                            Nenhuma inovação detectada
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Search Button (visible only on mobile) */}
                    <button
                        onClick={() => setIsSearchFocused(true)}
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
                        aria-label="Buscar"
                    >
                        <span className="material-icons-round text-xl">search</span>
                    </button>

                    {/* Mobile Search Overlay */}
                    {isSearchFocused && createPortal(
                        <div className="md:hidden fixed inset-0 z-[1000] bg-background-dark/95 backdrop-blur-2xl animate-in fade-in duration-200">
                            <div className="flex flex-col h-full">
                                {/* Mobile Search Header */}
                                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                                    <span className="material-icons-round text-accent-cyan text-xl">search</span>
                                    <input
                                        autoFocus
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        value={searchQuery}
                                        className="flex-1 bg-transparent text-base font-medium text-white placeholder:text-white/30 outline-none"
                                        placeholder="O que você procura?"
                                        type="text"
                                    />
                                    <button
                                        onClick={() => { setIsSearchFocused(false); setSearchQuery(''); }}
                                        className="p-2 rounded-full hover:bg-white/10 transition-all"
                                    >
                                        <span className="material-icons-round text-white/60 text-xl">close</span>
                                    </button>
                                </div>

                                {/* Mobile Search Results */}
                                <div className="flex-1 overflow-y-auto px-4 py-4">
                                    {isSearching ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan/40 animate-pulse">
                                                Buscando...
                                            </div>
                                        </div>
                                    ) : searchQuery.length >= 2 && searchResults.length > 0 ? (
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 px-2">
                                                {searchResults.length} resultado(s)
                                            </p>
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={`/produto/${product.handle}`}
                                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                                    onClick={() => { setSearchQuery(''); setIsSearchFocused(false); }}
                                                >
                                                    <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex-shrink-0">
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.title}
                                                            className="w-full h-full object-contain mix-blend-multiply"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-black text-white truncate">
                                                            {product.title}
                                                        </h4>
                                                        <p className="text-sm font-bold text-accent-cyan mt-1">
                                                            {shopifyService.formatMoney(product.price)}
                                                        </p>
                                                    </div>
                                                    <span className="material-icons-round text-white/20">chevron_right</span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : searchQuery.length >= 2 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <span className="material-icons-round text-white/10 text-5xl mb-4">search_off</span>
                                            <p className="text-sm font-bold text-white/30">
                                                Nenhum resultado para "{searchQuery}"
                                            </p>
                                            <p className="text-xs text-white/20 mt-1">Tente outros termos</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <span className="material-icons-round text-white/10 text-5xl mb-4">manage_search</span>
                                            <p className="text-sm font-medium text-white/30">
                                                Digite para buscar produtos
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Account & Cart */}
                    <div className="flex items-center gap-6">
                        <div className="relative" ref={userMenuRef}>
                            {user ? (
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-accent-cyan/50 shadow-[0_0_15px_rgba(0,149,255,0.3)] transition-all group-hover:scale-110 group-hover:border-accent-cyan bg-white/5 flex items-center justify-center">
                                        {user.picture ? (
                                            <img
                                                src={user.picture}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    // Se a imagem falhar, removemos o src para mostrar o ícone de fallback
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    const parent = (e.target as HTMLElement).parentElement;
                                                    if (parent) {
                                                        const span = document.createElement('span');
                                                        span.className = 'material-icons-round text-xl text-accent-cyan';
                                                        span.innerText = 'person';
                                                        parent.appendChild(span);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span className="material-icons-round text-xl text-accent-cyan">person</span>
                                        )}
                                    </div>
                                    <div className="hidden xl:flex flex-col items-start leading-none">
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Bem-vindo</span>
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-[80px]">{user.name}</span>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center text-white/60 hover:text-accent-cyan transition-all duration-300 group"
                                >
                                    <span className="material-icons-round text-2xl group-hover:scale-110 transition-transform">person_outline</span>
                                </button>
                            )}

                            {/* User Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute top-full right-0 mt-4 w-64 bg-background-dark/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-[70] animate-in fade-in slide-in-from-top-2 duration-300">
                                    {user ? (
                                        <>
                                            <div className="p-5 border-b border-white/5 bg-white/5 text-center sm:text-left">
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Status: Conectado</p>
                                                <p className="text-xs font-black text-white truncate">{user.name}</p>
                                                <p className="text-[9px] font-medium text-white/30 truncate">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link to="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black text-white uppercase tracking-widest transition-all group">
                                                    <span className="material-icons-round text-lg text-secondary/40 group-hover:text-accent-cyan transition-colors">account_circle</span>
                                                    Meu Perfil
                                                </Link>
                                                <Link to="/pedidos" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black text-white uppercase tracking-widest transition-all group">
                                                    <span className="material-icons-round text-lg text-secondary/40 group-hover:text-accent-cyan transition-colors">shopping_bag</span>
                                                    Meus Pedidos
                                                </Link>
                                                <div className="h-[1px] bg-white/5 my-2 mx-4"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-[10px] font-black text-red-500 uppercase tracking-widest transition-all group"
                                                >
                                                    <span className="material-icons-round text-lg group-hover:rotate-12 transition-transform">logout</span>
                                                    Encerrar Sessão
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-6 flex flex-col items-center text-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2">
                                                <span className="material-icons-round text-2xl text-accent-cyan animate-pulse">login</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Acesso Premium</h4>
                                                    <p className="text-[9px] font-medium text-white/40 uppercase tracking-tighter italic">Crie seu perfil Veltrion instantaneamente</p>
                                                </div>

                                                <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-left transition-all hover:bg-white/10 group/terms">
                                                    <label className="flex gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            id="terms-check"
                                                            className="w-4 h-4 mt-0.5 rounded border-white/10 bg-black/40 text-accent-cyan focus:ring-accent-cyan transition-all accent-accent-cyan shadow-[0_0_10px_rgba(0,149,255,0.2)]"
                                                            checked={isTermsAccepted}
                                                            onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                                        />
                                                        <span className="text-[9px] font-bold text-slate-500 leading-snug uppercase tracking-widest group-hover:text-white transition-colors">
                                                            Eu li e aceito os <Link to="/termos-de-servico" className="text-accent-cyan underline hover:text-white" onClick={() => setShowUserMenu(false)}>Termos de Serviço</Link> e a <Link to="/politica-de-privacidade" className="text-accent-cyan underline hover:text-white" onClick={() => setShowUserMenu(false)}>Política de Privacidade</Link> da Veltrion.
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="relative w-full flex justify-center">
                                                <div id="google-login-btn" className={`mt-4 min-h-[40px] w-full flex justify-center transition-all duration-500 ${!isTermsAccepted ? 'grayscale opacity-30 pointer-events-none blur-[1px]' : 'hover:scale-[1.02]'}`}></div>
                                                {!isTermsAccepted && (
                                                    <div
                                                        className="absolute inset-0 z-10 cursor-not-allowed"
                                                        onClick={(e) => { e.stopPropagation(); /* O visual de blur/grayscale já indica que é necessário marcar os termos */ }}
                                                    ></div>
                                                )}
                                            </div>
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mt-2">Powered by Shopify Passport</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 relative group ${cartCount > 0
                                    ? 'bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan shadow-[0_0_20px_rgba(0,149,255,0.2)]'
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/20'
                                }`}
                        >
                            <span className="material-icons-round text-2xl group-hover:rotate-12 transition-transform">shopping_bag</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-accent-cyan text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background-dark animate-bounce-slow px-1 shadow-[0_0_15px_rgba(0,149,255,0.5)]">
                                    {cartCount}
                                </span>
                            )}
                            {cartCount === 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-cyan rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            )}
                        </button>

                        {/* Mobile Menu Trigger */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:text-accent-cyan hover:border-accent-cyan/30 transition-all"
                        >
                            <span className="material-icons-round text-2xl">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu Overlay */}
            {isMobileMenuOpen && createPortal(
                <div className="lg:hidden fixed inset-0 z-[998] bg-background-dark border-l border-white/5 animate-in fade-in slide-in-from-right duration-500">
                    <div className="flex flex-col h-full pt-24 px-6 pb-12 overflow-y-auto">
                        <div className="flex flex-col gap-6">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Navegação Principal</p>
                            
                            <Link to="/" className="flex items-center justify-between group py-2" onClick={handleSmartphonesClick}>
                                <span className="text-3xl font-black text-white uppercase tracking-tighter group-active:text-accent-cyan transition-colors">Smartphones</span>
                                <span className="material-icons-round text-accent-cyan text-2xl group-active:translate-x-2 transition-transform">arrow_forward</span>
                            </Link>

                            <Link to="/acessorios" className="flex items-center justify-between group py-2" onClick={handleNavClick}>
                                <span className="text-3xl font-black text-white uppercase tracking-tighter group-active:text-accent-cyan transition-colors">Acessórios</span>
                                <span className="material-icons-round text-accent-cyan text-2xl group-active:translate-x-2 transition-transform">arrow_forward</span>
                            </Link>

                            <Link to="/ofertas" className="flex items-center justify-between group py-2" onClick={handleNavClick}>
                                <span className="text-3xl font-black text-white uppercase tracking-tighter group-active:text-accent-cyan transition-colors">Ofertas</span>
                                <span className="material-icons-round text-accent-cyan text-2xl group-active:translate-x-2 transition-transform">arrow_forward</span>
                            </Link>

                            <Link to="/suporte" className="flex items-center justify-between group py-2" onClick={handleNavClick}>
                                <span className="text-3xl font-black text-white uppercase tracking-tighter group-active:text-accent-cyan transition-colors">Suporte</span>
                                <span className="material-icons-round text-accent-cyan text-2xl group-active:translate-x-2 transition-transform">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/5 space-y-8">
                             <div className="space-y-4">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Atendimento Especializado</p>
                                <a href="https://wa.me/556198063734" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                                    <span className="material-icons-round text-accent-cyan">whatsapp</span>
                                    <span className="text-sm font-bold uppercase tracking-widest">Suporte WhatsApp</span>
                                </a>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                 <Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col gap-2 p-5 rounded-3xl bg-white/5 border border-white/5 text-center transition-all active:scale-95">
                                     <span className="material-icons-round text-accent-cyan text-2xl">account_circle</span>
                                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Perfil</span>
                                 </Link>
                                 <Link to="/pedidos" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col gap-2 p-5 rounded-3xl bg-white/5 border border-white/5 text-center transition-all active:scale-95">
                                     <span className="material-icons-round text-accent-cyan text-2xl">local_shipping</span>
                                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Pedidos</span>
                                 </Link>
                             </div>
                        </div>

                        <div className="mt-auto pt-12 flex flex-col items-center gap-4">
                             <div className="text-2xl font-black tracking-tighter text-white uppercase italic opacity-20">
                                Veltrion<span className="text-accent-cyan">.</span>
                             </div>
                             <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">© 2026 Veltrion Digital Systems</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite ease-in-out;
                }
            `}</style>
        </header>
    );
};

export default Navbar;
