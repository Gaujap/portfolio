/**
 * Mutable scroll state shared from the DOM (framer-motion scroll listeners)
 * to the WebGL scene (read every frame in useFrame). A plain module-level
 * object on purpose: the scene must read it at 60fps without triggering any
 * React re-renders.
 */
export const scrollState = {
  /** Whole-page scroll progress, 0 → 1. */
  page: 0,
  /** How present the project console is on screen, 0 → 1. */
  projectsPresence: 0,
  /** Index of the project currently active in the console. */
  activeProject: 0,
  /** Normalised pointer position, -1 → 1 on both axes (0,0 = centre). */
  pointerX: 0,
  pointerY: 0,
};
