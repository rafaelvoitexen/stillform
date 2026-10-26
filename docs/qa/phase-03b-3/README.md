# STILLFORM — Phase 03B.3 cinematic motion refinement

26 October 2026. **Implementation complete; stopped for human creative review.** The approved static Hero remains the final-frame authority.

## Before / after playback

| Viewport | Phase 03B.2 | Phase 03B.3 | Final PNG |
| --- | --- | --- | --- |
| 1440 × 900 | [Before](../phase-03b-2/playback/desktop-entrance.webm) | [After](playback/desktop-entrance.webm) | [Final](playback/desktop-08-settled.png) |
| 768 × 1024 | [Before](../phase-03b-2/playback/tablet-entrance.webm) | [After](playback/tablet-entrance.webm) | [Final](playback/tablet-08-settled.png) |
| 390 × 844 | [Before](../phase-03b-2/playback/mobile-entrance.webm) | [After](playback/mobile-entrance.webm) | [Final](playback/mobile-08-settled.png) |

[Production preview](http://127.0.0.1:4324/) · [Background Astro dev server](http://127.0.0.1:4322/). Reload for a new eligible entrance.

Final videos were captured with normal GPU compositing enabled: **202 / 167 / 320 actual Chrome screencast frames**. Export retains **131 / 111 / 164 original frames** at their recorded timestamps, dropping surplus high-refresh samples without inventing intermediate frames, and adds a 700ms final hold. They use normal production loads: **no artificial stylesheet delay, admission bypass, timeline seeking or frame interpolation**. Video capture was separate from lossless PNG acquisition to avoid screenshot readbacks interrupting playback. CDP capture/encoding cadence can be lower than uncaptured playback; this is not physical-display presentation certification. The earlier software recordings are retained as playback/software-desktop-entrance.webm and corresponding tablet/mobile files. The lossless keyframes and pixel regression use the original software-rendered baseline environment. See [continuous recording audit](continuous-recording-audit.json), [capture source](record-playback-gpu.mjs) and [encoder](encode-videos.mjs).

The exported files were decoded independently and their visible phases inspected: [encoded-video validation](encoded-video-validation.json). A first GPU-based export froze the desktop canvas despite correct raw frames; the final encoder now decodes one bitmap at a time, releases it immediately, emits explicit capture frames and verifies the final hold. No frozen export is used as the final deliverable.

## Eight identifiable moments

| Moment | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Initial slit | [01](playback/desktop-01-slit.png) | [01](playback/tablet-01-slit.png) | [01](playback/mobile-01-slit.png) |
| STILL from the right | [02](playback/desktop-02-still.png) | [02](playback/tablet-02-still.png) | [02](playback/mobile-02-still.png) |
| FORM from the left | [03](playback/desktop-03-form.png) | [03](playback/tablet-03-form.png) | [03](playback/mobile-03-form.png) |
| Centered frame / inner zoom | [04](playback/desktop-04-inner-zoom.png) | [04](playback/tablet-04-inner-zoom.png) | [04](playback/mobile-04-inner-zoom.png) |
| Identity fading | [05](playback/desktop-05-identity-exit.png) | [05](playback/tablet-05-identity-exit.png) | [05](playback/mobile-05-identity-exit.png) |
| Transfer + headline | [06](playback/desktop-06-transfer-headline.png) | [06](playback/tablet-06-transfer-headline.png) | [06](playback/mobile-06-transfer-headline.png) |
| Moving ABSENCE. boundary | [07](playback/desktop-07-moving-intersection.png) | [07](playback/tablet-07-moving-intersection.png) | [07](playback/mobile-07-moving-intersection.png) |
| Settled Hero | [08](playback/desktop-08-settled.png) | [08](playback/tablet-08-settled.png) | [08](playback/mobile-08-settled.png) |

Actual capture times and geometry: [desktop](playback/desktop-states.json), [tablet](playback/tablet-states.json), [mobile](playback/mobile-states.json). PNG readback adds latency; requested capture times are not exact presentation times. Playback was never sought or paused. Consecutive real captured frames and continuous sampling were inspected for continuity.

## Changed application files

- [hero-admission.js](../../../src/scripts/hero-admission.js): per-entry admission, BFCache replay and native scroll restoration; no persistent visit suppression.
- [hero-entrance.ts](../../../src/scripts/hero-entrance.ts): independent inner zoom and outer pose, opposing identity travel, corrected masks, concurrent headline/transfer, larger line offsets and cleanup.
- [hero-critical.css](../../../src/styles/hero-critical.css): independent CSS fail-open safeguards for runtime masks and desktop text colors.

Hero.astro, hero.ts, page/global styles, assets and package files were not changed during this refinement. Previous creative documents, recordings and unrelated uncommitted changes were preserved. Source snapshots: [entrance before](entrance-before.ts.txt), [admission before](admission-before.js.txt). No dependencies or website sections were added.

## Timing comparison

Times below are seconds from playback, excluding readiness. Tablet is the approved stacked layout at 768px; mobile uses the stacked choreography below 600px.

| Event / label | Desktop | Tablet | Mobile | Treatment |
| --- | --- | --- | --- | --- |
| canvas / wipe | 0–0.80 | 0–0.65 | 0–0.65 | Vertical 8% slit, power2.inOut |
| identityIn: STILL / FORM starts | 0.30 / 0.65 | 0.22 / 0.54 | 0.22 / 0.54 | power2.out |
| Identity duration per word | 1.05 | 0.92 | 0.88 | Opacity, 5px / 3px blur → 0 |
| STILL / FORM X travel | +100 / −100px | +55 / −55px | +32 / −32px | Resolves to 0; fixed type metrics |
| expand | 0.80–1.60 | 0.65–1.30 | 0.65–1.30 | Horizontal aperture, power2.inOut |
| zoom: 1 → peak | 0.80–2.25, 1.08 | 0.65–2.00, 1.06 | 0.65–1.90, 1.045 | Inner image only, sine.inOut |
| zoomReturn: peak → 1 | 2.25–4.00 | 2.00–3.35 | 1.90–3.15 | sine.inOut |
| identityOut | 2.15–2.60 | 1.80–2.20 | 1.65–2.05 | Simultaneous fade/blur, power2.inOut |
| transfer AND headline / BUILT | 2.60 | 2.20 | 2.05 | Same timeline start |
| Transfer duration | 1.40 | 1.15 | 1.10 | Outer pose, power2.inOut |
| AROUND / ABSENCE. starts | 2.90 / 3.20 | 2.47 / 2.75 | 2.30 / 2.57 | Individual authored positions |
| Main line duration | 0.95 | 0.82 | 0.80 | power2.out; opacity, 4px / 2px blur → 0 |
| Main line X | −75px → 0 | −45px → 0 | −32px → 0 | No Y translation, rotation or scale |
| wordmark | 2.78–3.38 | 2.32–2.82 | 2.17–2.67 | Opacity + 2px blur, power2.out |
| handoff | 4.00 | 3.35 | 3.15 | Inner scale 1; atomic proxy/real-photo replacement |
| secondary | 4.03–4.43 | 3.45–3.79 | 3.25–3.59 | Simultaneous opacity/blur, power1.out |
| settled | **4.43** | **3.79** | **3.59** | Original static styles, temporary DOM removed |
| Previous total | 5.58 | 4.72 | 4.37 | Phase 03B.2 |
| Reduction | **1.15** | **0.93** | **0.78** | Overlap removes the previous headline wait |

One master GSAP timeline has labels canvas, wipe, identityIn, expand, zoom, zoomReturn, identityOut, transfer, handoff, headline, wordmark, secondary and settled. No independent zoom loop or ambient animation exists. Continuous sampling measured about 4.39 / 3.79 / 3.59s; small differences reflect tick alignment and observation overhead.

## Inner zoom and spatial continuity

The outer proxy owns the measured photographic dimensions, centered position, rectangular aperture and transfer. Its only scale is uniform responsive fit on unusually short screens; that fit is 1 at the required viewports. It receives no cinematic zoom.

A child image owns **1 → 1.08 → 1** desktop, **1 → 1.06 → 1** tablet and **1 → 1.045 → 1** mobile. Zoom begins with horizontal expansion. Both keyed tweens belong to the master timeline, continuing through identity exit and transfer. Object-fit: cover, object-position: 50% 50% and center-center transform origin stay fixed. Scale never falls below 1, so no empty edge is exposed. Width and height are never independently animated.

The curve has a smooth zero-velocity peak, not a timed hold. The restrained return overlaps the much larger positional transfer. At handoff, inner scale is exactly 1 and the outer frame is at final measured geometry before the real photo replaces it in the same render transaction.

[Continuous motion verification](motion-verification.json) and [summary](motion-summary.json) confirm the peaks, constant centered dimensions within 0.0001px floating-point precision, and the main headline becoming visible while the proxy still exists. Last sampled pre-handoff scales were 1 or 1.0001; the actual authored endpoint is exactly 1. No crop jump, focal drift or exposed edge was found in the inspected actual frames.

## Lettering masks and headline registration

The light-corridor logic is removed. Temporary identity uses a graphite layer behind the opaque photograph and an identical white layer above it, clipped to the current outer aperture. The photograph naturally occludes graphite strokes. Every visible stroke over it is white; outside it stays graphite. Glyph counters are naturally transparent. Each pair shares one X/opacity/blur driver and identical fixed font geometry. The white mask updates throughout the fade; both identity layers are removed only once their exit finishes at transfer.

[Desktop before / after](desktop-identity-before-after.png) and [mobile before / after](mobile-identity-before-after.png) show the corrected LL and O. Reduced contrast over the bright opening is the accepted consequence of the strict white-over-photo rule.

The original semantic headline remains one accessible h1. Aria-hidden white copies use identical measured font metrics and the same per-line motion driver. Their common mask follows the actual visible outer frame, including aperture and transfer. It never follows inner zoom. Temporary wrappers clip graphite outside the same rectangle, after blur, preventing dark edge leakage. White copies remain registered after image handoff until text settlement, then copies and wrappers are removed. No changing text gradient is used during motion; the original static hard boundary returns on cleanup or CSS emergency fallback.

[Actual moving-boundary filmstrip](desktop-moving-boundary-filmstrip.png) spans transfer and handoff. [Frame 06](playback/desktop-06-transfer-headline.png) shows headline and photo arriving together; [frame 07](playback/desktop-07-moving-intersection.png) shows the moving ABSENCE. boundary. Measured white/base rectangle mismatch was **0px** at all three viewports.

Review caught a context-reversion callback repainting initial headline values after cleanup. Rendering is now disabled before context reversion. Completion and interruptions restore all words with no leftover transforms, filters, overlays or runtime wrappers.

## Replay, interruption and fallback validation

Final normal production admissions: **24/24**, six widths with two cold/cache-disabled and two warm attempts each. Reservation-to-start: **28.8–70.5ms**, under the unchanged 450ms ceiling. **No normal attempt skipped.** No QA delay or timing bypass was used. Raw results: [reliability.json](reliability.json).

[Native replay](replay.json) confirms fresh navigation, reload, navigation away/new entry, BFCache back to top and forward to top all play. Returning away from top preserves the actual restored 45px mobile scroll position and skips with history-away-from-top. Returning to zero in the same entry does not replay; a later new history entry at zero does. [Non-BFCache history](replay-no-bfcache.json), tested in isolated Chrome with BFCache disabled, confirms equivalent document reload/restoration behavior. Admission waits for native pageshow scroll restoration within the same bounded reservation.

There is no localStorage/sessionStorage flag or session-wide lock. Only duplicate initialization within a current entry is prevented. Permanent pageshow/pagehide hooks establish a fresh BFCache lease and record outgoing scroll. No scroll position is forced or locked.

[First restored paint](history-paint.json): the second entry starts normally. Its first 12 actual frames begin with mineral/slit, not the settled Hero. No visible final-to-hidden flash was observed. [First](history-frames/0.jpg), [next](history-frames/1.jpg), [third](history-frames/2.jpg).

The [27-case validation suite](validation.json) recorded **0 runtime exceptions** and covered:

- Completion, scroll cancellation/no replay, native focus, pointer/wordmark activation, resize, 200% text change and reduced-motion change.
- Immediate readable static HTML with reduced motion or JavaScript disabled.
- Keyboard/text resize during reservation; runtime delay/failure; asset delay; font/image failure; decode rejection; caught setup failure; CSP-blocked bootstrap; reload during readiness.
- Independent CSS reservation/running deadlines by stopping script execution mid-state. Content returns without callbacks and overlays become invisible. If JS is stopped, inert temporary DOM may remain until execution resumes; it cannot conceal or obstruct content. Normal completion/interruption actually removes it.
- Accessibility tree: one h1 named Built around absence., plus the real STILLFORM and E Vos links. Decorative copies are aria-hidden and pointer-transparent.

Forced delay/failure reasons were reservation-deadline, image-decode-failure, font-failure and setup-failure; reduced motion used reduced-motion. Late assets/runtime did not conceal readable content again. Script/CSP-disabled cases had no admission state and showed HTML normally. These intentional failures are separate from ordinary admission counts.

[Final desktop fallbacks](final-fallbacks.json) additionally verify CSS-only expiry restores the approved ABSENCE. color boundary, immediate reduced motion works even with JS stopped, and unsupported path masking skips cleanly with mask-unsupported. [CSS-only desktop](desktop-css-running-expiry.png) and [CSS reduced-motion desktop](desktop-reduced-motion-css-immediate.png) retain readable final geometry.

## Pixel regression and responsive checks

**All seven requested sizes match the approved static PNGs pixel for pixel**: 1440×900, 1280×800, 1024×768, 768×1024, 390×844, 360×780 and 1600×1000. Viewport and full-page captures match. Additional 320, 600 and 900px captures also match. All three final recorded PNGs on the final implementation are exact matches: [recorded parity](recorded-final-parity.json). See [pixel regression](pixel-regression.json), [geometry audit](regression.json), [settled PNGs](settled/).

320px reflow, 600/900px intermediates, 1440×500 short-screen and 200% text preserve natural height and readable metadata. No body overflow concealment was added. Header alignment, authored mobile photo offset and overlap remain unchanged.

No running or settled horizontal overflow was measured. Two early pre-stylesheet reserved DOM probes, at 18/26ms, did report overflow before blocking CSS/layout readiness; this was not painted overflow. Those raw observations remain in the audit rather than being hidden with body clipping. Deliberately late/missing fonts can still change fallback metrics as in the approved static implementation.

## Performance and build

Uncaptured playback was profiled separately. Environment: **real headless Chrome 156 through Chrome DevTools Protocol, GPU disabled/software rendering, emulated viewports**. A Chrome DevTools MCP connector was unavailable. These measurements do not certify physical-device presentation.

| Observation | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Running rAF samples | 188 | 223 | 214 |
| Median / p95 interval | 16.7 / **33.4ms** | 16.7 / 16.8ms | 16.7 / 16.7ms |
| Maximum interval | 50.1ms | 33.4ms | 33.3ms |
| Intervals >33.4ms | 21 | 1 | 0 |
| Tasks >50ms | 0 | 0 | 0 |
| CLS | 0 | 0 | 0 |
| Layout events | 10 | 9 | 10 |
| Maximum Paint event | 1.02ms | 0.31ms | 0.27ms |

[Final performance](performance.json), [before promotion](performance-before-promotion.json), [before identity occlusion](performance-before-identity-occlusion.json), and desktop/tablet/mobile trace JSONs retain measurements. Temporary compositor hints and natural occlusion reduced raster workload, but **did not establish consistent 60fps desktop playback in software rendering**. Raster totals sum worker threads, not wall-clock duration. rAF gaps are scheduling observations, not measured physical presentation drops.

### Accelerated follow-up

The software desktop gaps prompted a second, normal GPU-enabled Chrome session. [GPU information](gpu-info.json) confirms Intel UHD Graphics with GPU compositing and rasterization enabled. Uncaptured [GPU profiles](performance-gpu.json) and an additional [warm desktop profile](performance-gpu-warm.json) measured:

| Run | Median / p95 | Maximum interval | Intervals >33.4ms | Long tasks | CLS |
| --- | --- | --- | --- | --- | --- |
| Desktop, first run | 6.9 / 14.0ms | 90.5ms | 6 | 0 | 0 |
| Desktop, warm | 7.0 / 14.2ms | 69.4ms | 3 | 3 | 0 |
| Tablet | 6.9 / 7.1ms | 20.8ms | 0 | 0 | 0 |
| Mobile | 6.9 / 7.1ms | 13.9ms | 0 | 0 | 0 |

The warm desktop's three long tasks were 101 / 52 / 55ms near startup. Accelerated p95 is materially steadier than software rendering, but isolated desktop peaks remain. No perfect frametime or physical presentation guarantee is claimed. Trace files with -gpu and -gpu-warm suffixes retain the full evidence. Viewports remain emulated; this is not a physical phone/tablet test.

Layout measurements are cached before playback; the render function writes styles without per-frame layout reads. No full-screen filter, geometric distortion or additional animation library was introduced. Temporary hints, masks, filters, proxy and timeline context are disposed after settlement. No recurring custom animation loop remains.

Production **astro build passed**, one static page, no errors. **git diff --check passed** (existing LF/CRLF notices only). Astro/Vite compiles TypeScript; no separate type-check command is configured and no dependency was installed. Development browser smoke check completed with all three line opacities 1, transforms none and zero runtime wrappers.

The first direct dev background launcher ended with its short-lived shell. Relaunching via Windows Start-Process in hidden mode, still using Astro's required --background flag, persisted successfully; astro dev status confirmed it. Development review is at port 4322; production evidence uses port 4324.

## Remaining human review

The strict white-over-bright-aperture contrast and subtle zoom-return curve remain artistic judgments. No dark corridor patch, mismatched glyph, crop jump, exposed edge or final composition deviation was found in the inspected final sequence.

Actual displayed desktop smoothness remains a human-review point: accelerated headless playback has a much steadier p95 but still shows isolated scheduling peaks. Software rendering is slower. Safari, Firefox, physical phones/tablets, screen-reader listening and display presentation/drop measurement remain unverified.

Scope stops for creative review. No Manifesto, Archive, Outro, cross-section transition, ScrollTrigger, dependency or static redesign was added.
