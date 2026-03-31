import { initHomeGridTrail } from "./homeGridTrail.js";

let destroyHomeGrid: (() => void) | null = null;

export function mountHomeGrid(): void {
  if (destroyHomeGrid) {
    destroyHomeGrid();
    destroyHomeGrid = null;
  }
  const root = document.querySelector("[data-home-grid-root]");
  if (root instanceof HTMLElement) {
    const d = initHomeGridTrail(root);
    if (d) destroyHomeGrid = d;
  }
}
