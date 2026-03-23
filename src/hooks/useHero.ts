import { useState, useEffect, useCallback } from 'react';
import { shopifyService, ShopifyHeroBanner } from '../services/shopifyService';
import { banners as fallbackBanners } from '../data/banners';

/**
 * useHero Hook
 * Gerencia a lógica do carrossel de banners buscando do Shopify Metaobjects.
 */
export const useHero = (interval: number = 7000) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<ShopifyHeroBanner[]>([]);
    const [loading, setLoading] = useState(true);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const setSlide = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const dynamicBanners = await shopifyService.getHeroBanners();
                if (dynamicBanners && dynamicBanners.length > 0) {
                    setSlides(dynamicBanners);
                } else {
                    // Use fallback data if no Shopify metaobjects are found
                    setSlides(fallbackBanners.map(b => ({
                        ...b,
                        id: b.id.toString(),
                        buttonText: b.buttonText
                    })) as ShopifyHeroBanner[]);
                }
            } catch (error) {
                console.error("Error loading banners from Shopify:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBanners();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [nextSlide, interval, slides.length, currentSlide]);

    return {
        slides,
        currentSlide,
        loading,
        nextSlide,
        prevSlide,
        setSlide
    };
};
