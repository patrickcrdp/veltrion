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
        [ Loading Accessories Segment ]
    </div>
);

function AccessoriesPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent border-none">
            {/* Background Layer */}
            <DigitalRain />

            {/* 1. Header (Top Bar + Main) */}
            <Navbar />

            <main className="relative">
                {/* 2. Hero Carousel - Reusing the main one as requested */}
                <Hero />

                <Suspense fallback={<SectionLoader />}>
                    <div className="relative z-10 -mt-10">
                        {/* 3. Vitrine de Acessórios (Product Grid filtered) */}
                        <ProductGrid
                            collectionHandle="acessorios"
                            title="Acessórios"
                        />
                    </div>



                    {/* 5. Mais Destaques (Produtos Antigos) */}
                    <SecondaryCarousel reverse={false} />
                </Suspense>
            </main>

            {/* Footer */}
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default AccessoriesPage;
