export const transitions = {
  micro: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1],
  },
  component: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  entrance: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1],
  },
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
  },
};

// Hero entrance sequence
export const heroSequence = {
  eyebrow: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  headline: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
  },
  description: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] },
  },
  cta: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  visual: {
    initial: { opacity: 0, scale: 0.96, y: 12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};