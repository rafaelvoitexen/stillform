// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './config/site.mjs';

export default defineConfig({ site, output: 'static', devToolbar: { enabled: false } });
