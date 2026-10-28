# Outro — The Opening Remains

## Phase 06B superseding handoff — 28 October 2026

The static composition is approved. Statement weight remains 450. Creator: **Rafael Voitexen**. Outro footer: **The opening remains.** / **Created by Rafael Voitexen**. The implementation in this phase is static only.

The automatic entrance and settled-Hero return proposals below are historical and superseded. Future entrance: a dedicated headline-only stage with temporary ScrollTrigger pin/scrub; THE OPENING enters from the right and REMAINS. from the left using independent inner spans. Reading copy, Notes and links stay outside the stage. Outro footer labels will be gated until both lines settle, through existing footer ownership.

Future Phase 06D return: mineral/blur overlay above content and global UI but below the cursor; conceal first, settle Lenis/ScrollTrigger and move immediately to the top, then replay the existing Hero entrance through a minimal reusable API without reloading or duplicating its timeline. Reduced motion returns directly to the static Hero. Keep the native #top anchor fallback. No overlay, replay API, Outro motion or footer gating is implemented in 06B.

The earlier research below is retained intact.

Phase 06A · 28 October 2026 · One recommended direction for human creative review. No implementation or visual validation performed.

## Creative concept and final copy

**The photographs end; the opening remains.** After ten spatial observations, remove the photographic mass and let language occupy the mineral field. The ending recalls the Hero through scale and alignment, but offers a quieter, lighter typographic presence. No additional image, aperture interaction or color-field transition.

Closing statement, one accessible heading with two authored lines:

**THE OPENING**  
**REMAINS.**

Supporting copy: “A photograph holds a place for a moment. What remains is a way of looking.”

Return link: **Return to the opening ↑** — a real link to `#top`.

Small colophon, headed **Notes**: “STILLFORM is a fictional editorial study of architecture and perception.” Follow with “Photography is credited alongside each image.” Link “Hero” to `#top` and “Archive” to `#archive` for access to existing credits. Add a separate design/development credit only when the exact public name and destination are supplied; do not publish a placeholder or infer authorship.

No contact pitch, social-link grid, oversized copyright line or second wordmark. Notes belongs inside chapter 04, not a fifth section or disclosure system.

## Static composition

Continue mineral **#E5E8E4** with graphite **#292D2B** text. Use the existing full-width page container and shared gutter. No global max-width. The heading is the only monumental element.

- **Upper line:** THE OPENING starts at the left page gutter. Keep its entire line within the available width.
- **Lower line:** REMAINS. aligns to the right gutter, approximately 0.35–0.5 display-em below the first line's box. The offset makes the unoccupied center visible. Do not put copy inside that gap: unlike the Manifesto, this interval stays empty.
- **Reading row:** below the heading, supporting copy sits left, capped at 30ch; the return link sits right, aligned with the lower line's right edge. Allow approximately 56–88px between heading and reading row on desktop.
- **Notes:** a compact, left-aligned block below the reading row, separated by at least 48px. Leave the measured shared-footer clearance beneath it. No border or background panel.

Onest Variable **450** for the statement, −0.055em tracking, 1.02 leading. Wide sizing target: `clamp(5rem, 1rem + 9cqw, 16rem)`; approximately 146px at 1440, 189px at 1920, capped at 256px on ultrawide. Body 17–20px/1.5, weight 400; return link 15–16px with visible underline and a minimum 44px activation area; Notes at least 12px/1.5. No stretched letters or reduced parent opacity.

Use a minimum section height around **100svh**, including padding, with natural vertical growth. The statement begins roughly 100–140px below the section boundary at the desktop anchor, subject to actual header clearance. Distribute extra height below the statement rather than increasing the interline gap indefinitely. Never fix the section's height or conceal overflow to retain one viewport.

## Responsive treatment

| Category | Composition |
| --- | --- |
| 1440 / 1920 desktop | Left upper line, right lower line; supporting copy and return link share a lower row. Shared gutters remain 36/48px at default sizing. |
| 2560 / 3440 ultrawide | Heading stops growing at 256px; both outer alignments continue outward. Keep the reading measure and Notes compact. Open space increases horizontally, not through an extra blank scroll stage. |
| Tablet 600–1023 | Preserve opposing headline alignments; target 72–108px subject to fit. Supporting copy remains left; return link may occupy its own right-aligned row. Reserve existing fixed header/footer clearances. |
| Mobile 360 / 390 | THE OPENING remains one line where it fits; REMAINS. is right-aligned below. Target `clamp(2.25rem, .5rem + 10cqw, 3.5rem)`, approximately 44/47px. Use 24–32px between line boxes, then 40px before body copy. Return link follows in its own row; Notes follows in flow. No fixed mobile footer. |

At 320px or enlarged text, permit THE / OPENING to wrap naturally and retain the right alignment of REMAINS. Preserve sentence order. Do not reduce user text, force nowrap, or use viewport height as a content limit.

## Arrival and motion storyboard

The current final record is **10 / FLOW**, a 2:3 photograph of the Heydar Aliyev Center credited to Shiva Mardahi, with the observation “One surface folds into the next interval.” It occupies the left side of the final desktop register. Its attribution and motion remain untouched. The Outro's first line inherits the leftward visual emphasis, then the second line opens attention toward the right.

Keep the Archive's existing bottom padding, parallax and observation behavior. Append Outro in normal flow on the same mineral ground: photograph, caption, existing clearance, then statement. Add no departing-image mask, crossfade, new parallax or forced deceleration. Account for the final figure's existing travel when checking clearance; do not change its motion to manufacture a handoff.

| Beat | Artistic state and approximate timing |
| --- | --- |
| Arrival | Native scroll carries the final photograph away. The new heading approaches naturally; no pin, scrubbed reading delay or blank-screen hold. |
| Recognition | When the upper heading line reaches roughly 80% of viewport height, reveal it over 0.75s: opacity to 1, blur at most 3px to 0, upward settlement of only 8px, `power2.out`. |
| Completion | Start REMAINS. approximately 0.20s later; same treatment over 0.80s. It becomes fully still at about 1.0s total. The two lines read as one thought, not two separate entrances. |
| Rest | Supporting copy, Notes and return link remain normally visible throughout. Clear transient filters/transforms; no loop, hover animation or continued scroll-linked movement. |

Mobile: approximately 0.55s per line with a 0.12s offset, at most 4px travel and 2px blur. All timing is a tuning target, not a claim of tested motion. Bound blur to the line content, not the page.

Play once per page entry; returning upward does not replay. If initialization is late, the heading is already visible, or restored history lands here, keep the final state rather than hiding visible content. A fast scroll past the section settles this local reveal. Reduced motion, JavaScript failure or unsupported enhancement leaves all content visible immediately. No font-loading gate or effect is required to read the ending.

## Shared UI and return behavior

- Extend the existing chapter tracker/rolling rows to **Outro — 04 / 04**. Keep its 35% reading line, hysteresis, accessible status and transform ownership. Do not synchronize chapter selection to the reveal's completion or create another chapter store.
- Desktop/tablet contextual footer: left **“The opening remains.”**; right **“STILLFORM / End of the study”**. Preserve current supported visibility rules and measured clearance. Below 600px, the in-flow Notes supplies context; no persistent footer is added.
- Keep the global negative cursor unchanged. The return link uses native link/focus behavior; no magnetic area or new pointer mode.
- Use the existing Lenis anchor integration where eligible; native anchor navigation otherwise. No new Lenis instance, long cinematic return duration or scroll lock. Wheel/touch/keyboard can interrupt the return. Reduced motion returns immediately.
- Keyboard activation must leave focus meaningfully at the beginning, without a second scroll jump; verify the existing top/wordmark destination and add only minimal focus handling if needed. Returning shows the settled Hero and never replays its entrance.

## Minimal implementation plan for Sol

After approval: add one native Astro `Outro` section after Archive with a semantic h2, paragraph, return anchor and Notes. Use scoped CSS and existing typography/gutter/clearance tokens; no assets or dependencies are needed. Extend only the shared chapter list, section lookup and header/footer label rows. Add one scoped GSAP timeline with a one-time ScrollTrigger and ordinary lifecycle cleanup; no React, Flip or separate cross-section controller.

First verify the complete static composition and navigation. Then add the restrained reveal and its fail-open/reduced-motion paths. Preserve Hero, Manifesto, Archive, their source assets and existing scroll/pointer infrastructure. This document authorizes no implementation.

## Acceptance criteria

- The ending is legible and complete without motion; the empty center remains the compositional signature.
- Review 1440, 1920, 2560, 3440, tablet, 390 and 360 widths, plus 320px and 200% text. No cropped words, unintended overflow or fixed-UI collisions; Notes can extend the document.
- Flow's image, moving bounds, observation and credit clear the Outro without overlap or a newly inserted empty viewport. Test slow and fast scrolling in both directions.
- Header/footer reach chapter 04 at the document end and reverse correctly; mobile retains no fixed footer.
- Reveal plays once, rests cleanly, and cannot leave hidden content after resize, font delay, failure, navigation or restored history.
- Return works with mouse, touch, keyboard, native scrolling and Lenis; focus remains usable and the Hero entrance does not replay.
- No new image, interaction system, pinning or changes to approved chapters.

**Evidence and scope:** the closing statement and deliberate return continue the [existing Outro narrative](EXPERIENCE_NARRATIVE.md). This proposal replaces its historical moss panel/photo crop with a mineral, typography-only ending. Current composition and ownership were checked in [Archive.astro](../../src/components/Archive.astro), [archive.ts](../../src/scripts/archive.ts), [archive data](../../src/data/archive.json), [site-header.ts](../../src/scripts/site-header.ts), [SiteFooter.astro](../../src/components/SiteFooter.astro) and [smooth-scroll.ts](../../src/scripts/smooth-scroll.ts). Earlier four-record/Flip plans and stale restrictions on Lenis/transition implementation do not describe the approved current project. No browser study, assets or production changes were made. **Pending human approval: copy, composition and restrained reveal.**
