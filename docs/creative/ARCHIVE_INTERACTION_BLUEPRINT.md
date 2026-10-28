# Archive — Spatial Recomposition

Phase 05A · 27 October 2026 · Planning only. Read with [Archive art direction](ARCHIVE_ART_DIRECTION.md).

## One model: select, redistribute, read

| Event/state | Visible behavior |
| --- | --- |
| Contact sheet | Four stable, captioned photographic records in the authored asymmetric composition. No ambient motion or hover zoom. |
| Select | Click, tap, Enter or Space on a record's explicit selection button. Its existing photograph moves/enlarges into the wide feature slot; the other three become an ordered strip beside it. |
| Focused | Selected image retains its ratio and focal point. Its title, factual attribution and short observation occupy the right reading area; alternatives remain visible and selectable. A persistent “All four records” control returns to the sheet. No overlay, backdrop, lightbox or scroll lock. |
| Select another | The previous image rejoins the alternatives in record-number order; the chosen image takes the feature slot. The note changes to the same record, never a stale selection. |
| Deselect | Activate the selected record again, “All four records”, or Escape while focus is within Archive. Recompose all four into their authored positions using fresh geometry, rather than reversing obsolete coordinates. |
| Tablet/mobile | Keep the selected record at its original position in the ordered list. It expands where possible; others condense in place. The observation opens directly beneath it. No transfer to an offscreen top slot, horizontal carousel, swipe capture or sticky rail. |

A landscape already filling the mobile width need not grow artificially: neighboring images contracting and the reading area opening are its recomposition. Focused metadata is 25–45 words maximum plus verified facts; the brief's short observations may remain shorter. Images never become mandatory gateways to basic credits.

## Choreography targets

Capture → change the layout state → animate the four image wrappers from the captured geometry. Use **GSAP Flip**, with explicit transform scaling for ratio-preserving images; keep captions and reading text outside scaled surfaces. Flip defaults to width/height resizing, so transform scaling must be chosen deliberately. Make only the moving wrappers temporarily absolute if Grid requires it, retaining an in-flow stage to prevent collapse. [Official Flip.from documentation](https://gsap.com/docs/v3/Plugins/Flip/static.from()/).

| Action | Starting target, subject to 05D review |
| --- | --- |
| Select / switch, wide | 0.65–0.75s, `power2.inOut`; all image movements begin together, selected image above siblings only during crossing |
| Return | 0.55–0.65s, same spatial easing; restore initial hierarchy without a flourish |
| Tablet/mobile | 0.40–0.50s, shorter paths, same concurrent movement |
| Metadata | Outgoing note fades over ~0.10s; incoming note fades during the final ~0.18s. At most 2px blur on the small note, omitted on mobile; opacity alone is the default |

No bouncing, elastic travel, image blur, animated focal points, per-letter reveals or staggered thumbnail procession. Motion stops completely after selection.

**Rapid input: bounded latest-intent policy.** Maintain applied selection and one pending requested selection, not an event queue. During a Flip, continue accepting activations and replace the pending target. Finish the current short spatial move, then immediately run at most the latest requested change; discard intervening choices. Suppress the intermediate note if another selection is pending. Escape requests the unselected state. Repeated activation of the requested record toggles that request off. Do not disable controls or announce a selection that has not been applied.

This consciously trades up to one animation's latency for predictable continuity. It avoids arbitrary mid-flight retargeting: `Flip.getState()` normally completes active Flips affecting its targets. Capture only at transaction boundaries under this policy; do not assume it preserves an unfinished trajectory. [Official getState behavior](https://gsap.com/docs/v3/Plugins/Flip/static.getState()/). Verify perceived responsiveness in 05C before increasing complexity.

## Layout and technical ownership

Use one native Astro section with four stable record nodes, semantic figures/captions and explicit buttons, enhanced by a scoped TypeScript initializer. This follows Astro's [static HTML plus client script model](https://docs.astro.build/en/basics/astro-components/). Keep source order 01–04; change Grid placement, not DOM identity or parentage. Give image wrappers stable Flip identifiers. A selected record's own description moves to the reading area; avoid duplicate accessible metadata. State is selected ID or none, latest pending intent and one active timeline. React, Flip batching and a general animation registry are unnecessary.

Keep a record's ratio constant between sheet, feature and alternative sizes. Cap the feature against the asset budget; do not stretch portraits into landscapes. Before a transaction, read the four rectangles and target layout once. Reserve enough stage space for the larger wide state so nearby section boundaries do not shift on each choice; recompute that minimum on meaningful layout changes, never use a fixed viewport-height crop. On mobile, ordinary flow grows for the selected note. Use a short container-height transition only if needed to keep neighboring content continuous, not a whole-page height animation.

Image dimensions and responsive sources must be reserved before animation. A missing or undecoded image retains its frame and readable record information; no blank loading gate. Upgrade resolution without changing focal registration or delaying selection. Four bounded image surfaces need no canvas or per-frame layout measurement. Remove temporary promotion/absolute styles on completion and disposal.

**Interruption:** on breakpoint/orientation change, stop the active transaction, commit its latest requested semantic state in the new layout, clear transient Flip styles and measure afresh. Do not replay across breakpoints. On reduced-motion changes, settle immediately. Navigation/unmount disposes listeners, pending work and timelines; guard completion callbacks against stale ownership. Ordinary scrolling remains available and does not restart the interaction.

## Accessibility and user control

- Use ordinary buttons with meaningful names (“Select Passage”), `aria-pressed` for the applied selection and `aria-controls` for its observation. No tablist, modal semantics, roving tab index or custom arrow-key model is needed.
- Keep the activated record button focused through movement. Tab order remains record order, followed by the return control; retain visible record numbers so the wide visual rearrangement is understandable. Escape is scoped to this section, not a page-level override.
- Returning through the return control restores focus to the selected record's button before that control disappears. Do not move focus to the note automatically. If focused content ends outside the safe viewport after a wide rearrangement, reveal only enough to restore access, through the existing scroll infrastructure; never recenter the section or replay an entrance.
- A short polite status can announce the settled selected title. Avoid repeated announcements during queued changes. Inactive observations are hidden consistently from sight and accessibility APIs; meaningful credits remain visible.
- Reduced motion applies the same layout/content states instantly, with no Flip travel or blur. Without JavaScript, show all four figures, credits and observations in readable flow; enhancement-only controls must not be dead buttons.
- Targets at least 44px, visible graphite/moss focus indicators, no reliance on cursor or color alone. Touch remains native. Test 200% text, 320px reflow and keyboard order in both layouts.

## Integrate, do not replace

The current user brief approves Lenis and the Hero–Manifesto transition, superseding earlier restrictions. Source confirms [smooth-scroll.ts](../../src/scripts/smooth-scroll.ts) and [chapter-transition.ts](../../src/scripts/chapter-transition.ts) are imported by the page. Historical “future transition” language in [GLOBAL_INTERFACE.md](GLOBAL_INTERFACE.md) is stale; its ownership principles still apply. No runtime test is claimed in this planning phase.

- **Header/footer:** the current `Chapter` union and tracker in [site-header.ts](../../src/scripts/site-header.ts) still cover Hero/Manifesto only. Later extend that one tracker and shared label data for **Archive / 03 / 04**, including measured rolling-label bounds. Do not create an Archive detector competing with transition overrides. Footer proposal: left “Four records. / Different ways of occupying space.”; right “Threshold / Passage / Weight / Release”. Preserve existing supported desktop/tablet visibility and clearance; no persistent footer below 600px.
- **Cursor:** retain [pointer.ts](../../src/scripts/pointer.ts) as sole controller. No Archive magnetic reveal or second cursor. Standard focus/underline feedback is enough; selection must remain understandable with the native pointer.
- **Scroll:** keep the existing Lenis instance, eligibility and ticker integration. Do not stop it for Flip, create a second RAF driver, pin Archive or override the active chapter on record selection. After genuine section-height changes, request one coordinated geometry/ScrollTrigger refresh outside the animation tick; do not refresh on every frame. Shared chapter tracking must include Archive/Outro boundaries when those sections exist.
- **Completed sections:** no edits to Hero/Manifesto composition, entrance targets, transition choreography or pointer behavior. Appending Archive and extending shared chapter data are the only future cross-section integration changes contemplated here.

## Delivery phases and acceptance

| Phase | Exact scope and assets | Acceptance / boundaries |
| --- | --- | --- |
| **05B — Static Archive** | Implement only authored contact-sheet layout and semantic content. Use existing candidates and explicitly labeled temporary assets for missing Threshold/Release; preserve provenance. Add Archive to shared chapter/header/footer tracking. | Review 1440, 1920, 2560, 3440, tablet and mobile; unequal hierarchy, readable captions, correct 03 / 04, no overflow or persistent mobile footer. No Flip, selected states, new cursor or changes to completed sections. |
| **05C — Interactive Archive** | Add wide feature/alternative layout and small-screen in-place state, Flip transaction controller, keyboard, reduced-motion and failure paths. Approved or labeled study assets must have stable dimensions. | Every record selects, switches and returns; latest intent wins; no crop distortion, lost focus, detached DOM, stale note, scroll lock or chapter flicker. Preserve 05B appearance and all existing global behavior. |
| **05D — Polish** | Tune timings, crop fidelity and responsive fit; finalize four cleared images, responsive derivatives, attribution and observations. | Verify the eleven established 360–3840 targets plus required 3440 view, intermediate widths, 320px reflow, 200% text, touch, keyboard, image/font failures, JS-off, reduced motion, rapid input, resize mid-Flip and restored history. Profile actual image/animation costs; no invented FPS claims. Compare completed Hero/Manifesto behavior for regressions. No new interaction features or Outro design. |

**Creative review gate:** approve the contact sheet, wide feature/alternative model, mobile in-place adaptation and bounded latest-intent policy. Only these two planning documents were authored; no prototype, visual media, component or animation was created.
