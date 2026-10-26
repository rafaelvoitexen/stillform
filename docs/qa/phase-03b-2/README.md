# STILLFORM — Phase 03B.2 cinematic entrance

Implemented 26 October 2026. **Stopped for human creative review.** The Phase 03A.1/03B static Hero remains the final-frame authority.

## Review the complete entrance

| Viewport | Real playback | Final PNG |
| --- | --- | --- |
| 1440 × 900 | [Desktop video](playback/desktop-entrance.webm) | [Final](playback/desktop-07-settled.png) |
| 768 × 1024 | [Tablet video](playback/tablet-entrance.webm) | [Final](playback/tablet-07-settled.png) |
| 390 × 844 | [Mobile video](playback/mobile-entrance.webm) | [Final](playback/mobile-07-settled.png) |

These recordings use ordinary production loads, **without artificial stylesheet delays, admission bypasses, timeline seeking or frame interpolation**. They contain 296 / 273 / 263 actual Chrome screencast frames respectively. Videos encode those JPEG frames at recorded timestamps, with a short final hold for review. Only frames belonging to the current document's reservation and playback are retained; the previous page is excluded. PNGs are lossless visual evidence; video is lossy.

Production preview: [localhost:4324](http://localhost:4324/). Development preview: [localhost:4321](http://localhost:4321/). Missing the bounded readiness opportunity correctly produces the approved static Hero rather than a forced late intro.

## Seven identifiable keyframes

| Event | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Mineral canvas / initial vertical slit | [01](playback/desktop-01-slit.png) | [01](playback/tablet-01-slit.png) | [01](playback/mobile-01-slit.png) |
| STILL / FORM entering during wipe | [02](playback/desktop-02-identity-in.png) | [02](playback/tablet-02-identity-in.png) | [02](playback/mobile-02-identity-in.png) |
| Full centered photograph | [03](playback/desktop-03-expanded.png) | [03](playback/tablet-03-expanded.png) | [03](playback/mobile-03-expanded.png) |
| Slow scale in progress | [04](playback/desktop-04-scale.png) | [04](playback/tablet-04-scale.png) | [04](playback/mobile-04-scale.png) |
| Coordinated scale / position transfer | [05](playback/desktop-05-transfer.png) | [05](playback/tablet-05-transfer.png) | [05](playback/mobile-05-transfer.png) |
| Headline and small wordmark entering | [06](playback/desktop-06-headline.png) | [06](playback/tablet-06-headline.png) | [06](playback/mobile-06-headline.png) |
| Secondary information and exact static frame | [07](playback/desktop-07-settled.png) | [07](playback/tablet-07-settled.png) | [07](playback/mobile-07-settled.png) |

Capture timestamps, transforms and measured rectangles are in the [desktop](playback/desktop-states.json), [tablet](playback/tablet-states.json) and [mobile](playback/mobile-states.json) state logs. Screenshot acquisition adds latency; use their actual timestamps rather than treating the requested capture positions as exact timeline seeks.

## Implementation and two-pass process

The source now has one coherent owner:

- `src/scripts/hero-admission.js`: small synchronous head reservation, once-per-document latch, asset readiness, input interruptions and independent deadlines.
- `src/styles/hero-critical.css`: inline critical concealment and independent CSS fail-open safeguards; no static geometry changes.
- `src/scripts/hero-entrance.ts`: one labeled GSAP timeline, one decorative photo proxy, temporary identity, scale/transfer, final text and cleanup.
- `src/scripts/hero.ts`: existing layout/failure behavior and lifecycle coordination. It distinguishes initial font readiness from an actual text-size interruption while reserved.
- `src/components/Hero.astro` and `src/pages/index.astro`: replace the superseded shutter/pre-paint race with the new bootstrap and controller. Existing semantic markup, local assets, final colors/type/copy and responsive dimensions remain.

**Pass 1** implemented and inspected only the centered proxy, vertical/horizontal aperture, identity, continuous scale, transfer and handoff. [Spatial-pass evidence](pass-1/audit.json) and its screenshots are retained. That pass revealed that a constant protected central 44% band could leave parts of the identity dark on concrete. The color mask was refined against the unchanged photo's light corridor.

**Pass 2** added the final line choreography, wordmark and secondary information after spatial validation. Inspection also caught a scoped-background specificity conflict that painted a second desktop ABSENCE. shape. The running-only parent background override removes that duplicate; final static background styling is restored on cleanup. Final recordings contain the correction.

No dependency, React island, ScrollTrigger, other chapter, cross-section transition or interaction system was added. Creative handoff documents and previous evidence remain untouched.

## Authored timeline and easing

All times below are seconds from playback start. The 450ms reservation is a ceiling and never an artistic hold.

| Event / label | Desktop | Tablet | Mobile | Treatment |
| --- | --- | --- | --- | --- |
| `canvas`, `wipe` | 0–0.80 | 0–0.65 | 0–0.65 | Top-to-bottom 8% aperture, power2.inOut |
| `identityIn` | STILL 0.30, FORM 0.40; 0.70 each | 0.22 / 0.30; 0.58 each | Same as tablet | Opacity + 5px / 3px blur to zero, power2.out |
| `expand` | 0.80–1.60 | 0.65–1.30 | 0.65–1.30 | Symmetric horizontal aperture, power2.inOut |
| `scale` | **1.10–4.10, 0.90→1** | **0.95–3.55, 0.92→1** | **0.95–3.20, 0.94→1** | Uniform scale, sine.inOut |
| `identityOut` | 2.20–2.70 | 2.10–2.50 | 1.75–2.15 | Fade/blur, power2.inOut; chalk finishes 0.10s / 0.08s earlier |
| `transfer` | 2.55–4.10 | 2.35–3.55 | 2.00–3.20 | Center to measured final frame, power2.inOut |
| `handoff`, `headline` | 4.10 | 3.55 | 3.20 | Atomic image handoff; BUILT starts immediately |
| AROUND / ABSENCE. starts | 4.28 / 4.48 | 3.67 / 3.81 | 3.32 / 3.46 | Individual authored offsets, no letter cascade |
| Headline duration | 0.85 | 0.72 | 0.72 | Opacity, 4px / 2px blur, 0.18 / 0.12 line-height y travel; power2.out |
| `wordmark` | 4.28–4.88 | 3.67–4.17 | 3.32–3.82 | Opacity + 2px blur, power2.out |
| `secondary` | 5.18–5.58 | 4.38–4.72 | 4.03–4.37 | Simultaneous opacity + 1.5px / 1px blur, power1.out |
| `settled` | **5.58** | **4.72** | **4.37** | Revert inline motion styles and remove temporary layers |

The desktop length intentionally exceeds the older 3.45s proposal. A genuine 3s scale overlaps the fully opening image, readable identity and 1.55s transfer. Completing scale/transfer together before the final headline prevents a moving photo boundary from conflicting with ABSENCE. The ending has no additional hold or ambient motion. Tablet/mobile shorten the scale and retain their own authored composition.

Recorded wall-clock totals are approximately 5.55 / 4.72 / 4.37s; small differences from authored values reflect initialization, display ticks and recording overhead. See [motion verification](motion-verification.json).

## Slow-scale and spatial continuity

The real figure remains in document flow. Its final rectangle is measured only after Onest readiness and the existing fit guard. The proxy is created with exactly those dimensions, the same local JPEG, `object-fit: cover` and 50% 50% positioning. Neither width nor height is tweened.

One pose object holds x, y and a **single uniform scale**. One master-timeline update writes the combined translate/scale transform; there is no independent DOM transform tween competing with it. The transform origin is the frame center. Initial x/y align that center with the viewport center, so scaling cannot drift its apparent center. On short screens the starting scale also includes the uniform fit factor from the blueprint; it still ends at exactly 1.

Scale becomes perceptible as lateral expansion completes, without a new tween starting at that boundary. Translation begins later while the same scale continues. At `handoff`, x/y are explicitly zeroed and scale is explicitly set to 1. The real figure becomes visible and the matching proxy disappears in one synchronous timeline transaction, before the main heading enters. No dissolve, crop change, independent image zoom or perspective transform is used.

Measured centered-phase drift between keyframes 03/04 is 0px desktop/mobile and about 0.00002px tablet, within numerical rounding. The final static geometry and pixels match exactly.

## Temporary identity and contrast

STILL and FORM use local Onest Variable 500. STILL targets 66.7% of usable desktop composition width; FORM is right-aligned at the same type size. Tracking is fixed at +0.06em and leading 0.95. Stacked screens target 90%, with +0.025em and 1.00 leading. Both words and the 72%-viewport-height ceiling are measured once after font readiness; enlarged user text uses the static fallback instead of being scaled down.

Two registered decorative copies provide graphite/chalk contrast. The chalk copy is intersected with the current rectangular aperture and an authored light-corridor mask in the original image's source coordinates. The protected bright shaft stays graphite. No blend mode, outline, tint or new color is used. The identity remains stationary during photographic expansion and scale. Its color registration freezes for the short exit; chalk resolves slightly earlier before appreciable lateral travel.

The first implementation used live SVG geometry. Profiling identified unnecessary local SVG layout; the final implementation paints the same geometry with CSS clipping paths. Unsupported path clipping declines the entrance and exposes the static Hero. There are no per-frame layout reads or live SVG nodes in production.

## Loading and interruption validation

The approved state model replaces Phase 03B's pre-paint asset race: **static → reserved → running → settled**, or **reserved → static-final**. The head bootstrap may reserve before Hero content paints; assets need not beat that first paint. Independent JS and critical CSS fail open if the owner does not arrive.

- Reservation ceiling: **450ms**, installed before the concealment flag.
- Running ceiling: **6200ms** in both JS and CSS. This deliberately replaces the blueprint's old 4200ms safety ceiling because the approved slow-scale extension now ends at 5580ms. It is a failure ceiling, not a timeline delay.
- Claim is rejected if the deadline elapsed, CSS already failed open, readiness failed, geometry/text is unsuitable or the visit is terminal. Late modules/assets cannot re-hide content.
- Every input interruption settles first without cancelling the input. There is no scroll lock, focus trap, replay button or production QA bypass.

**Final-code cold/warm reliability:** [24/24 admissions](reliability.json), comprising two cache-bypassed cold and two warm loads at each of 1440, 1280, 1024, 768, 390 and 360px. Reservation-to-start ranged **40.3–76.7ms** on this local production server. No artificial CSS delay or retries were used. This measures this environment; slower remote networks can correctly miss the 450ms window.

Validated cases include:

- Normal completion, scroll away and return without replay, viewport resize, 200% text change, pointer/wordmark activation, reduced-motion changes and history restoration.
- Native focus on the photographer link settles and exposes a visible focus ring. The first focus attempt in an inactive headless document did not dispatch native focus; [the explicitly activated-tab check](focus.json) confirms the actual behavior. The raw result is preserved rather than relabeled.
- Keyboard and text resize during reservation; delayed/failed module; font/image delays and failures; decode rejection; thrown setup error; CSP-blocked bootstrap; reload during readiness.
- JS disabled and reduced motion show the approved static Hero immediately; their full-page mobile PNGs are pixel-identical to the static baseline.
- CSS-only reservation and running safety were tested by disabling script execution after the relevant state began. Content becomes readable and the overlay becomes invisible without a JS callback. Browser-computed identity matrices/zero-blur values can remain until JS cleanup resumes; they are visually neutral. Normal completion removes the inline properties entirely.
- Exactly one semantic h1 and one semantic image remain. The temporary identity/photo root is aria-hidden and pointer-transparent. Accessibility tree exposes only the real STILLFORM and E Vos links; temporary lettering adds no announced duplicate content.
- No horizontal overflow was recorded, including text-resize and failure cases. No indefinite blank state or late readable-to-hidden flash was observed.

Raw results: [validation](validation.json), [summary](validation-summary.json), [native focus](focus.json). Runtime exception count in the completed suite: **0**.

## Final-frame regression

Settled PNGs match the approved Phase 03B baseline pixel for pixel at **1440×900, 1280×800, 1024×768, 768×1024, 390×844, 360×780 and 1600×1000**, plus 320, 600 and 900px checks. Additional short-screen and 200% text checks preserve natural vertical growth.

The three recorded final frames also match exactly. See [pixel regression](pixel-regression.json), [geometry/reliability audit](regression.json), [settled captures](settled/) and the retained [previous static evidence](../phase-03b/settled/audit.json).

## Performance and build

Uncaptured playback was profiled separately from screencast recording. Traces and measurements are local headless Chrome 156, with the QA launch's GPU-disabled/software rendering and mobile viewport emulation. They do **not** certify physical-device presentation rates.

| Observation | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Running rAF samples | 333 | 283 | 262 |
| Median / p95 interval | 16.7 / 16.7ms | 16.7 / 16.8ms | 16.7 / 16.7ms |
| Intervals over 33.4ms | 0 | 0 | 0 |
| Recorded tasks over 50ms | 0 | 0 | 0 |
| CLS | 0 | 0 | 0 |
| Layout events after mask optimization | 7 | 7 | 7 |
| Maximum individual Paint event | 1.12ms | 0.27ms | 0.23ms |
| Maximum individual RasterTask | 4.23ms | 5.30ms | 3.21ms |

The earlier SVG version produced 136 / 132 / 112 local layout events. The final CSS path version removes that per-frame SVG layout work; remaining events are concentrated in preparation and cleanup. Raster totals span multiple worker threads and must not be interpreted as wall-clock duration. rAF intervals are scheduling evidence, not a direct count of physical presentation drops.

See [final performance](performance.json), [before optimization](performance-before-mask-optimization.json), and the desktop/tablet/mobile trace JSON files. Application code animates pose, clip and bounded text only, then stops; it has no recurring ambient animation or duplicate timeline.

Production `astro build` passed, one static page. `git diff --check` passed. No dependencies were installed. Astro/Vite compiles the TypeScript; the repository has no separate configured type-check command.

## Remaining creative review and limitations

The extended 5.58s desktop rhythm is the main artistic decision to judge: it preserves a perceptible, readable centered identity and a genuine slow scale rather than compressing the sequence into the superseded 3.45s target. Tablet/mobile end sooner. No unresolved crop jump, scale jump, center drift, exposed image edge or final color-boundary issue was found in the inspected recordings.

The authored identity contrast boundaries and fixed tracking remain subject to frame-by-frame creative approval. They do not change the approved final Hero. Deliberately late font loading may still reflow fallback metrics as in the previous static implementation; the entrance does not conceal or fit that away.

Safari, Firefox, physical phones/tablets, screen-reader listening and hardware presentation/drop profiling remain unverified. Unsupported CSS path masking, enlarged text, reduced motion and missed readiness all retain the readable final composition. Loading reliability measured here is not a guarantee for every network/device.

Scope ends here. No Manifesto, Archive, Outro, Hero-to-Manifesto transition, ScrollTrigger or additional interaction system was implemented.

QA sources: [record](record.mjs), [regression](regression.mjs), [reliability](reliability.mjs), [validation](validate.mjs), [profile](profile.mjs), [encoding](encode-videos.mjs), [CDP helper](cdp.mjs). These run against the local production preview and a dedicated Chrome debugging endpoint; they do not modify production timing to obtain playback.
