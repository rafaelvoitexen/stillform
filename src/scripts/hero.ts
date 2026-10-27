import { createHeroEntrance } from './hero-entrance';

let current: { hero: HTMLElement; dispose: () => void } | undefined;

function initializeHero() {
  const hero = document.querySelector<HTMLElement>('.hero');
  const page = document.querySelector<HTMLElement>('.page');
  if (!hero || !page || current?.hero === hero) return;
  current?.dispose();

  const opening = hero.querySelector<HTMLElement>('.around')!;
  const closing = hero.querySelector<HTMLElement>('.closing')!;
  const photo = hero.querySelector<HTMLElement>('.photo')!;
  const header = document.querySelector<HTMLElement>('.site-header')!;
  const note = hero.querySelector<HTMLElement>('.image-note')!;
  const image = hero.querySelector<HTMLImageElement>('img')!;
  const entrance = createHeroEntrance(hero, () => assess());
  const events = new AbortController();
  let frame = 0;
  let disposed = false;
  let sizeKey = '';

  const rangeWidth = (element: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(element.querySelector('.line-motion') ?? element);
    return range.getBoundingClientRect().width;
  };
  const assess = () => {
    hero.removeAttribute('data-stacked');
    note.removeAttribute('data-wrap');
    if (page.clientWidth >= 1024) {
      const x = opening.getBoundingClientRect().left;
      const rectangle = photo.getBoundingClientRect();
      const closingLeft = closing.getBoundingClientRect().left;
      const columns = [...header.children].map(el => el.getBoundingClientRect());
      if (x + rangeWidth(opening) > rectangle.left - 8 ||
          closingLeft < 0 ||
          closingLeft + rangeWidth(closing) <= rectangle.left ||
          closingLeft + rangeWidth(closing) > rectangle.left + rectangle.width / 2 - 16 ||
          columns.some((column, index) => index > 0 && column.left - columns[index - 1].right < 24)) {
        hero.setAttribute('data-stacked', '');
      }
    }
    if (rangeWidth(note.querySelector<HTMLElement>('.subject')!) +
        rangeWidth(note.querySelector<HTMLElement>('.credit')!) + 16 > note.clientWidth) {
      note.setAttribute('data-wrap', '');
    }
    sizeKey = `${page.clientWidth}:${getComputedStyle(document.documentElement).fontSize}:${getComputedStyle(opening).fontSize}:${document.fonts.check('500 176px Onest')}`;
  };
  const schedule = () => {
    if (disposed || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const nextSize = `${page.clientWidth}:${getComputedStyle(document.documentElement).fontSize}:${getComputedStyle(opening).fontSize}:${document.fonts.check('500 176px Onest')}`;
      if (nextSize === sizeKey) return;
      const previous = sizeKey.split(':'), next = nextSize.split(':');
      const initialFontReady = document.documentElement.dataset.heroState === 'reserved' &&
        previous[0] === next[0] && previous[1] === next[1] && previous[3] !== next[3];
      if (!initialFontReady && entrance.refresh()) return;
      assess();
    });
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(page);
  observer.observe(header.querySelector('.wordmark')!);
  document.fonts.ready.then(schedule);
  document.fonts.addEventListener('loadingdone', schedule, { signal: events.signal });
  const imageFailed = () => {
    entrance.settle();
    image.hidden = true;
    image.style.display = 'none';
    hero.querySelector<HTMLElement>('.image-failure')!.hidden = false;
  };
  image.addEventListener('error', imageFailed, { once: true, signal: events.signal });
  if (image.complete && !image.naturalWidth) imageFailed();
  assess();
  void entrance.attempt();

  current = { hero, dispose: () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    events.abort();
    entrance.dispose();
    current = undefined;
  } };
}

initializeHero();
const beforeSwap = () => current?.dispose();
const pageHide = () => current?.dispose();
const pageShow = (event: PageTransitionEvent) => { if (event.persisted) initializeHero(); };
document.addEventListener('astro:page-load', initializeHero);
document.addEventListener('astro:before-swap', beforeSwap);
window.addEventListener('pagehide', pageHide);
window.addEventListener('pageshow', pageShow);

if (import.meta.hot) import.meta.hot.dispose(() => {
  current?.dispose();
  document.removeEventListener('astro:page-load', initializeHero);
  document.removeEventListener('astro:before-swap', beforeSwap);
  window.removeEventListener('pagehide', pageHide);
  window.removeEventListener('pageshow', pageShow);
});
