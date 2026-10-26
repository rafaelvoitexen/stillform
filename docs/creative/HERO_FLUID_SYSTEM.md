# STILLFORM — Fluid Hero system

**Phase 03B.4 artistic baseline approved · Phase 03B.5 behavioral stabilization · 26 October 2026**

The cinematic narrative, fluid layout, continuous zoom and implemented ABSENCE ink are creatively approved. This contract supersedes conflicting geometry/crop rules in the archived portions of HERO_FINAL_SPEC, HERO_CINEMATIC_TIMELINE and HERO_KEYFRAMES. Historical research and QA remain intact. [Phase 03B.4 evidence](../qa/phase-03b-4/README.md) records the reviewed composition; [Phase 03B.5 stabilization](../qa/phase-03b-5/README.md) documents the latest behavior changes and pending runtime verification.

## Shared layout rule

The primary page and Hero use the entire available width. There is no global 1440px maximum or centered composition wrapper. Future Manifesto, Archive and Outro sections must use the same full-width rule and shared page gutters; those sections are not implemented here. Apply max-width only to readable copy or a specifically justified asset.

The page remains the inline-size query container. Shared gutter G is clamp(24px, 2.5cqw, 96px), with the authored mobile/tablet clamp(20px, 3.125cqw, 24px). Hero reflow caps its gutter at 24px. Paragraph copy retains its 32ch maximum. Metadata sizes and editorial copy are unchanged.

## Wide photograph and typography

Let W be the page's actual available width and Vh its viewport height. At ordinary text size:

- Photo height limit = min(max(650px, Vh − 250px), 1440px / 1.08).
- Photo width = min(0.48W − G, height limit × 655.2 / 650).
- Photo height = width × 650 / 655.2. Its right edge is W − G; P is its actual left edge. The wide frame retains the anchor aspect ratio, rather than stretching independently in X/Y.
- Optical headline left L = G − 6px. Headline size F = clamp(6rem, min(11rem + 0.12222222W − 176px, 11rem + 0.31 × photo height − 176px), 26rem). The rem contribution preserves user text enlargement.
- The third-line gap is clamp(0px, photo height − 3.2F − 20px, 45F/176). It eases down when height constrains ultrawide type, keeping the closing word inside the photographic field.
- ABSENCE endpoint = P + clamp(3.5rem, 0.4437F, 12rem). A native grid track and end alignment position the actual word; there is no per-frame positioning read or assumed fixed glyph width. Its static hard color stop is its own width minus that overlap.

1440×900 retains photo (748.8,112), about 655.2×650, F=176 and the original three-line silhouette. At wider aspect ratios the photograph becomes height-bounded, so ABSENCE intentionally shifts independently to bridge the mineral/photo boundary. BUILT and AROUND remain at the left optical margin.

Header columns span the usable viewport. Wordmark and edition remain left/right anchored; the descriptor occupies a fluid column. Captions share the photo tracks. The footer's middle text remains centered on the viewport; the edition and support remain at G. Metadata does not scale with the display typography.

Wide eligibility is font-aware: min-width calc(64rem + (100vw − 1024px) × .7). This reproduces the normal 1024px threshold while allowing CSS-only stacked reflow when text is enlarged, including with JavaScript disabled. The existing measured content-fit guard remains an additional enhancement. Enlarged-text stacked photography is independently bounded to a 650px-high source-aspect frame; this is an asset constraint, not a page maximum. Mobile/tablet retain their authored offset, 500px tablet height cap, 12px maximum backing overlap and natural document height.

## Continuous photographic crop

The real image and decorative inner proxy share object-fit cover, object-position 50% 50%, center origin and the CSS final scale: **1.06 wide, 1.04 tablet/reflow, 1.03 mobile**. The figure clips that internal scale. The master timeline has one inner-image tween from 1 to the CSS scale, beginning at expand and ending at handoff, using power1.out. No peak, reversal, zoomReturn label or scale reset exists.

The outer frame owns measured destination dimensions, clipping, uniform responsive fit and translation. It does not inherit the cinematic zoom. The actual final layout is measured after fonts/layout settle. Handoff replaces the proxy with the identically cropped real figure atomically. The authored closing-word backing must occlude both images consistently. The 450ms reservation and 6200ms fail-open protections remain.

Phase 03B.5 supersedes the earlier interruption policy: pointer, focus, keyboard, scrolling and viewport changes do not settle or restart the current entry. Changed geometry is reconciled while retaining timeline progress. Reload navigation explicitly starts at the top, with manual native scroll restoration for initialization; history traversal preserves restored positions. Reduced motion, asset failure, navigation disposal and genuine deadline fallbacks remain. There is no scroll lock or persistent visited flag.

Desktop rhythm remains 4.43s, tablet 3.79s, mobile 3.59s. Transfer and BUILT begin together at 2.60 / 2.20 / 2.05s; subsequent line offsets and opposing STILL/FORM motion remain those approved in Phase 03B.3. Temporary lettering targets two thirds of usable width, subject to its existing 72vh two-line height guard, and uses fixed tracking. Its blur surfaces are bounded to the measured glyph widths without changing positions.

## ABSENCE alternatives

Only the mineral-side ink changes. A = **#787c79**, approximately 58% graphite-equivalent, contrast **3.43:1** on mineral; B = **#656966**, approximately 68%, contrast **4.51:1**. Both meet large-text AA at the authored sizes. B is the approved implementation; A remains historical comparison evidence. The photo-side chalk remains fully opaque; no heading-wrapper opacity is reduced. Animation copies share motion drivers and resolve to the same final ink, preventing a cleanup color jump.

## Asset and acceptance limits

The licensed local E Vos source remains 1920×1440. The wide height cap reserves enough source pixels for both tested desktop crops, 1.06 and 1.08, at DPR 1. Ultrawide DPR 2 exceeds this source's detail budget; report that limitation rather than manufacturing an upscaled replacement. Retain attribution and licenses.

Approved Phase 03B.4 static screenshots cover all eleven requested viewports, including 3840×1600. Compare animated, reduced-motion and JS-off output against that baseline. Keep the historical 1440 old/new comparison. Phase 03B.5 runtime fixes still require human verification; they do not authorize new artistic changes. No other chapter, ScrollTrigger or new application dependency is authorized.
