import { Suspense, lazy } from 'react';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

// Lazy load components
const ProductGrid = lazy(() => import('../components/ProductGrid'));
const SecondaryCarousel = lazy(() => import('../components/SecondaryCarousel'));
const Footer = lazy(() => import('../components/Footer'));

const SectionLoader = () => (
    <div className="w-full h-48 flex items-center justify-center text-accent-cyan/30 animate-pulse font-mono text-[10px] uppercase tracking-[0.3em]">
        [ Scanning For Best Offers ]
    </div>
);

function OffersPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent border-none overflow-x-hidden">
            {/* Background Layer */}
            <DigitalRain />

            {/* 1. Header (Navbar) */}
            <Navbar />

            <main className="relative">
                {/* 2. Hero Carousel - Reusing for consistency */}
                <Hero />

                <Suspense fallback={<SectionLoader />}>
                    <div className="relative z-10 mt-16 lg:mt-24">
                        {/* 3. Vitrine de Ofertas (Filtrado por coleção) */}
                        <ProductGrid
                            collectionHandle="ofertas"
                            title="Ofertas Explosivas Veltrion"
                        />
                    </div>

                    {/* 4. Sugestões Adicionais ou Outras Ofertas */}
                    <SecondaryCarousel 
                        collectionHandle="mais-vendidos" 
                        title="Mais Desejados." 
                        subtitle="Aproveite enquanto durar"
                    />
                </Suspense>
            </main>

            {/* Footer */}
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default OffersPage;
