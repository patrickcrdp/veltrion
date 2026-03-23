import React, { useState, useEffect } from 'react';
import { shopifyService, ShopifyCollection } from '../services/shopifyService';

const CategorySection: React.FC = () => {
    const [collections, setCollections] = useState<ShopifyCollection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            const data = await shopifyService.getCollections(4);
            setCollections(data);
            setLoading(false);
        };
        fetchCollections();
    }, []);

    if (loading) return null;

    return (
        <section className="container mx-auto px-6 py-24">
            <div className="flex flex-col mb-12">
                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Explore Coleções <span className="text-accent-cyan italic">Veltrion</span></h2>
                <div className="w-20 h-1 bg-accent-cyan rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {collections.map((cat) => (
                    <div key={cat.id} className="group relative h-80 overflow-hidden rounded-[32px] border border-white/5 cursor-pointer">
                        {/* Background Image */}
                        <img
                            alt={cat.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            src={cat.image || 'https://via.placeholder.com/400x600?text=Collection'}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>

                        {/* Content */}
                        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                            <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.3em] mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                {cat.productCount} PRODUTOS
                            </span>
                            <h3 className="text-2xl font-black text-white group-hover:text-accent-cyan transition-colors">
                                {cat.title}
                            </h3>
                            <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mt-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                Ver Coleção
                                <span className="material-icons-round text-sm">arrow_forward</span>
                            </div>
                        </div>

                        {/* Hover Border Glow */}
                        <div className="absolute inset-0 border-2 border-accent-cyan/0 group-hover:border-accent-cyan/40 rounded-[32px] transition-all duration-500 z-30 pointer-events-none"></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
