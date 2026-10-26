# STILLFORM — Motion direction

**Phase 02C · 25 October 2026 · Artistic storyboard, not implemented**

**Reveal an interval → give it to the reader → redistribute it by choice.** Three deliberate events carry the experience. Architecture stays geometrically truthful; no rotation, perspective distortion, constant parallax or ambient loops. Native scrolling is sufficient. Astro + TypeScript with direct GSAP remains the intended foundation; React is not required for these motions.

## A. Hero entrance — Find the opening

| Beat | Artistic state |
| --- | --- |
| Initial | The mineral page and wordmark establish a stable frame. Inside the final photographic bounds, a narrow vertical aperture exposes the actual light shaft; surrounding photo areas are covered by mineral shutters. The headline is temporarily behind its own line masks. |
| Transformation | The shutters recede outward, revealing concrete mass around the already-visible light. The image itself stays registered and does not zoom or stretch. As the field opens, the three uppercase words enter as coordinated lines, not individual letters. |
| Final | The selected static Hero composition is fully readable. ABSENCE. meets the frame; all movement stops. |

**Intention:** discover mass by first seeing what is missing. This is a reveal of the photograph, not an animation of the building's concrete walls.

**Timing / easing proposal:** photograph 0.9–1.2s with `power3.inOut`; headline lines begin in the latter half, travel approximately 0.25 line height over 0.6–0.75s with `power3.out`, with 0.07–0.09s offsets. Total impression approximately 1.4–1.7s, not a mandatory loading screen. Credits arrive with the final word, not a separate flourish.

**Techniques:** one GSAP timeline; transform two opaque covers inside a fixed clipping frame; translate whole line wrappers. Existing authored line breaks mean SplitText is optional. Keep one accessible heading. Start only after the font and image are ready; if preparation fails, retain the visible static composition. Scrolling away should settle the entrance, not compete with the next passage.

**Mobile / reduced motion:** same aperture logic inside the portrait crop, shorter travel; reduced motion shows the completed Hero immediately. No looping or replay on minor scroll changes.

**Complexity: Low–medium.** Main risks are delayed asset readiness and text-mask clipping. Use fixed image bounds and transforms; avoid full-page filters and axis animation.

## B. Hero to Manifesto — The Void Takes the Page

| Beat | Artistic state |
| --- | --- |
| Initial | The settled Hero holds. The photograph's light shaft is the visual origin of a narrow editorial seam. |
| Transformation | The headline withdraws as a unit. Two registered portions of the photographic field recede away from the seam, exposing mineral ground. The expanding interval becomes a usable column; it does not pretend to reconstruct unseen architecture. |
| Final | The Manifesto occupies that cleared reading area. The photographic remnants have left the reading column, and body text remains stationary for reading. The mineral ground continues into the Archive. |

**Intention:** give the space previously occupied by the image to language. Preserve the seam's horizontal position initially; do not abruptly teleport a right-hand photographic opening into a centered page. Exact endpoints belong to the later keyframe phase.

**Timing / easing proposal:** a short desktop scroll passage of roughly **0.7–1 viewport**, with one shared orchestration and a small 0.15–0.25s scrub catch-up. Progress-driven travel uses linear mapping (`none`), not a cinematic time ease that fights scrolling. A freely scrolling reading interval follows. No snap or prolonged scroll capture.

**Techniques:** one top-level ScrollTrigger timeline coordinating the Hero exit and Manifesto entry. A bounded pinned frame may hold desktop continuity; translate its children, not the pinned container. Two static clipping regions share the same image/crop registration. The effect is an editorial separation of image planes. Text enters only after sufficient space exists. [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

**Mobile / reduced motion:** mobile uses the portrait image's lower interval to hand space downward to the next section, with one simple mask withdrawal and ordinary flow; avoid lateral panels across the full phone screen. Reduced motion uses consecutive static sections without pinning or scrub.

**Complexity: Medium.** Main risk: two image layers, breakpoint registration and pin geometry. Keep layers bounded; no painted filters, repeated refreshes or huge moving masks. Simplest viable version: one rectangular image curtain clears the column, preserving the same narrative without two panels.

## C. Archive — Spatial Recomposition

| Beat | Artistic state |
| --- | --- |
| Initial | Four architectural photographs form a contact sheet with visible titles. No image moves merely because the pointer passes over it. |
| Transformation | Click, tap or keyboard activation gives one image more space. It expands into the principal viewing area while the other three move into a compact rail. A short observation appears in the interval that the composition frees. |
| Final | One image is clearly selected; the alternatives remain identifiable and selectable. The page rests until another selection or close action. |

**Intention:** attention has spatial consequences. The archive behaves as a reconfigurable editorial surface, not a lightbox detached from the page.

**Timing / easing proposal:** 0.65–0.85s, `power3.inOut`; remaining images move concurrently, not in a decorative cascade. The note fades in during the final 0.15–0.2s. Closing reverses the spatial logic. A new selection should resolve cleanly from the current state.

**Techniques:** two CSS layout states and GSAP Flip: capture geometry, change selection/layout, animate the difference. Maintain a common photographic aspect ratio so scaling does not distort architecture; reserve the containing area to avoid a page jump. Keep titles outside scaled image layers. [Flip documentation](https://gsap.com/docs/v3/Plugins/Flip/).

**Mobile / reduced motion:** selected image becomes the full-width reading image with remaining thumbnails below. Preserve source order and keyboard focus; no hover dependency. Reduced motion switches directly to the selected layout with no spatial tween; content and controls remain identical.

**Complexity: Medium.** Four images and two states keep the problem bounded. Risks are reflow, image decoding and repeated selections during a transition. Simplest viable version uses fixed expanded/thumbnail slots and only one selection at a time; no drag or inertia.

## Continuity and approval

The vocabulary is always **open, yield, rearrange**. The four sections remain Hero → Manifesto → Archive → Outro. The Outro closes quietly without adding a fourth signature effect. Motion should be absent while the visitor reads.

Use media-query and reduced-motion branches with cleanup through [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/). Coordinate the cross-section passage centrally; avoid separate sections fighting over scroll. No Lenis, WebGL, Three.js or new scroll framework is justified here.

**Pending:** approve the selected Hero composition, entrance pacing, and whether the desktop seam separation merits the medium-complexity version. Timings above are artistic targets, not measured results. No GSAP timeline, Manifesto, Archive or Outro implementation was created.
