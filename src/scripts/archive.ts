import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const FIGURE_TRAVEL = [100, -160, 80, -140, 110, -170, 90, -125, 150, -100];
const IMAGE_TRAVEL = [6, 8, 7, 6.5, 8, 6, 7.5, 6.5, 7, 8];
const HOVER = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
let current: { root: HTMLElement; dispose: () => void } | undefined;

function initializeArchive() {
  const root = document.querySelector<HTMLElement>('#archive');
  if (!root || current?.root === root) return;
  current?.dispose();
  const media = gsap.matchMedia();
  const records = [...root.querySelectorAll<HTMLElement>('[data-archive-record]')];
  let disposed = false;
  try {
    media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 599px)' }, context => {
      if (!context.conditions?.motion) return;
      const mobile = !!context.conditions?.mobile;
      root.dataset.parallaxReady = 'true';
      records.forEach((record, index) => {
        const figure = record.querySelector<HTMLElement>('.record-entry')!;
        const parallax = record.querySelector<HTMLElement>('.record-parallax')!;
        const drift = record.querySelector<HTMLElement>('.image-drift')!;
        const caption = record.querySelector<HTMLElement>('figcaption')!;
        const travel = () => FIGURE_TRAVEL[index] * (innerWidth < 600 ? .3 : innerWidth < 1024 ? .55 : 1);
        const imageTravel = () => IMAGE_TRAVEL[index] * (innerWidth < 600 ? .5 : innerWidth < 1024 ? .75 : 1);
        // Layout, figure/caption, image drift and image zoom have separate transform owners.
        gsap.fromTo(parallax, { y: () => travel() / 2 }, {
          y: () => -travel() / 2, ease: 'none',
          scrollTrigger: { id: `archive-figure-${index}`, trigger: record, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        });
        gsap.fromTo(drift, { yPercent: () => -imageTravel() }, {
          yPercent: imageTravel, ease: 'none',
          scrollTrigger: { id: `archive-image-${index}`, trigger: record, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        });
        // A delayed module must never hide content already reached by the visitor.
        if (record.getBoundingClientRect().top >= innerHeight * .94) {
          const entry = gsap.timeline({ scrollTrigger: { id: `archive-entry-${index}`, trigger: record, start: 'top 94%', once: true } })
            .fromTo(figure, { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: .85, ease: 'power2.out', clearProps: 'opacity,transform' });
          if (!mobile) entry.fromTo(caption, { filter: 'blur(3px)' }, { filter: 'blur(0px)', duration: .7, clearProps: 'filter' }, 0);
        }
      });
      return () => { delete root.dataset.parallaxReady; };
    }, root);
    media.add({ observations: '(prefers-reduced-motion: no-preference) and (max-width: 1023px), (prefers-reduced-motion: no-preference) and (hover: none), (prefers-reduced-motion: no-preference) and (pointer: coarse)', mobile: '(max-width: 599px)' }, context => {
      if (!context.conditions?.observations) return;
      const blur = !context.conditions?.mobile;
      for (const record of records) {
        const note = record.querySelector<HTMLElement>('.record-observation')!;
        const words = note.querySelectorAll<HTMLElement>('.observation-ink [data-observation-word]');
        // Narrow mobile uses opacity only after physical Safari isolation.
        // Tablet retains blur, with no filter left at either resting endpoint.
        const clearFilters = () => words.forEach(word => word.style.removeProperty('filter'));
        gsap.timeline({ onComplete: clearFilters, onReverseComplete: clearFilters, scrollTrigger: {
          trigger: note, start: 'top 88%', end: 'bottom 15%',
          toggleActions: 'play reverse play reverse',
        } }).fromTo(words, { opacity: 0, ...(blur && { filter: 'blur(4px)' }) }, {
          opacity: 1, ...(blur && { filter: 'blur(0px)' }), duration: .5, stagger: .05, ease: 'power2.out',
        });
      }
    }, root);
    media.add(HOVER, () => {
      const hoverEvents = new AbortController();
      const timelines: gsap.core.Timeline[] = [];
      root.dataset.hoverReady = 'true';
      for (const record of records) {
        const frame = record.querySelector<HTMLElement>('[data-archive-photo]')!;
        const image = frame.querySelector<HTMLImageElement>('img')!;
        const ink = [...record.querySelectorAll<HTMLElement>('.observation-ink [data-observation-word]')];
        const white = [...record.querySelectorAll<HTMLElement>('.observation-white [data-observation-word]')];
        const timeline = gsap.timeline({ paused: true });
        timeline.to(image, { scale: 1.045, duration: 1.4, ease: 'power2.out' }, 0);
        ink.forEach((word, index) => {
          timeline.fromTo([word, white[index]], { opacity: 0, filter: 'blur(4px)' }, {
            opacity: 1, filter: 'blur(0px)', duration: .5, ease: 'power2.out',
          }, index * .05);
        });
        const dismiss = () => timeline.timeScale(2).reverse();
        frame.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') timeline.timeScale(1).play(); }, { signal: hoverEvents.signal });
        frame.addEventListener('pointerleave', dismiss, { signal: hoverEvents.signal });
        frame.addEventListener('pointercancel', dismiss, { signal: hoverEvents.signal });
        ScrollTrigger.create({ trigger: record, start: 'top bottom', end: 'bottom top', onLeave: dismiss, onLeaveBack: dismiss });
        timelines.push(timeline);
      }
      const dismissAll = () => timelines.forEach(timeline => timeline.timeScale(2).reverse());
      window.addEventListener('blur', dismissAll, { signal: hoverEvents.signal });
      document.addEventListener('visibilitychange', dismissAll, { signal: hoverEvents.signal });
      return () => { hoverEvents.abort(); delete root.dataset.hoverReady; };
    }, root);
  } catch { media.revert(); delete root.dataset.hoverReady; }
  // Reserved image dimensions avoid image-load refreshes. Fonts can change reading heights.
  document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
  current = { root, dispose: () => { disposed = true; media.revert(); delete root.dataset.hoverReady; current = undefined; } };
}
const dispose = () => current?.dispose();
const restore = (event: PageTransitionEvent) => { if (event.persisted) initializeArchive(); };
initializeArchive();
document.addEventListener('astro:page-load', initializeArchive);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', restore);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose(); document.removeEventListener('astro:page-load', initializeArchive); document.removeEventListener('astro:before-swap', dispose);
  window.removeEventListener('pagehide', dispose); window.removeEventListener('pageshow', restore);
});
