import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setChapterOverride, type Chapter } from './site-header';

gsap.registerPlugin(ScrollTrigger);
let current: { page: HTMLElement; dispose: () => void } | undefined;

function initializeTransition() {
  const page = document.querySelector<HTMLElement>('.page');
  const hero = page?.querySelector<HTMLElement>('.hero');
  const manifesto = page?.querySelector<HTMLElement>('#manifesto');
  const photo = hero?.querySelector<HTMLElement>('.photo');
  const image = photo?.querySelector<HTMLImageElement>('img');
  if (!page || !hero || !manifesto || !photo || !image || current?.page === page) return;
  current?.dispose();
  const html = document.documentElement;
  const originalReadiness = manifesto.getAttribute('data-reveal-ready');
  const events = new AbortController();
  const media = gsap.matchMedia();
  let admitted = false, skipped = false;
  const readiness = (ready: boolean) => {
    const value = ready ? originalReadiness : 'false';
    if (manifesto.getAttribute('data-reveal-ready') === value) return;
    if (value === null) manifesto.removeAttribute('data-reveal-ready');
    else manifesto.setAttribute('data-reveal-ready', value);
  };

  media.add({ all: 'all', desktop: '(min-width: 1024px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
    let disposed = false, timeline: gsap.core.Timeline | undefined;
    let observer: MutationObserver | undefined;
    const layers: HTMLElement[] = [];
    const originalOpacity = image.style.opacity;
    let geometry = { start: 0, end: 1, half: 0, reading: .7 };
    let chosen: Chapter = 'hero', lastOverride: Chapter | null | undefined;
    const desktop = !!context.conditions?.desktop && getComputedStyle(hero.querySelector('h1')!).display !== 'contents';
    const measure = () => {
      const section = manifesto.getBoundingClientRect();
      const frame = photo.getBoundingClientRect();
      const reading = manifesto.querySelector('.reading')!.getBoundingClientRect();
      const end = section.top + scrollY;
      const half = frame.width / 2;
      // The actual aperture center at the approved crop, never a viewport-width fraction.
      const opening = frame.left + half;
      const clearLeft = Math.max(0, opening - reading.left) / (half + 1) * .88;
      const clearRight = Math.max(0, reading.right - opening) / (half + 1) * .78;
      geometry = { start: Math.max(0, end - innerHeight) + (innerWidth >= 600 ? 100 : 0), end, half,
        reading: desktop ? gsap.utils.clamp(.58, .84, Math.max(clearLeft, clearRight) + .04) : .58 };
    };
    const coordinate = (progress: number) => {
      const underway = progress > 0 && progress < 1;
      readiness(progress >= 1);
      // A small progress band prevents chapter labels chattering when direction reverses.
      if (progress >= .625) chosen = 'manifesto';
      else if (progress <= .575) chosen = 'hero';
      const nextOverride = underway ? chosen : null;
      if (lastOverride !== nextOverride) { lastOverride = nextOverride; setChapterOverride(nextOverride); }
      // Keep the semantic photograph available to assistive technology during the visual swap.
      image.style.opacity = progress === 0 ? originalOpacity : '0';
      layers.forEach(layer => { layer.style.visibility = progress > 0 && progress < 1 ? 'visible' : 'hidden'; });
      html.dataset.voidState = progress === 0 ? 'ready' : progress === 1 ? 'settled' : 'running';
    };
    const createMotion = () => {
      const state = html.dataset.heroState;
      if (skipped && (state === 'reserved' || state === 'running')) skipped = false;
      if (disposed || timeline || skipped) return;
      if (state === 'reserved' || state === 'running' || document.fonts.status !== 'loaded') return;
      if (!CSS.supports('clip-path', 'inset(0)') || parseFloat(getComputedStyle(html).fontSize) > 16.5) {
        html.dataset.voidState = 'static-reflow'; observer?.disconnect(); return;
      }
      if (!image.complete || !image.naturalWidth) { html.dataset.voidState = 'static-image'; return; }
      measure();
      // Never acquire a scene already passed while the entrance owned its targets.
      if (!admitted && scrollY > geometry.start + 2) {
        skipped = true; html.dataset.voidState = 'static-early-scroll'; return;
      }
      admitted = true; observer?.disconnect();
      const field = (clip: string) => {
        const layer = document.createElement('div');
        layer.setAttribute('aria-hidden', 'true'); layer.dataset.voidField = '';
        Object.assign(layer.style, { position: 'absolute', inset: '0', pointerEvents: 'none', clipPath: clip, visibility: 'hidden' });
        const copy = image.cloneNode(false) as HTMLImageElement;
        copy.alt = ''; copy.removeAttribute('id'); copy.removeAttribute('fetchpriority'); copy.draggable = false;
        copy.style.visibility = 'visible'; copy.style.opacity = '1';
        layer.append(copy); photo.append(layer); layers.push(layer);
        return layer;
      };
      const upper = [...manifesto.querySelectorAll<HTMLElement>('.line-one [data-manifesto-word], .line-two [data-manifesto-word]')];
      const copy = [...manifesto.querySelectorAll<HTMLElement>('.annotation, .reading')];
      const lower = [...manifesto.querySelectorAll<HTMLElement>('.line-three [data-manifesto-word]')];
      const stagger = desktop ? .07 : .055;
      const headlineFrom = { opacity: 0, filter: `blur(${desktop ? 8 : 5}px)` };
      const headlineTo = { opacity: 1, filter: 'blur(0px)', ease: 'power2.out' };
      timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      timeline.addLabel('opening', 0).addLabel('language', .28).addLabel('reading', geometry.reading).addLabel('settled', 1);
      if (desktop) {
        const left = field('inset(0 50% 0 0)'), right = field('inset(0 0 0 50%)');
        timeline.to(left, { x: () => -geometry.half - 1, duration: .88 }, 'opening')
          .to(right, { x: () => geometry.half + 1, duration: .78 }, 'opening');
      } else {
        timeline.to(field('inset(0)'), { yPercent: -100, duration: .76 }, 'opening');
      }
      // Initialize every word before staggered sub-tweens acquire their own start times.
      timeline.set([...upper, ...lower], { ...headlineFrom, immediateRender: true }, 0)
        .fromTo(upper, headlineFrom, { ...headlineTo, duration: .26, stagger }, 'language')
        .fromTo(copy, { opacity: 0, filter: `blur(${desktop ? 3 : 2}px)` },
          { opacity: 1, filter: 'blur(0px)', duration: .98 - geometry.reading, ease: 'power1.out' }, 'reading')
        .fromTo(lower, headlineFrom, { ...headlineTo, duration: .36 - stagger * (lower.length - 1), stagger }, .64);
      const readingTween = timeline.getTweensOf(copy)[0];
      ScrollTrigger.create({
        id: 'hero-manifesto', trigger: manifesto, animation: timeline, scrub: true,
        start: () => geometry.start, end: () => geometry.end, invalidateOnRefresh: true,
        onRefreshInit: () => {
          measure();
          timeline?.removeLabel('reading'); timeline?.addLabel('reading', geometry.reading);
          readingTween.startTime(geometry.reading).duration(.98 - geometry.reading);
        },
        onUpdate: self => coordinate(self.progress), onRefresh: self => coordinate(self.progress),
      });
      coordinate(timeline.scrollTrigger?.progress ?? 0);
    };
    if (context.conditions?.reduced) {
      html.dataset.voidState = 'static-reduced-motion';
    } else {
      observer = new MutationObserver(createMotion);
      observer.observe(html, { attributes: true, attributeFilter: ['data-hero-state'] });
      image.addEventListener('load', createMotion, { signal: events.signal });
      document.fonts.ready.then(createMotion);
      createMotion();
    }
    return () => {
      disposed = true; observer?.disconnect();
      image.removeEventListener('load', createMotion);
      timeline?.scrollTrigger?.kill(); timeline?.revert(); layers.forEach(layer => layer.remove());
      image.style.opacity = originalOpacity;
      readiness(true); setChapterOverride(null);
      delete html.dataset.voidState;
    };
  });
  // Refresh only for layout changes; no measurements run inside the scrub callback.
  const resized = new ResizeObserver(() => { if (admitted) ScrollTrigger.refresh(true); });
  resized.observe(hero); resized.observe(manifesto);
  current = { page, dispose: () => { events.abort(); resized.disconnect(); media.revert(); current = undefined; } };
}
const dispose = () => current?.dispose();
const restore = (event: PageTransitionEvent) => { if (event.persisted) initializeTransition(); };
initializeTransition();
document.addEventListener('astro:page-load', initializeTransition);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', restore);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose(); document.removeEventListener('astro:page-load', initializeTransition); document.removeEventListener('astro:before-swap', dispose);
  window.removeEventListener('pagehide', dispose); window.removeEventListener('pageshow', restore);
});
