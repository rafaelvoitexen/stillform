import fs from 'node:fs/promises';
import { send, evaluate, delay, shot, read, target, ws, out } from './cdp.mjs';

await send('Performance.enable');
const errors = [], results = [];
let rules = [];
ws.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  if (message.method === 'Fetch.requestPaused') {
    const rule = rules.find(rule => message.params.request.url.includes(rule.contains));
    if (rule?.fail) void send('Fetch.failRequest', { requestId: message.params.requestId, errorReason: 'Failed' }).catch(() => {});
    else setTimeout(() => { void send('Fetch.continueRequest', { requestId: message.params.requestId }).catch(() => {}); }, rule?.delay || 0);
  }
});
await send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
await send('Page.addScriptToEvaluateOnNewDocument', { source: `
  window.__motionQA = { shifts: [], longTasks: [] };
  new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__motionQA.shifts.push({ value: entry.value, time: entry.startTime }); }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__motionQA.longTasks.push({ duration: entry.duration, time: entry.startTime }); }).observe({ type: 'longtask', buffered: true });
` });
const inspect = () => evaluate(`({
  state: document.querySelector('.hero')?.dataset.entrance,
  reason: document.querySelector('.hero')?.dataset.entranceReason,
  startCount: performance.getEntriesByName('stillform:hero:start').length,
  shutters: document.querySelectorAll('.hero-shutters').length,
  lineStyles: [...document.querySelectorAll('.line-motion')].map(e => ({ opacity: getComputedStyle(e).opacity, transform: getComputedStyle(e).transform, willChange: getComputedStyle(e).willChange })),
  imageTransform: getComputedStyle(document.querySelector('img')).transform,
  detailsOpacity: getComputedStyle(document.querySelector('.details')).opacity,
  qa: window.__motionQA
})`);
const viewport = (width = 1440, height = 900) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
const navigate = async () => { await send('Page.navigate', { url: 'http://127.0.0.1:4324/' }); await delay(120); };
const run = async () => {
  rules = [{ contains: '.css', delay: 80 }];
  await navigate();
  for (let index = 0; index < 100; index++) { const state = await inspect(); if (state.state === 'running') return state; await delay(10); }
  throw Error('Eligible entrance not running');
};
const record = async name => {
  const state = await inspect(), geometry = await read();
  results.push({ case: name, ...state, geometry });
  await fs.writeFile(new URL('validation.json', out), JSON.stringify({ results, errors }, null, 2));
  console.log(`${name}: ${state.state}, starts=${state.startCount}, overflow=${geometry.overflow.length}`);
};

await viewport(); rules = []; await navigate(); await delay(1800); await record('normal-load');
await viewport(390, 844); await run(); await delay(180); await evaluate('scrollTo(0,35)'); await delay(40); await record('scroll-interruption');
await evaluate('scrollTo(0,0)'); await delay(150); await record('scroll-return-no-replay');
await viewport(); await run(); await viewport(768, 1024); await delay(150); await record('resize-interruption');
await viewport(); await run(); await evaluate('document.documentElement.style.fontSize="200%"'); await delay(150); await record('text-resize-interruption');
await viewport(390, 844); await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await navigate(); await delay(400); await record('reduced-motion-load'); await shot('reduced-motion', true);
await send('Emulation.setEmulatedMedia', { features: [] });
await run(); await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await delay(70); await record('reduced-motion-during-playback'); await send('Emulation.setEmulatedMedia', { features: [] });
await run(); await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await delay(30); await record('keyboard-interruption');
await send('Emulation.setScriptExecutionDisabled', { value: true }); rules = []; await navigate(); await delay(500); await shot('no-js', true); await record('no-js');
await send('Emulation.setScriptExecutionDisabled', { value: false });
rules = [{ contains: '.css', delay: 80 }, { contains: 'tulach-e-vos.jpg', delay: 500 }, { contains: '.woff2', delay: 500 }];
await send('Network.setCacheDisabled', { cacheDisabled: true }); await navigate(); await delay(220); await record('slow-assets-readable-before-ready');
await delay(1200); await record('slow-assets-settled'); await shot('slow-assets', true);
rules = [{ contains: '.css', delay: 80 }, { contains: 'Hero.astro', delay: 500 }]; await navigate(); await delay(300); await record('delayed-runtime-watchdog');
await delay(700); await record('late-runtime-no-rehide');
rules = [{ contains: '.css', delay: 80 }, { contains: 'Hero.astro', fail: true }]; await navigate(); await delay(400); await record('runtime-failure');
rules = [{ contains: 'tulach-e-vos.jpg', fail: true }]; await navigate(); await delay(600); await record('image-failure'); await shot('image-failure', true);
rules = [{ contains: '.woff2', fail: true }]; await navigate(); await delay(600); await record('font-failure'); await shot('font-failure', true);
rules = [{ contains: '.woff2', delay: 500 }, { contains: 'tulach-e-vos.jpg', delay: 500 }]; await navigate(); await send('Page.reload', { ignoreCache: false });
await delay(1200); await record('reload-during-readiness');
await send('Network.setCacheDisabled', { cacheDisabled: false }); await viewport(); await run(); await delay(1600); await record('eligible-completion'); await shot('eligible-completion');
const history = await send('Page.getNavigationHistory'), entryId = history.entries[history.currentIndex].id;
await send('Page.navigate', { url: 'about:blank' }); await delay(100); await send('Page.navigateToHistoryEntry', { entryId }); await delay(500); await record('history-return');
const ax = await send('Accessibility.getFullAXTree');
results.push({ case: 'semantics', headings: ax.nodes.filter(n => n.role?.value === 'heading').map(n => ({ name: n.name?.value, level: n.properties?.find(p => p.name === 'level')?.value?.value })), links: ax.nodes.filter(n => n.role?.value === 'link').map(n => n.name?.value) });
await fs.writeFile(new URL('validation.json', out), JSON.stringify({ results, errors }, null, 2));
await fetch('http://127.0.0.1:9223/json/close/' + target.id); ws.close();
