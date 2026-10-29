import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const TUNING = Object.freeze({ lerp: .12 });
const ELIGIBILITY = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
let current: { page: HTMLElement; dispose: () => void } | undefined;

let activeLenis: Lenis | undefined;
let holds = 0, resume = true;
export function pauseSmoothScroll() {
  if (holds++ === 0) { resume = !activeLenis?.isStopped; activeLenis?.stop(); }
  let released = false;
  return () => { if (released) return; released = true; if (--holds === 0 && resume) activeLenis?.start(); };
}
export function scrollToOpeningImmediately() {
  if (activeLenis) activeLenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function initializeSmoothScroll() {
  const page = document.querySelector<HTMLElement>('.page');
  if (!page || current?.page === page) return;
  current?.dispose();
  const media = gsap.matchMedia();
  media.add(ELIGIBILITY, () => {
    let lenis: Lenis | undefined, unsubscribe: (() => void) | undefined;
    const events = new AbortController();
    let disposed = false;
    const dispose = () => {
      if (disposed) return;
      disposed = true; events.abort(); gsap.ticker.remove(advance); unsubscribe?.();
      if (activeLenis === lenis) activeLenis = undefined;
      lenis?.destroy(); lenis = undefined;
      // Restore this project's GSAP defaults when native scrolling resumes.
      gsap.ticker.lagSmoothing(500, 33);
    };
    const advance = (time: number) => {
      try { lenis?.raf(time * 1000); }
      catch { dispose(); } // Fail open: destroy listeners/classes rather than trapping wheel input.
    };
    try {
      lenis = new Lenis({
        wrapper: window, lerp: TUNING.lerp, smoothWheel: true, syncTouch: false,
        anchors: true, respectReducedMotion: true, autoRaf: false,
      });
      activeLenis = lenis;
      if (holds) lenis.stop();
      unsubscribe = lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(advance);
      // Native navigation takes precedence over unfinished wheel inertia. Never cancel the key.
      window.addEventListener('keydown', event => {
        if (!['PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', ' '].includes(event.key) || event.defaultPrevented) return;
        if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]')) return;
        if (lenis?.isScrolling === 'smooth') lenis.scrollTo(scrollY, { immediate: true });
      }, { signal: events.signal });
      window.addEventListener('pointerdown', event => {
        if (event.clientX >= document.documentElement.clientWidth && lenis?.isScrolling === 'smooth') {
          lenis.scrollTo(scrollY, { immediate: true });
        }
      }, { passive: true, signal: events.signal });
    } catch { dispose(); }
    return dispose;
  });
  current = { page, dispose: () => { media.revert(); current = undefined; } };
}
const dispose = () => current?.dispose();
const restore = (event: PageTransitionEvent) => { if (event.persisted) initializeSmoothScroll(); };
initializeSmoothScroll();
document.addEventListener('astro:page-load', initializeSmoothScroll);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', restore);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose(); document.removeEventListener('astro:page-load', initializeSmoothScroll); document.removeEventListener('astro:before-swap', dispose);
  window.removeEventListener('pagehide', dispose); window.removeEventListener('pageshow', restore);
});
