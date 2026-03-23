/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ffffff",
                secondary: "#aaaaaa",
                "background-light": "#f4f4f4",
                "background-dark": "#020617",
                "card-dark": "#0f172a",
                "border-dark": "#1e293b",
                "accent-cyan": "#0095ff",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "16px",
            },
        },
    },
    plugins: [],
}
