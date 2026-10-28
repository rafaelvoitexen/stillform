import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prepareHeroReplay, settleHero } from './hero';
import { acquireCinematicScrollLock, resetCinematicScroll, supportsCinematicScrollLock } from './cinematic-scroll-lock';
import { setChapterOverride, setEditorialSuppressed } from './site-header';

type Phase = 'IDLE' | 'CONCEALING' | 'RESETTING' | 'REPLAYING' | 'FINISHING';
let current: { overlay: HTMLElement; dispose: () => void } | undefined;

function initializeReturn() {
  const overlay = document.querySelector<HTMLElement>('[data-return-overlay]');
  const link = document.querySelector<HTMLAnchorElement>('[data-outro-return]');
  if (!overlay || !link || current?.overlay === overlay) return;
  current?.dispose();
  const events = new AbortController();
  let phase: Phase = 'IDLE', run = 0, deadline = 0;
  let releaseScroll: (() => void) | undefined;
  let animation: gsap.core.Timeline | undefined;
  let playback: Awaited<ReturnType<typeof prepareHeroReplay>> = null;
  const state = (value: Phase) => { phase = value; if (value === 'IDLE') delete document.documentElement.dataset.returnState; else document.documentElement.dataset.returnState = value.toLowerCase(); };
  const resetScroll = () => {
    resetCinematicScroll(); ScrollTrigger.update(); setChapterOverride(null);
    if (location.hash !== '#top') history.replaceState(history.state, '', `${location.pathname}${location.search}#top`);
  };
  const focusOpening = () => document.querySelector<HTMLAnchorElement>('.site-header .wordmark')?.focus({ preventScroll: true });
  const finish = (fallback = false, reset = true) => {
    run++; clearTimeout(deadline); animation?.kill(); animation = undefined;
    if (fallback) { playback?.cancel(); settleHero(); if (reset) resetScroll(); }
    playback = null;
    overlay.removeAttribute('style'); setEditorialSuppressed(false);
    releaseScroll?.(); releaseScroll = undefined;
    state('IDLE');
    // Focus-visible forces the wordmark opaque; restore focus only after its authored entrance.
    if (reset) focusOpening();
  };
  const transition = async () => {
    const token = ++run;
    state('CONCEALING');
    releaseScroll = acquireCinematicScrollLock(() => finish(true)) ?? undefined;
    if (!releaseScroll) { finish(true); return; }
    // Independent fail-open safeguard covers asset delays, interruption and setup failures.
    deadline = window.setTimeout(() => { if (token === run) finish(true); }, 8500);
    try {
      gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto', opacity: .01, backdropFilter: 'blur(0px)' });
      animation = gsap.timeline().to(overlay, { backdropFilter: `blur(${innerWidth < 600 ? 3 : 6}px)`, duration: .28, ease: 'power2.out' }, 0)
        .to(overlay, { opacity: 1, duration: .65, ease: 'power2.inOut' }, .02);
      await animation;
      if (token !== run) return;
      state('RESETTING'); setEditorialSuppressed(true); resetScroll();
      const prepared = await prepareHeroReplay();
      if (token !== run) { prepared?.cancel(); return; }
      playback = prepared;
      state('REPLAYING'); playback?.play();
      animation = gsap.timeline().to(overlay, { opacity: 0, backdropFilter: 'blur(0px)', duration: .45, ease: 'power2.out' });
      await animation;
      if (token !== run) return;
      overlay.style.pointerEvents = 'none';
      state('FINISHING');
      if (playback) await playback.finished;
      if (token === run) finish();
    } catch { if (token === run) finish(true); }
  };
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) {
      // Keep browser defaults while shielding modified clicks from Lenis' anchor listener.
      event.stopPropagation(); return;
    }
    event.preventDefault(); event.stopPropagation(); // Prevent Lenis' window anchor handler from starting a competing scroll.
    if (phase !== 'IDLE') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !supportsCinematicScrollLock()) {
      settleHero(); resetScroll(); focusOpening(); return;
    }
    void transition();
  }, { signal: events.signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden && phase !== 'IDLE') finish(true); }, { signal: events.signal });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  reduced.addEventListener('change', () => { if (reduced.matches && phase !== 'IDLE') finish(true); }, { signal: events.signal });
  current = { overlay, dispose: () => { events.abort(); if (phase !== 'IDLE') finish(true, false); current = undefined; } };
}
const dispose = () => current?.dispose();
const restore = (event: PageTransitionEvent) => { if (event.persisted) initializeReturn(); };
initializeReturn();
document.addEventListener('astro:page-load', initializeReturn);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', restore);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose(); document.removeEventListener('astro:page-load', initializeReturn); document.removeEventListener('astro:before-swap', dispose);
  window.removeEventListener('pagehide', dispose); window.removeEventListener('pageshow', restore);
});
