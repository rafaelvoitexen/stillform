import { gsap } from 'gsap';

let current: { root: HTMLElement; dispose: () => void } | undefined;

function initializePointer() {
  const root = document.querySelector<HTMLElement>('[data-global-pointer]');
  if (!root || current?.root === root) return;
  current?.dispose();
  const media = gsap.matchMedia();
  media.add('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    if (!CSS.supports('mix-blend-mode', 'difference') || !CSS.supports('clip-path', 'circle(1px)')) return;
    const negative = root.querySelector<HTMLElement>('.global-negative')!;
    const portal = root.querySelector<HTMLElement>('.global-portal')!;
    // A failed stylesheet must never leave an invisible custom cursor hiding the native one.
    const appearance = getComputedStyle(negative);
    if (appearance.position !== 'fixed' || appearance.mixBlendMode !== 'difference' || parseFloat(appearance.width) !== 34) return;
    const manifesto = document.querySelector<HTMLElement>('#manifesto');
    const interval = manifesto?.querySelector<HTMLElement>('.revealing-void');
    const html = document.documentElement, events = new AbortController();
    const options = { signal: events.signal, passive: true };
    const image = new Image(); image.alt = ''; image.draggable = false;
    image.src = '/images/tulach-e-vos.jpg';
    Object.assign(image.style, { position: 'absolute', maxWidth: 'none', objectFit: 'cover', objectPosition: '50% 50%', pointerEvents: 'none' });
    portal.append(image);
    let assetReady = false, disposed = false, frame = 0, inside = false;
    let rawX = 0, rawY = 0, vw = innerWidth, vh = innerHeight;
    let zone = { left: 0, right: 0, top: 0, bottom: 0, diameter: 34, width: 0, planeY: 0, planeHeight: 0 };
    const state = { x: 0, y: 0, engage: 0, visible: 0 };
    const clamp = gsap.utils.clamp;
    const smooth = (value: number) => { const x = clamp(0, 1, value); return x * x * (3 - 2 * x); };
    const ready = () => !!manifesto && manifesto.dataset.revealReady !== 'false' && assetReady && zone.diameter >= 100;
    const native = () => { delete html.dataset.cursorActive; };
    const fail = () => { native(); negative.style.visibility = portal.style.visibility = 'hidden'; };
    const render = () => {
      try {
        const diameter = 34 + (zone.diameter - 34) * state.engage;
        const radius = diameter / 2;
        const x = clamp(radius, Math.max(radius, vw - radius), state.x);
        const y = clamp(radius, Math.max(radius, vh - radius), state.y);
        const clearance = Math.min(x - zone.left, zone.right - x, y - zone.top, zone.bottom - y);
        // The track has 20px glyph gutters. Fade across 12px before any glyph can be reached.
        const photoMix = ready() ? state.engage * smooth((clearance - radius + 12) / 12) : 0;
        negative.style.transform = `translate3d(${x - 17}px,${y - 17}px,0) scale(${diameter / 34})`;
        portal.style.transform = `translate3d(${x - 160}px,${y - 160}px,0)`;
        portal.style.clipPath = `circle(${radius}px at 50% 50%)`;
        image.style.transform = `translate3d(${zone.left - x + 160}px,${zone.planeY - y + 160}px,0)`;
        negative.style.opacity = `${state.visible * (1 - photoMix)}`;
        portal.style.opacity = `${state.visible * photoMix}`;
        negative.style.visibility = portal.style.visibility = state.visible > 0 ? 'visible' : 'hidden';
        if (inside && state.visible > .02) html.dataset.cursorActive = ''; else native();
      } catch { fail(); }
    };
    const xTo = gsap.quickTo(state, 'x', { duration: .14, ease: 'power3.out', onUpdate: render });
    const yTo = gsap.quickTo(state, 'y', { duration: .14, ease: 'power3.out', onUpdate: render });
    const engageTo = gsap.quickTo(state, 'engage', { duration: .52, ease: 'power2.inOut', onUpdate: render });
    const visibleTo = gsap.quickTo(state, 'visible', { duration: .12, ease: 'power2.out', onUpdate: render });
    const steer = () => {
      let x = rawX, y = rawY, engage = 0;
      if (ready()) {
        const dx = Math.max(zone.left - x, 0, x - zone.right);
        const dy = Math.max(zone.top - y, 0, y - zone.bottom);
        const clearance = Math.min(x - zone.left, zone.right - x, y - zone.top, zone.bottom - y);
        const distance = dx || dy ? Math.hypot(dx, dy) : -clearance;
        const range = Math.min(140, vw * .08);
        const strength = .7 * smooth((range - distance) / (range + 48));
        const radius = zone.diameter / 2;
        const anchorX = clamp(zone.left + radius, zone.right - radius, x);
        const anchorY = clamp(zone.top + radius, zone.bottom - radius, y);
        x += (anchorX - x) * strength; y += (anchorY - y) * strength;
        engage = smooth(-distance / 32);
      }
      xTo(x); yTo(y); engageTo(engage);
    };
    const hide = () => { inside = false; native(); visibleTo(0); engageTo(0); };
    const measure = () => {
      frame = 0; vw = innerWidth; vh = innerHeight;
      if (manifesto && interval) {
        const gap = interval.getBoundingClientRect();
        const copyBottom = Math.max(...[...manifesto.querySelectorAll('.reading, .annotation, .line-two')].map(el => el.getBoundingClientRect().bottom));
        const footerTop = manifesto.querySelector('.manifesto-footer')!.getBoundingClientRect().top;
        const centerY = gap.top + gap.height / 2;
        const halfHeight = Math.max(0, Math.min(centerY - copyBottom - 16, footerTop - 24 - centerY));
        const diameter = Math.max(34, Math.min(clamp(190, 300, vw * .145), gap.width - 24, halfHeight * 2 - 12));
        zone = { left: gap.left, right: gap.right, top: centerY - halfHeight, bottom: centerY + halfHeight,
          diameter, width: gap.width, planeY: centerY - Math.max(gap.width * .75, halfHeight * 2) / 2,
          planeHeight: Math.max(gap.width * .75, halfHeight * 2) };
        image.style.width = `${Math.max(0, zone.width)}px`; image.style.height = `${zone.planeHeight}px`;
      }
      if (inside) steer(); render();
    };
    const refresh = () => { if (!frame) frame = requestAnimationFrame(measure); };
    image.decode().then(() => { if (!disposed) { assetReady = true; refresh(); } }, () => { assetReady = false; });
    const move = (event: PointerEvent) => {
      try {
        if (event.pointerType !== 'mouse') return hide();
        rawX = event.clientX; rawY = event.clientY;
        if (!inside) { state.x = rawX; state.y = rawY; xTo.tween.invalidate(); yTo.tween.invalidate(); inside = true; }
        steer(); visibleTo(1);
      } catch { fail(); }
    };
    document.addEventListener('pointermove', move, options);
    document.addEventListener('pointerout', event => { if (!(event as PointerEvent).relatedTarget) hide(); }, options);
    document.addEventListener('pointercancel', hide, options);
    document.addEventListener('visibilitychange', hide, options);
    document.addEventListener('keydown', event => { if (event.key === 'Tab' || event.key === 'Escape') hide(); }, options);
    window.addEventListener('blur', hide, options);
    window.addEventListener('scroll', refresh, options);
    window.addEventListener('resize', refresh, options);
    const observer = new ResizeObserver(refresh);
    if (manifesto) observer.observe(manifesto);
    if (interval) observer.observe(interval);
    const gate = new MutationObserver(() => { if (!ready()) engageTo(0); });
    if (manifesto) gate.observe(manifesto, { attributes: true, attributeFilter: ['data-reveal-ready'] });
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    measure();
    return () => {
      disposed = true; native(); events.abort(); observer.disconnect(); gate.disconnect(); cancelAnimationFrame(frame);
      [xTo, yTo, engageTo, visibleTo].forEach(tween => tween.tween.kill());
      image.remove(); negative.removeAttribute('style'); portal.removeAttribute('style');
    };
  }, root);
  current = { root, dispose: () => { media.revert(); delete document.documentElement.dataset.cursorActive; current = undefined; } };
}
const dispose = () => current?.dispose();
const restore = (event: PageTransitionEvent) => { if (event.persisted) initializePointer(); };
initializePointer();
document.addEventListener('astro:page-load', initializePointer);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', restore);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose(); document.removeEventListener('astro:page-load', initializePointer); document.removeEventListener('astro:before-swap', dispose);
  window.removeEventListener('pagehide', dispose); window.removeEventListener('pageshow', restore);
});
