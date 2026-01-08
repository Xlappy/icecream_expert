/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'diner-pink': '#FFC8DD',   // Основний фон (полуничне молоко)
                'diner-blue': '#A2D2FF',   // Акценти (небо)
                'diner-yellow': '#FFEF96', // Для виділення (ваніль)
                'cherry-red': '#FF5D5D',   // Кнопки (вишня)
                'cream': '#FFFDF7',        // Фон карток
                'choco': '#4A3B32',        // Текст (шоколад) замість чорного
            },
            fontFamily: {
                'display': ['"Shrikhand"', 'cursive'], // Для заголовків (дуже жирний, ретро)
                'body': ['"Quicksand"', 'sans-serif'], // Для тексту (округлий, читабельний)
            },
            boxShadow: {
                'retro': '8px 8px 0px 0px rgba(74,59,50,1)',
                'retro-sm': '4px 4px 0px 0px rgba(74,59,50,1)',
            }
        },
    },
    plugins: [],
}
