/**
 * Splits text safely, respecting emojis and multi-byte characters.
 * Equivalent to Locomotive's `pue` regex.
 */
const splitText = (text) =>
    [...new Intl.Segmenter().segment(text)].map((x) => x.segment);

/**
 * Full Shuffle: Completely randomizes the array of characters.
 * Used for Hover effects (4 steps).
 */
const fullShuffle = (chars) => {
    const arr = [...chars];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
};

/**
 * The core scrambler function.
 * Preserves spaces and word lengths by splitting words first.
 */
const scrambleElement = (el, algorithm, iterations, duration) => {
    // Only target elements that contain text and no nested HTML (or explicitly allowed)
    if (el.children.length > 0 && !el.hasAttribute("data-allow-shuffle")) return;
    if (!el.innerText.trim()) return;

    // Store original text for accessibility and reset
    if (!el.hasAttribute("aria-label")) {
        el.setAttribute("aria-label", el.innerText);
    }
    const originalText = el.getAttribute("aria-label");

    // Clear any existing animation
    if (el._scrambleTimer) clearInterval(el._scrambleTimer);

    let step = 0;
    const interval = duration / iterations;

    el._scrambleTimer = setInterval(() => {
        step++;

        // Final step: restore exact original text
        if (step >= iterations) {
            clearInterval(el._scrambleTimer);
            el.innerText = originalText;
            return;
        }

        // Split by spaces to preserve word structure, then scramble each word
        const words = originalText.split(" ");
        const scrambledWords = words.map((word) => {
            const chars = splitText(word);
            return algorithm(chars);
        });

        el.innerText = scrambledWords.join(" ");
    }, interval);
};

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Binds hover shuffle on `[data-hover-shuffle]` and `[data-hover-shuffle="children"]`.
 */
export const initTextShuffle = () => {
    if (prefersReducedMotion()) return;

    // Locomotive-style: 4 iterations over 250ms
    const hoverElements = document.querySelectorAll("[data-hover-shuffle]");

    hoverElements.forEach((el) => {
        // Prevent duplicate listeners
        if (el._hasShuffleListener) return;
        el._hasShuffleListener = true;

        // Handle children if specified (e.g. splitting "Theory" and "Verse")
        const targets =
            el.dataset.hoverShuffle === "children"
                ? Array.from(el.querySelectorAll("[data-hover-shuffle-child]"))
                : [el];

        el.addEventListener("mouseenter", () => {
            targets.forEach((target) =>
                scrambleElement(target, fullShuffle, 4, 250),
            );
        });

        el.addEventListener("mouseleave", () => {
            targets.forEach((target) => {
                if (target._scrambleTimer) {
                    clearInterval(target._scrambleTimer);
                    target.innerText =
                        target.getAttribute("aria-label") || target.innerText;
                }
            });
        });
    });
};

/** One-shot scramble on mount (same steps/timing as hover shuffle). */
export function runLoadShuffle(el) {
    if (prefersReducedMotion()) return;
    if (!(el instanceof HTMLElement)) return;
    scrambleElement(el, fullShuffle, 4, 250);
}

/** Run load shuffle on every `[data-load-shuffle]` (static markup). */
export function initLoadShuffle() {
    if (prefersReducedMotion()) return;
    requestAnimationFrame(() => {
        for (const el of document.querySelectorAll("[data-load-shuffle]")) {
            if (!(el instanceof HTMLElement)) continue;
            if (!el.innerText.trim()) continue;
            scrambleElement(el, fullShuffle, 4, 250);
        }
    });
}
