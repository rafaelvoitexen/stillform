# STILLFORM — Phase 04B.4 cursor correction

27 October 2026. **Implemented; awaiting human creative review.** Only the production pointer controller changes. Hero, header, static Manifesto, typography, copy, palette and assets remain unchanged. No Phase 04C/ScrollTrigger work is started.

[Open the versioned production preview](http://127.0.0.1:4326/?review=04b4#manifesto) to load the corrected bundle.

## Review first

- [Video A — natural interaction](playback/natural-entrance.webm).
- [Video B — stress test](playback/stress-entrance.webm).
- [1440 portal](portal-1440.png), [1920](portal-1920.png), [2560](portal-2560.png), [3440](portal-3440.png).
- The verified previous [large black circle](before/black-circle.png), [corrected same-edge photo during movement](after-edge.png) and [stopped-center success](before/center.png).
- [Before measurement](before-measurement.json), [gesture analysis](analysis.json), [four-edge tests](boundaries.json), [image registration](registration.json).

All playback is real Chrome output driven by CDP pointer simulation. **No physical/manual mouse session is claimed.** Gestures vary position and velocity continuously; they do not wait at each destination for the reveal to finish. The supplied task did not include a new user recording; the previous Phase 04B recordings/source were reviewed and the failures were reproduced directly before editing.

## Verified causes

| Report | Actual cause | Before evidence |
| --- | --- | --- |
| A: works after stopping | Every pointer event called `engageTo()` again, resetting the same 0.52s power2.inOut tween. The code used raw coordinates for a fractional target, but had no discrete engagement state. A second photo gate then depended on the lagging visual cursor. There was no explicit dwell timer. | During 180 uninterrupted input events the circle stayed near 34–36px with almost invisible photo; after stopping it reached 197.6px and image opacity 1. |
| B: intermediate expansion | `steer()` retargeted/restarted engagement even when its target remained 1. Repeated events kept returning the easing curve to its slow opening. | Full expansion required the subsequent stationary 650ms hold. Installed GSAP `quickTo()` calls `tween.resetTo()` on every invocation; this is suitable for tracking, not repeatedly restarting a state transition. |
| C: large black circle | Diameter depended on engagement, while `photoMix` also multiplied a separate clearance gate derived from animated position/radius. These conditions could disagree permanently. | At the near-edge test, diameter 197.6px, photo opacity 0, negative opacity 1. |
| D: weak magnetism | The old target was the nearest safe projection of the raw point. In the central safe area it equaled the raw point, so the apparent attraction was zero there. Strong edge projection was further obscured by the photo gate. | Source inspection and the edge reproduction explain the inconsistent feel; the earlier static success frame did not demonstrate center-relative resistance. |

No persistent geometry-cache defect, debounce timer or duplicate pointer controller was found. The earlier QA measured rendering cadence and included stationary holds after destinations; it did not adequately assert logical state/progress during ordinary continuous movement. Those holds masked the functional problem. Previous artifacts are preserved unchanged.

## Reference and implementation

The [Cursify reference](https://cursify.ui-layouts.com/components/magnetic-cursor) uses raw center-relative distance to change hover state and continuously moves the element. Its live demo was also inspected: the button moved from x=462 to about 517.8 and grew from 144 to 151.2px during the sampled approach. [Reference capture](reference-demo.png), [measurements](reference.json). The adaptation uses its center-relative response principle; it does not copy the React component, springs, styling or per-event layout reads. No React/Framer Motion dependency is introduced.

`src/scripts/pointer.ts` now has two logical modes: **NORMAL** and **MAGNETIC_REVEAL**. Each mouse event first stores raw client coordinates, immediately classifies against cached region bounds, then updates the visual target. A 16px exit hysteresis band prevents edge chatter. UI controls/header are excluded. Geometry refresh reclassifies the latest raw position after scroll/resize/font/content changes; it is coalesced to one animation frame and never read in the pointer handler.

Only a change of logical mode retargets the shared reveal tween. Its current value drives diameter, photo opacity and inverse negative opacity together. There is no separate photo-clearance multiplier. Entry is **0.34s**, release **0.24s**, both power2.out; normal position tracking is **0.12s**, power3.out. The image is perceptible early rather than after expansion. An unavailable image remains NORMAL at 34px.

While engaged, the visual target contracts toward the region center by **28%**, then is bounded to the full-size safe area. Rendering constrains the actual circle, including during contraction, so the photo cannot cross typography. Release resumes ordinary tracking from the actual last painted coordinate after contraction, avoiding a discontinuous jump to a distant raw pointer. These are presentation constraints, not a third engagement state. Tuning constants are grouped at the top of the controller.

The photographic plane remains stationary; its inverse offset uses the actual rendered center, including safety projection. Measured world-plane variation over continuous motion was **0px horizontally and 0.000061px vertically** (floating-point precision). Its placeholder source, attribution and licensing are unchanged.

## Diagnostics

Inspect without triggering interaction:

```js
window.__stillformPointer?.snapshot()
window.__stillformPointer?.transitions()
window.__stillformPointer?.tuning
```

Snapshot fields include raw/visual/target coordinates, region/safe bounds, logical mode, shared progress, diameter, both opacities, influence, asset readiness, geometry revision/dirty flag and active tween flags. The transition ring is capped at 80 copies and records reason, timestamp, input sequence and progress. No console or network telemetry logging is added. The API is absent after ineligible-media cleanup/disposal.

`1440-diagnostics.json` through `3440-diagnostics.json` record events and rAF snapshots for the actual gestures. `natural-diagnostics.json` / `stress-diagnostics.json` accompany the final videos and include `performance.timeOrigin` for exact alignment with screencast epoch timestamps. Snapshot reads do not retarget animation or perform DOM measurements.

## Continuous input results

Each of the four desktop viewports executed **1,085 movement events**, including:

- A: ten fast traversals, without stops. All produced the expected twenty entry/exit transitions during movement. Observed crossing velocities reached about 3,232 / 5,854 / 7,345 / 10,922 CSS px/s respectively.
- B: entry followed by continued motion during expansion. Progress reached 1 without waiting at a destination.
- C: several seconds of internal movement, with full photo progress maintained and **zero additional state changes**. No persistent intermediate size or large-black state occurred.
- D: edge oscillation inside the 16px hysteresis allowance produced no unwanted changes. A separate continuous traversal of all four sides/corners also retained progress 1 with zero extra state changes at every viewport.
- E: repeated unfinished entry/exit/re-entry transitions retargeted from current progress rather than resetting to endpoints.
- F: slow and fast exits returned to NORMAL, progress 0 and diameter 34px, while movement continued.

Captured raw-event classification matched the same input sequence; diagnostic collection followed within 0.3–0.7ms in these runs. The natural-session first image-opacity sample ≥0.1 arrived in the first few sampled frames after raw engagement; this is a browser-state observation, not a physical input-to-photon latency guarantee. [Analysis](analysis.json) records observed sample timing.

Across all recorded gesture sets: **zero sampled safety-bound violations and zero large-circle/absent-image states**. Photo share matches reveal progress within floating-point precision. The invariant and safe rendered geometry were checked throughout movement, not just at settled screenshots. The final same-edge check also records mode MAGNETIC_REVEAL, progress/image opacity 1 and negative opacity 0 while moving; reverse header labels were observed mid-roll and settled back to Hero. [Final smoke](final-smoke.json).

## Regression, accessibility and performance

Hero/header source and admission logic were not edited. The browser confirmed the Hero remains running during ordinary mouse movement, then completes with no temporary overlays. A CDP reload completed at document top. This is **not a native OS F5 claim**. The reused six-viewport regression also checks fixed header chapter updates, reverse scrolling, keyboard focus, readiness gate, touch/coarse-pointer and reduced-motion cleanup. [Results](pointer.json), [Hero/failure/static checks](fallback.json).

The shared static/reduced-motion sweep from 320 through 3840, including intermediate 600/900 widths, had no horizontal overflow. A blocked photograph remained NORMAL, progress 0, diameter 34px, image opacity 0 and negative opacity 1. Native-cursor fallback, media gating, lifecycle disposal and the stylesheet-readiness guard are retained. No essential content or native click/selection behavior is intercepted.

Uncaptured ordinary and engaged pointer profiles at 1440 and 3440 observed **zero pointer-phase layout reads**, zero long tasks and zero rAF intervals >33ms in the four runs. Median intervals were 6.9–7.0ms; p95 7.1–7.2ms. [Performance data](performance.json). These describe this headless Chrome host/session; they are not a physical-device FPS or GPU-memory guarantee. No permanent custom render loop is introduced.

Both videos retain browser timestamps, without slowed playback or generated/interpolated poses. Natural contains 1,120 source frames over 11.659s, exported to 12.383s including the closing hold; stress contains 981 source frames over 10.215s, exported to 10.933s. Offline encoding uses a 60fps clock, selects actual recorded frames and adds only a final review hold. Source manifests, original JPEG frames, [encoding audit](encoding-audit.json) and [recording audit](recording-audit.json) remain available. A final decode check is saved for each video.

Strict TypeScript and production build results are in `checks.txt` / `build.txt`. No new application dependency, typography change or section is introduced.

## Remaining review

The functional failures are fixed in the executed continuous-input cases. Human review should judge the 28% attraction, constrained movement and release feel with everyday physical mouse use. Shadowed concrete in the placeholder is naturally dark: the corrected edge image shows real texture at opacity 1, rather than the prior absent-photo state. The image/crop was not brightened to mask the defect. Safari/Firefox, physical touch and a full screen-reader session were not tested. Existing difference-blend contrast/antialiasing limitations remain unchanged. Phase 04C remains out of scope.
