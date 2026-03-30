interface Dot {
  x: number;
  y: number;
}

function cssColorToHex(value: string): string {
  const s = value.trim();
  if (!s) return '';
  if (s.startsWith('#')) return s;
  const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return '';
  const toHex = (n: string) => parseInt(n, 10).toString(16).padStart(2, '0');
  return `#${toHex(m[1]!)}${toHex(m[2]!)}${toHex(m[3]!)}`;
}

function resolveTwinkleColor(container: HTMLElement): string {
  const override = container.dataset.color?.trim();
  if (override) return override.startsWith('#') ? override : cssColorToHex(override) || override;
  const resolved = getComputedStyle(container).getPropertyValue('--twinkle-fill').trim();
  return cssColorToHex(resolved) || '#043b45';
}

declare global {
  interface HTMLElement {
    _twinkler?: Twinkler;
  }
}

class Twinkler {
  container: HTMLElement;
  gridCanvas: HTMLCanvasElement;
  elementCanvas: HTMLCanvasElement;
  gridCtx: CanvasRenderingContext2D;
  elementCtx: CanvasRenderingContext2D;
  color: string;
  density: number;
  dotRadius: number;
  dots: Dot[];
  flicker: { current: number; target: number };
  animationFrame: number | null;
  _running: boolean;
  _reducedMotion: boolean;

  constructor(container: HTMLElement) {
    const gridCanvas = container.querySelector<HTMLCanvasElement>('.twinkle-grid');
    const elementCanvas = container.querySelector<HTMLCanvasElement>('.twinkle-element');
    const gridCtx = gridCanvas?.getContext('2d');
    const elementCtx = elementCanvas?.getContext('2d');
    if (!gridCanvas || !elementCanvas || !gridCtx || !elementCtx) {
      throw new Error('TwinkleMask: missing canvas or 2d context');
    }

    this.container = container;
    this.gridCanvas = gridCanvas;
    this.elementCanvas = elementCanvas;
    this.gridCtx = gridCtx;
    this.elementCtx = elementCtx;

    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.color = resolveTwinkleColor(container);
    this.density = parseFloat(container.dataset.density || '') || 5;
    this.dotRadius = 1.8 * window.devicePixelRatio;

    this.dots = [];
    this.flicker = { current: 0.05, target: 0.05 };
    this.animationFrame = null;
    this._running = false;

    this.init();
    this.bindEvents();
  }

  calculateStep(width: number): number {
    return width > 960
      ? (0.98 * width) / 20 / this.density
      : (0.92 * width) / 4 / (2 * this.density);
  }

  resize(): void {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = rect.width * dpr;
    const height = rect.height * dpr;

    this.gridCanvas.width = width;
    this.gridCanvas.height = height;
    this.elementCanvas.width = width;
    this.elementCanvas.height = height;

    const step = this.calculateStep(width);
    const cols = Math.floor(width / step / 2);

    this.dots = [];
    for (let y = 0; y < height + 1; y++) {
      for (let x = -cols; x < cols + 1; x++) {
        const dotX = Math.floor(width / 2 + x * step);
        const dotY = Math.floor(height - y * step - this.dotRadius);
        this.dots.push({ x: dotX, y: dotY });
      }
    }

    this.drawStaticGrid();
    if (this._reducedMotion) {
      this.syncElementStatic();
    }
  }

  /** Full-opacity dot copy on mask layer (reduced-motion snapshot). */
  syncElementStatic(): void {
    this.elementCtx.clearRect(0, 0, this.elementCanvas.width, this.elementCanvas.height);
    this.elementCtx.fillStyle = this.color;
    this.dots.forEach((dot) => {
      this.elementCtx.beginPath();
      this.elementCtx.arc(dot.x, dot.y, this.dotRadius, 0, Math.PI * 2);
      this.elementCtx.fill();
    });
  }

  drawStaticGrid(): void {
    this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
    this.gridCtx.fillStyle = this.color;

    this.dots.forEach((dot) => {
      this.gridCtx.beginPath();
      this.gridCtx.arc(dot.x, dot.y, this.dotRadius, 0, Math.PI * 2);
      this.gridCtx.fill();
    });
  }

  drawFlickerFrame = (): void => {
    if (!this._running) return;

    if (this.flicker.current < this.flicker.target) {
      this.flicker.current = Math.min(this.flicker.target, this.flicker.current + 0.05);
    } else if (this.flicker.current > this.flicker.target) {
      this.flicker.current = Math.max(this.flicker.target, this.flicker.current - 0.05);
    }

    this.elementCtx.clearRect(0, 0, this.elementCanvas.width, this.elementCanvas.height);
    this.elementCtx.fillStyle = this.color;

    this.dots.forEach((dot) => {
      if (Math.random() >= this.flicker.current) {
        this.elementCtx.beginPath();
        this.elementCtx.arc(dot.x, dot.y, this.dotRadius, 0, Math.PI * 2);
        this.elementCtx.fill();
      }
    });

    setTimeout(() => {
      if (this._running) {
        this.animationFrame = requestAnimationFrame(this.drawFlickerFrame);
      }
    }, 150);
  };

  bindEvents(): void {
    const observer = new ResizeObserver(() => this.resize());
    observer.observe(this.container);

    if (this._reducedMotion) {
      return;
    }

    this.container.addEventListener('mouseenter', () => {
      this.flicker.target = 0.6;
    });

    this.container.addEventListener('mouseleave', () => {
      this.flicker.target = 0.05;
    });

    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting) {
        if (!this._running) {
          this._running = true;
          this.drawFlickerFrame();
        }
      } else {
        this._running = false;
        if (this.animationFrame != null) {
          cancelAnimationFrame(this.animationFrame);
        }
        this.animationFrame = null;
      }
    });
    io.observe(this.container);
  }

  init(): void {
    this.resize();
  }
}

export function initTwinkleMasks(): void {
  document.querySelectorAll<HTMLElement>('.twinkle-container').forEach((el) => {
    if (!el._twinkler) el._twinkler = new Twinkler(el);
  });
}
