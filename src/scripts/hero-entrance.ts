import { gsap } from 'gsap';

interface HeroLease {
  entry: number;
  historyReady: Promise<void>;
  deadline: number;
  font: Promise<boolean>;
  decoded: Promise<boolean>;
  cleanup?: () => void;
  claim: () => boolean;
  finish: (reason: string) => void;
}
declare global { interface Window { __stillformHero?: HeroLease; } }

const setStyles = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>) => Object.assign(element.style, styles);

/** One timeline owns independent frame and inner-image transforms. */
export function createHeroEntrance(hero: HTMLElement, prepareLayout: () => void) {
  const lease = window.__stillformHero;
  let disposed = false;
  let attempted = false;
  let context: gsap.Context | undefined;
  let timeline: gsap.core.Timeline | undefined;
  let overlay: HTMLDivElement | undefined;
  let headlineInk: HTMLDivElement | undefined;
  const baseMasks: HTMLElement[] = [];
  let refreshGeometry: (() => void) | undefined;
  let geometryFrame = 0;
  const geometryEvents = new AbortController();
  const refresh = () => {
    if (!refreshGeometry || disposed) return false;
    if (!geometryFrame) geometryFrame = requestAnimationFrame(() => {
      geometryFrame = 0;
      refreshGeometry?.();
    });
    return true;
  };
  const settle = (reason = 'layout-change') => lease?.finish(reason);

  const attempt = async () => {
    if (!lease || attempted || disposed || document.documentElement.dataset.heroState !== 'reserved') return;
    attempted = true;
    try {
      const [fontReady, decoded] = await Promise.all([lease.font, lease.decoded, lease.historyReady]);
      if (disposed || document.documentElement.dataset.heroState !== 'reserved') return;
      if (!fontReady || !decoded) return settle('assets-unavailable');
      if (!CSS.supports('clip-path', "path(evenodd, 'M0 0 H1 V1 H0 Z')")) return settle('mask-unsupported');
      prepareLayout();
      const lines = [...hero.querySelectorAll<HTMLElement>('.line-motion')];
      const image = hero.querySelector<HTMLImageElement>('.photo img')!;
      const photo = hero.querySelector<HTMLElement>('.photo')!;
      let finalZoom = parseFloat(getComputedStyle(hero).getPropertyValue('--photo-zoom'));
      if (!Number.isFinite(finalZoom) || finalZoom < 1) return settle('geometry-unavailable');
      if (!image.complete || !image.naturalWidth) return settle('image-not-ready');
      if (lines.some(line => line.getBoundingClientRect().height > parseFloat(getComputedStyle(line).lineHeight) + 1)) return settle('text-reflow');
      if (parseFloat(getComputedStyle(document.documentElement).fontSize) > 16.5 || (window.visualViewport && window.visualViewport.scale !== 1)) return settle('resized-text');

      const stacked = getComputedStyle(hero.querySelector('h1')!).display === 'contents';
      const mobile = stacked && innerWidth < 600;
      let rect = photo.getBoundingClientRect();
      const viewport = window.visualViewport;
      let vw = viewport?.width ?? innerWidth, vh = viewport?.height ?? innerHeight;
      let vx = viewport?.offsetLeft ?? 0, vy = viewport?.offsetTop ?? 0;
      let gutter = parseFloat(getComputedStyle(hero.querySelector('.header')!).marginLeft);
      let composition = hero.getBoundingClientRect();
      let usable = composition.width - gutter * 2;
      let fit = Math.min(1, (vw - gutter * 2) / rect.width, (vh - gutter * 2) / rect.height);
      if (fit <= 0 || !Number.isFinite(fit)) return settle('geometry-unavailable');
      const pose = {
        x: vx + vw / 2 - (rect.x + rect.width / 2),
        y: vy + vh / 2 - (rect.y + rect.height / 2),
        scale: fit,
      };
      const aperture = { bottom: 100, edge: 46 };
      const journey = { progress: 0 };
      const zoom = { progress: 0 };
      const wipe = stacked ? .65 : .8;
      const transfer = mobile ? 2.05 : stacked ? 2.2 : 2.6;
      const transferDuration = mobile ? 1.1 : stacked ? 1.15 : 1.4;
      const handoff = transfer + transferDuration;
      const identityOut = transfer - (stacked ? .4 : .45);
      const headline = transfer;
      const lineDuration = mobile ? .8 : stacked ? .82 : .95;
      const offsets = [0, mobile ? .25 : stacked ? .27 : .3, mobile ? .52 : stacked ? .55 : .6];
      const lastOffset = offsets[2];
      const secondaryStart = Math.max(handoff, headline + lastOffset + lineDuration - .12);
      const settled = secondaryStart + (stacked ? .34 : .4);

      overlay = document.createElement('div');
      overlay.dataset.heroOverlay = '';
      overlay.setAttribute('aria-hidden', 'true');
      setStyles(overlay, { position: 'fixed', inset: '0', zIndex: '20', pointerEvents: 'none', isolation: 'isolate', overflow: 'clip' });
      const proxy = document.createElement('div');
      proxy.dataset.photoProxy = '';
      setStyles(proxy, {
        position: 'absolute', left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.width}px`, height: `${rect.height}px`,
        transformOrigin: '50% 50%', willChange: 'transform, clip-path', overflow: 'hidden',
      });
      const proxyImage = document.createElement('img');
      proxyImage.src = image.currentSrc || image.src;
      proxyImage.alt = '';
      proxyImage.width = image.naturalWidth; proxyImage.height = image.naturalHeight;
      proxyImage.dataset.innerImage = '';
      setStyles(proxyImage, { display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%', transformOrigin: 'center center', willChange: 'transform' });
      proxy.append(proxyImage);
      overlay.append(proxy);

      const groups = ['var(--graphite)', 'var(--chalk)'].map((color, index) => {
        const group = document.createElement('div');
        setStyles(group, { position: 'absolute', inset: '0', color, fontFamily: 'Onest, Arial, sans-serif', fontWeight: '500' });
        const textPlane = document.createElement('div');
        setStyles(textPlane, { position: 'absolute', inset: '0' });
        const rows = ['STILL', 'FORM'].map((word, rowIndex) => {
          const row = document.createElement('div');
          row.textContent = word;
          row.dataset.identityWord = word;
          setStyles(row, {
            position: 'absolute', left: `${composition.x + gutter}px`, width: `${usable}px`,
            fontSize: '100px', lineHeight: stacked ? '1' : '.95', letterSpacing: stacked ? '.025em' : '.06em',
            textAlign: rowIndex ? 'right' : 'left', whiteSpace: 'nowrap', opacity: '0', willChange: 'transform, opacity, filter',
          });
          textPlane.append(row);
          return row;
        });
        group.append(textPlane); overlay!.append(group);
        return rows;
      });
      document.body.append(overlay);
      let rendering = true;
      lease.cleanup = () => {
        // Context reversion rewinds timeline drivers; it must not repaint their initial pose.
        rendering = false;
        refreshGeometry = undefined;
        cancelAnimationFrame(geometryFrame);
        geometryEvents.abort();
        timeline?.kill(); context?.revert(); overlay?.remove(); headlineInk?.remove();
        baseMasks.forEach(mask => { if (mask.firstElementChild) mask.replaceWith(mask.firstElementChild); });
      };
      const textWidth = (element: HTMLElement) => {
        const range = document.createRange(); range.selectNodeContents(element); return range.getBoundingClientRect().width;
      };
      const fontSize = Math.min(
        usable * (stacked ? .9 : .667) / textWidth(groups[0][0]) * 100,
        usable / Math.max(...groups[0].map(textWidth)) * 100,
        vh * .72 / (stacked ? 2 : 1.9),
      );
      const lineHeight = fontSize * (stacked ? 1 : .95);
      const identityY = vy + vh / 2 - lineHeight;
      groups.forEach(rows => rows.forEach((row, index) => setStyles(row, { fontSize: `${fontSize}px`, top: `${identityY + index * lineHeight}px` })));
      // Keep the approved glyph positions while bounding ultrawide blur/compositor surfaces.
      const identityWidths = groups[0].map(textWidth);
      groups.forEach(rows => rows.forEach((row, index) => setStyles(row, {
        width: `${identityWidths[index]}px`, left: `${composition.x + gutter + (index ? usable - identityWidths[index] : 0)}px`, textAlign: 'left',
      })));
      const identityLayers = groups.map(rows => rows[0].parentElement!.parentElement!);
      // The opaque photo naturally covers graphite ink; only the white layer needs a mask.
      overlay.prepend(identityLayers[0]);
      const identityTravel = mobile ? 32 : stacked ? 55 : 100;
      const identityMotion = [
        { x: identityTravel, opacity: 0, blur: stacked ? 3 : 5 },
        { x: -identityTravel, opacity: 0, blur: stacked ? 3 : 5 },
      ];
      // The semantic base and white visual copy share one driver per line.
      let lineRects = lines.map(line => line.getBoundingClientRect());
      lines.forEach(line => {
        const mask = document.createElement('span'); mask.dataset.headlineBaseMask = '';
        mask.style.display = 'block'; line.before(mask); mask.append(line); baseMasks.push(mask);
      });
      const headlineTravel = mobile ? 32 : stacked ? 45 : 75;
      const lineMotion = lines.map(() => ({ x: -headlineTravel, opacity: 0, blur: stacked ? 2 : 4 }));
      headlineInk = document.createElement('div');
      headlineInk.dataset.heroOverlay = 'headline';
      headlineInk.setAttribute('aria-hidden', 'true');
      setStyles(headlineInk, { position: 'fixed', inset: '0', zIndex: '21', pointerEvents: 'none', overflow: 'clip' });
      const whiteLines = lines.map((line, index) => {
        const ink = document.createElement('div');
        const typography = getComputedStyle(line), box = lineRects[index];
        ink.textContent = line.textContent;
        ink.dataset.headlineWhite = String(index);
        setStyles(ink, {
          position: 'absolute', left: `${box.x}px`, top: `${box.y}px`, width: `${box.width}px`, height: `${box.height}px`,
          fontFamily: typography.fontFamily, fontSize: typography.fontSize, fontWeight: typography.fontWeight,
          lineHeight: typography.lineHeight, letterSpacing: typography.letterSpacing, fontStyle: typography.fontStyle,
          color: 'var(--chalk)', whiteSpace: 'nowrap', opacity: '0', willChange: 'transform, opacity, filter',
        });
        headlineInk!.append(ink);
        return ink;
      });
      document.body.append(headlineInk);
      let identityGone = false, handedOff = false, claimed = false;
      const render = () => {
        if (!rendering) return;
        proxyImage.style.transform = `scale(${1 + (finalZoom - 1) * zoom.progress})`;
        if (!handedOff) {
          const remaining = 1 - journey.progress;
          pose.x = (vx + vw / 2 - (rect.x + rect.width / 2)) * remaining;
          pose.y = (vy + vh / 2 - (rect.y + rect.height / 2)) * remaining;
          pose.scale = 1 + (fit - 1) * remaining;
          // Only responsive fit belongs to the frame. Cinematic zoom belongs to its inner image.
          proxy.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale})`;
          proxy.style.clipPath = `inset(0 ${aperture.edge}% ${aperture.bottom}% ${aperture.edge}%)`;
        }
        const width = rect.width * pose.scale, height = rect.height * pose.scale;
        const x = rect.x + rect.width / 2 + pose.x - width / 2;
        const y = rect.y + rect.height / 2 + pose.y - height / 2;
        const start = aperture.edge / 100, end = 1 - start;
        const photoClip = `inset(${y}px ${vw - x - end * width}px ${vh - y - height * (1 - aperture.bottom / 100)}px ${x + start * width}px)`;
        const outside = (ox: number, oy: number, outerWidth: number, outerHeight: number) => {
          const l = x + start * width - ox, r = x + end * width - ox;
          const t = y - oy, b = y + height * (1 - aperture.bottom / 100) - oy;
          return `path(evenodd, 'M-120 -30 H${outerWidth + 120} V${outerHeight + 30} H-120 Z M${l} ${t} H${r} V${b} H${l} Z')`;
        };
        if (!identityGone) {
          identityLayers[1].style.clipPath = photoClip;
          identityMotion.forEach((motion, index) => {
            for (const rows of groups) setStyles(rows[index], {
              transform: `translate3d(${motion.x}px,0,0)`, opacity: `${motion.opacity}`, filter: `blur(${motion.blur}px)`,
            });
          });
        }
        // Clipping happens outside the blurred white glyphs, retaining a hard photographic edge.
        headlineInk!.style.clipPath = photoClip;
        lineMotion.forEach((motion, index) => {
          const styles = { transform: `translate3d(${motion.x}px,0,0)`, opacity: `${motion.opacity}`, filter: `blur(${motion.blur}px)` };
          if (claimed) setStyles(lines[index], styles);
          baseMasks[index].style.clipPath = outside(lineRects[index].x, lineRects[index].y, lineRects[index].width, lineRects[index].height);
          setStyles(whiteLines[index], styles);
        });
      };
      render();
      performance.mark('stillform:hero:ready');
      if (!lease.claim()) { overlay.remove(); return; }
      claimed = true;
      context = gsap.context(() => {
        // The authored mineral backing must occlude both proxy and real photograph.
        // Lift the existing page stacking context; no additional covering layer is needed.
        gsap.set(hero.closest('.page'), { position: 'relative', zIndex: 21 });
        const secondary = [...hero.querySelectorAll<HTMLElement>('.details, .descriptor, .chapter, .footer')];
        gsap.set([...lines, photo, hero.querySelector('.closing'), hero.querySelector('.wordmark'), ...secondary], { opacity: 0 });
        gsap.set(lines, { x: -headlineTravel, y: 0, filter: `blur(${stacked ? 2 : 4}px)`, color: 'var(--graphite)', backgroundImage: 'none', willChange: 'transform, opacity, filter' });
        gsap.set(lines[2], { color: 'var(--absence-ink)' });
        gsap.set(baseMasks, { clipPath: 'inset(-30px -120px)' });
        timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' }, onUpdate: render });
        Object.entries({ canvas: 0, wipe: 0, identityIn: stacked ? .22 : .3, expand: wipe, zoom: wipe, identityOut, transfer, handoff,
          headline, wordmark: headline + (stacked ? .12 : .18), secondary: secondaryStart, settled,
        }).forEach(([label, time]) => timeline!.addLabel(label, time));
        timeline.to(aperture, { bottom: 0, duration: wipe }, 'wipe')
          .to(aperture, { edge: 0, duration: stacked ? .65 : .8 }, 'expand')
          .to(zoom, { progress: 1, duration: handoff - wipe, ease: 'power1.out' }, 'zoom')
          .to(journey, { progress: 1, duration: transferDuration }, 'transfer');
        for (let index = 0; index < 2; index++) {
          timeline.to(identityMotion[index], { x: 0, opacity: 1, blur: 0, duration: mobile ? .88 : stacked ? .92 : 1.05, ease: 'power2.out' }, (stacked ? .22 : .3) + index * (stacked ? .32 : .35));
        }
        timeline.to(identityMotion, { opacity: 0, blur: stacked ? 3 : 5, duration: stacked ? .4 : .45 }, 'identityOut')
          .call(() => { identityGone = true; identityLayers.forEach(layer => layer.remove()); }, [], 'transfer')
          .call(() => {
            journey.progress = 1; render();
            handedOff = true; overlay?.remove();
            performance.mark('stillform:hero:transfer');
          }, [], 'handoff')
          .set(photo, { opacity: 1 }, 'handoff')
          .set(hero.querySelector('.closing'), { opacity: 1 }, 'headline');
        lines.forEach((line, index) => {
          timeline!.to(lineMotion[index], { x: 0, opacity: 1, blur: 0, duration: lineDuration, ease: 'power2.out' }, headline + offsets[index]);
        });
        const wordmark = hero.querySelector('.wordmark');
        gsap.set(wordmark, { filter: 'blur(2px)' });
        gsap.set(secondary, { filter: `blur(${stacked ? 1 : 1.5}px)` });
        timeline.to(wordmark, { opacity: 1, filter: 'blur(0px)', duration: stacked ? .5 : .6, ease: 'power2.out' }, 'wordmark')
          .to(secondary, { opacity: 1, filter: 'blur(0px)', duration: stacked ? .34 : .4, ease: 'power1.out' }, 'secondary')
          .call(() => settle('complete'), [], 'settled');
      }, hero);
      refreshGeometry = () => {
        if (!rendering) return;
        // Read geometry only after an actual viewport/scroll change, never per animation tick.
        lines.forEach(line => { line.style.transform = 'none'; });
        prepareLayout();
        rect = photo.getBoundingClientRect();
        vw = viewport?.width ?? innerWidth; vh = viewport?.height ?? innerHeight;
        vx = viewport?.offsetLeft ?? 0; vy = viewport?.offsetTop ?? 0;
        composition = hero.getBoundingClientRect();
        gutter = parseFloat(getComputedStyle(hero.querySelector('.header')!).marginLeft);
        usable = composition.width - gutter * 2;
        fit = Math.min(1, (vw - gutter * 2) / rect.width, (vh - gutter * 2) / rect.height);
        lineRects = lines.map(line => line.getBoundingClientRect());
        const typography = lines.map(line => getComputedStyle(line));
        // Retarget the responsive crop without rewinding the active zoom tween.
        finalZoom = parseFloat(getComputedStyle(hero).getPropertyValue('--photo-zoom'));
        setStyles(proxy, { left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.width}px`, height: `${rect.height}px` });
        whiteLines.forEach((ink, index) => {
          const box = lineRects[index], font = typography[index];
          setStyles(ink, { left: `${box.x}px`, top: `${box.y}px`, width: `${box.width}px`, height: `${box.height}px`,
            fontSize: font.fontSize, lineHeight: font.lineHeight, letterSpacing: font.letterSpacing });
        });
        if (!identityGone) {
          const nowStacked = getComputedStyle(hero.querySelector('h1')!).display === 'contents';
          const tracking = nowStacked ? .025 : .06;
          const ratios = identityWidths.map((width, index) => width / fontSize +
            (tracking - (stacked ? .025 : .06)) * ['STILL', 'FORM'][index].length);
          const size = Math.min(usable * (nowStacked ? .9 : .667) / ratios[0],
            usable / Math.max(...ratios), vh * .72 / (nowStacked ? 2 : 1.9));
          const leading = size * (nowStacked ? 1 : .95);
          groups.forEach(rows => rows.forEach((row, index) => setStyles(row, {
            fontSize: `${size}px`, lineHeight: nowStacked ? '1' : '.95', letterSpacing: `${tracking}em`,
            width: `${ratios[index] * size}px`, top: `${vy + vh / 2 - leading + index * leading}px`,
            left: `${composition.x + gutter + (index ? usable - ratios[index] * size : 0)}px`,
          })));
        }
        render();
      };
      const geometryOptions = { passive: true, signal: geometryEvents.signal };
      window.addEventListener('scroll', refresh, geometryOptions);
      window.addEventListener('resize', refresh, geometryOptions);
      window.visualViewport?.addEventListener('resize', refresh, geometryOptions);
      window.visualViewport?.addEventListener('scroll', refresh, geometryOptions);
      timeline!.play(0);
    } catch { settle('setup-failure'); }
  };
  return { attempt, settle, refresh, dispose: () => { disposed = true; settle('dispose'); } };
}
