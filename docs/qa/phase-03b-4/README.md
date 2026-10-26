# STILLFORM — Phase 03B.4 review

26 October 2026. **Implemented; stopped for human creative review.** The cinematic narrative remains approved. The new fluid layout/crop baseline and ABSENCE intensity are candidates for approval; variant B is provisional.

[Production preview](http://127.0.0.1:4324/) · [Background Astro development server](http://127.0.0.1:4323/). Reload for a new eligible entrance.

## Review first

- [1440px before / after](1440-before-after.png).
- ABSENCE comparisons: [desktop A/B](variants/1440x900-comparison.png), [mobile A/B](variants/390x844-comparison.png), [2560px A/B](variants/2560x1440-comparison.png).
- Crop exploration: [1.06 at 1440](variants/1440-zoom-1.06.png), [1.08 at 1440](variants/1440-zoom-1.08.png), [1.06 at 3440](variants/3440-zoom-1.06.png), [1.08 at 3440](variants/3440-zoom-1.08.png). **1.06 is implemented** to retain more architectural detail and source-pixel headroom. Mobile ends at 1.03; tablet at 1.04.

| Actual viewport | Complete native video | Static candidate |
| --- | --- | --- |
| [1440 × 900](baseline/1440x900.png) | [Desktop](playback/desktop-entrance.webm) | [PNG](baseline/1440x900.png) |
| [2560 × 1440](baseline/2560x1440.png) | [Large desktop](playback/large-entrance.webm) | [PNG](baseline/2560x1440.png) |
| [3440 × 1440](baseline/3440x1440.png) | [Native ultrawide](playback/ultrawide-entrance.webm) | [PNG](baseline/3440x1440.png) |
| [390 × 844](baseline/390x844.png) | [Mobile](playback/mobile-entrance.webm) | [PNG](baseline/390x844.png) |

**For judging smoothness, also use the [lighter ultrawide review video](playback/ultrawide-review-entrance.webm).** It records the same real 3440×1440 layout, captured at 1920×804. Native full-resolution screencast readback substantially lowers capture cadence; the lighter copy contains 202 actual source frames versus 57 in the native ultrawide stream. It does not resize the CSS viewport, seek the timeline or interpolate motion.

Native recordings contain 237 / 63 / 57 / 342 actual frames respectively. Playback at 1920×1080 and 768×1024 was also captured and inspected; their raw frames/state logs remain in playback/. All captures use ordinary production admission, with no artificial stylesheet delay or timing bypass. The final exporter preserves captured timestamps on a 60fps clock by holding each actual JPEG until the next captured frame (at most 16.7ms quantization), then holds the settled image for 700ms. No intermediate poses are synthesized. Offline encoding avoids the time stretching observed with browser canvas export at large resolutions.

Exported native dimensions and durations were decoded independently: **1440×900 / 5.067s, 2560×1440 / 5.250s, 3440×1440 / 5.250s, 390×844 / 4.367s**. Video duration includes capture lead-in and the review hold; authored motion remains 4.43 / 3.79 / 3.59s. [Recording audit](continuous-recording-audit.json), [lighter-copy audit](review-proxy-audit.json), [encoding audit](encoding-audit.json), [decoded video validation](encoded-video-validation.json). Eight decoded moments per video are saved as playback/*-video-check-0.png through -7.png; video is lossy, so use baseline PNGs for image/ink inspection.

## Fluid layout and alignment

The global 1440px cap is removed. The full-width page exposes shared responsive gutters; reading copy retains its 32ch maximum. Photo width is jointly constrained by available horizontal space, viewport height and the native asset budget, preserving the 655.2:650 wide-frame aspect ratio. Metadata stays at its existing reading sizes. Header columns span the usable viewport; captions share photo tracks, and the footer's middle text stays centered on the viewport.

The 1440px anchor retains photo x=748.8, y=112, about 655.2×650, 176px headline type and the original three-line silhouette. Header descriptor distribution shifts about 3px as it becomes a fluid grid column. Above that anchor, display type and image grow at different rates. On short ultrawide screens the photo becomes height-bounded, and ABSENCE deliberately shifts independently to end a controlled distance inside the actual photo boundary. Its end alignment is native CSS grid, not an assumed fixed word width or per-frame layout measurement. [Full layout contract and formulas](../../creative/HERO_FLUID_SYSTEM.md).

| Viewport | Photo frame, rounded | Display type | ABSENCE photo overlap |
| --- | --- | --- | --- |
| [360 × 780](baseline/360x780.png) | 272 × 365 | 66.5 / 62.8px | Authored stacked treatment |
| [390 × 844](baseline/390x844.png) | 298 × 400 | 72 / 68px | Authored stacked treatment |
| [768 × 1024](baseline/768x1024.png) | 617.6 × 500 | 128 / 120.8px | Authored stacked treatment |
| [1024 × 768](baseline/1024x768.png) | 465.9 × 462.2 | 125.2px | 56px |
| [1280 × 800](baseline/1280x800.png) | 582.4 × 577.8 | 156.4px | 69.4px |
| [1440 × 900](baseline/1440x900.png) | 655.2 × 650 | 176px | 78.1px |
| [1600 × 1000](baseline/1600x1000.png) | 728 × 722.2 | 195.6px | 86.8px |
| [1920 × 1080](baseline/1920x1080.png) | 836.6 × 830 | 234.7px | 104.1px |
| [2560 × 1440](baseline/2560x1440.png) | 1164.8 × 1155.5 | 312.9px | 138.8px |
| [3440 × 1440](baseline/3440x1440.png) | 1199.5 × 1190 | 368.9px | 163.7px |
| [3840 × 1600](baseline/3840x1600.png) | 1344 × 1333.3 | 413.3px | 183.4px |

All eleven viewport and full-page PNGs are in [baseline/](baseline/). Mobile/tablet offset, 12px maximum backing overlap, typography and natural height are preserved. A font-aware container condition provides CSS-only stacked reflow when text is enlarged. The existing JS fit guard remains additional protection. An independently bounded source-aspect photograph prevents a wide enlarged-text fallback from stretching a small asset across the entire screen.

## Monotonic zoom and ink

The outer frame owns aperture, responsive fit and spatial transfer. A single master-timeline tween owns the inner image scale, **1 → CSS final zoom**, from expand to handoff using power1.out: 0.80–4.00s desktop, 0.65–3.35s tablet, 0.65–3.15s mobile. There is no zoomReturn, midpoint hold or scale reset. The real image uses the same CSS scale, origin and 50% 50% crop even when animation is skipped.

The existing opposite STILL/FORM X movements, fixed tracking, headline starts/stagger, wordmark and secondary timings remain unchanged. Transfer and BUILT still start together. Blur surfaces are bounded to glyph widths while retaining their approved positions. Photo destination and text clipping are recalculated from the real final layout before playback; the render loop only writes cached geometry.

[Continuous motion sampling](motion-verification.json) and [summary](motion-summary.json) confirm monotonic scale in all six motion viewports, matching proxy/real final scales, no running horizontal overflow, no remaining wrappers/overlays, and white/base registration within **0.00025 CSS px** floating-point precision. No crop reset or spatial handoff jump was found in the inspected actual frame sequences.

Only the mineral-side ABSENCE ink changes:

| Variant | Resolved ink | Graphite-equivalent | Mineral contrast | Status |
| --- | --- | --- | --- | --- |
| A | #787c79 | 58% | 3.43:1 | Large-text AA; alternative |
| B | #656966 | 68% | 4.51:1 | Large-text AA and normal-text AA; provisional implementation |

The white photo-side portion remains fully chalk-white. Neither the heading nor its wrapper receives a reduced final opacity. Both animated color copies share the same motion driver; the base resolves to the same ink used by static CSS. [Contrast calculations](contrast.json). Choice of A/B remains a creative decision.

## Regression, accessibility and loading

The new static candidate is captured with JavaScript disabled. Animated and reduced-motion final frames were compared against it at all eleven targets, both viewport and full-page:

- **Geometry matches in 11/11 viewports.** All normal entries completed with line opacity 1, no inline motion transforms/filters, zero temporary masks/overlays and the intended static image scale.
- **22/44 PNG comparisons are byte-identical.** The remainder differ only in small GPU text-raster values: at most 3/255 per RGB channel and 0.0364% of pixels. These are not represented as exact-byte matches. No layout or photographic crop mismatch was found. [Pixel comparison](pixel-parity.json), [geometry/state audit](regression.json), [summary](validation-summary.json).
- 320px reflow, 600/900px intermediate widths, a 1440×500 short screen and 200% text sizing passed without out-of-bounds content. Enlarged-text tests passed **with and without JavaScript**, including ultrawide widths. Natural document height is retained; no body overflow concealment or scroll locking was added. [Reflow](reflow.json), [supplemental checks](supplemental.json).
- **24/24 ordinary cold/warm admissions played**, across desktop, 1920, 2560, 3440, tablet and mobile; reservation-to-start was 52.6–237.8ms under the unchanged 450ms ceiling. [Admission results](reliability.json).
- Fresh navigation, reload, re-entry, BFCache back/forward to top replay correctly. Restored scroll away from top is preserved; scrolling back within that entry does not replay. [Native history results](replay.json).
- The 27-case suite passed with **0 runtime exceptions**: focus/pointer/keyboard, scroll, resize, text change, reduced motion, JS disabled, delayed/failed runtime/assets, font/image/decode failures, caught setup error, CSP-blocked bootstrap, reload during readiness and CSS-only safety. The AX tree exposes one h1 and the real STILLFORM/E Vos links. [Validation](validation.json).
- Additional ultrawide JS-stopped tests confirm the independent CSS deadline and immediate reduced-motion rules restore readable content, the new ink boundary and final crop. Unsupported path masks fail open. [Final fallback checks](final-fallbacks.json).

Astro development was started in its required background mode. Its first cold capture was still in progress at the observation point; a warm real-browser check settled normally at 4.414s from the start mark, with no overlays or text transforms. [Warm development result](dev-warm.json).

## Performance and image limits

These are **new uncaptured profiles of the changed layout**, in real Chrome through CDP with GPU compositing/rasterization enabled. Viewports are emulated; physical display presentation and physical phones were not certified. [Current GPU information](gpu-info.json), [profile data](performance.json), retained desktop/large/ultrawide/largest/mobile traces.

| Viewport | Median / p95 rAF interval | Maximum interval | Gaps >33.4ms | CLS |
| --- | --- | --- | --- | --- |
| [1440 × 900](baseline/1440x900.png) | 6.9 / 7.1ms | 48.6ms | 2 | 0 |
| [2560 × 1440](baseline/2560x1440.png) | 7.0 / 14.0ms | 159.9ms | 2 | 0 |
| [3440 × 1440](baseline/3440x1440.png) | 7.0 / 20.8ms | 27.8ms | 0 | 0 |
| [3840 × 1600](baseline/3840x1600.png) | 7.0 / 20.9ms | 34.2ms | 1 | 0 |
| [390 × 844](baseline/390x844.png) | 6.9 / 7.1ms | 27.7ms | 0 | 0 |

The 2560px run had an isolated scheduling outlier near late settlement, about 4.24s into playback, without a matching main-thread long task. Its cause was not established. The 1440px run logged one 50ms startup task; the other runs logged none. No uniform 60fps guarantee is claimed. Layout events stayed at 10–11 per run, concentrated around setup/cleanup rather than frame-by-frame layout reads. Tightening temporary identity surfaces improved the larger profiles; [the initial profile](performance-before-tight-identity.json) is retained.

The source remains the licensed local **1920×1440** JPEG. At final zoom, source pixels per CSS pixel are about **1.176 at 2560, 1.142 at 3440, 1.019 at 3840**. DPR 1 fits the source budget, including both tested desktop crops. **Ultrawide DPR 2 needs a higher-resolution version of the same licensed photograph.** No enlarged replacement was manufactured. The source decode is about 10.55 MiB RGBA; the largest frame is about 6.84 MiB at DPR 1, before browser caching/compositing overhead. These are pixel-budget estimates, not measured total GPU allocations. [Resolution/memory budget](image-resolution.json), [native DPR 1 image details](native-photo-detail.png).

## Files and final checks

Application changes: [Hero.astro](../../../src/components/Hero.astro), [global.css](../../../src/styles/global.css), [hero-entrance.ts](../../../src/scripts/hero-entrance.ts), [hero.ts](../../../src/scripts/hero.ts), [hero-critical.css](../../../src/styles/hero-critical.css). Admission architecture, semantic markup, copy, Onest assets, photograph and attribution remain. [AGENTS.md](../../../AGENTS.md) and the three requested creative documents now point to [HERO_FLUID_SYSTEM.md](../../creative/HERO_FLUID_SYSTEM.md); their earlier contracts are retained explicitly as historical evidence. Per-task source snapshots are in before/.

- Production Astro build passed: one static page, no errors.
- Strict noEmit TypeScript check passed for both Hero scripts with a temporary TypeScript 7.0.2 compiler and [targeted config](tsconfig.json); raw admission JS syntax check passed.
- git diff --check passed; existing LF/CRLF notices only.
- No application dependency or lockfile changed. Temporary compiler/video tooling lives in the ignored QA cache. [Native timestamp encoder](encode-native.mjs) uses the standalone FFmpeg distributed by the existing Playwright tooling; no motion framework was added.

Applied frontend-design and official GSAP core/timeline/performance skills. Technical references: [Astro scoped styles](https://docs.astro.build/en/guides/styling/), [GSAP fromTo](https://gsap.com/docs/v3/GSAP/gsap.fromTo()/).

**Remaining review:** approve the fluid compositions and choose ABSENCE A/B; inspect physical-device smoothness and high-DPR image detail. Safari/Firefox, screen-reader listening and hardware presentation/drop measurement remain unverified. Scope ends here: no new chapter, ScrollTrigger, cross-section transition or identity redesign.
