import { type Variants } from 'framer-motion';

/**
 * Shared animation variants for consistent motion across the app
 * Eliminates duplication and ensures unified animation behavior
 */

// ── Easing Curves ──
export const easings = {
  smooth: [0.16, 1, 0.3, 1] as [number, number, number, number],
  elastic: [0.22, 1, 0.36, 1] as [number, number, number, number],
  bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  linear: 'linear',
} as const;

// ── Fade Animations ──
export const fadeUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 1, 
      ease: easings.smooth
    } 
  }
} as Variants;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: easings.smooth
    } 
  }
} as Variants;

export const fadeDown: Variants = {
  hidden: { y: -40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 1, 
      ease: easings.smooth
    } 
  }
} as Variants;

// ── Slide Animations ──
export const slideInLeft: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: easings.elastic
    } 
  }
} as Variants;

export const slideInRight: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: easings.elastic
    } 
  }
} as Variants;

// ── Scale Animations ──
export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: easings.elastic
    } 
  }
} as Variants;

// ── Staggered Container ──
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren, 
      delayChildren 
    } 
  }
} as Variants);

// ── Staggered Items ──
export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: easings.smooth
    } 
  }
} as Variants;

// ── Hero-Specific Animations ──
export const heroContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  }
} as Variants;

export const heroItem: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: easings.elastic
    } 
  }
} as Variants;

// ── Export all variants as a single object for easy access ──
export const animations = {
  fadeUp,
  fadeIn,
  fadeDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
  heroContainer,
  heroItem,
  easings,
} as const;
