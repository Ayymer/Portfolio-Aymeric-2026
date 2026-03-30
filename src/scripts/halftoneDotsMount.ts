import {
  ShaderMount,
  halftoneDotsFragmentShader,
  getShaderColorFromString,
  ShaderFitOptions,
  HalftoneDotsTypes,
  HalftoneDotsGrids,
  isPaperShaderElement,
} from '@paper-design/shaders';

const SELECTOR = '[data-halftone-dots-host]';

function cssColorToHex(value: string): string {
  const s = value.trim();
  if (s.startsWith('#')) return s;
  const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return '#fbfefa';
  const toHex = (n: string) => parseInt(n, 10).toString(16).padStart(2, '0');
  return `#${toHex(m[1]!)}${toHex(m[2]!)}${toHex(m[3]!)}`;
}

function tokenColorsFromDocument(): { back: string; front: string } {
  const root = getComputedStyle(document.documentElement);
  return {
    back: cssColorToHex(root.getPropertyValue('--color-lime-1')),
    front: cssColorToHex(root.getPropertyValue('--color-lime-11')),
  };
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function disposeHost(host: HTMLElement): void {
  if (isPaperShaderElement(host) && host.paperShaderMount) {
    host.paperShaderMount.dispose();
    host.paperShaderMount = undefined;
  }
}

function mountHost(host: HTMLElement): void {
  const imageSrc = host.dataset.imageSrc;
  if (!imageSrc) return;

  disposeHost(host);

  if (prefersReducedMotion()) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = '';
    img.decoding = 'async';
    img.className = 'block w-full h-full object-cover';
    host.appendChild(img);
    return;
  }

  const originalColors = host.dataset.originalColors === 'true';

  const dotSize = parseFloat(host.dataset.halftoneSize ?? '0.65');
  const contrastVal = parseFloat(host.dataset.halftoneContrast ?? '0.01');
  const grainSizeVal = parseFloat(host.dataset.halftoneGrainSize ?? '0.5');
  const fitRaw = host.dataset.halftoneFit ?? 'cover';
  const u_fit =
    fitRaw === 'contain' ? ShaderFitOptions.contain : ShaderFitOptions.cover;

  const img = new Image();
  img.decoding = 'async';
  img.src = imageSrc;

  img.onload = () => {
    if (!host.isConnected) return;

    const { back, front } = tokenColorsFromDocument();
    const uniforms = {
      u_image: img,
      u_colorBack: getShaderColorFromString(back),
      u_colorFront: getShaderColorFromString(front),
      u_originalColors: originalColors,
      u_type: HalftoneDotsTypes.holes,
      u_grid: HalftoneDotsGrids.square,
      u_inverted: false,
      u_size: dotSize,
      u_radius: 0.91,
      u_contrast: contrastVal,
      u_grainMixer: 0,
      u_grainOverlay: 0,
      u_grainSize: grainSizeVal,
      u_fit,
      u_scale: 1,
      u_rotation: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_offsetX: 0,
      u_offsetY: 0,
      u_worldWidth: 0,
      u_worldHeight: 0,
    };

    const minPr = Number(host.dataset.minPixelRatio ?? '2');
    const maxPc = Number(host.dataset.maxPixelCount ?? String(1920 * 1080 * 4));

    new ShaderMount(host, halftoneDotsFragmentShader, uniforms, undefined, 0, 0, minPr, maxPc, [
      'u_image',
    ]);
  };

  img.onerror = () => {
    host.dataset.halftoneError = '1';
  };
}

export function initHalftoneDotsHosts(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(SELECTOR).forEach((host) => {
    mountHost(host);
  });
}

export function disposeAllHalftoneDotsHosts(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(SELECTOR).forEach((host) => {
    disposeHost(host);
  });
}
