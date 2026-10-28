# Archive — A Field of Intervals

Phase 05A · 27 October 2026 · Creative proposal for review, not an implementation specification validated in-browser.

## Recommended composition

**Four photographs, unequal amounts of space, one field of attention.** The contact sheet presents relationships before individual projects. Selecting a record redistributes the same field; it does not open a separate viewing environment.

Section title: **ARCHIVE**. Introduction: “Four observations on how a place is made perceptible.” Instruction, once enhanced: “Select a record to give it space.” Initial record titles: **Threshold / Passage / Weight / Release**. These are editorial themes, not verified building names.

Use two asymmetric registers on a 12-column grid. At 1440px, retain the shared 36px page gutter; use approximately 24px column gaps and 64px between registers. Grid columns below are inclusive:

| Record | Position and frame | Compositional role |
| --- | --- | --- |
| 01 Threshold | Upper register, columns 1–6; 3:2 landscape | Largest first encounter; establishes a broad field containing a small opening |
| 02 Passage | Upper register, columns 9–12; 4:5 portrait, max 360px wide, right-aligned; 64px lower | A narrower, compressed counterweight; columns 7–8 remain open |
| 03 Weight | Lower register, columns 3–6; 4:5 portrait, max 320px wide, left-aligned | Draws attention inward, beneath the first landscape rather than directly beneath its edge |
| 04 Release | Lower register, columns 7–12; 3:2 landscape, 80px lower | Opens the field again and gives the next chapter a quieter point of departure |

Offsets are starting art-direction targets; enlarged text and short viewports must grow naturally. Do not fit all four images into one screen. The section is an edited sequence with a coherent overall map, not four equal cards. No borders, shadows, tile backgrounds or overlaid titles. Caption each photograph 12–16px below its edge: record number and title first, verified location/credit beneath. Keep factual credits available in both states.

ARCHIVE is smaller than the Manifesto statement: Onest 500, roughly 64–104px on desktop, −0.05em tracking, 1.0 leading; 44–56px mobile. Record titles 18–22px/500; reading text 16–20px/400, 1.5 leading, maximum 34ch; metadata at least 12px. Mineral continues uninterrupted. Graphite carries text; photographs supply tonal density. No monochrome filter is assumed: accept restrained natural concrete, earth and vegetation tones; reject a mixed set of saturated skies and heavy grading.

The Manifesto's opening becomes several intervals between photographic masses. Preserve its existing exit and let Archive enter through ordinary flow. The final landscape should offer visual release, with room after its caption; do not require deselection before continuing to Outro or design the Outro here.

## Fluid composition

Use the existing full-width query container and `--page-gutter`. Asset caps below constrain individual images, never the section. Keep image positions tied to outer/grid alignments when their widths stop growing.

| Width category | Contact sheet | Focused arrangement |
| --- | --- | --- |
| 1440 | Grid above; landscape width approximately 672px | Selected figure spans columns 1–8; reading area and three alternatives occupy 10–12; column 9 is the interval |
| 1920 | Same map; landscapes cap at 880px; portraits 400/360px; offsets remain bounded | Selected frame fits an 1100 × 760px box, retaining its record ratio; right column carries a horizontal strip of alternatives below the note |
| 2560 / 3440 | Landscapes cap at 1040/1120px; portraits at 440/480px. First landscape stays left, last stays right; interior anchors stay on grid. No wider paragraphs or multiplied offsets | Selected frame fits a 1320 × 880px box. Right reading/alternative area caps at 640px and stays right-aligned. Remaining width becomes a deliberate separating interval |
| Tablet 600–1023 | Six columns: landscapes span all six; portraits occupy four, alternately right/left. Preserve record order and shorten offsets to 24–40px | Selected record expands within its existing position; other images become compact, captioned figures in the same vertical sequence. No jump to a desktop feature slot |
| Mobile below 600 | One ordered sequence: landscapes full width, portraits approximately 82% wide with a consistent right edge. 32–48px between records | Same in-place model; selected portrait gains full usable width, landscapes are already full width. Other images reduce to about 52% width; their labels retain normal type size. The note opens beneath the selected image |

The wide feature/rail arrangement requires content fit, not width alone. Use the in-place arrangement for enlarged text or insufficient usable height. Do not squeeze metadata beneath fixed UI or shrink user text. Photography keeps **one aspect ratio and focal point per record across its states**, including mobile; hierarchy comes from size and placement, not an animated crop.

## Four photographic briefs

Notes below are proposed observations to validate against final photographs, not factual descriptions of unidentified buildings.

| Record | Image requirement and draft observation | Resolution after the intended crop |
| --- | --- | --- |
| Threshold | Frontal or slightly oblique concrete enclosure; small opening within broad mass, low sidelight, calm and weighty. 3:2 landscape; keep both wall edges and the opening. “The wall occupies most of the frame. The opening determines where the eye goes.” | Aim ≥3000 × 2000; supports the 1320 × 880 focus cap near 2× without artificial enlargement |
| Passage | Receding passage, compressed perspective, directional sunlight across the floor. 4:5 portrait; preserve the exit and light path, not just an abstract surface. “Light draws a route through the enclosure before the body follows.” | Aim ≥2000 × 2500; local study image may support a smaller working crop |
| Weight | Curved or intersecting concrete planes around an upper opening, diffuse light, tactile surface. 4:5 portrait; retain the aperture and enough floor/doorway to convey scale. “A narrow opening makes the surrounding concrete feel heavier.” | Aim ≥2000 × 2500; assess retained crop pixels before assigning a 2× rendition |
| Release | Open court or interval between masses, soft horizon or bright empty field, quieter contrast. 3:2 landscape; absence should dominate without becoming an empty sky image. “Beyond the enclosure, the distance between surfaces becomes the subject.” | Aim ≥3000 × 2000; same focused landscape cap |

### Existing assets inspected

The [existing shortlist](HERO_ASSET_SHORTLIST.md) and [provenance record](proofs/assets/asset-provenance.json) document source/license checks on **25 October 2026**. This phase reuses that evidence; it does not claim a new license audit or download.

- **E Vos, Tulach a’ tSolais:** production file [1920 × 1440](../../public/images/tulach-e-vos.jpg); recorded offered original 4242 × 3181. Already approved for Hero; the Manifesto reveal also reuses it. Keep it there. It can temporarily stand in for Threshold during later layout work, clearly marked as a duplicate study asset, but should not become another final repetition. [Source](https://unsplash.com/photos/dark-concrete-hallway-with-bright-light-at-the-end-ela0A8rSxbw).
- **Anastashia Nadya Angkasa:** [local 1600 × 2408 study](proofs/assets/passage-anastashia-angkasa.jpg); recorded original 2652 × 3991. Candidate for Passage. Visually inspected: warm concrete, strong diagonal floor light, dark enclosure and greenery at the exit. A 4:5 crop needs review to preserve the light path. “Setre Marina Lake Biwako” is the photographer's recorded location, not independently verified authorship. [Source](https://unsplash.com/photos/modern-architectural-passage-with-sunlight-and-shadows-XnAubvnRnYU).
- **Mattia Revelant:** [local 1600 × 2400 study](proofs/assets/curved-mattia-revelant.jpg); recorded original 4160 × 6240. Candidate for Weight. Visually inspected: curved concrete and upper aperture are useful; cars/buildings visible through the lower opening may weaken the edit. Do not erase them or invent a building attribution. Building/location remain unresolved. [Source](https://unsplash.com/photos/curved-concrete-walls-in-park-wWFy4g4iOHs).
- **Threshold and Release:** no final images selected. The institutional Salk/Barragán reference images are not production-cleared substitutes. A labeled existing-photo placeholder can unblock 05B; do not present four crops of one photograph as four authentic records.

All three recorded candidates carried the Unsplash License at the prior check; only Tulach is currently a production asset. Before release, record source URL, creator, license evidence, original dimensions and crop; resolve or explicitly omit unknown factual metadata. Do not invent architects or claim exhaustive third-party clearance. Use responsive derivatives from legitimate originals, never upscale a study JPEG to satisfy the pixel target.

## Review decision

Recommend this uneven two-register field over an equal four-across strip: it gives each spatial observation a different scale while retaining a legible order. Its cost is a taller section and a deliberate switch to in-place interaction on smaller layouts. Approve composition, four themes and photographic briefs before 05B. Final assets and crop approval remain open; no new brand direction is proposed.

Basis: [original narrative](EXPERIENCE_NARRATIVE.md), [Spatial Recomposition refinement](ART_DIRECTION_REFINEMENT.md), [technical research](../research/TECHNICAL_PATTERNS.md). The old disclosure-only Archive concept is superseded by this proposed layout interaction; completed sections remain unchanged.
