import { gsap } from 'gsap';

let current: { section: HTMLElement; dispose: () => void } | undefined;

function initializeManifesto() {
  const section = document.querySelector<HTMLElement>('.manifesto');
  if (!section || current?.section === section) return;
  current?.dispose();
  const media = gsap.matchMedia();
  media.add('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const negative = section.querySelector<HTMLElement>('.void-negative')!;
    const portal = section.querySelector<HTMLElement>('.void-portal')!;
    const interval = section.querySelector<HTMLElement>('.revealing-void')!;
    const events = new AbortController();
    const options = { signal: events.signal, passive: true };
    const image = new Image();
    image.alt = '';
    image.draggable = false;
    image.src = '/images/tulach-e-vos.jpg';
    Object.assign(image.style, { position: 'absolute', maxWidth: 'none', objectFit: 'cover', objectPosition: '50% 50%', pointerEvents: 'none' });
    portal.append(image);
    let assetReady = false, disposed = false, inside = false, frame = 0;
    image.decode().then(() => { if (!disposed) assetReady = true; }, () => { assetReady = false; });
    let bounds = section.getBoundingClientRect(), gap = interval.getBoundingClientRect();
    let radius = 75, planeHeight = 300;
    const point = { x: 0, y: 0, visible: 0 };
    const ready = () => section.dataset.revealReady !== 'false';
    const clamp = gsap.utils.clamp;
    const render = () => {
      const x = clamp(radius, Math.max(radius, bounds.width - radius), point.x);
      const y = clamp(radius, Math.max(radius, bounds.height - radius), point.y);
      const gx = gap.left - bounds.left, gy = gap.top - bounds.top;
      // Fade before the circular aperture can intersect any authored glyph.
      const clearance = Math.min(x - gx, gx + gap.width - x, y - gy, gy + gap.height - y);
      const edge = clamp(0, 1, (clearance - radius + 18) / 18);
      const reveal = assetReady && ready() ? edge * edge * (3 - 2 * edge) : 0;
      const visible = ready() ? point.visible : 0;
      const transform = `translate3d(${x - radius}px,${y - radius}px,0)`;
      negative.style.transform = portal.style.transform = transform;
      negative.style.opacity = `${visible * (1 - reveal)}`;
      portal.style.opacity = `${visible * reveal}`;
      negative.style.visibility = portal.style.visibility = visible > 0 ? 'visible' : 'hidden';
      // The photographic plane is registered to the interval, not attached to the cursor.
      image.style.transform = `translate3d(${gx - x + radius}px,${gy + gap.height / 2 - planeHeight / 2 - y + radius}px,0)`;
    };
    const xTo = gsap.quickTo(point, 'x', { duration: .14, ease: 'power3.out', onUpdate: render });
    const yTo = gsap.quickTo(point, 'y', { duration: .14, ease: 'power3.out', onUpdate: render });
    const visibilityTo = gsap.quickTo(point, 'visible', { duration: .18, ease: 'power2.out', onUpdate: render });
    const measure = () => {
      frame = 0;
      bounds = section.getBoundingClientRect();
      gap = interval.getBoundingClientRect();
      radius = parseFloat(getComputedStyle(negative).width) / 2;
      planeHeight = Math.max(gap.height, radius * 4);
      image.style.width = `${gap.width}px`;
      image.style.height = `${planeHeight}px`;
      render();
    };
    const hide = () => { inside = false; visibilityTo(0); };
    const refresh = () => {
      hide();
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !ready()) return hide();
      const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      if (!inside) {
        point.x = x; point.y = y;
        xTo.tween.invalidate(); yTo.tween.invalidate();
        inside = true;
      }
      xTo(x); yTo(y); visibilityTo(1);
    };
    section.addEventListener('pointermove', move, options);
    section.addEventListener('pointerleave', hide, options);
    section.addEventListener('pointercancel', hide, options);
    window.addEventListener('scroll', refresh, options);
    window.addEventListener('resize', refresh, options);
    document.addEventListener('visibilitychange', hide, options);
    const observer = new ResizeObserver(refresh);
    observer.observe(section); observer.observe(interval);
    const gate = new MutationObserver(() => { if (!ready()) { hide(); render(); } });
    gate.observe(section, { attributes: true, attributeFilter: ['data-reveal-ready'] });
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    measure();
    return () => {
      disposed = true; events.abort(); observer.disconnect(); gate.disconnect(); cancelAnimationFrame(frame);
      [xTo, yTo, visibilityTo].forEach(tween => tween.tween.kill());
      image.remove(); negative.removeAttribute('style'); portal.removeAttribute('style');
    };
  }, section);
  current = { section, dispose: () => { media.revert(); current = undefined; } };
}

const dispose = () => current?.dispose();
const restore = (event: PageTransitionEvent) => { if (event.persisted) initializeManifesto(); };
initializeManifesto();
document.addEventListener('astro:page-load', initializeManifesto);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', restore);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose();
  document.removeEventListener('astro:page-load', initializeManifesto);
  document.removeEventListener('astro:before-swap', dispose);
  window.removeEventListener('pagehide', dispose);
  window.removeEventListener('pageshow', restore);
});
