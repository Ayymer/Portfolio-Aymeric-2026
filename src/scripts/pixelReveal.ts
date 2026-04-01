/** Shared “pixelate then sharpen” reveal used by case images and works hover preview. */

export const PIXEL_REVEAL_FRAME_STEPS = [8, 16, 32, 48, 96] as const;
export const PIXEL_REVEAL_FRAME_MS = 80;
export const PIXEL_REVEAL_MAX_SIZE = 128;

export function pixelRevealPrefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Match CSS `object-fit: cover` into a dest bitmap (uniform scale, crop). */
function drawImageObjectCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dW: number,
  dH: number,
): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (iw <= 0 || ih <= 0 || dW <= 0 || dH <= 0) return;
  const ir = iw / ih;
  const dr = dW / dH;
  let sx: number;
  let sy: number;
  let sw: number;
  let sh: number;
  if (ir > dr) {
    sh = ih;
    sw = ih * dr;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = iw / dr;
    sx = 0;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dW, dH);
}

/** Match CSS `object-fit: contain` (uniform scale, letterbox; dest cleared first). */
function drawImageObjectContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dW: number,
  dH: number,
): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (iw <= 0 || ih <= 0 || dW <= 0 || dH <= 0) return;
  ctx.clearRect(0, 0, dW, dH);
  const ir = iw / ih;
  const dr = dW / dH;
  let tw: number;
  let th: number;
  let ox: number;
  let oy: number;
  if (ir > dr) {
    tw = dW;
    th = dW / ir;
    ox = 0;
    oy = (dH - th) / 2;
  } else {
    th = dH;
    tw = dH * ir;
    ox = (dW - tw) / 2;
    oy = 0;
  }
  ctx.drawImage(img, 0, 0, iw, ih, ox, oy, tw, th);
}

function resolveObjectFit(
  wrap: HTMLElement,
  explicit?: "cover" | "contain",
): "cover" | "contain" {
  if (explicit) return explicit;
  return wrap.closest(".case-image-slot--contain") ? "contain" : "cover";
}

/** Buffer size ~slot aspect so CSS 100%×100% scales uniformly like the final <img>. */
function bufferSizeForWrap(wrap: HTMLElement, img: HTMLImageElement): { cW: number; cH: number } {
  const rect = wrap.getBoundingClientRect();
  const rw = rect.width;
  const rh = rect.height;
  if (rw >= 2 && rh >= 2) {
    const r = rw / rh;
    if (rw >= rh) {
      const cW = Math.min(Math.round(rw), PIXEL_REVEAL_MAX_SIZE);
      const cH = Math.max(1, Math.round(cW / r));
      return { cW, cH };
    }
    const cH = Math.min(Math.round(rh), PIXEL_REVEAL_MAX_SIZE);
    const cW = Math.max(1, Math.round(cH * r));
    return { cW, cH };
  }

  let cW = img.naturalWidth;
  let cH = img.naturalHeight;
  if (cW > PIXEL_REVEAL_MAX_SIZE) {
    cH = Math.round((cH * PIXEL_REVEAL_MAX_SIZE) / cW);
    cW = PIXEL_REVEAL_MAX_SIZE;
  }
  return { cW: Math.max(1, cW), cH: Math.max(1, cH) };
}

export type PixelRevealOptions = {
  /** Run when skipping animation or after the last frame (reveal the real image). */
  onComplete: () => void;
  /** If true before a frame, remove canvas and stop (e.g. new hover target). */
  isAborted?: () => boolean;
  /** Use global `.rendering-pixelated` on canvas; otherwise set `imageRendering` inline. */
  useUtilityPixelClass?: boolean;
  /** Align with the slot’s `object-fit` (default: from `.case-image-slot--contain` or `cover`). */
  objectFit?: "cover" | "contain";
};

/**
 * Draws stepped downscale/upscale frames on a canvas over `img`, then calls `onComplete`.
 */
export function runPixelReveal(
  img: HTMLImageElement,
  wrap: HTMLElement,
  options: PixelRevealOptions,
): void {
  const { onComplete, isAborted, useUtilityPixelClass = false, objectFit: objectFitOpt } = options;

  if (pixelRevealPrefersReducedMotion()) {
    onComplete();
    return;
  }

  wrap.querySelector("canvas")?.remove();

  const objectFit = resolveObjectFit(wrap, objectFitOpt);
  const { cW, cH } = bufferSizeForWrap(wrap, img);

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
    if (objectFit === "contain") {
      drawImageObjectContain(ctx, img, cols, rows);
    } else {
      drawImageObjectCover(ctx, img, cols, rows);
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, cols, rows, 0, 0, cW, cH);

    stepIndex++;
    setTimeout(drawFrame, PIXEL_REVEAL_FRAME_MS);
  }

  drawFrame();
}
