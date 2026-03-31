/**
 * Homepage: square-cell trail + grid-native cyan ripples on a canvas behind copy.
 * Skips entirely when prefers-reduced-motion: reduce.
 */

/** @type {WeakMap<HTMLElement, () => void>} */
const destroyByRoot = new WeakMap();

/** CSS pixels */
const CELL = 18;
const BRUSH_RADIUS = 40;
const DECAY = 0.92;
const HEAT_CUTOFF = 0.025;
const SQUARE_INSET = 2;
/** Softer trail on cyan-1 */
const MAX_HEAT_ALPHA = 0.11;

const MAX_RIPPLES = 5;
/** Slower expansion, calmer read */
const RIPPLE_DURATION_MS = 1150;
const RIPPLE_MAX_RADIUS = 380;
const RIPPLE_SPEED_PX_PER_MS = RIPPLE_MAX_RADIUS / RIPPLE_DURATION_MS;
/** Wider band = softer, less “sharp” ring */
const BAND_WIDE_PX = 28;
const BAND_NARROW_PX = 14;
const RIPPLE_PEAK_ALPHA = 0.3;
const RIPPLE_SIZE_PULSE = 0.07;
const RIPPLE_BOOST_THRESHOLD = 0.002;

/** Distance damping: 1 / (1 + k * dist) */
const DIST_FALLOFF_K = 0.0045;

/** Spaced, quieter follow-through */
const ECHO_OFFSET_MS = [0, 130, 260];
const ECHO_GAIN = [1, 0.22, 0.1];

const RIPPLE_LIFETIME_MS =
  RIPPLE_DURATION_MS + ECHO_OFFSET_MS[ECHO_OFFSET_MS.length - 1];

/** Same hue (~192°): vivid cyan, trail = darker / ripple = lighter (minimal hue shift) */
const TRAIL_FILL = "rgb(0, 100, 116)";
const RIPPLE_FILL = "rgb(0, 176, 200)";

/**
 * @param {number} waveR
 */
function bandAtWaveR(waveR) {
  const t = Math.min(1, Math.max(0, waveR / RIPPLE_MAX_RADIUS));
  return BAND_WIDE_PX + t * (BAND_NARROW_PX - BAND_WIDE_PX);
}

/**
 * @param {number} dist
 */
function spatialFalloff(dist) {
  return 1 / (1 + DIST_FALLOFF_K * dist);
}

/**
 * Smoothstep(edge0, edge1, x) in [0,1]
 * @param {number} edge0
 * @param {number} edge1
 * @param {number} x
 */
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * @param {number} dist
 * @param {number} elapsed
 * @param {number} gain
 */
function echoRingBoost(dist, elapsed, gain) {
  if (elapsed < 0 || elapsed >= RIPPLE_DURATION_MS) return 0;
  const waveR = Math.min(elapsed * RIPPLE_SPEED_PX_PER_MS, RIPPLE_MAX_RADIUS);
  const band = bandAtWaveR(waveR);
  if (band < 0.5) return 0;
  const w = Math.abs(dist - waveR) / band;
  const ring = w >= 1 ? 0 : 1 - smoothstep(0, 1, w);
  const timeFade = 1 - elapsed / RIPPLE_DURATION_MS;
  const spatial = spatialFalloff(dist);
  return ring * timeFade * spatial * gain;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * @param {HTMLElement} root
 * @returns {(() => void) | null}
 */
export function initHomeGridTrail(root) {
  if (!root || reducedMotion()) return null;
  const prevDestroy = destroyByRoot.get(root);
  if (prevDestroy) prevDestroy();

  const canvas = root.querySelector("[data-home-grid-canvas]");
  if (!(canvas instanceof HTMLCanvasElement)) return null;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  /** @type {Map<string, number>} */
  const trail = new Map();
  /** @type {{ x: number; y: number; start: number }[]} */
  let ripples = [];

  let dpr = 1;
  let cssW = 0;
  let cssH = 0;

  /** @type {{ x: number; y: number } | null} */
  let pendingPointer = null;

  let raf = 0;
  /** True while a frame is scheduled or running (avoids duplicate RAF ids). */
  let loopScheduled = false;

  function hasVisualWork(now) {
    if (pendingPointer) return true;
    if (trail.size > 0) return true;
    for (const r of ripples) {
      if (now - r.start < RIPPLE_LIFETIME_MS) return true;
    }
    return false;
  }

  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    loopScheduled = false;
  }

  function scheduleLoop() {
    if (document.visibilityState === "hidden" || loopScheduled) return;
    loopScheduled = true;
    raf = requestAnimationFrame(frame);
  }

  function syncSize() {
    const rect = root.getBoundingClientRect();
    cssW = rect.width;
    cssH = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(cssW * dpr));
    canvas.height = Math.max(1, Math.round(cssH * dpr));
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    trail.clear();
    ripples = [];
  }

  function clientToLocal(clientX, clientY) {
    const r = root.getBoundingClientRect();
    return {
      x: clientX - r.left,
      y: clientY - r.top,
    };
  }

  function isInsideLocal(x, y) {
    return x >= 0 && y >= 0 && x < cssW && y < cssH;
  }

  function applyBrush(localX, localY) {
    const gx = Math.floor(localX / CELL);
    const gy = Math.floor(localY / CELL);
    const rCells = Math.ceil(BRUSH_RADIUS / CELL) + 1;
    for (let dy = -rCells; dy <= rCells; dy++) {
      for (let dx = -rCells; dx <= rCells; dx++) {
        const cgx = gx + dx;
        const cgy = gy + dy;
        const cx = (cgx + 0.5) * CELL;
        const cy = (cgy + 0.5) * CELL;
        const dist = Math.hypot(cx - localX, cy - localY);
        if (dist > BRUSH_RADIUS) continue;
        const falloff = 1 - dist / BRUSH_RADIUS;
        const key = `${cgx},${cgy}`;
        const prev = trail.get(key) ?? 0;
        trail.set(key, Math.max(prev, falloff));
      }
    }
  }

  function decayTrail() {
    for (const [key, v] of trail) {
      const nv = v * DECAY;
      if (nv < HEAT_CUTOFF) trail.delete(key);
      else trail.set(key, nv);
    }
  }

  /**
   * @param {number} cx
   * @param {number} cy
   * @param {{ x: number; y: number; start: number }} rip
   * @param {number} now
   */
  function rippleBoostFromSource(cx, cy, rip, now) {
    const dist = Math.hypot(cx - rip.x, cy - rip.y);
    let maxB = 0;
    for (let i = 0; i < ECHO_OFFSET_MS.length; i++) {
      const elapsed = now - rip.start - ECHO_OFFSET_MS[i];
      maxB = Math.max(maxB, echoRingBoost(dist, elapsed, ECHO_GAIN[i]));
    }
    return maxB;
  }

  /**
   * @param {number} gx
   * @param {number} gy
   * @param {number} now
   */
  function rippleBoostAtCell(gx, gy, now) {
    const cx = (gx + 0.5) * CELL;
    const cy = (gy + 0.5) * CELL;
    let maxB = 0;
    for (const rip of ripples) {
      maxB = Math.max(maxB, rippleBoostFromSource(cx, cy, rip, now));
    }
    return maxB;
  }

  /**
   * @param {number} now
   * @param {Set<string>} set
   */
  function addRippleCellKeys(now, set) {
    const margin = BAND_WIDE_PX + CELL;
    for (const rip of ripples) {
      const t = now - rip.start;
      if (t < 0 || t >= RIPPLE_LIFETIME_MS) continue;
      for (let i = 0; i < ECHO_OFFSET_MS.length; i++) {
        const elapsed = t - ECHO_OFFSET_MS[i];
        if (elapsed < 0 || elapsed >= RIPPLE_DURATION_MS) continue;
        const waveR = Math.min(elapsed * RIPPLE_SPEED_PX_PER_MS, RIPPLE_MAX_RADIUS);
        const maxR = waveR + margin;
        const minR = Math.max(0, waveR - margin);
        const gx0 = Math.floor((rip.x - maxR) / CELL);
        const gx1 = Math.ceil((rip.x + maxR) / CELL);
        const gy0 = Math.floor((rip.y - maxR) / CELL);
        const gy1 = Math.ceil((rip.y + maxR) / CELL);
        for (let gy = gy0; gy <= gy1; gy++) {
          for (let gx = gx0; gx <= gx1; gx++) {
            const cx = (gx + 0.5) * CELL;
            const cy = (gy + 0.5) * CELL;
            const dist = Math.hypot(cx - rip.x, cy - rip.y);
            if (dist > maxR + 1 || dist < minR - 1) continue;
            const b = echoRingBoost(dist, elapsed, ECHO_GAIN[i]);
            if (b > RIPPLE_BOOST_THRESHOLD) set.add(`${gx},${gy}`);
          }
        }
      }
    }
  }

  /**
   * @param {number} now
   */
  function drawGrid(now) {
    ripples = ripples.filter((r) => now - r.start < RIPPLE_LIFETIME_MS);

    const sqBase = CELL - SQUARE_INSET * 2;
    if (sqBase <= 0) return;

    /** @type {Set<string>} */
    const keysToDraw = new Set(trail.keys());
    addRippleCellKeys(now, keysToDraw);

    for (const key of keysToDraw) {
      const [gx, gy] = key.split(",").map(Number);
      const heat = trail.get(key) ?? 0;
      const boost = rippleBoostAtCell(gx, gy, now);
      const alpha = Math.min(
        1,
        Math.max(heat * MAX_HEAT_ALPHA, boost * RIPPLE_PEAK_ALPHA),
      );
      if (alpha < 0.001) continue;

      const sizeMul = 1 + boost * RIPPLE_SIZE_PULSE;
      const sq = sqBase * sizeMul;
      const cellLeft = gx * CELL;
      const cellTop = gy * CELL;
      const extra = sq - sqBase;
      const px = cellLeft + SQUARE_INSET - extra / 2;
      const py = cellTop + SQUARE_INSET - extra / 2;

      ctx.fillStyle = boost > 0.01 ? RIPPLE_FILL : TRAIL_FILL;
      ctx.globalAlpha = alpha;
      ctx.fillRect(px, py, sq, sq);
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    raf = 0;
    loopScheduled = false;

    decayTrail();

    if (pendingPointer) {
      const { x, y } = pendingPointer;
      pendingPointer = null;
      if (isInsideLocal(x, y)) applyBrush(x, y);
    }

    ctx.clearRect(0, 0, cssW, cssH);
    drawGrid(now);

    if (hasVisualWork(now)) scheduleLoop();
  }

  function onPointer(ev) {
    pendingPointer = clientToLocal(ev.clientX, ev.clientY);
    scheduleLoop();
  }

  function onClick(ev) {
    const { x, y } = clientToLocal(ev.clientX, ev.clientY);
    if (!isInsideLocal(x, y)) return;
    ripples.push({ x, y, start: performance.now() });
    if (ripples.length > MAX_RIPPLES) ripples.splice(0, ripples.length - MAX_RIPPLES);
    scheduleLoop();
  }

  function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
      stopLoop();
    } else if (hasVisualWork(performance.now())) {
      scheduleLoop();
    }
  }

  syncSize();
  const ro = new ResizeObserver(() => {
    syncSize();
  });
  ro.observe(root);

  /** Capture so events hit children (e.g. copy layer above the canvas) without listening on `window`. */
  root.addEventListener("pointermove", onPointer, { passive: true, capture: true });
  root.addEventListener("pointerdown", onPointer, { passive: true, capture: true });
  root.addEventListener("click", onClick);
  document.addEventListener("visibilitychange", onVisibilityChange);

  function destroy() {
    stopLoop();
    ro.disconnect();
    root.removeEventListener("pointermove", onPointer, { capture: true });
    root.removeEventListener("pointerdown", onPointer, { capture: true });
    root.removeEventListener("click", onClick);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    destroyByRoot.delete(root);
    trail.clear();
    ripples = [];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  destroyByRoot.set(root, destroy);
  return destroy;
}
