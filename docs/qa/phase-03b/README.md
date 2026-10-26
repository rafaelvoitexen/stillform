# STILLFORM — Phase 03B: Find the Opening

Hero entrance implemented; awaiting human motion review. The approved Phase 03A.1 static composition remains unchanged.

## Implementation

- `src/components/Hero.astro`: one inner span per authored line; scoped, temporary line masks; a small parser-side admission check. One semantic h1 and one semantic photograph remain.
- `src/scripts/hero-entrance.ts`: one GSAP timeline, two decorative mineral shutters, interruption handling and complete style/layer cleanup.
- `src/scripts/hero.ts`: the existing content-fit/image-failure behavior, now with explicit lifecycle teardown and entrance coordination. Text ranges measure the glyphs inside the new wrappers rather than their full-width block boxes.
- `src/pages/index.astro`: local asset preloads and early decode/font readiness. The unchanged Onest font-face declaration moves here from `src/styles/global.css` so it can start loading before the Hero is parsed. No family, weight, metrics, asset, color, copy or static layout values change.
- No dependencies, React islands, plugins, other chapters or cross-section transitions were added.

The photograph never translates, scales or changes crop. Two opaque 46%-wide shutters leave an initial 8% aperture and translate outward inside a clipped overlay. The single photo remains registered underneath. The closing word's mobile mineral backing stays stationary. Desktop graphite/chalk coloring is applied to the moving inner line during playback, preserving its shared, stationary x boundary.

## Choreography

| Treatment | Photo | Line starts | Line duration/travel | Secondary text | End |
| --- | --- | --- | --- | --- | --- |
| Desktop | 1.10s, power3.inOut | 0.55 / 0.63 / 0.71s | 0.65s, 0.25 line height, power3.out | 1.10–1.30s, opacity only | 1.36s |
| Stacked mobile/tablet | 0.90s, power3.inOut | 0.45 / 0.52 / 0.59s | 0.55s, 0.18 line height, power3.out | 0.94–1.14s, opacity only | 1.14s |

Header and footer metadata do not animate. Shutters leave the DOM when the photograph finishes opening; all GSAP inline transforms, opacity and promotion hints revert when the timeline ends or is interrupted. There is no repeating sequence or per-frame geometry-reading loop in application code.

## Motion recordings

| Composition | Video | GIF alternative | Initial | Intermediate | Final |
| --- | --- | --- | --- | --- | --- |
| 1440 × 900 | [Desktop WebM](desktop-entrance.webm) | [GIF](desktop-entrance.gif) | [100ms](desktop-100ms.png) | [550ms](desktop-550ms.png), [800ms](desktop-800ms.png), [1100ms](desktop-1100ms.png) | [Settled](desktop-1550ms.png) |
| 390 × 844 | [Mobile WebM](mobile-entrance.webm) | [GIF](mobile-entrance.gif) | [100ms](mobile-100ms.png) | [550ms](mobile-550ms.png), [800ms](mobile-800ms.png), [1100ms](mobile-1100ms.png) | [Settled](mobile-1550ms.png) |
| 768 × 1024 | [Tablet WebM](tablet-entrance.webm) | [GIF](tablet-entrance.gif) | [100ms](tablet-100ms.png) | [550ms](tablet-550ms.png), [800ms](tablet-800ms.png), [1100ms](tablet-1100ms.png) | [Settled](tablet-1550ms.png) |

These are real-clock Chrome DevTools screencast frames from the production bundle, not a seeked/test-only timeline. For repeatable responsive recordings, the QA browser delayed only the stylesheet request by 80ms, reproducing a cold stylesheet with already-ready local font/image resources. This creates an eligible pre-paint opportunity without changing application code or relaxing its guard. The normal-load validation also played one entrance without that delay. Other ordinary loads can legitimately show the static composition.

Videos encode the captured JPEG frames at their recorded timestamps; no generated/interpolated frames. The initial pre-navigation frame is omitted and the settled frame holds briefly for review. GIFs loop for review only; the website does not loop. Video/GIF compression is lossy; PNGs are the source of truth for visual comparison. PNG filenames indicate requested capture positions; DevTools screenshot latency means exact elapsed capture times are in [desktop states](desktop-states.json), [mobile states](mobile-states.json), and [tablet states](tablet-states.json).

Browser: real headless Chrome 156, through native Chrome DevTools Protocol. Chrome DevTools MCP is not exposed in this session.

## First-paint and progressive enhancement contract

The server renders complete, readable HTML and CSS. No persistent loading class, page opacity, scroll lock or loader is used. Asset readiness is requested early without blocking the renderer. The parser-side admission can prepare an opening only after the specific local font is loaded and the shared image resource is decoded, with visible document, top-of-page position, normal motion preference, styled geometry and no emergency word wrapping.

Its lease closes before the next rendering opportunity. Existing paint entries prevent late admission. If assets miss that opportunity, the full static Hero remains visible and the entrance is skipped for this visit. A late module cannot conceal content that has already appeared. This deliberately prioritizes reading over guaranteed playback.

A prepared state has a **160ms runtime-handoff limit**, with its own interruption listeners. If the bundle is delayed or fails, the static state is restored. Once running, the timeline has a further 1800ms fail-safe. Neither timer waits for missing assets. No late readiness triggers a retry. A successful timeline settles around 1.36s / 1.14s, well before that fail-safe.

Recorded preparation precedes first contentful paint in all three recordings:

| Recording | Prepared | First contentful paint | Measured sequence end after start |
| --- | --- | --- | --- |
| Desktop | 121.9ms | 152ms | 1359.5ms |
| Mobile | 107.3ms | 136ms | 1152.1ms |
| Tablet | 105.3ms | 128ms | 1147.4ms |

See [admission verification](admission-verification.json). Cold/slow assets, reduced motion, history returns and reflow keep the static composition. There is no production replay/debug control.

## Static-frame parity

Every pixel of the three recorded final PNGs matches its approved Phase 03A.1 viewport screenshot. Settled development-server screenshots also match at **360, 390, 768, 1024, 1280, 1440 and 1600px**, plus 320, 600 and 900px checks. JavaScript-disabled and reduced-motion mobile full-page captures match the approved static full page exactly.

See [pixel regression](pixel-regression.json), [settled geometry audit](settled/audit.json), and [approved Phase 03A.1 evidence](../phase-03a-1/README.md). No static layout was altered to accommodate the entrance.

## Technical and accessibility validation

- Production `astro build` passed, one static page. Astro/Vite compiles the TypeScript; no separate project type-check command is configured.
- `git diff --check` passed.
- Runtime exception count: **0** in the completed browser validation.
- Normal eligible load: one entrance; completion removes all shutters and returns every line to opacity 1, transform none, will-change auto.
- Scroll away, viewport resize, 200% root-text resize, keyboard focus and reduced-motion change during playback all settle immediately. Returning to the top does not replay.
- Reduced motion at load: zero starts and immediate completed composition.
- JavaScript disabled: readable static composition with local font/image; pixel-identical mobile full page.
- Slow font/image loading: readable content before readiness, no conceal/reveal flash, no late entrance.
- Delayed/failed GSAP bundle: handoff deadline restores the complete Hero; late execution cannot hide it again.
- Image failure: reserved mineral frame and accessible unavailable-image message. Font failure: readable fallback and content-fit rules. No horizontal overflow.
- Reload during initialization and browser back/forward: no duplicate timeline or forced replay. The history return retains one start from its original visit, not a new start.
- Accessibility tree: exactly one level-one heading, “Built around absence.”; only STILLFORM and E Vos are links. Decorative shutters are aria-hidden and pointer-transparent. Keyboard focus settles any temporarily transparent content.
- No more than one start per document observed. No layout tween, filters, image scaling, ScrollTrigger or continuous application animation loop.
- Observed normal and eligible completed entrances had **0 CLS** and no recorded tasks over 50ms. Explicitly changing text to 200% caused expected reflow; the deliberately delayed font produced about **0.0022 CLS** from fallback-to-Onest metrics. This is not caused by the entrance, and is not concealed or fitted away.

Full case results: [validation.json](validation.json). Performance observations are from desktop headless Chrome under QA overhead; they are not a physical-device or universal frame-rate certification.

## Remaining artistic and technical limitations

The strict pre-paint contract means playback frequency depends on browser asset/cache timing; a fast first paint may legitimately skip even a warm visit. This is intentional, and the recordings provide a reliable review of eligible playback. The development module graph is more likely to miss the handoff than the production bundle.

Mobile/tablet still use natural document height. Credits below the fold settle with the same entrance rather than waiting for scroll. Supporting copy remains provisional. No additional artistic issue was found in the three reviewed sequences; timing and character of the opening remain subject to human motion approval.

Safari, Firefox, physical phones/tablets, screen-reader listening and low-end-device profiling remain unverified. The small delayed-font shift described above remains a font-loading limitation.

## Review and reproduction

Development preview: [localhost:4321](http://localhost:4321/). Production preview: [localhost:4324](http://localhost:4324/). Live visits obey admission conditions; use the recordings for repeatable artistic review.

QA sources: [record-eligible.mjs](record-eligible.mjs), [record-production.mjs](record-production.mjs), [validate.mjs](validate.mjs), [regression.mjs](regression.mjs), [cdp.mjs](cdp.mjs), [encode-gifs.py](encode-gifs.py), [encode-videos.mjs](encode-videos.mjs). They use a local Chrome debugging endpoint on 9223 and existing bundled runtime libraries, with no project dependency installation.

Stop here for human review. Hero-to-Manifesto, ScrollTrigger, other chapters and identity changes remain excluded.
