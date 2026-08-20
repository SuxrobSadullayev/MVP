/**
 * ==========================================================================
 * TAILWIND PRESET — dizayn tokenlaridan
 * --------------------------------------------------------------------------
 * TZ NFR-UX-01/02: dizayn tizimi kod bazasida, YAGONA manba.
 *
 * Bu yerda XOM QIYMAT (hex, px) YO'Q — hammasi `var(--...)` ga ishora qiladi.
 * Sabab: mavzu almashishi (light/dark/immersiv) CSS darajasida ishlaydi,
 * Tailwind esa faqat o'sha o'zgaruvchilarga murojaat qiladi.
 * Agar bu yerga hex yozilsa, dark mavzu buziladi.
 *
 * Ishlatilishi (apps/web/tailwind.config.js):
 *   import preset from '@3ds/ui/tailwind-preset';
 *   export default { presets: [preset], content: [...] };
 *
 * tokens.css ham import qilinishi SHART — preset faqat nomlarni bog'laydi,
 * qiymatlar o'sha faylda turadi.
 * ========================================================================== */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // --- Fon qatlamlari ---
        canvas: 'var(--color-bg-canvas)',
        surface: 'var(--color-bg-surface)',
        raised: 'var(--color-bg-raised)',
        sunken: 'var(--color-bg-sunken)',

        // --- Matn ---
        fg: {
          DEFAULT: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
          inverse: 'var(--color-text-inverse)',
          brand: 'var(--color-text-brand)',
        },

        // --- Chegaralar ---
        // `divider` dekorativ, `control` interaktiv (WCAG 1.4.11 ≥ 3:1)
        divider: 'var(--color-border-divider)',
        control: 'var(--color-border-control)',
        strong: 'var(--color-border-strong)',

        // --- Harakat ---
        action: {
          DEFAULT: 'var(--color-action-bg)',
          hover: 'var(--color-action-bg-hover)',
          active: 'var(--color-action-bg-active)',
          fg: 'var(--color-action-text)',
          subtle: 'var(--color-action-subtle-bg)',
          'subtle-fg': 'var(--color-action-subtle-text)',
        },

        // --- Status ---
        success: { DEFAULT: 'var(--color-success-text)', bg: 'var(--color-success-bg)' },
        danger: { DEFAULT: 'var(--color-danger-text)', bg: 'var(--color-danger-bg)' },
        warning: { DEFAULT: 'var(--color-warning-text)', bg: 'var(--color-warning-bg)' },

        // --- Ishonch tili (mahsulotga xos) ---
        computed: { DEFAULT: 'var(--color-trust-computed-text)', bg: 'var(--color-trust-computed-bg)' },
        claimed: { DEFAULT: 'var(--color-trust-claimed-text)', bg: 'var(--color-trust-claimed-bg)' },
        generated: {
          DEFAULT: 'var(--color-generated-text)',
          bg: 'var(--color-generated-bg)',
          border: 'var(--color-generated-border)',
        },
        vip: { DEFAULT: 'var(--color-vip-text)', bg: 'var(--color-vip-bg)' },
        verified: { DEFAULT: 'var(--color-verified-text)', bg: 'var(--color-verified-bg)' },
      },

      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },

      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-snug)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-snug)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-snug)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
      },

      // 8px grid — TZ NFR-UX-03
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        9: 'var(--space-9)',
        tap: 'var(--tap-min)', // ≥44px — NFR-UX-08
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        modal: 'var(--shadow-modal)',
      },

      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },

      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        decelerate: 'var(--ease-decelerate)',
        accelerate: 'var(--ease-accelerate)',
      },

      // Markazlashgan shkala — `z-[9999]` urushlari yo'q
      zIndex: {
        sticky: 'var(--z-sticky)',
        header: 'var(--z-header)',
        dropdown: 'var(--z-dropdown)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },

      maxWidth: {
        container: 'var(--container-max)',
      },
    },
  },
};
