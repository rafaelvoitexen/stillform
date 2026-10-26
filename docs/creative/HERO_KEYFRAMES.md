# STILLFORM — Hero keyframes: Find the Opening

**Phase 02D · Production handoff · 25 October 2026**

Companion to [Hero final specification](HERO_FINAL_SPEC.md). This document defines the entrance; it is not executable animation code. The settled frame is **Study 1**, with the specified production refinements. Every transform and temporary clip must resolve to that layout.

## Reveal geometry

The final photograph remains at its settled dimensions and crop throughout. Inside its clipping frame, place two **opaque mineral shutters**. At the initial animated state, they cover the photograph except for a vertical aperture centered at **50% of frame width**, aligned with the photo's light shaft. Aperture width is **8% of the frame**: approximately 52px at 1440, 47px at 1280, 37px at 1024, 49px at 768, 24px at 390 and 22px at 360.

Each shutter initially occupies **46% of frame width**. The left travels left by its own width; the right travels right by its own width, until both are completely outside the clipping frame. Use translation, not scaling the photograph or animating the frame's width. The opening is a rectangular editorial aperture; do not trace the irregular architecture or imply the building physically moves. Frame clipping must prevent shutter travel from causing page overflow.

The photograph remains a single semantic image. Shutters are decorative, inaccessible to assistive technology and pointer-transparent. The mobile ABSENCE. backing sits above the photographic reveal and stays part of the final composition.

## Desktop keyframes and timing

All times are seconds from **animation-ready**, not navigation start. Targets below replace the earlier ranges. Allow at most ±0.1s tuning for perceptual parity after implementation, without changing sequence or adding effects.

| Time | Photograph | Headline and secondary text |
| --- | --- | --- |
| Static/preparation | Full final photograph visible by default. No blocking loader. | Full readable semantic content by default. Header is always present. |
| K0 — 0.00 | Only when safe to animate before first visible paint: shutters define the 8% aperture. | Three lines have opacity 0 and are translated down **0.25 of their own line height** inside generously padded line masks. Final layout space is already reserved. |
| K1 — 0.55 | Shutters are at the midpoint of their 1.10s outward travel: approximately **54%** of image width visible. | BUILT begins its 0.65s entrance. AROUND begins at 0.63; ABSENCE. begins at 0.71. |
| K2 — 1.10 | Complete photograph exposed; shutter travel finishes. | All three words are nearing rest. Support and attribution fade from opacity 0 to 1 over **0.20s**, with no displacement. |
| K3 — 1.36 | Static photograph; remove redundant shutter layers/promotion. | All lines at y=0 and opacity 1. Credits finished at 1.30. Final masks must not clip visible glyphs. No further movement. |

Photo easing: **power3.inOut**. Headline: **power3.out**; whole lines move together, not character staggers. Secondary opacity: **power1.out**. Header, wordmark and navigation never animate. Preserve a single h1 with coherent reading order. No font-weight/tracking tween, horizontal headline travel, bounce or overshoot.

Use one GSAP timeline with named stages and authored line wrappers. SplitText is unnecessary for three explicit lines. The stationary desktop graphite/chalk boundary follows the shared photo edge, while the line moves vertically. Do not animate that boundary separately or leave a white text layer visible before its graphite counterpart.

## Stacked tablet and mobile adaptation

Use the same aperture ratio and final crop. Image reveal duration **0.90s**. Opening headline starts **0.45s**, **0.52s**, **0.59s**; each line travels **0.18 of its line height** over **0.55s**, ending at **1.14s**. Support/credit fade from **0.94 to 1.14s**. Easing stays the same.

The image remains between AROUND and ABSENCE. in visual composition. Move the closing word inside its own mask; **do not move its mineral backing** or expose a dark strip behind the line during entrance. The smaller 24px maximum overlap belongs to static layout, not animation.

If content growth places ABSENCE. or credits below the initial viewport, settle them with the same short sequence; do not add scroll-triggered entrances for offscreen words. On emergency reflow/intra-word wrapping, skip the entrance and present the readable static layout.

## Readiness, interruption and failure contract

1. Render the final readable state in HTML/CSS. Do not hide the Hero with a persistent loading class or wait screen. Reserve the image's space and load local Onest with a normal fallback.
2. The entrance is optional enhancement. Play only when the specific Onest face is loaded, the image has decoded, geometry is stable, the document is visible, the Hero is at the top, and motion is allowed. A successful image load with a failed decode must not leave content hidden.
3. **Never conceal already-read content to stage an intro.** If the ready state cannot be established before the first visible Hero paint, retain the static state and skip the entrance for this visit. Do not wait visibly for fonts or the image. This intentionally means slow/cold loads may show the static design; completeness takes priority over guaranteed animation.
4. Settle immediately if the user scrolls away, follows an anchor, resizes across a composition mode, changes text size during playback or switches to reduced motion. Do not rewind on return. No scroll lock, wheel interception or animated scroll requirement.
5. Image failure keeps reserved layout, a mineral frame and a short accessible unavailable-image message; all text and credit remain readable. Font failure retains fallback text, invokes the content-fit/reflow rules, and skips motion. Do not fake a new image or stretch fallback letters to fit.
6. On teardown/navigation, stop the timeline and remove only its own temporary layers/styles. Returning from another chapter or browser history shows the settled Hero, not a forced replay. No per-frame DOM geometry reads.

The first-paint condition is an implementation acceptance requirement, not a claim that it has been tested. If the future Astro loading/lifecycle setup cannot guarantee it, choose the static fallback rather than introduce a flash-to-hidden sequence.

## Reduced motion and validation

With `prefers-reduced-motion: reduce`: show the final composition immediately, without shutters, translations, opacity delay, pinning or smooth-scroll override. The image, title, support and credit remain identical in content. JavaScript disabled likewise presents the final static composition.

Verify clean first paint and no disappear/reappear behavior under throttled network/cache states; actual local-font readiness; no glyph clipping; no layout shift from masking; correct stationary color intersection; and exact final-state parity. Test interruption, short screens, portrait/tablet reflow and reduced-motion changes during playback. Performance must be measured later; this handoff does not claim an achieved frame rate.

## Manifesto boundary — documented, explicitly excluded

**The Void Takes the Page** remains the next-chapter intent: the settled photograph yields an interval that becomes a reading area. Its later implementation may use coordinated ScrollTrigger and registered image planes, with a simpler mobile withdrawal. See [motion direction, beat B](MOTION_DIRECTION.md).

**Do not implement its pinning, scrub, exit transforms, Manifesto markup or placeholder reading section as part of the Hero.** Finish the entrance in normal document flow and leave no transforms on a future shared stage. The later cross-section controller must own the handoff; avoid two independent controllers competing for the same nodes. Archive Flip and Outro behavior are equally outside this scope.
