import { gsap } from 'gsap';

const CHAPTERS = ['hero', 'manifesto', 'archive'] as const;
export type Chapter = typeof CHAPTERS[number];
const DESCRIPTIONS: Record<Chapter, string> = { hero: 'An archive of spatial observations', manifesto: 'Manifesto', archive: 'Archive' };
let active: Chapter = 'hero';
let override: Chapter | null = null;
let editorialSuppressed = false;
let refreshEditorial: (() => void) | undefined;
let update: (() => void) | undefined;
let current: { header: HTMLElement; dispose: () => void } | undefined;
export const getActiveChapter = () => active;
/** Cross-section motion suppresses footer presentation without changing chapter state. */
export function setEditorialSuppressed(suppressed: boolean) {
  if (editorialSuppressed === suppressed) return;
  editorialSuppressed = suppressed; refreshEditorial?.();
}
/** Future transition ownership is explicit; null releases tracking to normal scroll. */
export function setChapterOverride(chapter: Chapter | null) { override = chapter; update?.(); }

function initializeHeader() {
  const header = document.querySelector<HTMLElement>('.site-header');
  const manifesto = document.querySelector<HTMLElement>('#manifesto');
  if (!header || !manifesto || current?.header === header) return;
  current?.dispose();
  const events = new AbortController(), options = { signal: events.signal, passive: true };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = CHAPTERS.map(chapter => document.querySelector<HTMLElement>(chapter === 'hero' ? '.hero' : `#${chapter}`));
  const footer = document.querySelector<HTMLElement>('.site-footer');
  const windows = [...header.querySelectorAll<HTMLElement>('.descriptor, .chapter'), ...(footer?.querySelectorAll<HTMLElement>('[data-editorial-window]') ?? [])];
  const rows = windows.map(view => [...view.querySelectorAll<HTMLElement>('.label-row')]);
  const updateFooterStatus = () => {
    if (!footer) return;
    const chapter = active;
    footer.querySelector('[data-editorial-status]')!.textContent = [...footer.querySelectorAll<HTMLElement>(`[data-chapter="${chapter}"]`)].map(row => row.dataset.editorialLabel).join(' ');
  };
  const progress = { value: 0 };
  let tween: gsap.core.Tween | undefined, frame = 0, initialized = false;
  let tops: number[] = [];
  let dirty = true, footerHeight = 0, heroTop = 0;
  const footerMotion = [...(footer?.querySelectorAll<HTMLElement>('.editorial-motion') ?? [])];
  const presence = { y: 100 };
  let footerShown = false, presenceTween: gsap.core.Tween | undefined;
  const renderPresence = () => footerMotion.forEach(layer => { layer.style.transform = `translateY(${presence.y}%)`; });
  const updateFooterVisibility = (immediate = false) => {
    const shown = !editorialSuppressed && !!footer && innerWidth >= 600 && footerHeight > 0 && scrollY - heroTop >= footerHeight;
    if (shown === footerShown && !immediate) return;
    footerShown = shown;
    presenceTween?.kill();
    if (shown) {
      if (!document.documentElement.hasAttribute('data-editorial-visible')) { presence.y = 100; renderPresence(); }
      document.documentElement.setAttribute('data-editorial-visible', '');
      render();
    }
    presenceTween = gsap.to(presence, {
      y: shown ? 0 : -100, duration: immediate || reduced.matches ? 0 : .52, ease: 'power2.inOut', onUpdate: renderPresence,
      onComplete: () => {
        if (!footerShown) {
          delete document.documentElement.dataset.editorialVisible;
          presence.y = 100; renderPresence();
        }
      },
    });
  };
  refreshEditorial = () => updateFooterVisibility(editorialSuppressed);
  const render = () => rows.forEach(group => {
    // Preserve the current footer labels throughout their exit, including rapid chapter changes.
    if (!footerShown && group[0]?.closest('.site-footer')) return;
    group.forEach((row, index) => {
      row.style.transform = `translateY(${(index - progress.value) * 100}%)`;
    });
  });
  const select = (chapter: Chapter, immediate = false) => {
    if (initialized && chapter === active && !immediate) return;
    active = chapter; initialized = true;
    const index = CHAPTERS.indexOf(chapter);
    document.documentElement.dataset.activeChapter = chapter;
    header.querySelector('[data-chapter-description]')!.textContent = DESCRIPTIONS[chapter];
    header.querySelector('[data-chapter-status]')!.textContent = `Section ${index + 1} of 4`;
    updateFooterStatus();
    tween?.kill();
    tween = gsap.to(progress, { value: index, duration: immediate || reduced.matches ? 0 : .52, ease: 'power2.inOut', onUpdate: render, onComplete: updateFooterVisibility });
    document.dispatchEvent(new CustomEvent('stillform:chapterchange', { detail: { chapter } }));
  };
  const tick = () => {
    frame = 0;
    if (dirty) {
      dirty = false;
      tops = sections.map(section => section ? section.getBoundingClientRect().top + scrollY : Infinity);
      heroTop = tops[0];
      windows.forEach((view, index) => {
        const height = Math.max(...rows[index].map(row => row.firstElementChild!.getBoundingClientRect().height));
        view.style.setProperty('--label-height', `${height}px`);
      });
      if (footer) {
        document.documentElement.dataset.editorialReady = '';
        const box = footer.getBoundingClientRect();
        const bottom = parseFloat(getComputedStyle(footer).bottom) || 25;
        footerHeight = box.height;
        document.documentElement.style.setProperty('--editorial-clearance', `${footerHeight > 0 ? footerHeight + bottom + 24 : 0}px`);
        updateFooterStatus(); render();
      }
      const headerBox = header.getBoundingClientRect();
      document.documentElement.style.setProperty('--header-content-clearance', headerBox.height > 70 ? `${headerBox.bottom + 24}px` : '0px');
    }
    const marker = scrollY + innerHeight * .35;
    let index = initialized ? CHAPTERS.indexOf(active) : 0;
    const margin = initialized ? 24 : 0;
    while (index < CHAPTERS.length - 1 && marker >= tops[index + 1] + margin) index++;
    while (index > 0 && marker < tops[index] - margin) index--;
    const chapter = override ?? CHAPTERS[index];
    select(chapter, !initialized); updateFooterVisibility();
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
  const measure = () => { dirty = true; schedule(); };
  update = schedule;
  window.addEventListener('scroll', schedule, options);
  window.addEventListener('resize', measure, options);
  window.addEventListener('pageshow', measure, options);
  window.addEventListener('hashchange', schedule, options);
  reduced.addEventListener('change', () => { select(active, true); updateFooterVisibility(true); }, options);
  const observer = new ResizeObserver(measure);
  sections.forEach(section => { if (section) observer.observe(section); });
  observer.observe(header); if (footer) observer.observe(footer);
  document.fonts.ready.then(() => { if (!events.signal.aborted) measure(); });
  tick();
  current = { header, dispose: () => {
    events.abort(); observer.disconnect(); cancelAnimationFrame(frame); tween?.kill(); presenceTween?.kill();
    footerMotion.forEach(layer => layer.style.removeProperty('transform'));
    windows.forEach(view => view.style.removeProperty('--label-height'));
    rows.flat().forEach(row => row.removeAttribute('style'));
    document.documentElement.style.removeProperty('--header-content-clearance');
    delete document.documentElement.dataset.editorialReady;
    delete document.documentElement.dataset.editorialVisible;
    document.documentElement.style.removeProperty('--editorial-clearance');
    update = undefined; refreshEditorial = undefined; editorialSuppressed = false; current = undefined;
  } };
}
const dispose = () => current?.dispose();
const restore = (event: PageTransitionEvent) => { if (event.persisted) initializeHeader(); };
initializeHeader();
document.addEventListener('astro:page-load', initializeHeader);
document.addEventListener('astro:before-swap', dispose);
window.addEventListener('pagehide', dispose);
window.addEventListener('pageshow', restore);
if (import.meta.hot) import.meta.hot.dispose(() => {
  dispose(); document.removeEventListener('astro:page-load', initializeHeader); document.removeEventListener('astro:before-swap', dispose);
  window.removeEventListener('pagehide', dispose); window.removeEventListener('pageshow', restore);
});
