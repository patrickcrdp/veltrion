import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHero } from '../hooks/useHero';

const Hero: React.FC = () => {
    const {
        slides,
        currentSlide,
        nextSlide,
        prevSlide,
        setSlide
    } = useHero(5000);

    return (
        <section className="relative w-full pt-20 lg:pt-0 lg:h-screen lg:min-h-[700px] group overflow-hidden bg-background-dark">
            <div className="relative h-full w-full overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`lg:absolute lg:inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100 relative' : 'opacity-0 scale-105 pointer-events-none absolute inset-0'
                            }`}
                    >
                        {/* Full Slide Link */}
                        <a href={slide.link} className="block w-full h-full bg-background-dark">
                            {/* 
                              Mobile: w-full + auto height → imagem aparece INTEIRA sem espaço vazio
                              Desktop (lg+): object-cover + absolute → experiência imersiva
                            */}
                            <img
                                alt={slide.title}
                                className="w-full h-auto lg:h-full lg:object-cover object-center"
                                loading={index === 0 ? "eager" : "lazy"}
                                src={slide.image}
                                style={{
                                    imageRendering: 'auto'
                                }}
                            />
                        </a>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 md:px-8 z-30 pointer-events-none">
                    <button
                        onClick={prevSlide}
                        className="pointer-events-auto p-2 sm:p-3 md:p-5 rounded-full bg-black/20 sm:bg-black/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white hover:text-black transition-all opacity-60 sm:opacity-0 group-hover:opacity-100 transform sm:-translate-x-4 sm:group-hover:translate-x-0"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="pointer-events-auto p-2 sm:p-3 md:p-5 rounded-full bg-black/20 sm:bg-black/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white hover:text-black transition-all opacity-60 sm:opacity-0 group-hover:opacity-100 transform sm:translate-x-4 sm:group-hover:translate-x-0"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    </button>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-3 sm:bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 md:gap-4 z-40">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setSlide(index)}
                            className={`h-1 sm:h-1.5 transition-all duration-700 rounded-full ${index === currentSlide ? 'bg-white w-12 sm:w-16 md:w-24' : 'bg-white/20 w-5 sm:w-6 md:w-8 hover:bg-white/40'
                                }`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
