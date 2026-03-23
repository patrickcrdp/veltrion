
export interface Banner {
    id: number;
    title: string;
    highlight: string;
    subtitle: string;
    image: string;
    link: string;
    buttonText: string;
    accentColor: string;
}

export const banners: Banner[] = [
    {
        id: 1,
        title: "O Futuro da",
        highlight: "Tecnologia",
        subtitle: "Experiência premium e performance extrema em cada detalhe da sua nova jornada digital.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop",
        link: "/#vitrine",
        buttonText: "Explorar Agora",
        accentColor: "#0095ff"
    },
    {
        id: 2,
        title: "Design &",
        highlight: "Performance",
        subtitle: "Sua produtividade elevada ao máximo com o ecossistema mais moderno do mundo.",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1000&auto=format&fit=crop",
        link: "/#vitrine",
        buttonText: "Ver Coleção",
        accentColor: "#a855f7"
    },
    {
        id: 3,
        title: "Eco",
        highlight: "Sustentável",
        subtitle: "Inovação com consciência. Conheça nossa linha de acessórios biodegradáveis e potentes.",
        image: "https://images.unsplash.com/photo-1556656793-062ff98782a1?q=80&w=1000&auto=format&fit=crop",
        link: "/#vitrine",
        buttonText: "Saber Mais",
        accentColor: "#10b981"
    }
];
