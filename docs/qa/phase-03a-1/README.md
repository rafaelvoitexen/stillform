# STILLFORM — Phase 03A.1 static Hero polish

Implemented in `src/components/Hero.astro`. Awaiting human review; no motion or additional chapters.

## Focused changes

- **Tablet:** the image height now eases from the existing mobile frame to a 500px cap at 768px. At 768 × 1024 the frame is 617.59 × 500px instead of 617.59 × 650px. The headline remains 128px / 120.8px, weight 500. ABSENCE.'s line box moves from y=1020.08 to y=882.08 and ends at y=1013.28, with the complete word visible in the first viewport. The wider crop reveals more side walls while retaining the shaft, constriction and floor. No viewport-height fitting is used.
- **Mobile:** retained the 298 × 400px / 272 × 365.09px image frames, right offsets, 50% 50% positioning and headline scale. Mineral backing overlap is now at most 12px or 3% of image height, rather than 24px or 6%. Top backing padding decreases from 8px to 4px. More of the floor remains visible, with a closer optical connection between the photo boundary and the closing word. No letters are clipped.
- **Editorial UI:** replaced all inactive chapter labels with the noninteractive `01 / 04` indicator. The previous desktop header column width is reserved, preserving the wordmark and descriptor alignment. Removed “Scroll to read”. The remaining footer phrase is centered in the footer grid.
- **Desktop:** headline, photo, intersection, stage and supporting content retain their approved geometry. No typography, color, image asset or dependency changes.

These focused adjustments follow the new Phase 03A.1 instruction; earlier creative handoff and Phase 03A evidence remain preserved.

## Before / after screenshots

All are actual Astro development-server renders, captured at device scale 1 in Chrome 156 through Chrome DevTools Protocol. Chrome DevTools MCP is unavailable in this session. Browser scrollbar emulation is hidden for exact content-width comparisons; application CSS does not conceal overflow.

| Viewport | Before | After | Side-by-side comparison |
| --- | --- | --- | --- |
| 360 × 780 | [Before](before/360x780.png) | [After](after/360x780.png) | [Compare](360x780-comparison.png) |
| 390 × 844 | [Before](before/390x844.png) | [After](after/390x844.png) | [Compare](390x844-comparison.png) |
| 768 × 1024 | [Before](before/768x1024.png) | [After](after/768x1024.png) | [Compare](768x1024-comparison.png) |
| 1024 × 768 | [Before](before/1024x768.png) | [After](after/1024x768.png) | [Compare](1024x768-comparison.png) |
| 1280 × 800 | [Before](before/1280x800.png) | [After](after/1280x800.png) | [Compare](1280x800-comparison.png) |
| 1440 × 900 | [Before](before/1440x900.png) | [After](after/1440x900.png) | [Compare](1440x900-comparison.png) |
| 1600 × 1000 | [Before](before/1600x1000.png) | [After](after/1600x1000.png) | [Compare](1600x1000-comparison.png) |

Full-page compositions: [360px](after/360x780-full.png), [390px](after/390x844-full.png), [768px](after/768x1024-full.png), [1280px](after/1280x800-full.png). Before source is preserved as [Hero.astro.txt](before/Hero.astro.txt).

## Comparison and regression evidence

The main composition, from the photo's top through its complete frame height across the entire viewport width, is pixel-identical before/after at **1024, 1280, 1440 and 1600px**. This region includes the headline/photo intersection. Header, photo and headline geometry objects also match exactly. See [pixel regression](desktop-pixel-regression.json) and [verification](verification.json).

The 1440px main geometry remains Study 1: title x=30/y=132, 176px Onest 500, photo x=748.80/y=112, 655.19 × 650px, hard graphite/chalk boundary aligned to the photo. The mobile authored composition remains the same, with the explicitly requested refinement at its lower photo boundary. The Phase 03A desktop/tablet/mobile images were retained; the new before captures match that implementation.

All seven requested states were visually inspected. Additional 320, 600 and 900px captures and 1023/1024px breakpoint checks verify reflow and interpolation. No horizontal overflow was found.

## Build and accessibility validation

- Production `astro build`: passed, one static page. Astro/Vite compiles the existing TypeScript; no standalone type-check command is configured.
- `git diff --check`: passed.
- Exact PNG dimensions verified for all requested viewport captures.
- 200% root font-size simulation at 1440, 1024, 768, 390 and 320px: no horizontal overflow; stacking, emergency word wrapping, metadata and natural height remain usable.
- Local rendered platform font verified as custom Onest / Onest-Medium. Headline weight remains 500; credits remain at least 12px.
- Accessibility tree: one level-one heading, “Built around absence.”; only STILLFORM and E Vos are links. Keyboard traversal and visible focus verified for both.
- JavaScript-disabled and reduced-motion mobile full-page images have identical hashes to the normal static state.
- Blocked font/image requests, wide fallback-font rendering and throttled loading preserve readable content and reserved image geometry.
- No GSAP, other sections, extra effects or new dependencies were added.

Raw data: [before audit](before/audit.json), [after audit](after/audit.json), [validation audit](validation/audit.json), [supplementary checks](validation/supplementary-audit.json). Scripts: [capture](capture.mjs), [validation](validate.mjs), [supplementary](supplementary.mjs).

## Remaining limitations and tradeoffs

At 768 × 1024, all three words and the photograph are visible together; supporting copy and credits continue below the fold. The document naturally grows to 1157px rather than compressing the complete page. Mobile heights are approximately 838px at 360px wide and 889px at 390px wide: revealing more floor adds about 7–8px to the previous compositions. Shorter tablet viewports can still require scrolling to finish the heading. At 200% text sizing, preserving readable text takes priority over first-viewport composition.

The tablet photograph is deliberately broader and shows less vertical ceiling extent than its former portrait crop. The central opening and both concrete planes remain legible; the title scale was preserved instead of forcing the full document into one screen.

Safari, Firefox, physical devices, manual browser font-only zoom and a screen-reader listening pass remain unverified. Supporting copy remains provisional. Stop here for human visual review.
