import { runLoadShuffle } from './textShuffle.js';
import { runPixelReveal } from './pixelReveal.ts';
import { initHomeGridTrail } from './homeGridTrail.js';

const projectRows = document.querySelectorAll('.project-row');

/** Grid trail behind the works preview panel (desktop only); paused while preview is open. */
let worksGridDestroy = null;

function stopWorksGridTrail() {
  if (worksGridDestroy) {
    worksGridDestroy();
    worksGridDestroy = null;
  }
}

function startWorksGridTrail() {
  if (window.innerWidth < 768) return;
  const root = document.querySelector('[data-works-grid-root]');
  if (!(root instanceof HTMLElement)) return;
  stopWorksGridTrail();
  const d = initHomeGridTrail(root);
  if (d) worksGridDestroy = d;
}
const rightLabel = document.getElementById('right-label');
const rightSpacer = document.getElementById('right-spacer');
const rightHeading = document.getElementById('right-heading');
const rightPreview = document.getElementById('right-preview');
const previewThumb = document.getElementById('preview-thumb');
const previewWrap = document.getElementById('preview-wrap');

let animId = 0;

function runPixelAnimation(img, wrap) {
  const id = ++animId;
  runPixelReveal(img, wrap, {
    onComplete: () => {
      if (id !== animId) return;
      img.style.opacity = '1';
    },
    isAborted: () => id !== animId,
  });
}

if (
  rightLabel &&
  rightSpacer &&
  rightHeading &&
  rightPreview &&
  previewThumb &&
  previewWrap
) {
  const labelRow = rightLabel;
  const spacerEl = rightSpacer;
  const headingEl = rightHeading;
  const previewEl = rightPreview;
  const thumbEl = previewThumb;
  const wrapEl = previewWrap;

  function isMobile() {
    return window.innerWidth < 768;
  }

  function showPreview(row) {
    stopWorksGridTrail();

    const thumb = row.dataset.thumb;

    if (thumb) {
      thumbEl.style.opacity = '0';
      thumbEl.src = thumb;
      thumbEl.classList.remove('hidden');
      if (thumbEl.complete && thumbEl.naturalWidth > 0) {
        runPixelAnimation(thumbEl, wrapEl);
      } else {
        thumbEl.addEventListener(
          'load',
          () => runPixelAnimation(thumbEl, wrapEl),
          { once: true },
        );
      }
    } else {
      thumbEl.classList.add('hidden');
    }

    const label = '/ ' + (row.dataset.title ?? '');
    headingEl.textContent = label;
    headingEl.setAttribute('aria-label', label);
    requestAnimationFrame(() => runLoadShuffle(headingEl));
    labelRow.classList.remove('hidden');
    labelRow.classList.add('flex');
    spacerEl.classList.add('hidden');
    previewEl.style.display = 'flex';
  }

  function hidePreview() {
    labelRow.classList.add('hidden');
    labelRow.classList.remove('flex');
    spacerEl.classList.remove('hidden');
    previewEl.style.display = 'none';
    startWorksGridTrail();
  }

  projectRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      row.classList.add('bg-cyan-3');
      row.querySelector('.icon-closed')?.classList.add('hidden');
      row.querySelector('.icon-open')?.classList.remove('hidden');
      showPreview(row);
    });

    row.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      row.classList.remove('bg-cyan-3');
      row.querySelector('.icon-closed')?.classList.remove('hidden');
      row.querySelector('.icon-open')?.classList.add('hidden');
      hidePreview();
    });
  });

  startWorksGridTrail();
}

document.addEventListener('astro:before-swap', () => {
  stopWorksGridTrail();
});
