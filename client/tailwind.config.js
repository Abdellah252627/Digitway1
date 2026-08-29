/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#173404',      // Primary dark green
          primary: '#3B6D11',   // Primary mid green
          accent: '#639922',    // Accent bright green
          light: '#86BF38',     // Light vibrant green
          subtle: '#EBF4DD',    // Pale green tint
        },
        surface: {
          bg: '#F1EFE8',        // Neutral light background
          card: '#FFFFFF',      // Pure white card
          elevated: '#FAF8F5',  // Slight warm surface
          muted: '#E6E3D8',     // Border & divider
          dark: '#2C2C2A',      // Neutral dark text/bg
          darker: '#1E1E1C',    // Deeper dark surface
          charcoal: '#151712',  // Ultra dark green-charcoal
        },
        ink: {
          primary: '#2C2C2A',   // Main text
          secondary: '#62625D', // Secondary text
          muted: '#8C8C85',     // Muted/placeholder text
          inverted: '#F1EFE8',  // Light text on dark bg
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(23, 52, 4, 0.07), 0 4px 6px -2px rgba(23, 52, 4, 0.03)',
        'card': '0 10px 30px -5px rgba(23, 52, 4, 0.08)',
        'elevated': '0 20px 40px -15px rgba(23, 52, 4, 0.12)',
        'glow': '0 0 25px rgba(99, 153, 34, 0.25)',
      }
    },
  },
  plugins: [],
}
