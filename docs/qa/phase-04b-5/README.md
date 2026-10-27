# STILLFORM — Phase 04B.5

27 October 2026. **Implemented; awaiting human approval.** No diameter/boundary redesign, global footer, ScrollTrigger, new dependency or Hero choreography change.

[Fresh preview](http://127.0.0.1:4326/?review=04b5#manifesto) · [Continuous desktop video](playback/release-entrance.webm) · [Decoded mid-release frame](playback/release-decoded.png)

## Changed files

| File | Change |
| --- | --- |
| [pointer.ts](../../../src/scripts/pointer.ts) | Continuous free/magnetic position blend, no release-completion handoff; stationary photo-window clipping; trajectory diagnostics. |
| [SiteHeader.astro](../../../src/components/SiteHeader.astro) | Only 01/02 rolls in a fixed 2ch tabular slot; static ` / 04`; selection protection for descriptor/pagination. |
| [Hero.astro](../../../src/components/Hero.astro) | Selection protection for display lettering, temporary feature overlays and decorative metadata only. |
| [Manifesto.astro](../../../src/components/Manifesto.astro) | Selection protection for monumental headline and decorative footer labels; editorial paragraphs stay selectable. |
| [GLOBAL_INTERFACE.md](../../creative/GLOBAL_INTERFACE.md) | Updated ownership/release contract. |

The header controller and Hero entrance/admission scripts were not changed. Earlier QA and source snapshots remain preserved; this pass's pre-change files are in `before/`.

## Release correction

The verified cause was `constrained` remaining true after logical exit. `steer()` continued projecting the target into full-size safe bounds, `render()` continued clamping there, and `onComplete` finally reset/retargeted position. Contraction and ordinary tracking therefore occurred in separate phases.

Free x/y tracking now stays active continuously. Rendering computes the magnetic projection and blends it with that free point using the same reveal progress that drives contraction and opacity. Influence declines immediately during exit; at progress zero, the expression already equals the free position. There is no positional onComplete callback, endpoint reset or new tracking tween at completion. Unchanged raw coordinates do not restart tracking.

The existing **0.24s** release duration is retained. Existing activation bounds, vertical clearance and target diameters are retained. Photo pixels are clipped to the original stationary interval window while the circular cursor moves out; no new activation boundary or independent photo-opacity gate is introduced. The plane's inverse offset still uses the actual rendered center.

## Trajectory evidence

Actual DOM circle centers/diameters were sampled on every observed animation frame, alongside raw/visual/normal/magnetic coordinates and reveal progress. This validates the path, not just the endpoint.

| Release | Movement while still contracting, 1440 | 1920 |
| --- | --- | --- |
| Slow | 132.7px | 157.0px |
| Fast | 260.6px | 289.3px |
| Diagonal | 307.9px | 323.2px |
| Exit during unfinished expansion | 198.3px | 204.9px |

Unfinished-expansion exits began around progress 0.32. Rapid re-entry reversals also ran before contraction completed. In every sample, the position blend matched its formula, and progress-zero position had **0px residual** from free tracking. DOM centers matched diagnostics within **0.0001px**. Continuous post-release motion returned to the 34px cursor without a delayed positional handoff. [Trajectory analysis](trajectory-analysis.json), raw `1440-trajectory.json`, `1920-trajectory.json`, `demonstration-trajectory.json`.

The demonstration is one continuous Chrome/CDP session covering slow, fast, diagonal, unfinished-expansion and rapid-re-entry release. It contains 1,656 actual captured frames over 17.763s, exported to 18.483s including a closing hold. Original timestamps are preserved on a 60fps clock; no generated poses, interpolation or slowed motion. [Encoding audit](encoding-audit.json). No physical/manual mouse session is claimed.

## Pagination and selection

At **1440×900, 1920×1080 and 390×844**, both roll directions were tested. Denominator x/y movement was **0px**, and its transform remained `none` throughout sampled start/mid/end states. Replacing a visible numeral with a one-digit fixture also produced **0px** slot-width/denominator displacement. Descriptor rolling, 0.52s duration and power2.inOut easing remain owned by the unchanged controller. A single hidden status exposes the complete pagination; visual numeral/denominator spans are aria-hidden. [Pagination results](pagination-analysis.json), [one-digit fixture](extra.json), [accessibility tree](accessibility.json).

Real browser drag-selection tests produced empty selections for Hero display type, Manifesto headline, descriptor and pagination. Both registered layers of temporary STILL/FORM computed `user-select: none`. Meaningful reading and closing paragraphs remained selectable at all three widths (97 characters of reading copy; 58–59 of closing copy, including viewport-dependent line breaks). Photo-credit links, the brand link and inputs are not covered by a broad selection reset. Keyboard navigation retained a visible focus outline. [Browser QA](qa.json).

Screenshots: [1440 Hero](screenshots/1440-hero.png), [1440 Manifesto](screenshots/1440-manifesto.png), [1920](screenshots/1920-manifesto.png), [390](screenshots/390-manifesto.png).

## Regression and remaining review

- All three Hero entries completed normally; no browser runtime exceptions or horizontal overflow were recorded. Existing layout, copy, photo zoom and entrance ownership remain unchanged.
- Registered image-plane x/y variation was **0px** in the additional motion sample. Actual clipped photo edges match the unchanged interval window. Reduced motion disposes the custom pointer and restores native cursor; header remains visible. No pointer-phase DOM reads or permanent loop were added to the application. QA trajectory sampling deliberately reads DOM rectangles and is separate from application code.
- TypeScript strict validation and Astro production build pass; results are in `checks.txt` / `build.txt`.
- During exit, the circle can straddle the fixed photographic window: the photograph is visibly clipped at that edge as it contracts, rather than painting over typography. This is the safety tradeoff visible in the recording and needs human artistic approval.
- Validation used headless Chrome with CDP input. Physical mouse feel, other browsers and a full screen-reader session remain human/release checks. No Phase 04B.6 work has started.
