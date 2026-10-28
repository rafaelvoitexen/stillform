import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setOutroEditorialReady } from './site-header';

gsap.registerPlugin(ScrollTrigger);
let current: { root: HTMLElement; dispose: () => void } | undefined;

function initializeOutro() {
  const root = document.querySelector<HTMLElement>('#outro');
  if (!root || current?.root === root) return;
  current?.dispose();
  const stage = root.querySelector<HTMLElement>('[data-outro-stage]')!;
  const lines = [...stage.querySelectorAll<HTMLElement>('[data-outro-line]')];
  const media = gsap.matchMedia();
  let firstSetup = true, disposed = false;
  // GSAP runs the callback only if at least one query matches. Small, short screens
  // must initialize too; viewport conditions choose geometry, never motion admission.
  const setup = () => {
    if (disposed) return;
    media.add({ all: 'all', reduced: '(prefers-reduced-motion: reduce)', wide: '(min-width: 600px)', room: '(min-height: 700px)' }, context => {
      const rect = stage.getBoundingClientRect();
      // Deep links/history or delayed initialization must not hide an already visible ending.
      const preserveVisible = firstSetup && (location.hash === '#outro' || (scrollY > 0 && rect.top < innerHeight && rect.bottom > 0));
      firstSetup = false;
      if (context.conditions?.reduced || preserveVisible) {
        setOutroEditorialReady(true);
        return;
      }
      const pinTop = () => Math.max(96, (document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 64) + 32);
      const pin = rect.height + pinTop() < innerHeight - 96;
      const distance = () => pin ? gsap.utils.clamp(540, 960, innerHeight * .8) : Math.min(560, innerHeight * .65);
      const displacement = () => pin ? gsap.utils.clamp(innerWidth < 600 ? 40 : 120, 360, innerWidth * .16) : gsap.utils.clamp(40, 100, innerWidth * .1);
      const readingClearance = () => {
        if (!pin) return;
        const spacer = stage.parentElement?.classList.contains('pin-spacer') ? stage.parentElement : null;
        const spacing = spacer ? parseFloat(getComputedStyle(spacer).paddingBottom) || 0 : 0;
        const content = root.querySelector('.notes')!.getBoundingClientRect().bottom - root.getBoundingClientRect().top - spacing;
        const paddingTop = parseFloat(getComputedStyle(root).paddingTop);
        // Only fill unused final-viewport clearance, never reserve the animation distance twice.
        const tail = Math.max(0, innerHeight + paddingTop - pinTop() + 2 - content);
        const value = `${Math.ceil(tail)}px`;
        if (root.style.getPropertyValue('--outro-tail-clearance') !== value) root.style.setProperty('--outro-tail-clearance', value);
      };
      readingClearance();
      const coordinate = (progress: number) => {
        setOutroEditorialReady(progress >= .9);
        root.dataset.outroState = progress >= .8 ? 'settled' : 'converging';
      };
      setOutroEditorialReady(false);
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'outro-convergence', trigger: stage,
          start: pin ? () => `top top+=${pinTop()}` : 'top 78%',
          end: () => `+=${distance()}`, pin: pin ? stage : false,
          // Transform pinning preserves the .page query-container ancestry and its typography.
          // ScrollTrigger owns the sole scroll-distance spacer.
          pinType: 'transform', pinSpacing: true, scrub: true, invalidateOnRefresh: true,
          onRefreshInit: readingClearance,
          onUpdate: self => coordinate(self.progress), onRefresh: self => coordinate(self.progress),
        },
      });
      timeline.addLabel('arrival', 0).addLabel('convergence', 0).addLabel('remains', .18).addLabel('settled', .8).addLabel('editorial', .9);
      lines.forEach((line, index) => timeline.fromTo(line, {
        x: () => displacement() * (index === 0 ? 1 : -1), opacity: 0, filter: 'blur(4px)',
      }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: .62, ease: 'power1.out' }, index === 0 ? 'convergence' : 'remains'));
      // Both lines settle before the shared footer is admitted; retain a normalized range.
      timeline.to({}, { duration: .2 }, .8);
      coordinate(timeline.scrollTrigger?.progress ?? 0);
      return () => { root.style.removeProperty('--outro-tail-clearance'); delete root.dataset.outroState; setOutroEditorialReady(true); };
    }, root);
  };
  // Measure with the local font before creating the timeline, never hide visible text late.
  if (document.fonts.status === 'loaded') setup();
  else document.fonts.ready.then(() => { if (!disposed) { setup(); ScrollTrigger.refresh(); } });
  current = { root, dispose: () => { disposed = true; media.revert(); setOutroEditorialReady(true); current = undefined; } };
}
const dispose = () => current?.dispose();
const restore = (event: PageTransitionEvent) => { if (event.persisted) initializeOutro(); };
initializeOutro();
document.addEventListener('astro:page-load', initializeOutro);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', restore);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose(); document.removeEventListener('astro:page-load', initializeOutro); document.removeEventListener('astro:before-swap', dispose);
  window.removeEventListener('pagehide', dispose); window.removeEventListener('pageshow', restore);
});
