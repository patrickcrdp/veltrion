import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AccessoriesPage from './pages/AccessoriesPage';
import OffersPage from './pages/OffersPage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PoliciesPage from './pages/PoliciesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CartDrawer } from './components/CartDrawer';
import AccessibilityMenu from './components/AccessibilityMenu';
import ScrollToTop from './components/ScrollToTop';
import LoginPromptModal from './components/LoginPromptModal';
import { pixelService } from './services/pixelService';

function App() {
  const location = useLocation();

  // Inicializa os pixels uma única vez ao montar o app
  useEffect(() => {
    pixelService.init();
  }, []);

  // Rastreia mudanças de página em todas as plataformas
  useEffect(() => {
    pixelService.trackPageView(window.location.href);
  }, [location]);

  return (
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
        <ScrollToTop />
        <AccessibilityMenu />
        <CartDrawer />
        <LoginPromptModal />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/acessorios" element={<AccessoriesPage />} />
          <Route path="/ofertas" element={<OffersPage />} />
          <Route path="/suporte" element={<SupportPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/central-ajuda" element={<HelpCenterPage />} />
          <Route path="/politicas" element={<PoliciesPage />} />
          <Route path="/produto/:handle" element={<ProductDetailPage />} />
          <Route path="/products/:handle" element={<ProductDetailPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/politica-de-reembolso" element={<RefundPolicyPage />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
          <Route path="/termos-de-servico" element={<TermsOfServicePage />} />
        </Routes>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>
);
}

export default App;

