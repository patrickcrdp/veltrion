import { Suspense, lazy } from 'react';
import DigitalRain from '../components/DigitalRain';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

// Lazy load components
const ScrollImageSequence = lazy(() => import('../components/ScrollImageSequence'));
const ProductGrid = lazy(() => import('../components/ProductGrid'));
const FeatureSection = lazy(() => import('../components/FeatureSection'));

const SecondaryCarousel = lazy(() => import('../components/SecondaryCarousel'));
const Footer = lazy(() => import('../components/Footer'));

const SectionLoader = () => (
    <div className="w-full h-48 flex items-center justify-center text-accent-cyan/30 animate-pulse font-mono text-[10px] uppercase tracking-[0.3em]">
        [ Loading Data Segment ]
    </div>
);

function HomePage() {
    return (
        <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-black bg-transparent border-none">
            {/* Background Layer */}
            <DigitalRain />

            {/* 1. Header (Top Bar + Main) */}
            <Navbar />

            <main className="relative">
                {/* 2. Hero Carousel */}
                <Hero />

                <Suspense fallback={<SectionLoader />}>
                    {/* 3. Storytelling Sequence (Premium Showcase) */}
                    <ScrollImageSequence />

                    {/* 4. Vitrine de Produtos (Product Grid) */}
                    <ProductGrid />

                    {/* 5. Banner Destaque (Full Width) */}
                    <FeatureSection />

                    {/* 6. Categorias / Acessórios */}

                    
                    {/* Novo Carrossel de Smartphones */}
                    <div id="smartphones-section" className="scroll-mt-32">
                        <ProductGrid collectionHandle="smartphones" title="Smartphones de Performance" />
                    </div>

                    {/* 7. Carousel Secundário (Acessórios) */}
                    <SecondaryCarousel 
                        collectionHandle="acessorios" 
                        title="Acessórios & Mais." 
                    />
                </Suspense>
            </main>

            {/* 8. Footer */}
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default HomePage;
