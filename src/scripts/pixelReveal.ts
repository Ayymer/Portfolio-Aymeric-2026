/** Shared “pixelate then sharpen” reveal used by case images and works hover preview. */

export const PIXEL_REVEAL_FRAME_STEPS = [8, 16, 32, 48, 96] as const;
export const PIXEL_REVEAL_FRAME_MS = 80;
export const PIXEL_REVEAL_MAX_SIZE = 128;

export function pixelRevealPrefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type PixelRevealOptions = {
  /** Run when skipping animation or after the last frame (reveal the real image). */
  onComplete: () => void;
  /** If true before a frame, remove canvas and stop (e.g. new hover target). */
  isAborted?: () => boolean;
  /** Use global `.rendering-pixelated` on canvas; otherwise set `imageRendering` inline. */
  useUtilityPixelClass?: boolean;
};

/**
 * Draws stepped downscale/upscale frames on a canvas over `img`, then calls `onComplete`.
 */
export function runPixelReveal(
  img: HTMLImageElement,
  wrap: HTMLElement,
  options: PixelRevealOptions,
): void {
  const { onComplete, isAborted, useUtilityPixelClass = false } = options;

  if (pixelRevealPrefersReducedMotion()) {
    onComplete();
    return;
  }

  wrap.querySelector("canvas")?.remove();

  let cW = img.naturalWidth;
  let cH = img.naturalHeight;
  if (cW > PIXEL_REVEAL_MAX_SIZE) {
    cH = Math.round((cH * PIXEL_REVEAL_MAX_SIZE) / cW);
    cW = PIXEL_REVEAL_MAX_SIZE;
  }

  const canvas = document.createElement("canvas");
  canvas.width = cW;
  canvas.height = cH;
  if (useUtilityPixelClass) {
    canvas.classList.add("rendering-pixelated");
  } else {
    canvas.style.imageRendering = "pixelated";
  }
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  });
  wrap.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    onComplete();
    return;
  }

  let stepIndex = 0;

  function drawFrame(): void {
    if (isAborted?.()) {
      canvas.remove();
      return;
    }
    if (stepIndex >= PIXEL_REVEAL_FRAME_STEPS.length) {
      if (!isAborted?.()) onComplete();
      setTimeout(() => {
        if (!isAborted?.()) canvas.remove();
      }, 100);
      return;
    }

    const cols = PIXEL_REVEAL_FRAME_STEPS[stepIndex]!;
    const rows = Math.max(1, Math.round((cols * cH) / cW));

    ctx.clearRect(0, 0, cW, cH);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, 0, 0, cols, rows);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, cols, rows, 0, 0, cW, cH);

    stepIndex++;
    setTimeout(drawFrame, PIXEL_REVEAL_FRAME_MS);
  }

  drawFrame();
}
