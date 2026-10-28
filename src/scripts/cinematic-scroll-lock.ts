import { pauseSmoothScroll, scrollToOpeningImmediately } from './smooth-scroll';

const owners = new Map<symbol, () => void>();
let guards: AbortController | undefined, resume: (() => void) | undefined, deadline = 0;
export const supportsCinematicScrollLock = () => CSS.supports('scrollbar-gutter', 'stable');

function unlock() {
  clearTimeout(deadline); guards?.abort(); guards = undefined;
  // Remove the stopped class while the root geometry is still protected.
  const release = resume; resume = undefined;
  try { release?.(); }
  finally { delete document.documentElement.dataset.cinematicScrollLock; }
}
function cancelOwners() {
  for (const cancel of [...owners.values()]) { try { cancel(); } catch { /* Always unlock. */ } }
  owners.clear(); unlock();
}

/** One reference-counted lock spans the return overlay and the complete Hero replay. */
export function acquireCinematicScrollLock(cancel: () => void) {
  if (!supportsCinematicScrollLock()) return null;
  const token = Symbol('cinematic-scroll');
  if (!owners.size) {
    document.documentElement.dataset.cinematicScrollLock = '';
    resume = pauseSmoothScroll();
    guards = new AbortController();
    const options = { capture: true, passive: false, signal: guards.signal };
    const prevent = (event: Event) => event.preventDefault();
    window.addEventListener('wheel', prevent, options);
    window.addEventListener('touchmove', prevent, options);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); cancelOwners(); return; }
      // Tab can scroll even an overflow:hidden root. Preserve document focus order
      // and browser-chrome exit, but move focus without scrolling during the intro.
      if (event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey) {
        const focusable = [...document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select, summary, [tabindex], [contenteditable="true"]')]
          .filter(element => element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
          .sort((a, b) => (a.tabIndex > 0 ? a.tabIndex : Number.MAX_SAFE_INTEGER) - (b.tabIndex > 0 ? b.tabIndex : Number.MAX_SAFE_INTEGER));
        const index = focusable.indexOf(document.activeElement as HTMLElement);
        const next = focusable[index + (event.shiftKey ? -1 : 1)];
        if (next) { event.preventDefault(); next.focus({ preventScroll: true }); }
        return;
      }
      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      if (event.key === ' ' && element?.closest('button, summary, [role="button"]')) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) event.preventDefault();
    }, options);
    window.addEventListener('pagehide', cancelOwners, { signal: guards.signal });
    deadline = window.setTimeout(cancelOwners, 10000);
  }
  owners.set(token, cancel);
  return () => {
    if (!owners.delete(token)) return;
    if (!owners.size) unlock();
  };
}

/** Programmatic reset remains supported while overflow and Lenis are locked. */
export const resetCinematicScroll = () => scrollToOpeningImmediately();
if (import.meta.hot) import.meta.hot.dispose(cancelOwners);
