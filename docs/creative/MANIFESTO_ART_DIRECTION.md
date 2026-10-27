# STILLFORM — Manifesto art direction

Phase 04A · 26 October 2026 · **Two proposals for human approval; no production implementation.**

Recommend **A — The Inhabited Interval**. A reading passage interrupts a monumental sentence: the space the Hero opens becomes a place for language. Start with the [actual visual study](MANIFESTO_VISUAL_STUDY.md).

## Approved context and evidence

Occupied Void, Onest Variable, the mineral/graphite palette and the four chapters remain fixed. [HERO_FLUID_SYSTEM.md](HERO_FLUID_SYSTEM.md) and AGENTS.md supersede historical capped layouts and entrance interruption rules. The [Phase 03B.5 report](../qa/phase-03b-5/README.md) records source changes but no new browser captures. This study inspects the current Hero markup/CSS and uses the unchanged [03B.4 settled Hero](../qa/phase-03b-4/settled/1440x900.png) as visual evidence; it does not claim new Hero runtime validation.

The research's verified lessons are hierarchy before effects, uneven emphasis within a disciplined grid, and Astro editorial markup enhanced directly with GSAP. See [reference teardown](../research/REFERENCE_TEARDOWN.md), [technical patterns](../research/TECHNICAL_PATTERNS.md) and [implementation opportunities](../research/IMPLEMENTATION_OPPORTUNITIES.md). Specifically:

- OH's unequal photographic emphasis informs scale relationships, not a borrowed layout. [Original reference](https://www.oharchitecture.com.au/).
- Atelier's typography-led rhythm and native Astro composition support a section whose strongest event is editorial. Its fonts, pixel boundary and distinctive design are not reused. [Pinned source](https://github.com/codrops/atelier-north/tree/6703fc3f15ec92979964070814a99855d0baa38f).
- Reference C's coordinated scene ownership supports the later transition. The two-window withdrawal and both compositions here are **new proposals**, not recovered reference effects. [Existing C research](../research/TECHNICAL_PATTERNS.md).

No new visual reference hunt or new photographic asset was necessary. [ART_DIRECTION_REFINEMENT.md](ART_DIRECTION_REFINEMENT.md) supplies the useful rule: one meaningful interruption per composition. Historical font proposals and old scroll-to-settle behavior are not adopted.

## A — The Inhabited Interval / typographic monumentality

**Statement:** WHAT WE / LEAVE OPEN / LETS US … SEE.

**Reading passage:** “Light enters where mass stops. An opening gives the eye a passage, and the body a sense of scale.”

**Marginal observation:** “[ THE INHABITED INTERVAL ] / Space is never neutral.”

**Closing copy:** “We collect the moments when an absence becomes perceptible.”

The first two lines form an offset lintel. A horizontal band interrupts the sentence before LETS US / SEE. The paragraph occupies the right of that band, in the territory vacated by the photograph. The eye crosses open space to complete the sentence. This is a different silhouette from the Hero's left stack/right image: there is no final photograph, and the closing line spans both page edges.

At 1440, a 12-column grid has 36px outer gutters and 20px internal gaps. WHAT WE starts at the left gutter; LEAVE OPEN starts on column 3; the paragraph starts on column 9, approximately x=961px. LETS US and SEE. face each other across the width. Annotation aligns with LEAVE OPEN. At ultrawide, the page stays full width while type caps at 250px and body at 24px/28ch. The interval is bounded by content and a modest height-dependent minimum; it is not a full empty viewport.

| Role | Rendered system |
| --- | --- |
| Display | Onest 500; −0.065em; 0.98 line-height; wide `clamp(80px, 3rem + 7vw, 250px)` |
| Tablet | `clamp(3.5rem, 2rem + 7vw, 7.5rem)`; paragraph moves to columns 7–12 |
| Mobile | `clamp(2.5rem, 1.5rem + 6.5vw, 4rem)`; −0.06em; 1.04 leading; LEAVE OPEN indented one track |
| Reading | Onest 400; 17–24px, 1.5 leading; mobile 17px/1.45, starts on column 4 |
| Metadata | Onest 400, 12px/1.45–1.5; no new oversized section numeral |
| Color | Mineral ground; graphite text; moss closing SEE.; no opacity reduction, gradients or textures |

Mobile preserves the interrupted sentence but stacks LETS US and right-aligned SEE. The annotation and paragraph are vertically separated, not squeezed side by side. All text remains in flow, with a minimum section height rather than fixed height. The prototype uses viewport units because it is a standalone full-width page; future production should use the existing page query container/gutter contract.

**Critical reservation:** the moss ending is subtle and optional at approval; the concept must survive in all graphite. Tablet has a generous interval below the final line, and ultrawide creates a long eye journey. These are visible tradeoffs, not claimed universal improvements.

## B — Three Ways of Seeing / editorial spatial composition

**Statement:** SPACE IS / FELT BEFORE / IT IS NAMED.

**Opening passage:** “A building reaches beyond its edges. We read it through what moves, what holds, and what remains open.”

| Observation | Copy |
| --- | --- |
| LIGHT | Changes the room without moving a wall. Each hour draws another boundary. |
| MASS | Gives the opening its weight. Concrete makes a small interval feel immense. |
| ABSENCE | Leaves room for the body. A pause between surfaces becomes a place to stand. |

The upper statement and lower diagonal of observations form two different reading speeds. Three editorial indices identify the observations; they are not controls or extra chapters. Thin stone rules terminate their columns. All text is graphite on mineral.

Wide grid: 12 columns, 24px gaps, shared outer gutters. Heading occupies columns 1–6; opening passage 9–12. Each observation spans four columns; vertical offsets are 0/44/88px at 1440. Headline Onest 500, −0.065em, 0.98 leading, `clamp(64px, 2rem + 4.1vw, 174px)`; observation titles 48–156px/1.05. Body 16–22px/1.5, max 27ch. Mobile removes the diagonal: an indented introduction followed by three aligned, compact observations, 38px titles and 15px body. This is intentionally denser than A.

Its opening passage can receive the same right-hand cleared field. The later observations then enter ordinary flow together, with no sequential reveal effect. **Weakness:** on mobile it becomes a familiar editorial list; the three-part argument is informative but less distinctive than A's inhabited sentence.

## Critical comparison

| Criterion | A | B |
| --- | --- | --- |
| Artistic sophistication | Strong figure/ground argument; one decisive interruption | Carefully paced editorial hierarchy |
| Originality | Copy and interval perform the same idea | More familiar magazine composition |
| Typography | Large phrase remains coherent across an occupied pause | Greater range of reading scales, less singular silhouette |
| Occupied Void | Absence is structurally necessary | Absence is discussed alongside light and mass |
| Hero continuity | Transfers photographic opening into the sentence's pause | Transfers opening into introductory column |
| Desktop | Stronger memorable frame | More information and denser rhythm |
| Mobile | Preserves asymmetry and the pause | Clear but resembles a list of principles |
| Ultrawide | Rendered; full-width closing line, capped type/body | Fluid rules authored; ultrawide not rendered |
| Motion potential | Withdrawal has a precise editorial destination | Withdrawal works, but is less essential to composition |
| Feasibility | Low layout / medium transition | Low–medium layout / same medium transition |

Choose A for the stronger conceptual and visual consequence, not merely for fewer elements. Keep B as a genuine alternative if editorial explanation should outweigh a memorable single statement. Both need no React, new font, image production or heavy animation system.

**Approval requested:** composition A or B, exact Manifesto copy, and the proposed transition receiving geometry. No choice here changes the approved Hero or authorizes production work.
