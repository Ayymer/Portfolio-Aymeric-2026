import { runLoadShuffle } from './textShuffle.js';
import { runPixelReveal } from './pixelReveal.ts';

const projectRows = document.querySelectorAll('.project-row');
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
}
