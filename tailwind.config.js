export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Professional Color Palette
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Main orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },

        /* ---- Game design system (collision-free names, mapped to CSS vars) ---- */
        base: 'var(--bg-base)',          // page background
        panel: 'var(--bg-elevated)',     // cards / panels
        soft: 'var(--bg-soft)',          // hover surfaces
        hair: 'var(--border-subtle)',    // hairline borders
        hairlit: 'var(--border-strong)', // active selection border
        ink: {
          DEFAULT: 'var(--text-primary)',
          soft: 'var(--text-secondary)',
          faint: 'var(--text-tertiary)',
        },
        gold: 'var(--accent-gold)',      // XP / achievements / primary highlight
        aqua: 'var(--accent-cyan)',      // dev / engineer stat
        coral: 'var(--accent-rose)',     // design stat / designer class
        ok: 'var(--success)',
        bad: 'var(--danger)',
      },

      // Signature font stack
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        pixel: ['var(--font-pixel)', 'ui-monospace', 'monospace'],
      },
      
      // Consistent Spacing System
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Typography Scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Fluid display sizes (clamp) for hero / section headers
        'display': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'h2': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'eyebrow': ['clamp(0.65rem, 1vw, 0.75rem)', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      
      // Professional Font Weights
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      
      // Consistent Border Radius
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      
      // Professional Shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 60px -12px rgba(0, 0, 0, 0.25), 0 8px 24px -4px rgba(0, 0, 0, 0.15)',
        '2xl': '0 25px 80px -12px rgba(0, 0, 0, 0.3), 0 12px 32px -4px rgba(0, 0, 0, 0.2)',
      },
      
      // Professional Transitions
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
      },
      
      // Premium easing curves (no linear / ease-in-out for UI motion)
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // Animation System
      animation: {
        "scroll-up": "scrollUp 10s linear infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.8s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        // Game layer
        "marquee": "marquee var(--marquee-duration, 40s) linear infinite",
        "marquee-reverse": "marquee var(--marquee-duration, 40s) linear infinite reverse",
        "shimmer": "shimmer 8s ease-in-out infinite",
        "gradient-x": "gradientX 6s ease infinite",
        "border-beam": "borderBeam var(--beam-duration, 6s) linear infinite",
      },
      keyframes: {
        scrollUp: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        marquee: {
          "from": { transform: "translateX(0)" },
          "to": { transform: "translateX(calc(-100% - var(--marquee-gap, 2rem)))" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        borderBeam: {
          "100%": { "offset-distance": "100%" },
        },
      },
      
      // Professional Gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-professional': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      },
      
      // Container System
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
};
