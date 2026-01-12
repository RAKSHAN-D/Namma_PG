/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable class-based dark mode
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1a73e8", // Example premium blue
                secondary: "#fbbc04",
                dark: "#202124",
            }
        },
    },
    plugins: [],
}
