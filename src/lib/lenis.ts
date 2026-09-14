import type Lenis from "lenis";

// The single smooth-scroll instance, created by <SmoothScroll />. Null when reduced motion is on.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}
