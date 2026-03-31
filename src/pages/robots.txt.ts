import type { APIRoute } from 'astro';

const SITE_FALLBACK = 'https://aymericfremont.com';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(SITE_FALLBACK)).origin;
  const sitemapUrl = new URL('sitemap-index.xml', `${origin}/`).href;
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
