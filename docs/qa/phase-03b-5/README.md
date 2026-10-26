# STILLFORM — Phase 03B.5 stabilization

26 October 2026. Implementation ready for human verification. The Phase 03B.4 artistic composition, fluid geometry, crop, ink and motion rhythm are approved. This pass changes behavior and temporary layering only.

## Diagnosis and changes

**Interaction cancellation was explicit application behavior.** Admission installed focus, pointer, keyboard, scroll, resize, orientation, hash and visual-viewport cancellation handlers. The layout observer independently called `entrance.settle()` on a size change. These explain the reported immediate switch to the static composition. Ordinary interaction now leaves the current timeline running. Navigation disposal, reduced-motion changes, failed assets and genuine deadlines still settle safely.

**Reload had no dedicated scroll-restoration policy.** Admission rejected an initial nonzero scroll position, and its scroll listener also cancelled playback if the browser restored a position after admission. Mobile/tablet content naturally exceeds the viewport, exposing this path more readily than wide desktop. No persistent visited flag was found. Reload now sets manual restoration before admission, scrolls to the top immediately and on initial pageshow, then restores the prior restoration setting after both pageshow and settlement (or on departure). This prevents native late restoration from competing with the opening. It does not lock scrolling. History traversal and BFCache away-from-top behavior retain their separate policy.

**The mobile cut is consistent with a stacking mismatch in source.** The authored closing word has a mineral backing covering up to 12px of the static photograph. The fixed cinematic proxy was above that backing, while the real photograph was below it. Removing the proxy therefore changed which bottom pixels were visible. The existing `.page` is temporarily lifted above the photographic overlay; the existing backing now occludes both representations consistently as the moving photograph approaches it. The white headline layer remains above the page in document paint order. GSAP context reversion restores the page's original styles. No covering element, fade or additional animation was added. Consecutive browser frames have **not** been captured to verify this fix.

**Resize continuity:** the transfer uses the same eased, normalized progress as before, with its origin and destination recomputed after actual geometry changes. One coalesced animation-frame callback updates cached frame, headline and temporary identity geometry on resize/scroll; the animation tick continues to write cached values. The zoom uses the same timing and ease with normalized progress and the CSS-defined endpoint, avoiding a tween restart when the responsive crop changes. Mobile remains 1.03, tablet 1.04 and wide desktop 1.06. The original seven-event labels, durations, headline offsets and temporary identity travel are unchanged.

Admission exposes current-entry diagnostics through `window.__stillformHero.diagnostics`: navigation kind, reload policy, initial scroll, reservation, claim and finish times, and finish reason. Existing performance marks and HTML state/reason attributes remain available. No persistent storage is used.

## Validation boundary

At the user's explicit request, this pass does **not** open or control a browser. The earlier native-control attempt was blocked before implementation; its observations and the reviewed source snapshots remain under this directory. No new recording, screenshot, native F5 result, browser accessibility audit, final-frame pixel comparison or performance measurement is claimed.

`admission.test.mjs` runs the real admission source in isolated VM documents. Six test groups cover ten independent reload admissions, scroll policy, duplicate claims, ordinary interaction, fresh navigation, back/forward restoration, BFCache re-entry, reduced motion, failed font/image and reservation/running deadlines. These are state-machine tests, **not ten native F5 reloads**. Build, strict TypeScript and JavaScript syntax checks are run separately; see `validation.txt`.

Previous reports and recordings are preserved in [Phase 03B.4](../phase-03b-4/README.md). Its “no crop reset or spatial handoff jump” conclusion did not account for the authored backing's occlusion; proxy/image transform equality alone was insufficient evidence of continuity. This report supersedes that conclusion without modifying historical artifacts.

## Pending human verification

- Ten consecutive native F5 reloads on mobile and desktop, including a scrolled mobile document; cold/warm cache, hard reload, development and production preview.
- Click, focus, keyboard, scrolling and resizing across breakpoints while the entrance continues; confirm destination, crop and text masks settle correctly.
- Consecutive mobile frames around 3.15s handoff and 3.59s completion, plus tablet 3.35s/3.79s. Verify the authored backing occludes continuously rather than revealing/removing a lower slice at handoff.
- Settled regression at 1440×900, 2560×1440, 3440×1440, 768×1024, 390×844 and 360×780; reduced motion and JS disabled; no overflow, leftover overlays, masks or page styles.

The unchanged Phase 03B.4 static screenshots remain the visual reference. Phase 03B.5 is a code candidate awaiting runtime confirmation and final Hero approval, not a newly verified visual baseline.
