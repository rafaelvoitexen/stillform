import type { APIRoute } from 'astro';
import { site } from '../../config/site.mjs';

export const getStaticPaths = () => site ? [{ params: { sitemap: 'sitemap' } }] : [];
export const GET: APIRoute = ({ site }) => new Response(
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site!.href}</loc></url></urlset>`,
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
