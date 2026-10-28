# STILLFORM — Mobile experience review · Phase 07A

28 October 2026. Diagnostic review only; production code and approved behavior are unchanged.

## Evidence and limits

- **Source-confirmed:** ownership, media conditions, properties and refresh paths below.
- **Locally observed:** Chromium at actual CSS viewports 390×844, 390×680 and 1440×900; wheel/keyboard input and DOM/console inspection, not physical touch.
- **User-reported:** Outro stutter on iPhone 12 / Chrome iOS and iPhone 15 / Safari iOS; pink line on Safari. Both reported iOS browsers use WebKit. No physical iPhone or WebKit runner was available here.
- No FPS, dropped-frame, long-task or GPU-memory measurements were obtained. Exact iOS/browser versions and affected entrance remain needed.

## Priority and diagnosis

| Priority | Symptom / confidence | Files | Recommended action / impact | Risk and acceptance |
| --- | --- | --- | --- | --- |
| **P0** | Outro stutter: device report; mobile pin/filter/viewport coupling confirmed; dominant cause unverified | `src/scripts/outro.ts`, `src/components/Outro.astro` | Isolate blur, then evaluate mobile-only unpinned X/opacity convergence. Reduce native-scroll synchronization and paint risk. | Preserve final type geometry, opposite travel, stagger, reverse playback and footer gate. Accept only after both iPhones show stable slow/fast/reverse scrolling and toolbar changes. Desktop pin unchanged. |
| **P0** | Pink line: device report, not reproduced locally | `hero-entrance.ts`, `chapter-transition.ts`, `archive.ts`, `outro.ts`; `ReturnTransition.astro`, `SiteHeader.astro` | Identify the exact entrance and isolate its filter, clipping and blend operations individually on WebKit. Apply the smallest confirmed workaround. | No blanket layer promotion or removal of desktop effects. Pass the same reproducible gesture repeatedly without the artifact or a new crop/text seam. |
| **P1** | Manifesto reveal absent below desktop eligibility: confirmed | `Manifesto.astro`, `chapter-transition.ts`, `pointer.ts` | Add a reserved in-flow photo slot and lightweight scroll reveal through the existing section ownership; plan below. | Needs approval of mobile slot height/crop. SEE. and editorial copy remain unobstructed; static/reduced-motion image readable. |
| **P1** | Archive cumulative rendering cost: source-confirmed workload, device cost unmeasured | `archive.ts`, `Archive.astro`, `src/data/archive.json` | Profile visible records; test mobile word/caption blur reduction before reducing parallax. Review overscan and requested image sizes at device DPR. | Keep differentiated figure motion, internal drift, words and credits. No blank image edges, missing observations or desktop hover regression. |
| **P1** | Viewport-dependent refresh/recreation: confirmed sensitivity; iOS refresh frequency unknown | `outro.ts`, `chapter-transition.ts`, `site-header.ts` | Remove unused height-query invalidation in the next implementation; measure refresh calls before changing global policy. Cache stable geometry where possible and coalesce genuine layout changes. | Rotation, font resizing and restoration must still recalculate correctly; no stale pin or chapter positions. |
| **P1** | Archive text can pass under fixed header: expected layering; inaccessible content not established | `SiteHeader.astro`, `site-header.ts`, `Archive.astro` | Validate a safe reading zone and focused/anchored caption clearance on devices. Adjust targeted scroll margins/entrance thresholds only if needed. | No permanent header background. All paragraphs/credits must be readable and keyboard focus visible after normal scrolling. |
| **P2** | Further image/layer tuning | Archive assets and temporary Hero layers | Tune only after traces identify decode/raster pressure. Existing lazy loading and transform separation should be retained. | Do not trade away photographic quality or introduce permanent promotion of every image. |

Script names without a directory in the table refer to `src/scripts/`; component names refer to `src/components/`.

## P0 — Outro and Safari isolation

**Confirmed:** mobile can use `pinType: 'transform'`, `scrub: true`, a 540–960px pin distance and `blur(4px)` text inside `overflow: clip`. Inline `blur(0px)` remains after settlement. There is no reparenting; query-container ancestry is preserved.

Unused `wide`/`room` matchMedia conditions remain watched: crossing `min-height: 700px` recreates the context. Pin eligibility is captured at setup; distance uses `innerHeight` on refresh, while gaps use `svh`. Hero/Manifesto ResizeObservers request global refreshes. A refresh storm has **not** been measured.

**Local observation:** at 390×844, stage width 335px and font size 45.5px remained stable during pinning, with one pin spacer. At scrollY 8144, changing height alone to 680px retained that font size but changed stage height from 219.39px to 204.80px; line opacities changed from approximately .694/.289 to 1/.938. This reproduces viewport sensitivity, not Safari toolbar behavior or the reported stutter. Forward/reverse updates and final settlement worked locally.

**Hypotheses:** native-scroll/JS-pin synchronization, filtered glyph rasterization and viewport invalidation. Lenis is ineligible below 1024px or without fine pointer/hover. GSAP documents these risks: [native-scroll synchronization](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll()/), [resize tradeoffs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.config()/). Neither establishes this site's root cause. Do not start with global normalization or suppressed resizes.

**Recommended mobile endpoint:** unpinned natural-flow X/opacity convergence, retaining stagger/final composition and removing blur if isolation supports it. Ensure the end is reachable before document end. Keep desktop pinning and tablet footer progress gate; mobile footer stays disabled. Compare blur-only and pin-only changes separately first.

**Pink line: unverified.** Candidates are Hero's blurred duplicate text/even-odd masks, Manifesto's blurred words/clipped photo fields, Archive's words/clipped images, Outro's blur/clip and return's backdrop blur. The difference-blended header persists on mobile; the magnetic cursor is ineligible there.

Smallest test: identify chapter/word/gesture, then disable only its filter in Safari Remote Web Inspector, repeat, restore, and isolate clipping next. Test header blending/backdrop blur or fractional clipping only if relevant. This controlled WebKit isolation was unavailable. A GPU raster artifact remains a hypothesis; no blanket `translateZ(0)` workaround.

## P1 — Manifesto mobile/tablet reveal plan (not implemented)

At <600px, `.revealing-void` is `display:none` with a zero rect. LETS US and SEE. are stacked, separated by a 5px margin. There is no existing mobile photo aperture to animate. Tablet retains the flex interval but permits wrapping; its available bounds must be checked independently.

1. Make the decorative interval a reserved photo slot: a modest landscape band between mobile lines; tablet uses the measured gap or the stacked fallback. Review added height without changing typography/alignment.
2. Reuse `/images/archive/manifesto-barbican-1280.webp` (Ollie Singleton / Barbican; provenance: `public/images/archive/SOURCES.json`), intentionally cropped and decorative.
3. Extend existing Manifesto ownership with one small-screen reveal timeline, no pin/listeners for touch gestures. Candidate range: slot top 85%→55%, after typography receives its reading space. Latch completion so it stays revealed afterward.
4. Prefer an overflow-clipped translating wrapper with inverse image translation, keeping the photo plane stationary. Compare inset clipping only if WebKit profiling favors it; no blur/blend.
5. Default CSS is fully revealed with dimensions reserved. Reduced motion, JS-off, failure or initialization after the slot is reached preserve that state. Respect `data-reveal-ready`; desktop magnetism stays unchanged.

## Archive, readability and integration

- Archive source registers **20 scrub triggers** (two per record), **10 small-screen observation triggers**, and **up to 10 once-only entrances** depending on initial scroll position. This is 30–40 Archive registrations, not 40 concurrently active animations. No record-specific permanent RAF loop or per-frame layout read was found in those tweens.
- There are 73 observation words; mobile animates only ink layers. Word filters retain `blur(0px)`; caption filters are cleared. Test mobile word blur reduction first, keeping opacity/stagger. Zero blur need not cost the same as `none`.
- Transform ownership is already separate. Mobile figure travel totals 24–51px; internal drift is ±3–4% of the overscanned layer. Preserve these distinctions. Dimensions are reserved and images lazy/async loaded.
- Ten 800px variants total 628KB compressed, approximately 27.6MiB as RGBA surfaces before extra layers: **an estimate, not residency**. Local Chromium chose 480px variants for early records; inspect actual DPR 3 device `currentSrc`, decode and memory before changing srcsets/overscan.
- Mobile header occupied y25–57.38px; captions naturally pass beneath it. Observation exit uses viewport 15% (about 127px at 844px); this does not guarantee clearance of taller text blocks. Verify contrast/focused-credit clearance; avoid a header panel.
- Ownership is coherent by inspection: one eligible Lenis ticker, guarded controllers, shared lock through replay completion, navigation/HMR cleanup. No repeated-navigation leak measurement was made.
- Local 390×844 return completed at top with lock released, proxy removed and overlay hidden. Desktop 1440px reload ran/completed, resumed Lenis and retained 1425px page width through unlock. End navigation produced Outro/04, one pin and settled lines. No horizontal overflow or captured warnings/errors. Physical touch, iOS gutter support, cold loads and BFCache remain unvalidated.

## Small implementation phases and acceptance

**07B — P0 mobile Outro and Safari isolation.** First obtain versions/exact pink-line scene. Compare current, mobile blur-off, then mobile pin-off using identical device gestures. Remove unused height-query invalidation; profile refresh counts and causes. Keep genuine orientation/font refresh. Select the lowest-cost natural-flow solution only after comparison. Pass: both devices, forward/reverse/rapid input, toolbar shown/hidden, stable fonts/final rects, no pink seam; desktop 1440px unchanged.

**07C — Manifesto reveal.** Implement the reserved slot and transform reveal above after geometry review. Pass at 390/360/768px: no SEE. overlap, no pin, smooth left-to-right exposure, completion retained, correct static/reduced fallback; desktop cursor unaffected.

**07D — Archive and integration polish.** Profile representative landscape and portrait plus observation entry on device. Target text filters and unnecessary refresh first; change parallax/image overscan only with evidence. Check header safe reading zone. Pass: credits readable, no clipped image gaps, preserved rhythm, no new overflow, no offscreen animation loop or increased trigger count after repeat navigation.

**07E — Final cross-browser/device QA.** Use production preview on both named iPhones, Safari desktop where available, Chromium mobile and desktop 1440px. Capture short Web Inspector timelines (not an export/video campaign) for scroll/layout/paint and record measured long tasks/frame behavior without extrapolating desktop GPU results. Recheck JS-off, reduced motion, font/image failure, rotation, browser zoom, top/away history restoration and deep links. No build was needed or run for this documentation-only audit.

### Required real-device test sequence

1. Record iOS/browser version, viewport, display zoom/text size, Low Power Mode and initial toolbar position. Use the same production build and ordinary cache conditions.
2. Reload at top; try wheel-equivalent touch swipes and keyboard where available during Hero. Confirm lock through completion, then usable scrolling. Repeat cold/warm; inspect admission reason if skipped.
3. Scroll through Manifesto and representative Archive records at slow/fast speeds. Identify the exact pink-line scene before toggling properties. Inspect selected image variants and paint/decode work.
4. Reach Outro by scrolling from Archive, **not a direct `#outro` link**: direct links deliberately preserve static visible content and bypass first entrance. Reverse halfway; expand/collapse toolbar; rotate and return. Compare isolated blur/pin cases.
5. Return from settled Outro three times, including rapid touch input during replay. Verify top0, lock released only at Hero completion, no residual overlay/proxy, correct chapter/footer, one Outro pin in the baseline, and functional next trip. Then test back/forward away from top and reduced-motion/native anchor paths.

**Review blocker:** the pink line's affected element and dominant iPhone stutter cost cannot be established from Chromium. The smallest next input is the exact affected entrance plus device/iOS versions and an on-device property-isolation result. No production fix or mobile reveal was applied during this audit.
