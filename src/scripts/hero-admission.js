/* Synchronous, bounded reservation. Readable HTML is the default if this script is absent. */
(() => {
  if (window.__stillformHeroEnter) return;
  const html = document.documentElement;
  const enter = (restored = false) => {
    const previous = window.__stillformHero;
    if (previous && !restored) return previous;
    const restoredScroll = previous?.scrollPosition ?? scrollY;
    previous?.finish('new-entry');
    delete html.dataset.heroState;
    delete html.dataset.heroReason;
    const events = new AbortController();
    const started = performance.now();
    const navigation = performance.getEntriesByType('navigation')[0];
    const reload = !restored && navigation?.type === 'reload';
    // A reload is a fresh opening, including on naturally taller mobile pages.
    // Do not apply this policy to history entries: their saved scroll belongs to the user.
    const restoration = history.scrollRestoration;
    let pageShown = false, reloadFinished = false;
    const releaseReloadRestoration = () => {
      reloadFinished = true;
      if (reload && pageShown) history.scrollRestoration = restoration;
    };
    if (reload) {
      history.scrollRestoration = 'manual';
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      window.addEventListener('pageshow', () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        pageShown = true;
        if (reloadFinished) history.scrollRestoration = restoration;
      }, { once: true });
      window.addEventListener('pagehide', () => { history.scrollRestoration = restoration; }, { once: true });
    }
    let timer;
    const lease = window.__stillformHero = {
      entry: (previous?.entry ?? 0) + 1,
      scrollPosition: 0,
      historyReady: Promise.resolve(),
      deadline: started + 450,
      cleanup: undefined,
      font: Promise.resolve(false),
      decoded: Promise.resolve(false),
      diagnostics: { navigation: restored ? 'bfcache' : navigation?.type ?? 'navigate', reload, initialScroll: restoredScroll, reservedAt: started },
      finish(reason) {
        const state = html.dataset.heroState;
        if (state === 'settled' || state === 'static-final') return;
        clearTimeout(timer);
        events.abort();
        releaseReloadRestoration();
        try { lease.cleanup?.(); }
        finally {
          document.querySelectorAll('[data-hero-overlay]').forEach(node => node.remove());
          html.dataset.heroState = state === 'running' ? 'settled' : 'static-final';
          html.dataset.heroReason = reason;
          lease.diagnostics.finishedAt = performance.now();
          lease.diagnostics.reason = reason;
          performance.mark('stillform:hero:end', { detail: reason });
        }
      },
      claim() {
        if (html.dataset.heroState !== 'reserved') return false;
        if (performance.now() >= lease.deadline || getComputedStyle(html).getPropertyValue('--sf-expired').trim() === '1') {
          lease.finish('reservation-expired');
          return false;
        }
        clearTimeout(timer);
        html.dataset.heroState = 'running';
        lease.deadline = performance.now() + 6200;
        timer = setTimeout(() => lease.finish('running-deadline'), 6200);
        performance.mark('stillform:hero:start', { detail: { entry: lease.entry } });
        lease.diagnostics.claimedAt = performance.now();
        return true;
      },
    };
    html.dataset.heroEntry = String(lease.entry);
    const skip = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced-motion'
      : restored && (restoredScroll > 1 || scrollY > 1) ? 'history-away-from-top'
      : document.visibilityState !== 'visible' ? 'background'
      : !reload && (scrollY > 1 || (location.hash && location.hash !== '#top')) ? 'away-from-top'
      : window.visualViewport && visualViewport.scale !== 1 ? 'visual-viewport'
      : parseFloat(getComputedStyle(html).fontSize) > 16.5 ? 'resized-text'
      : !restored && performance.getEntriesByType('paint').length ? 'late-bootstrap' : null;
    if (skip) { lease.finish(skip); return; }

    const options = { signal: events.signal };
    // Install every fail-open mechanism BEFORE the flag that can conceal content.
    timer = setTimeout(() => lease.finish('reservation-deadline'), 450);
    // Ordinary interaction never cancels or restarts the current entry.
    // Geometry changes are reconciled by the motion controller, without scroll locking.
    window.addEventListener('pagehide', () => lease.finish('pagehide'), options);
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => lease.finish('motion-preference'), options);
    if (!restored && navigation?.type === 'back_forward') {
      // Let native history restore scroll before claiming. Keep the same bounded reservation.
      lease.historyReady = new Promise(resolve => window.addEventListener('pageshow', () => {
        requestAnimationFrame(() => {
          if (scrollY > 1) lease.finish('history-away-from-top');
          resolve();
        });
      }, { ...options, once: true }));
    }
    html.dataset.heroState = 'reserved';
    performance.mark('stillform:hero:reserved');

    lease.font = document.fonts.load('500 176px Onest').then(faces => {
      const ready = faces.some(face => face.family === 'Onest' && face.status === 'loaded');
      if (!ready) lease.finish('font-failure');
      return ready;
    }, () => { lease.finish('font-failure'); return false; });
    const image = new Image();
    image.src = '/images/tulach-e-vos.jpg';
    lease.decoded = image.decode().then(() => true, () => { lease.finish('image-decode-failure'); return false; });
    return lease;
  };
  window.__stillformHeroEnter = enter;
  // These hooks belong to the document, not the abortable current-entry listeners.
  window.addEventListener('pagehide', () => {
    if (window.__stillformHero) window.__stillformHero.scrollPosition = scrollY;
  });
  window.addEventListener('pageshow', event => { if (event.persisted) enter(true); });
  enter();
})();
