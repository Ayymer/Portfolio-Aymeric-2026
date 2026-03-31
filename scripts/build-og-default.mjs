import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const fontPath = join(root, "public/fonts/Tangerine-Regular.woff2");
const fontB64 = readFileSync(fontPath).toString("base64");

/** Matches Loader.astro: lime-1 bg, lime-12 text, Tangerine, uppercase, letter-spacing */
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style type="text/css"><![CDATA[
      @font-face {
        font-family: 'Tangerine';
        src: url('data:font/woff2;base64,${fontB64}') format('woff2');
        font-weight: 400;
        font-style: normal;
      }
      .name {
        font-family: 'Tangerine', cursive;
        font-size: 132px;
        fill: #273f1c;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
    ]]></style>
  </defs>
  <rect width="1200" height="630" fill="#fbfefa"/>
  <text x="600" y="335" class="name" text-anchor="middle" dominant-baseline="middle">Aymeric Fremont</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
});
const pngData = resvg.render();
writeFileSync(join(root, "public/og-default.png"), pngData.asPng());
