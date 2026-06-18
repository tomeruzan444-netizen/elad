import type { APIRoute } from 'astro';

// Dynamic robots.txt:
//  - staging build (PUBLIC_NOINDEX=true)  -> block everything (temp domain stays out of Google)
//  - production build                     -> allow all + point to the sitemap
const NOINDEX = import.meta.env.PUBLIC_NOINDEX === 'true';

const staging = `User-agent: *
Disallow: /
`;

const production = `User-agent: *
Allow: /

Sitemap: https://elad-digital.co.il/sitemap-index.xml
`;

export const GET: APIRoute = () =>
  new Response(NOINDEX ? staging : production, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
