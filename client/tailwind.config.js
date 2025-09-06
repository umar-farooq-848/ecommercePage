// ========================================
// CLIENT/TAILWIND.CONFIG.JS - Tailwind Configuration
// ========================================
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}'
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'neon-green': '#00FFA3',
          'electric-indigo': '#6C5DD3',
          'neon-pink': '#FF006E',
          'cyber-yellow': '#FFBE0B',
          'soft-black': '#1C1C1E',
          'white-smoke': '#F9F9F9',
          'glass': 'rgba(255,255,255,0.06)',
          // CSS variable colors
          'bg': 'var(--bg)',
          'card-bg': 'var(--card-bg)',
          'fg': 'var(--fg)',
          'primary': 'var(--primary)',
          'primary-foreground': 'var(--primary-foreground)'
        },
        boxShadow: {
          'glow-neon': '0 6px 24px rgba(0,255,163,0.18)',
          'glow-indigo': '0 8px 28px rgba(108,93,211,0.18)',
          'glow-pink': '0 6px 24px rgba(255,0,110,0.18)',
          'glow-yellow': '0 6px 24px rgba(255,190,11,0.18)'
        },
        backgroundImage: {
          'neon-gradient': 'linear-gradient(90deg,#00FFA3 0%,#6C5DD3 50%,#FF006E 100%)',
          'cyber-gradient': 'linear-gradient(135deg,#6C5DD3 0%,#FFBE0B 100%)',
          'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        },
        backdropBlur: {
          'xs': '2px',
          'glass': '8px'
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif']
        },
        animation: {
          'gradient-flow': 'gradient-flow 3s ease-in-out infinite',
          'slide-in': 'slideIn 0.3s ease-out',
          'pulse-glow': 'pulseGlow 2s ease-in-out infinite'
        },
        keyframes: {
          'gradient-flow': {
            '0%, 100%': { 'background-position': '0% 50%' },
            '50%': { 'background-position': '100% 50%' }
          },
          'slideIn': {
            '0%': { transform: 'translateY(-10px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' }
          },
          'pulseGlow': {
            '0%, 100%': { boxShadow: '0 0 5px rgba(108, 93, 211, 0.4)' },
            '50%': { boxShadow: '0 0 20px rgba(108, 93, 211, 0.8)' }
          }
        },
        screens: {
          'xs': '475px'
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem'
        },
        borderRadius: {
          '2xl': '1rem',
          '3xl': '1.5rem'
        }
      }
    },
    plugins: []
  }