import { gsap } from 'gsap';

const TUNING = Object.freeze({ normalSize: 34, tracking: .12, expansion: .34, release: .24, influence: .28, hysteresis: 16 });
type Mode = 'NORMAL' | 'MAGNETIC_REVEAL';
interface Bounds { left: number; right: number; top: number; bottom: number; }
interface Transition { time: number; mode: Mode; reason: string; input: number; rawX: number; rawY: number; progress: number; }
declare global {
  interface Window {
    __stillformPointer?: {
      snapshot: () => Record<string, unknown>;
      transitions: () => Transition[];
      tuning: typeof TUNING;
    };
  }
}
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
    const appearance = getComputedStyle(negative);
    if (appearance.position !== 'fixed' || appearance.mixBlendMode !== 'difference' || parseFloat(appearance.width) !== TUNING.normalSize) return;
    const manifesto = document.querySelector<HTMLElement>('#manifesto');
    const interval = manifesto?.querySelector<HTMLElement>('.revealing-void');
    const header = document.querySelector<HTMLElement>('.site-header');
    const html = document.documentElement, events = new AbortController();
    const options = { signal: events.signal, passive: true };
    const image = new Image(); image.alt = ''; image.draggable = false;
    image.src = '/images/tulach-e-vos.jpg';
    Object.assign(image.style, { position: 'absolute', maxWidth: 'none', objectFit: 'cover', objectPosition: '50% 50%', pointerEvents: 'none' });
    portal.append(image);
    let assetReady = false, disposed = false, frame = 0, inside = false, blockedTarget = false;
    let rawX = 0, rawY = 0, input = 0, vw = innerWidth, vh = innerHeight;
    let dirty = true, geometryRevision = 0, transitionCount = 0;
    let mode: Mode = 'NORMAL';
    let progressTween: gsap.core.Tween | undefined;
    let zone = { left: 0, right: 0, top: 0, bottom: 0, diameter: 34, width: 0, planeX: 0, planeY: 0, planeHeight: 0 };
    const state = { x: 0, y: 0, progress: 0, visible: 0 };
    const target = { x: 0, y: 0 };
    const rendered = { x: 0, y: 0, normalX: 0, normalY: 0, magneticX: 0, magneticY: 0, diameter: 34, imageOpacity: 0, negativeOpacity: 0 };
    const trace: Transition[] = [];
    const clamp = gsap.utils.clamp;
    const available = () => !!manifesto && manifesto.dataset.revealReady !== 'false' && assetReady && zone.diameter >= 100;
    const safeBounds = (radius = zone.diameter / 2): Bounds => ({ left: zone.left + radius, right: zone.right - radius, top: zone.top + radius, bottom: zone.bottom - radius });
    const native = () => { delete html.dataset.cursorActive; };
    const fail = () => { inside = false; native(); negative.style.visibility = portal.style.visibility = 'hidden'; };
    const render = () => {
      try {
        const diameter = TUNING.normalSize + (zone.diameter - TUNING.normalSize) * state.progress;
        const radius = diameter / 2;
        const normalX = clamp(radius, Math.max(radius, vw - radius), state.x);
        const normalY = clamp(radius, Math.max(radius, vh - radius), state.y);
        let magneticX = normalX, magneticY = normalY;
        if (zone.diameter >= 100) {
          const safe = safeBounds();
          magneticX = clamp(safe.left, safe.right, normalX + ((zone.left + zone.right) / 2 - normalX) * TUNING.influence);
          magneticY = clamp(safe.top, safe.bottom, normalY + ((zone.top + zone.bottom) / 2 - normalY) * TUNING.influence);
        }
        // Free tracking never stops. Size and spatial attraction release in the same phase.
        const x = normalX + (magneticX - normalX) * state.progress;
        const y = normalY + (magneticY - normalY) * state.progress;
        // One progress owns size and layer opacity; the stationary window clips the photograph.
        Object.assign(rendered, { x, y, normalX, normalY, magneticX, magneticY, diameter, imageOpacity: state.visible * state.progress, negativeOpacity: state.visible * (1 - state.progress) });
        negative.style.transform = `translate3d(${x - 17}px,${y - 17}px,0) scale(${diameter / TUNING.normalSize})`;
        portal.style.transform = `translate3d(${x - 160}px,${y - 160}px,0)`;
        portal.style.clipPath = `circle(${radius}px at 50% 50%)`;
        image.style.transform = `translate3d(${zone.planeX - x + 160}px,${zone.planeY - y + 160}px,0)`;
        negative.style.opacity = `${rendered.negativeOpacity}`; portal.style.opacity = `${rendered.imageOpacity}`;
        negative.style.visibility = portal.style.visibility = state.visible > 0 ? 'visible' : 'hidden';
        if (inside && state.visible > .02) html.dataset.cursorActive = ''; else native();
      } catch { fail(); }
    };
    const xTo = gsap.quickTo(state, 'x', { duration: TUNING.tracking, ease: 'power3.out', onUpdate: render });
    const yTo = gsap.quickTo(state, 'y', { duration: TUNING.tracking, ease: 'power3.out', onUpdate: render });
    const visibleTo = gsap.quickTo(state, 'visible', { duration: .12, ease: 'power2.out', onUpdate: render });
    const steer = () => {
      // Progress updates render the blend; only changed raw input retargets tracking.
      if (target.x !== rawX) { target.x = rawX; xTo(rawX); }
      if (target.y !== rawY) { target.y = rawY; yTo(rawY); }
    };
    const setMode = (next: Mode, reason: string) => {
      if (next === mode) return;
      mode = next; transitionCount++;
      trace.push({ time: performance.now(), mode, reason, input, rawX, rawY, progress: state.progress });
      if (trace.length > 80) trace.shift();
      progressTween?.kill();
      progressTween = gsap.to(state, {
        progress: next === 'MAGNETIC_REVEAL' ? 1 : 0,
        duration: next === 'MAGNETIC_REVEAL' ? TUNING.expansion : TUNING.release,
        ease: 'power2.out', onUpdate: render,
      });
    };
    const classify = (reason: string) => {
      const margin = mode === 'MAGNETIC_REVEAL' ? TUNING.hysteresis : 0;
      const hit = inside && !blockedTarget && available() && rawX >= zone.left - margin && rawX <= zone.right + margin && rawY >= zone.top - margin && rawY <= zone.bottom + margin;
      setMode(hit ? 'MAGNETIC_REVEAL' : 'NORMAL', reason);
    };
    const resetUnavailable = (reason: string) => {
      setMode('NORMAL', reason); progressTween?.kill(); state.progress = 0;
      state.x = rendered.x; state.y = rendered.y;
      if (inside) {
        Object.assign(target, { x: rawX, y: rawY });
        xTo(rawX, rendered.x); yTo(rawY, rendered.y);
      }
      render();
    };
    const hide = () => {
      if (!inside) return;
      inside = false; native(); setMode('NORMAL', 'pointer-hidden'); visibleTo(0);
    };
    const measure = () => {
      frame = 0; dirty = false; geometryRevision++; vw = innerWidth; vh = innerHeight;
      if (manifesto && interval) {
        const gap = interval.getBoundingClientRect();
        const copyBottom = Math.max(...[...manifesto.querySelectorAll('.reading, .annotation, .line-two')].map(el => el.getBoundingClientRect().bottom));
        const footerTop = manifesto.getBoundingClientRect().bottom - parseFloat(getComputedStyle(manifesto).paddingBottom);
        const centerY = gap.top + gap.height / 2;
        const halfHeight = Math.max(0, Math.min(centerY - copyBottom - 16, footerTop - 24 - centerY));
        const left = Math.max(8, gap.left), right = Math.min(vw - 8, gap.right);
        const top = Math.max(centerY - halfHeight, (header?.getBoundingClientRect().bottom ?? 0) + 12);
        const bottom = Math.min(centerY + halfHeight, vh - 8);
        const diameter = Math.max(34, Math.min(clamp(190, 300, vw * .145), right - left - 24, bottom - top - 12));
        zone = { left, right, top, bottom, diameter, width: gap.width, planeX: gap.left,
          planeY: centerY - Math.max(gap.width * .75, halfHeight * 2) / 2, planeHeight: Math.max(gap.width * .75, halfHeight * 2) };
        image.style.width = `${Math.max(0, zone.width)}px`; image.style.height = `${zone.planeHeight}px`;
        // The stationary photographic window retains its existing bounds as the cursor leaves.
        image.style.clipPath = `inset(${Math.max(0, zone.top - zone.planeY)}px ${Math.max(0, zone.planeX + zone.width - zone.right)}px ${Math.max(0, zone.planeY + zone.planeHeight - zone.bottom)}px ${Math.max(0, zone.left - zone.planeX)}px)`;
      }
      if (zone.diameter < 100 && (state.progress > 0 || mode === 'MAGNETIC_REVEAL')) resetUnavailable('geometry-unavailable');
      classify('geometry'); if (inside) steer(); render();
    };
    const refresh = () => { dirty = true; if (!frame) frame = requestAnimationFrame(measure); };
    image.decode().then(() => { if (!disposed) { assetReady = true; refresh(); } }, () => { if (!disposed) { assetReady = false; resetUnavailable('image-unavailable'); } });
    const move = (event: PointerEvent) => {
      try {
        if (event.pointerType !== 'mouse') return hide();
        rawX = event.clientX; rawY = event.clientY; input++;
        blockedTarget = event.target instanceof Element && !!event.target.closest('.site-header, a, button, input, textarea, select, [contenteditable]');
        if (!inside) {
          state.x = rawX; state.y = rawY; xTo.tween.invalidate(); yTo.tween.invalidate();
          inside = true; visibleTo(1);
        }
        // Classify synchronously from this event, never from a tweened coordinate.
        classify('pointer'); steer();
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
    if (header) observer.observe(header);
    const gate = new MutationObserver(() => { classify('readiness-gate'); if (inside) steer(); });
    if (manifesto) gate.observe(manifesto, { attributes: true, attributeFilter: ['data-reveal-ready'] });
    document.fonts.ready.then(() => { if (!disposed) refresh(); });
    const diagnostics = Object.freeze({
      snapshot: () => ({ raw: { x: rawX, y: rawY, input }, visual: { x: rendered.x, y: rendered.y }, target: { ...target },
        region: { left: zone.left, right: zone.right, top: zone.top, bottom: zone.bottom }, safeBounds: safeBounds(),
        mode, progress: state.progress, diameter: rendered.diameter, imageOpacity: rendered.imageOpacity,
        negativeOpacity: rendered.negativeOpacity, magneticInfluence: state.progress * TUNING.influence, constraintStrength: state.progress,
        normalPosition: { x: rendered.normalX, y: rendered.normalY }, magneticPosition: { x: rendered.magneticX, y: rendered.magneticY },
        imageReady: assetReady, geometryRevision, geometryDirty: dirty, transitions: transitionCount,
        tweens: { x: xTo.tween.isActive(), y: yTo.tween.isActive(), reveal: progressTween?.isActive() ?? false, visibility: visibleTo.tween.isActive() } }),
      transitions: () => trace.map(item => ({ ...item })), tuning: TUNING,
    });
    window.__stillformPointer = diagnostics;
    measure();
    return () => {
      disposed = true; native(); events.abort(); observer.disconnect(); gate.disconnect(); cancelAnimationFrame(frame);
      progressTween?.kill(); [xTo, yTo, visibleTo].forEach(tween => tween.tween.kill());
      image.remove(); negative.removeAttribute('style'); portal.removeAttribute('style');
      if (window.__stillformPointer === diagnostics) delete window.__stillformPointer;
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
