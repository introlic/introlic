/**
 * Core Branding Constants
 * Centralizing design tokens ensures consistency and makes theme updates trivial.
 */

export const COLORS = {
  brand: {
    blue: '#00a3ff',
    blueDim: 'rgba(0, 163, 255, 0.1)',
    blueMuted: 'rgba(0, 163, 255, 0.2)',
    blueDeep: '#0066cc',
  },
  neutral: {
    black: '#000000',
    deep: '#020202',
    surface: '#030303',
    white: '#ffffff',
    gray: {
      900: '#111111',
      800: '#1a1a1a',
      700: '#333333',
      600: '#4b5563',
      500: '#6b7280',
      400: '#9ca3af',
      300: '#d1d5db',
    }
  }
} as const;

export const TYPOGRAPHY = {
  tracking: {
    tightest: '-0.05em',
    tighter: '-0.02em',
    widest: '0.4em',
  }
} as const;

export const THEME = {
  aesthetic: 'Command Deck // Foundry',
  version: '2.8.4',
} as const;
