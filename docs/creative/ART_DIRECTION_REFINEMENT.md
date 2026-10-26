# STILLFORM — Occupied Void, refined

**Phase 02B · 25 October 2026 · Static Hero studies, awaiting creative approval**

Occupied Void is provisionally selected. This refinement increases expression within that concept; it does not revive Chromatic Memory or approve production work. Start with the [four rendered proofs](HERO_VISUAL_STUDY.md).

## What changes

**Architecture defines the space that is not built.** The page should enact that proposition: a photographic opening, an interruption in the composition and a deliberate opening in motion.

The earlier proposal was too polite: a small left-hand statement beside a photograph could belong to many architectural sites. Its generic mask entrance and text disclosure did little to express the subject. Replace that treatment with a more consequential relationship:

- **Type behaves like mass.** Large, tightly fitted words approach or cross a photographic edge. They remain readable and do not cover the photograph's central opening.
- **Negative space interrupts something.** In A, a mineral rectangle removes a lower corner of the photographic field. In B, a photograph interrupts the sentence's flow, especially on mobile. It is not leftover padding.
- **The frame is part of the argument.** Photographs retain real geometry and texture; no perspective warp, synthetic light or invented architecture.
- **Motion changes the role of the interval.** The Hero's visual gap can become a reading space; selecting an Archive record can redistribute the surrounding composition.

Two Hero alternatives test this with **the same licensed photograph, palette and font pair**, avoiding a comparison driven simply by different assets.

## Typography: challenge the earlier pairing

| Option | Assessment | Decision for these proofs |
| --- | --- | --- |
| Archivo + Source Serif 4 | Clear hierarchy, but the normal-width sans/reading-serif pairing did not establish enough character in the earlier proposal. | Retain as historical research; not the default for the refinement. |
| Bricolage Grotesque + Instrument Sans | Bricolage's irregular proportions and substantial counters give large words a more specific silhouette. Instrument handles small captions without competing. | **Rendered in both variants.** Bricolage 600; Instrument 400 for the visible small text. A 500 Instrument file is also retained for study. |
| High-contrast display serif | Could make the typography more dramatic, but would push this concept toward a literary/luxury identity and weaken the relationship between letterform and architectural mass. | Considered, not rendered or recommended. |

Primary sources: [Bricolage's official specimen](https://ateliertriay.github.io/bricolage/) and [repository](https://github.com/ateliertriay/bricolage); [Instrument Sans repository](https://github.com/Instrument/instrument-sans). The bundled font license notices are in [proof assets](proofs/assets/). Fonts are local study files, not an installed production system.

**Actual proof typography:** A uses a 102 px desktop / 61 px mobile headline; B uses 228 px desktop, with 96 px opening words and an 84 px closing word on mobile. Small reading text is 14–17 px; photographic credits are intentionally secondary. No font-axis animation or letter stretching is proposed.

**Copy tested:** A: “The shape of absence.” B: “Built around absence.” The latter is stronger because “around” describes both architecture and the layout. The previous “Space, held still” is retired in these studies: it states a mood without making the spatial relationship explicit.

## Palette and framing

Preserve the proposed mineral **#E5E8E4**, graphite **#292D2B**, chalk **#F7F8F5**, moss **#35463D** and stone **#747D76**. The proofs rely on mineral and graphite; B changes the intersecting end of the title to chalk over the photograph's dark side. This is a hard color boundary, not a decorative gradient or translucent treatment.

The photo is already monochrome; no filter was added. Both compositions keep the light shaft recognizable. The large landscape treatment in A loses more roof/floor context; B's narrower frame retains more of the central vertical sequence. Mobile crops are composed separately rather than scaled-down desktop layouts.

The editorial rule is now **one meaningful interruption per composition**. Do not distribute notches, split words, rules or masks across every record.

## ONE Hero-to-Manifesto signature — The void takes the page

**Status:** proposal only. No transition, Manifesto layout or GSAP timeline has been implemented.

| Question | Recommendation |
| --- | --- |
| Artistic purpose | Turn the empty space in the photograph into the space in which the manifesto is read. This gives the transition a narrative consequence, beyond revealing an image. |
| Initial state | The complete, settled Hero. The photograph reads as one image; its central light shaft is visible. The heading is already readable. No loader or mandatory entrance is needed. |
| Change | On continuing downward, two clipped portions of the same photograph recede laterally from the opening. The heading leaves as a block. Mineral ground appears between them, making the visual gap wider. |
| Final state | A readable central area occupies the former interval, with small remnants of photographic mass at its edges before ordinary flow takes over. The building is not depicted as physically splitting: this is an explicitly editorial frame transition. |
| GSAP / CSS technique | Two overflow-clipped image windows using the same registered image coordinates, transform-based motion, one short ScrollTrigger-owned passage. A single controller coordinates image windows and heading. Use a stationary wrapper only for that passage if needed. |
| Complexity | **Medium.** The effect is simple; responsive registration, reverse scrolling and clean handoff into normal flow require care. No SVG mesh, WebGL, canvas or image segmentation. |
| Performance implications | Two large composited surfaces can consume memory. Reuse one source image, size it to the display, avoid filters, and remove temporary promotion after the passage. No per-frame layout reads or hundreds of mask pieces. |
| Simplest viable implementation | Two rectangular clips and horizontal transforms; no traced silhouette of the actual opening. Keep the full static photo underneath until the transition is ready. Limit the effect to one scene. |
| Mobile / reduced motion | On a narrow screen, a single crop clears the reading area through a short frame transition; do not squeeze text between two slivers or require a long pinned scroll. Reduced motion uses the settled Hero followed by normal reading flow. |

The central slit in the selected photo supports this idea unusually well. Registration is asset-specific and must be defined after the Hero variant is approved. No promise of precise timing or smooth frame rate is made before a motion prototype.

Source basis: the Phase 01 findings on coordinated scene ownership and CSS sticky, plus [official ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). The two-panel editorial mechanism is a new proposal, not an extracted OH or Atelier effect.

## ONE Archive signature — Contact sheet to spatial reading

**Status:** proposal only. No Archive UI or animation has been built.

| Question | Recommendation |
| --- | --- |
| Artistic purpose | Selecting a record gives that space more room. The Archive physically redistributes attention instead of merely exposing a paragraph. |
| Initial state | Four photographs form a compact contact sheet. Each has a visible title and a selection control. |
| Final state | The selected photograph becomes a large 3:2 figure; the other three become a small, ordered rail. A concise observation occupies the interval beside the enlarged figure. “All observations” returns to the contact sheet. |
| GSAP / CSS technique | Two explicit CSS layout states and Flip to preserve the figures' spatial continuity. Keep each image at the same 3:2 ratio at both endpoints so uniform scaling does not distort architecture. Reveal the note separately with opacity. |
| Complexity | **Medium**, bounded to four records and one active selection. No drag, filtering, infinite gallery, modal or route transition. |
| Performance implications | Four figures change layout once per selection; transforms bridge the states. Reserve stage space to reduce scroll jumps. Limit decoded source sizes and avoid scaling a tiny raster into the featured position. |
| Simplest viable implementation | One grid/featured toggle, one selected record, four existing DOM figures and a shared note region. No cloned portal system or per-frame React state. The tiny rail need not itself be interactive during transition. |
| Interruption / accessibility | Keep selection on explicit click/tap/keyboard activation. Preserve focus and record order, identify the selected item, and finish/cancel the current transition before another selection. Reduced motion changes layout immediately. |
| Mobile | A full-width selected image with three smaller choices below it, with the observation in ordinary flow. Maintain image ratio and avoid horizontal scroll interception. |

[Flip's documented state-capture model](https://gsap.com/docs/v3/Plugins/Flip/) fits an actual layout change. It is now justified by the interaction, rather than included as a portfolio checklist item. A small Astro client script can own this state; React remains optional only if later requirements materially expand it.

## Continuity across exactly four sections

| Section | Refined role | Continuity rule |
| --- | --- | --- |
| **01 — Hero** | Encounter architectural mass and a meaningful opening. | One interrupted composition; complete static image/text relationship first. |
| **02 — Manifesto** | Read in the space the Hero opens. | The photographic interval becomes a reading interval. This replaces the earlier independent sticky-image emphasis, rather than adding another signature effect. |
| **03 — Archive** | Grant a selected spatial observation more room. | The same principle of redistributing mass and space becomes user-controlled. This replaces simple disclosures. |
| **04 — Outro** | Return to the original opening with context. | Reuse the first image/detail and a normal return anchor. Add no third major motion system. |

This table refines narrative intent only. It does not develop or implement the three later sections.

## Originality, scope and recommendation

The individual ingredients—large type, clipping and Flip—are established techniques. **Originality is the specific relationship:** architecture, letterforms and selection all negotiate the amount of space left open. Do not claim an unprecedented technical invention.

Recommend **Hero variant B — The cut**, supported by the actual [visual comparison](HERO_VISUAL_STUDY.md). It is more assertive on both screen sizes and has a clearer authored sentence/image relationship. A remains a credible choice if photographic breadth should outweigh typographic tension.

Keep the engineering investment concentrated in the two proposed signatures. Native Astro content, native scrolling and direct GSAP remain sufficient. Lenis, WebGL, Three.js, a backend, an animation registry and hydrated editorial sections are unnecessary.

**Approval boundary:** the static proofs are complete visual studies. The motion descriptions are unimplemented recommendations. Hero selection, keyframes and production assets remain for human review; the production application and AGENTS.md are unchanged.

