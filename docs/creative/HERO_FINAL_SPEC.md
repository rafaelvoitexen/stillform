# STILLFORM — Current production specification amendment

**Phase 03B.4 · 26 October 2026 · Fluid layout and continuous zoom implemented for review**

The current production rules are in [HERO_FLUID_SYSTEM.md](HERO_FLUID_SYSTEM.md). They supersede the archived text below wherever it specifies a 1440px maximum page width, old image crop/scale, static left-edge assumptions, vertical headline travel, a light-corridor lettering mask, completed-transfer-before-headline timing, prior-entry suppression or older timing/deadline values.

Retain the approved Phase 03B.3 narrative and rhythm: opposing STILL / FORM motion; main headline entering from the left concurrently with image transfer; strict white over the actual photo aperture; replay on every eligible new entry; no replay for scrolling to the top within that entry. Phase 03B.4 adds a single monotonic inner zoom to the same CSS final crop, full-width fluid geometry, and a provisional subdued ABSENCE ink.

The new layout/crop screenshots and both ink alternatives await human visual approval. [Current QA and recordings](../qa/phase-03b-4/README.md) record the actual tested implementation and remaining limits. No other section or cross-section motion is in scope.

---

## Archived previous contract — retained historical evidence

The following prior document is preserved for research. Its conflicting implementation instructions are historical, not current production requirements.

# STILLFORM — Final Hero production specification

**Phase 02D · Approved direction consolidated 25 October 2026**

## Authority and scope

**Final concept: Occupied Void. Official baseline: Study 1 — Preserve the Cut.** Onest Variable is the sole family; the Hero uses weight **500**, with the exact three authored lines **BUILT / AROUND / ABSENCE.** Retain the mineral/graphite palette and E Vos photograph. Exploration is closed.

This specification and [Hero keyframes](HERO_KEYFRAMES.md) supersede conflicting proposals and pending-selection language in older documents. Earlier research, screenshots and proofs are historical evidence and must remain unchanged. The four chapters remain **Hero → Manifesto → Archive → Outro**; Notes belongs to the Outro, not a fifth section. The refined narrative is encounter an opening → read in the space it yields → redistribute attention among four observations → return to the opening.

**Next implementation scope: Hero only**, including its entrance. This handoff itself authorizes no application edits. Manifesto transition, Archive interaction and other sections are excluded from that Hero task.

Approved visual targets: [desktop 1440 × 900](proofs/onest/screenshots/study-1-desktop.jpg) and [mobile 390 × 844](proofs/onest/screenshots/study-1-mobile.jpg). [Study source](proofs/onest/study-1.html) and [CSS](proofs/onest/shared.css) establish appearance, **not production layout architecture**: do not port their absolute top offsets and fixed minimum heights wholesale.

The rules below are the requested production refinements, not new rendered studies. Only the existing target screenshots have been browser-verified; all new responsive rules require implementation QA.

## Composition and layout contract

Use a centered composition container, maximum **1440px** wide at the default text size. Let **W** mean its actual width, not the browser width including scrollbars. Above 1440px, center the complete composition; do not keep moving the image boundary outward while capping the type.

**Wide composition:** eligible at **1024px and above**, subject to the content-fit guard below. Use shared grid tracks for the photographic edge, metadata and text-color boundary. Main gutter **G = clamp(24px, 0.025W, 36px)**. Image left edge **P = 0.52W**, right edge **W − G**. Display optical left edge **L = G − 6px**. Keep BUILT and AROUND on mineral; only the ending of ABSENCE. intersects the dark image plane. No rotation, stroke, blend mode or stretching.

**Desktop reference geometry, 1440 × 900:** header top 30px; image x=748.8, y=112, width=655.2, height=650px. Heading line box starts x=30, y=132. Display size 176px, leading 1.02; add 45px before the third line. Caption row starts 21px below the image; supporting copy starts 7px lower than that row. Preserve this silhouette and crop.

Produce those positions through a header, a shared composition stage and following content rows. Header line-height is 1.2, with at least 52px between its bottom and the stage at desktop. Within the stage, the heading begins 20px below the image top. Photo height is **min(650px, photo width × 650/655.2)**. Stage height is the greater of the image height and the complete heading extent. Scale the third-line gap with the headline: **45 × F/176**. The caption/support row and footer follow the stage in flow. If text grows, the stage and following rows grow with it.

The Hero may have a **minimum** height of 100svh. It must never have a maximum viewport height or force all content into 900px/844px. At 1440 × 900, use available bottom space to place the footer about 25px from the edge; at shorter heights, preserve at least 22px after the content row and 25px bottom padding. Extra viewport height becomes breathing room below the main composition, not stretched photography.

## Responsive dimensions

Nominal values below assume a 16px root and unmodified text size. They are interpolation checkpoints, not six independent hardcoded layouts.

| Container width | Mode | G / image left | Headline opening / closing | Photo frame, approximately |
| --- | --- | --- | --- | --- |
| 1440 | Wide | 36 / 748.8px | 176 / 176px | 655.2 × 650px |
| 1280 | Wide | 32 / 665.6px | 156.4 / 156.4px | 582.4 × 577.8px |
| 1024 | Wide if fit guard passes | 25.6 / 532.5px | 125.2 / 125.2px | 465.9 × 462.2px |
| 768 | Stacked tablet | 24 / 126.4px | 128 / 120.8px | 617.6 × 650px |
| 390 | Stacked mobile | 20 / 72px | 72 / 68px | 298 × 400px |
| 360 | Stacked mobile | 20 / 68px | 66.5 / 62.8px | 272 × 365.1px |

For wide type, nominal **F = 176W/1440**. Express fluid type with a rem contribution rather than viewport units alone: the size rule is the equivalent of **clamp(6rem, 11rem + 0.122222W − 176px, 11rem)**. Here W is a length; the formula is a specification, not JavaScript to copy. Root-size changes must increase text, not be cancelled by fitting logic.

For stacked opening words use **clamp(3rem, 4.5rem + 0.184615W − 72px, 8rem)**. Closing word: **clamp(2.75rem, 4.25rem + 0.174359W − 68px, 7.55rem)**. All display type remains 500, −0.055em tracking, 1.02 leading. Use container-relative units or equivalent measured-container sizing; do not size against a wider viewport than the actual container.

### Stacked composition and focused mobile improvement

Stack below 1024px or when the wide composition fails its fit guard. Gutter is **clamp(20px, W/32, 24px)**; display optical left edge is **G − 3px**. The photograph starts at **G + 0.133333W**, ends at **W − G**, and has height **min(650px, width × 400/298)**. This retains Study 1's offset image inside the sentence rather than adopting Study 2's title-above-full-width-photo layout.

Header top 24px; allow approximately 48px from header bottom to the first title line. After the two opening lines, leave 34px before the photo. These are flow gaps, not fixed y coordinates. At 390px they reproduce approximately y=99 for the title and y=280 for the image.

**Refine ABSENCE. by reducing the image overlap from approximately 37px in the proof to 24px maximum.** Its mineral backing begins 24px before the photo's lower edge, rather than at a fixed page offset. Cap overlap at 6% of image height and never obscure the shaft's constriction. The closing word remains fully graphite with 8px top and 4px bottom breathing room. The backing covers the whole closing-line area to the container's right edge, preventing a residual dark sliver under the letters. Do not place chalk letters over the bright shaft on mobile.

Follow the closing line with 20px before supporting copy, then 20px before credits and at least 24px bottom padding. The taller 12px credits and reduced overlap may make the 390px composition roughly 880px tall with current copy; that is expected, **not a new fixed height**. Full-screen fit is subordinate to reading quality. At 768px the same structure naturally becomes taller still.

### Content fit, text resizing and intermediate widths

Wide mode requires the actual loaded-font right edge of AROUND to stay at least **8px before P**, and ABSENCE. to cross P while staying at least **16px before the photograph's centerline**. Neither opening word may touch the photo. Header columns need at least 24px clear separation. Reassess only when font readiness, container size or text size changes, not on every frame.

If any condition fails, use the stacked composition. **Do not shrink text below the requested text size, change tracking to cram it in, clip the page or hide overflow.** The 1024px row is a normal-size target, not a promise to retain two columns at every zoom setting.

Keep text and metadata in auto-sized rows. At 200% text resizing and 320 CSS-pixel reflow, let the page grow. If an individual display word cannot fit even in stacked mode, allow an emergency intra-word wrap as an accessibility exception; preserve the exact text, punctuation and reading order. Do not use horizontal scrolling or scaleX. Caption blocks wrap or stack rather than overlap. Browser zoom can trigger the stacked mode naturally; font-only zoom must also be tested.

## Typography and small editorial content

Onest Variable only; normal style; no synthetic bold/italic. Main headline is one accessible h1 in the order BUILT, AROUND, ABSENCE.; visual grid placement must not duplicate spoken content. On stacked screens the photograph may sit visually between the second and third lines while the accessible heading remains a coherent sentence.

| Element | Production treatment |
| --- | --- |
| Wordmark | STILLFORM, 550, 25px wide / 22px stacked, −0.045em, 1.2 leading; retain the study's 0.12em interval before FORM. Accessible name remains STILLFORM. |
| Header descriptor | 13px/1.4, 400, sentence case. Omit in stacked mode; do not squeeze it into the navigation. |
| Navigation | 13px wide / **14px stacked**, 400; 28px wide gaps. Preserve Manifesto / Archive / Notes on wide screens; stacked header retains Archive only. Use adequate link hit areas, at least 44px tall, without increasing the visible type weight. |
| Supporting copy | **Provisional:** “Architecture defines / the space that is not built.” 16px wide / **15px stacked**, 400, 1.45 leading, maximum 32ch. Let revised copy wrap and grow. Headline copy is locked. |
| Image subject and location | 12px/1.5, subject 500, location 400; wide location below subject. Mobile may omit location as in the approved target, retaining the building name. |
| Photographer credit | **0.75rem minimum (12px at default root)**, 400, 1.5 leading, graphite. Underline the photographer link with 3px offset. Never restore the 10px proof value. |
| Footer metadata | 12px/1.4, 400; left edition, center “Light. Mass. Interval.”, right scroll cue. Omit in stacked mode as in Study 1. |

Wide metadata aligns to P and the image's right edge; supporting copy aligns to G. On stacked screens, subject aligns to G and the credit to W−G, on a shared first baseline; give them 16px minimum separation. If their intrinsic widths no longer fit, stack the credit below with 8px gap and left alignment. Do not abbreviate or reduce the attribution size to fit.

Navigation destinations are `#manifesto`, `#archive`, and `#outro` (Notes). **Do not ship dead anchors during Hero-only work.** Render unavailable destinations as noninteractive labels or omit them, consistently with the static baseline; activate links only when real sections exist. The wordmark can link to the Hero's actual `#top`. A scroll cue is likewise noninteractive until its destination exists. No new menu or extra section is required.

Expand interactive hit areas into the header's surrounding free space without moving its optical baseline or changing the reference stage offset. If resized text needs a taller header, let it grow and push the stage down; baseline matching is only required at the default reference size.

## Color, photography and intersection

Mineral **#E5E8E4** is the page/backing; graphite **#292D2B** is all reading/UI text; chalk **#F7F8F5** is only the desktop intersecting portion of ABSENCE. Moss **#35463D** remains available for focus outlines; stone **#747D76** is not small-text color. No decorative gradient, glass panel, texture overlay or image contrast filter.

Use `object-fit: cover`, **50% 50% positioning**, the same uncropped source and the frame dimensions above. Do not pan the image at intermediate widths. Preserve the light shaft and both concrete planes; no image scaling during entrance. The mobile backing intentionally covers part of the floor, not the central opening.

The desktop color boundary is **P − L in the headline's local coordinate space**, derived from the same shared grid geometry as the photo. Use a hard edge, not a blend or soft gradient. It must stay stationary through vertical line entrance. If duplicate text layers are used for clipping, expose only one semantic heading. Reset to solid graphite in stacked/reflow mode.

Assets and credits:

- [Approved JPEG](proofs/assets/tulach-e-vos.jpg): 1920 × 1440, 236,795 bytes, E Vos, Tulach a’ tSolais, Oulart Hill, Ireland. Preserve “Photograph by E Vos / on Unsplash” with [source link](https://unsplash.com/photos/dark-concrete-hallway-with-bright-light-at-the-end-ela0A8rSxbw). Alt: “Two concrete masses frame a narrow shaft of daylight at Tulach a’ tSolais.”
- [Photo provenance](proofs/assets/asset-provenance.json) and [license/attribution research](HERO_ASSET_SHORTLIST.md) remain authoritative evidence. Individual architect/sculptor metadata is unresolved there; do not invent credits. Do not substitute an institutional photograph.
- [Local variable WOFF2](proofs/onest/assets/Onest-Latin-Variable.woff2), 33,760 bytes, weight range 100–900; retain the [OFL notice](proofs/onest/assets/OFL.txt). [Existing browser font verification](proofs/onest/font-verification.json) establishes the study font, not future production loading.

Later implementation may create correctly sized local image derivatives without changing the source crop or tone. Do not hotlink runtime font files or depend on a remote image endpoint. Reserve image dimensions; give the Hero image loading priority. The study copies are references, not an instruction to import application assets from the docs directory.

## Acceptance and handoff

Implement with native Astro markup, scoped CSS and TypeScript; GSAP directly for the entrance. No React island is justified for this Hero. No ScrollTrigger, Flip, Lenis, WebGL or Three.js is required for its entrance. Retain one clear animation owner and clean lifecycle teardown.

Verify at all six widths above, plus 320px reflow, intermediate widths and short/tall heights. At 1440 × 900 compare against the approved screenshot; preserve its type/image signature. At 390px compare composition and crop, allowing the explicitly specified larger credits, smaller overlap, text hierarchy and resulting height growth. Check keyboard focus, actual local font, image failure, slow font/image readiness, JS disabled, reduced motion, 200% text resize and no accidental horizontal overflow. Confirm the entrance ends at the same geometry as the static state.

The implementation agent should follow these production refinements rather than request a new artistic choice. Report concrete conflicts if the asset or layout cannot meet the invariants. **Only supporting copy and unresolved historical asset metadata remain editorial follow-ups; neither reopens the headline or direction.** Stop after the separately requested Hero implementation; do not infer authorization to build other chapters.
