import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { test } from 'node:test';

const source = await fs.readFile(new URL('../../../src/scripts/hero-admission.js', import.meta.url), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

// State-machine tests, not native browser/F5 or visual validation.
function documentEntry({ navigation = 'reload', scroll = 90, reduce = false, imageFails = false, fontFails = false } = {}) {
  const window = new EventTarget(), document = new EventTarget(), media = new EventTarget();
  const timers = new Map(), marks = [];
  let clock = 10, nextTimer = 0;
  const html = { dataset: {} };
  document.documentElement = html;
  document.visibilityState = 'visible';
  document.querySelectorAll = () => [];
  document.fonts = { load: async () => fontFails ? [] : [{ family: 'Onest', status: 'loaded' }] };
  media.matches = reduce;
  const history = { scrollRestoration: 'auto' };
  Object.assign(window, { visualViewport: null, scrollTo: () => { scroll = 0; } });
  const context = {
    window, document, history, location: { hash: '' }, AbortController,
    matchMedia: () => media,
    performance: {
      now: () => clock,
      getEntriesByType: type => type === 'navigation' ? [{ type: navigation }] : [],
      mark: (name, options) => marks.push({ name, detail: options?.detail }),
    },
    getComputedStyle: () => ({ fontSize: '16px', getPropertyValue: () => '0' }),
    setTimeout: (callback, delay) => { timers.set(++nextTimer, { callback, delay }); return nextTimer; },
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame: callback => callback(),
    Image: class { decode() { return imageFails ? Promise.reject(Error('image failed')) : Promise.resolve(); } },
  };
  Object.defineProperty(context, 'scrollY', { get: () => scroll });
  vm.runInNewContext(source, context);
  return { window, document, media, html, history, timers, marks,
    lease: () => window.__stillformHero,
    scroll: () => scroll,
    scrollTo: value => { scroll = value; },
    clock: value => { clock = value; },
  };
}

test('ten independent reload entries reset scroll and admit a fresh timeline', async () => {
  for (let index = 0; index < 10; index++) {
    const entry = documentEntry();
    await flush();
    assert.equal(entry.history.scrollRestoration, 'manual');
    assert.equal(entry.scroll(), 0);
    entry.window.dispatchEvent(new Event('pageshow'));
    assert.equal(entry.history.scrollRestoration, 'manual', 'defer automatic restoration until entry settles');
    assert.equal(entry.lease().claim(), true);
    assert.equal(entry.lease().claim(), false, 'no duplicate concurrent claim');
    assert.equal(entry.lease().diagnostics.navigation, 'reload');
    entry.lease().finish('complete');
    assert.equal(entry.history.scrollRestoration, 'auto');
    assert.equal(entry.html.dataset.heroReason, 'complete');
  }
});

test('ordinary interaction does not finish or replay the active entry', async () => {
  const entry = documentEntry();
  await flush();
  entry.lease().claim();
  for (const type of ['focusin', 'pointerdown', 'keydown']) entry.document.dispatchEvent(new Event(type));
  entry.scrollTo(45);
  for (const type of ['scroll', 'resize', 'orientationchange', 'hashchange']) entry.window.dispatchEvent(new Event(type));
  entry.scrollTo(0);
  entry.window.dispatchEvent(new Event('scroll'));
  assert.equal(entry.html.dataset.heroState, 'running');
  assert.equal(entry.lease().entry, 1);
  assert.equal(entry.marks.filter(mark => mark.name === 'stillform:hero:start').length, 1);
});

test('fresh top navigation is admitted; ordinary away navigation preserves position', async () => {
  const top = documentEntry({ navigation: 'navigate', scroll: 0 });
  await flush();
  assert.equal(top.lease().claim(), true);
  const away = documentEntry({ navigation: 'navigate', scroll: 90 });
  assert.equal(away.scroll(), 90);
  assert.equal(away.html.dataset.heroReason, 'away-from-top');
  assert.equal(away.history.scrollRestoration, 'auto');
});

test('history scroll restoration is not replaced by reload policy', async () => {
  const entry = documentEntry({ navigation: 'back_forward', scroll: 0 });
  assert.equal(entry.history.scrollRestoration, 'auto');
  entry.scrollTo(45);
  entry.window.dispatchEvent(new Event('pageshow'));
  await flush();
  assert.equal(entry.scroll(), 45);
  assert.equal(entry.html.dataset.heroReason, 'history-away-from-top');
});

test('BFCache top return receives a new entry; away return stays static', async () => {
  for (const position of [0, 45]) {
    const entry = documentEntry({ navigation: 'navigate', scroll: 0 });
    await flush();
    entry.lease().claim();
    entry.scrollTo(position);
    entry.window.dispatchEvent(new Event('pagehide'));
    const show = new Event('pageshow');
    Object.defineProperty(show, 'persisted', { value: true });
    entry.window.dispatchEvent(show);
    await flush();
    assert.equal(entry.lease().entry, 2);
    if (position) assert.equal(entry.html.dataset.heroReason, 'history-away-from-top');
    else assert.equal(entry.lease().claim(), true);
  }
});

test('reduced motion, failed assets and real deadlines remain fail-open', async () => {
  for (const [options, reason] of [
    [{ reduce: true }, 'reduced-motion'],
    [{ imageFails: true }, 'image-decode-failure'],
    [{ fontFails: true }, 'font-failure'],
  ]) {
    const entry = documentEntry(options);
    await flush();
    assert.equal(entry.html.dataset.heroState, 'static-final');
    assert.equal(entry.html.dataset.heroReason, reason);
  }
  const expired = documentEntry();
  expired.clock(500);
  assert.equal(expired.lease().claim(), false);
  assert.equal(expired.html.dataset.heroReason, 'reservation-expired');
  const running = documentEntry();
  running.lease().claim();
  [...running.timers.values()].find(timer => timer.delay === 6200).callback();
  assert.equal(running.html.dataset.heroReason, 'running-deadline');
});
