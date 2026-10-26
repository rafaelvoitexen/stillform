# STILLFORM — Art direction proposal

**Phase 02 · 25 October 2026 · Two proposals for human creative approval**

**Recommendation: A — Occupied Void. This is a recommendation, not an approved direction.** Both proposals remain viable. Approval selects a concept for the subsequent Hero art-direction, keyframe and asset-definition phase; it does not authorize implementation.

Companions: [four-section narrative](EXPERIENCE_NARRATIVE.md) · [visual reference board](VISUAL_REFERENCE_BOARD.md).

## 1. What the research establishes

Reviewed in full: [Reference teardown](../research/REFERENCE_TEARDOWN.md), [Technical patterns](../research/TECHNICAL_PATTERNS.md), [Implementation opportunities](../research/IMPLEMENTATION_OPPORTUNITIES.md), the root [AGENTS.md](../../AGENTS.md), and [README.md](../../README.md). The latter supplies starter-project context, not an existing visual identity. Guidance applied: frontend-design, GSAP core, timeline, ScrollTrigger, React lifecycle and performance skills.

The table separates **observations/source findings** from **new creative interpretations**. Neither reference's popularity nor a technique's presence proves award quality, usability or performance.

| Area | Verified Phase 01 evidence | Interpretation proposed for STILLFORM |
| --- | --- | --- |
| Composition | OH uses a measured 12-column grid with unequal image spans and portrait/landscape proportions. Atelier also defines a responsive 12-track grid. | A stable alignment can carry authorship without regular cards. A uses one persistent vertical edge; B uses paired images sharing a baseline. |
| Typography | OH makes large scale contrasts within PP Neue Montreal. Atelier pairs Anton with Kode Mono; title entrances are source-confirmed. | Give display and reading text distinct jobs. Do not inherit either reference's fonts, wordmark proportions or characteristic all-caps/mono pairing. |
| Photography | OH's crop ratios and cover behavior are runtime-confirmed. Atelier's canvas resolves into photographs while its scale settles. | Treat the final photograph as the composition's anchor. A studies mass around an opening; B studies the relationship between a whole space and a material detail. |
| Motion | OH menu and text sequencing were observed, but its original animation code was unavailable. Atelier's pixel reveals and C's coordinated masks were inspected in source. | Use one visual grammar per direction. A reveals across an edge; B brings related views into association. These are original adaptations, not recovered OH algorithms. |
| Stack | Atelier uses Astro layout/page/card components and direct scripting without React. C coordinates image/text in a master scroll sequence. | Render editorial content in Astro. Give cross-section motion one lifecycle owner, with small section responsibilities. A centralized controller need not become Atelier's large global script. |
| Impact versus cost | The research prioritizes hierarchy, unequal image emphasis, simple masks, selective sticky composition and lifecycle ownership. | Spend effort on crops, spacing and interruption-safe transitions. Omit pixels, dense SVG blinds, forced long stages and inertial scrolling unless a later prototype proves their artistic necessity. |

Research limits still apply: sequential frames are not timed motion recordings; no measured FPS/Core Web Vitals or physical-device audit was completed. The Phase 01 mobile findings concern those references, not the unbuilt proposals below.

## 2. Shared editorial scope

STILLFORM is an authored archive about how architecture is perceived. It has no studio services, client logos, project enquiries or invented agency credentials.

Both proposals use exactly four chapters: **Hero → Manifesto → Archive → Outro**. A deliberately small first edition contains **four records**, each with one principal photograph, a short observation, verified attribution and one detail view where useful. The Hero and Outro reuse imagery from that edition. Four strong records are preferable to a large inconsistent gallery.

Draft categories describe perception: **Threshold, Interval, Weight, Reflection**. These are editorial themes, not invented building names. Building, architect, location and photographer facts must be verified when assets are selected. STILLFORM is fictional; the authorship of any real building or photograph is not.

Each direction needs two font families at most. Direct chapter links replace a theatrical menu. The site must remain compelling as a static editorial page, with readable content and useful controls when motion is reduced or unavailable. Desktop and mobile receive different crops and compositions, while retaining the same reading order.

All dimensions, colors, text and layout roles below are **proposed art-direction targets**, not recovered reference measurements or final implementation specifications. Type must be fitted to the chosen assets and real copy in the next phase.

---

## 3. Direction A — Occupied Void

### A. Creative concept

**Central idea:** architecture gives shape to what is not built. A courtyard, doorway, gap or band of sky becomes the archive's subject; concrete and stone make that absence legible.

**Emotional intention:** gravity, concentration and a brief sense of suspension. The visitor feels the weight of the building before noticing the precision of the empty space.

**Visual signature:** a single off-center alignment separates a compact typographic field from a large photographic mass. This is an **empty interval and shared image/text edge**, not a decorative line drawn down the page. Across the four chapters, the same alignment changes function: threshold, reading edge, archive margin, final opening.

**Why it fits:** the name STILLFORM becomes an observation about spatial perception. Monumentality comes from proportion and photographic evidence, without oversized branding, an agency presentation or simulated 3D.

### B. Visual system

#### Type

Primary: **Archivo**, normal width, roman, 400/500/600. Secondary: **Source Serif 4**, roman 400, restricted to reflective reading passages. Sources and availability are documented in the [board](VISUAL_REFERENCE_BOARD.md#type-and-sourcing-references).

| Role | Desktop target | Mobile target | Treatment |
| --- | --- | --- | --- |
| STILLFORM masthead | 24 px / 500 | 20 px / 500 | Uppercase wordmark only; modest tracking |
| Hero statement | 96–112 px / 600; line height 0.96 | 54–64 px / 600; line height 1.00 | Archivo; close but readable spacing, approximately −0.035em |
| Chapter statement | 60–80 px / 500; line height 1.04 | 36–44 px / 500; line height 1.08 | Sentence case; controlled line endings |
| Essay / manifesto | 23–27 px / 400; line height 1.45 | 19–21 px / 400; line height 1.5 | Source Serif 4; 38–48 characters per line |
| Record title | 26–32 px / 500 | 24–28 px / 500 | Archivo; the title remains subordinate to the image |
| Navigation / captions | 14–16 px / 400–500; line height 1.4 | 14–16 px | Archivo; natural case; no code-like metadata |

No stretched letters, outlines, animated font axes or decorative italics. Archivo supplies structural clarity; the serif marks a change from looking to reading, not an interchangeable “luxury” accent.

#### Color

| Role | HEX | Use |
| --- | --- | --- |
| Mineral ground | **#E5E8E4** | Main editorial canvas |
| Graphite | **#292D2B** | All primary text and controls on light grounds |
| Chalk | **#F7F8F5** | Figure backing and occasional reading surface |
| Deep moss | **#35463D** | Compact Outro field or selected control |
| Stone gray | **#747D76** | Nonessential dividing details only; not small reading text |

Use graphite on mineral/chalk, and chalk on moss. Required captions use the primary text pairing. Color is flat and quiet; photographic color remains independent of this UI palette. No gradient, “concrete” noise overlay or large black-screen interlude.

#### Grid, spacing and composition

Desktop uses 12 columns with approximately 40 px outside margins at 1440 px and 20 px gutters. The Hero gives columns 1–4 to the statement, column 5 to a deliberate interval, and columns 6–12 to the photograph. The left edge of column 6 is the recurring alignment.

Use a small spacing vocabulary: 8, 16, 24, 40, 64 and 96 px. Most pauses contain a caption, a change in scale or a useful glimpse of the next chapter. Do not insert empty screen heights to manufacture importance. Archive records use a limited family of large landscape and narrower portrait figures; their emphasis follows the essay, rather than alternating mechanically.

On mobile, use four columns, 20 px margins and 12 px gutters. The desktop interval becomes a visible **left inset for captions and reading text**, not a wasted fifth column. Large photographs can reach the container edges; the inset reconnects the chapters. Tablet uses the stacked version once the desktop statement and photograph can no longer coexist comfortably.

Default photographic ratios: **5:4 Hero**, **3:2 context**, **4:5 portrait**, **1:1 detail**. The ratio is a frame, not permission to cut through a structural opening. Mobile Hero uses a separately composed 4:5 crop.

Texture comes only from photographed material. Square corners, no floating panels, no fake archival stamps. Caption order: theme, building/location when known, photographer credit. A plain “Read observation” disclosure expands in place; no separate case-study route.

Navigation: STILLFORM at left, “Manifesto”, “Archive”, “Notes” at right. “Notes” anchors to the Outro's credits/colophon. On narrow screens, the same short links wrap into a compact second line; no overlay menu. Links have visible focus and an underline on hover/focus, not cursor-following effects.

### C. Photography and art direction

Seek concrete, stone or masonry volumes with a **readable opening or interval**: a courtyard between masses, a recess, a deep doorway, a roof aperture, a narrow exterior passage. Prefer near-frontal views or restrained oblique perspectives with believable verticals. Keep the camera low enough to convey mass without an extreme wide-angle spectacle.

Lighting is clear and directional. Shadows should describe depth; preserve information inside them. Avoid theatrical crushed blacks, HDR halos, golden-hour sentimentality and a whole edition photographed under flat gray skies.

The strongest Hero candidate has three useful regions: a substantial material plane, a distinct negative space, and a small light-bearing plane. It does not have to reproduce the Salk courtyard's symmetry. A single small person may establish scale in one record; populated lifestyle scenes are outside the concept.

Consistency: natural material color, comparable contrast, no mixture of monochrome and saturated color, no baked-in typography. Images may vary in angle, but every record must support a sentence about space rather than only display an attractive facade.

Sourcing: first seek a small coherent series by one or two photographers, through their own portfolio/contact or a source with explicit reuse terms. Free-library photographs are candidates only after inspecting the individual image/license and attribution. Institutional photographs in the board are **study references**, not an available asset pack. Prefer original photographs where available. No generated architecture is required.

### D. Motion direction

**Pacing:** deliberate but immediately responsive. Most of the page is still. Short functional responses sit beneath a more deliberate Hero entrance.

**Entrance:** establish the readable masthead and statement first; then let the photographic opening become fully legible. The settled composition must arrive without requiring a scroll, intro dismissal or loader.

**Typography:** move a statement as one typographic block, or at most a few lines. Do not cascade every character. Manifesto prose is readable on arrival and is never progressively unlocked word by word.

**Images:** one straight-edged reveal follows the Hero's recurring alignment. The photograph itself remains stable while its cover/frame opens. Archive images can appear fully formed; repeating the Hero reveal on every image would dilute its meaning.

**Scroll:** natural document flow. One desktop Manifesto composition may hold a small image beside a passing observation; the visual purpose is to keep the same opening present while the reader changes how they interpret it. Mobile uses ordinary stacked flow. No full-page snapping, horizontal scroll or artificially long pinned stage.

**Section transitions:** keep the shared edge and crop logic visible. Motion does not need to animate an image physically through every section. At the Outro, a detail of the opening seen at the beginning closes the argument.

**Easing:** a firm start with a smooth, unhurried deceleration for the Hero; restrained ease-in-out for a reversible disclosure. Hover and keyboard responses feel direct. Avoid elastic, bounce, spring overshoot, rotation, repeated zoom, cinematic camera drift and simultaneous motion in unrelated elements.

Reduced motion presents the settled frame and normal document flow. The shared edge, image scale and content provide continuity without the effect.

### E. Hero concept

At a 1440 × 900 reference viewport, a compact masthead and three chapter links occupy the top band. Below, the left third holds the proposed three-line statement:

> Space,  
> held  
> still.

A short line beneath identifies the publication: “An editorial archive of architecture, light and the spaces between.” The image occupies the right seven columns, taller and visually heavier than the text block, with a visible margin around it. The fifth column is a meaningful interval between language and mass. A small caption belongs directly to the image. The first viewport is predominantly image and type, not empty background.

The photograph's principal opening should sit near the recurring edge or visibly answer it. Do not force exact alignment by distorting the building. The title does not cross the photograph or obscure the opening.

Entrance concept: the page is identifiable immediately; one planar reveal makes the image's light/void relationship explicit and settles. Text and image belong to the same arrival, not separate effect demonstrations. Exact timings and keyframes are deferred.

Mobile rearranges the statement into **“Space, / held still.”** at the smaller size, followed by a dominant 4:5 image and its inset caption. The image begins within the opening screen; the entire chapter may extend below it. Do not shrink both text and photograph to fit an arbitrary screen height.

The memorable impression is the tension between a compact statement and a massive, precisely framed void. If the Hero needs animation to be interesting, the crop or proportions have failed.

### F. Implementation feasibility

| Item | Assessment |
| --- | --- |
| Assets | Four principal archive photographs, up to four detail crops derived from them, a separately approved mobile Hero crop, two font families. Hero/Outro reuse edition imagery. No video, 3D or generated production art required. |
| Techniques | CSS grid and normal images; one simple cover/inset reveal; limited GSAP block motion; optional CSS sticky plus ScrollTrigger for Manifesto emphasis. SplitText only if responsive line treatment earns its complexity. |
| Engineering complexity | **Low–Medium overall.** Medium effort is concentrated in responsive cropping, motion interruption and keeping the one shared composition coherent. |
| Performance risks | A large Hero can dominate image loading; large masks may paint; font swapping can reflow the heading. Reserve image geometry, use appropriate responsive sources, load only needed font styles and retain visible fallbacks. No measured performance is claimed. |
| Simplification | Replace a mask with a single transformed cover; remove sticky behavior on short screens; retain the complete static composition. Never simulate depth with multiple full-resolution layers just to add movement. |
| Hardest creative dependency | Finding a photograph whose opening is compelling at both desktop and mobile crops. A generic facade would make the concept feel like familiar minimal architecture branding. |

---

## 4. Direction B — Chromatic Memory

### A. Creative concept

**Central idea:** we remember architecture as a relationship between a place and a sensation: a room and its reflected color, a wall and its granular surface, a stair and the light beside it.

**Emotional intention:** intimacy, curiosity and recollection. The visitor feels invited to look again, rather than confronted by a monument.

**Visual signature:** the **view/trace pair**. A contextual photograph and a smaller detail from that same space share a baseline, with a short observation linking them. The large serif statement sits beside or above that relationship, like a photographic essay. Pairing is systematic, never a random collage.

**Why it fits:** STILLFORM becomes a study of spatial memory and material perception. Monumentality is felt through proximity and color as well as scale. The archive's author is present through selection and language, without pretending to be the architect.

### B. Visual system

#### Type

Primary: **Newsreader**, roman 400/500 for display and reading. Secondary: **Public Sans**, static 400/500 styles for navigation, metadata and controls. Its official repository still supplies the fonts but reports inactive development and experimental variable files; this proposal does not depend on its variable version. See the verified source in the [board](VISUAL_REFERENCE_BOARD.md#type-and-sourcing-references).

| Role | Desktop target | Mobile target | Treatment |
| --- | --- | --- | --- |
| STILLFORM masthead | 22 px / Public Sans 500 | 20 px / 500 | Quiet uppercase identifier |
| Hero statement | 80–96 px / Newsreader 400; line height 1.04 | 46–54 px / 400; line height 1.08 | Sentence case, approximately −0.02em; no isolated italic word |
| Chapter statement | 48–64 px / Newsreader 400 | 34–42 px / 400 | More conversational than monumental |
| Essay | 23–26 px / Newsreader 400; line height 1.5 | 20–22 px / 400; line height 1.5 | 45–55 characters per line |
| Record title | 30–36 px / Newsreader 500 | 26–30 px / 500 | Reads as an essay title |
| Navigation / captions | 14–16 px / Public Sans 400–500 | 14–16 px | Compact, sentence case, no mono substitute |

The serif is the sustained voice, not an ornamental quote. Public Sans keeps controls clearly functional. No serif logo flourish, faux book spine, deckled edges or decorative editorial rules.

#### Color

| Role | HEX | Use |
| --- | --- | --- |
| Mist lavender | **#D9D3E5** | Main canvas, chosen to support cool/warm photographic relationships |
| Plum ink | **#35293F** | Text and controls on all light surfaces |
| Pale chalk | **#F5F1F5** | Quiet reading interludes and caption backing |
| Dust blue | **#667996** | Nonessential markers or larger decorative fields only |
| Clay gray | **#A68B7B** | Small nonessential material notes; not body text |

Use plum ink on lavender/chalk and chalk on plum for a selected state. Keep controls independent of the colors inside a photograph. The UI palette supports rather than recolors the imagery. No gradient wash or translucent color filter over photos.

#### Grid, spacing and composition

Desktop uses an eight-column grid with approximately 48 px outside margins at 1440 px and 24 px gutters. Hero statement spans columns 1–5 above the photographic pair. A contextual view occupies columns 1–5 below; its detail occupies columns 7–8, aligned to the context image's lower edge. Column 6 is a short relational pause, not a permanent vertical spine.

The dominant line is **horizontal**: paired baselines, captions and text/image relationships make a rhythm of looking across and then down. Use 8, 16, 24, 32, 48 and 72 px intervals. Composition is more intimate and denser than A, with a short observation close to its subject. Large unused margins must not overwhelm the photographs.

Context images primarily use **3:2**; close views use **4:5** or **1:1**. A pair is made from the same source photograph or a verified series of the same space, not two unrelated buildings chosen for matching color.

Mobile uses a two-column layout, 20 px margins and a 12 px gutter. The contextual image spans both columns, with a small detail and its sentence side by side underneath. The detail must remain large enough to reveal a material or light relationship; otherwise use a full-width second image in the same record. Do not put two illegible thumbnails in the first viewport.

Texture comes from the photograph's plaster, grain, stone and reflected light. Flat editorial surfaces, square image corners, no paper filters. Navigation uses the same three explicit chapter links as A. “View / Detail” is the Archive's paired-image control; current state is indicated with text and shape/underline, not color alone.

### C. Photography and art direction

Seek colored plaster, painted concrete, stone, courtyards, stairs, thresholds and walls receiving reflected light. Prefer views at human height, slightly oblique, close enough to notice how one plane changes another. Architecture remains the subject; furniture and props cannot turn the edition into a lifestyle catalogue.

Light is diffuse, reflected or directional without severe clipping. Include one vivid material color per record, balanced by neutral planes. A restrained edition might move from pale stone through muted rose to a deeper blue-green, but that sequence must follow available real photographs, not invented color grading.

The Hero pair needs a legible contextual view and a **specific trace**: a pink reflection on a pale stair, light meeting a textured wall, a color turning a corner. A detail crop should teach the reader something they could overlook in the whole.

Consistency: natural white balance, restrained saturation, similar tonal softness, no mixture of glossy real-estate HDR and quiet documentary images. Do not imply that two different buildings depict the same room. No fabricated before/after light sequence.

Sourcing: a small photographic series is more important here than access to famous buildings. One photographer's coherent study can outperform a set of iconic but mismatched images. A free-library route remains possible, but the view/detail relationship and sufficient crop resolution must be checked. The Barragán reference demonstrates a quality to seek; its images are not assumed reusable.

### D. Motion direction

**Pacing:** a gentle conversational rhythm, with more frequent small associations than A's single assertive reveal. Most reading and imagery remain still.

**Entrance:** the statement and contextual image establish meaning immediately. The detail joins that image as a quiet second thought. This is not a sequential slideshow or a delayed loading screen.

**Typography:** whole phrases or blocks, minimal displacement and soft opacity changes. Reading paragraphs never become a letter-by-letter performance.

**Images:** preserve a stable context view. A detail may dissolve into its adjacent slot, or the Archive may exchange “View” and “Detail” within one stable frame. Do not zoom a photograph until it pretends to be a camera moving through space.

**Scroll:** continuous natural flow. Association comes from proximity and the repeated pair, not pinning. A Manifesto detail can appear as its caption enters, then remain present. No repeated parallax.

**Section transitions:** a material color or crop relation is recalled in the following chapter; pale chalk reading areas interrupt lavender without creating a separate theme. Color changes are authored surfaces, not scroll-driven full-page color morphs.

**Easing:** softly rounded ease-in-out for a view/detail exchange; gentle deceleration for the first association. Functional feedback remains immediate. Avoid spring motion, glitch, hard mechanical shutters, page-curl simulation, dragging paper sheets and blur-heavy “dream” effects.

Reduced motion places paired images in their final arrangement and changes Archive views directly. Information does not depend on a dissolve.

### E. Hero concept

At 1440 × 900, the masthead occupies a slim upper band. Below it, a two-line serif statement begins on the left:

> Some spaces  
> stay with us.

The contextual photograph begins beneath the statement and spans roughly five eighths of the content width. A narrow detail sits to its right, lower in the composition; their lower edges align. The pair fills the lower half of the opening view. In the space above the detail: “Four observations on light, color and material.” A joint caption explains the relationship, rather than presenting two unrelated portfolio cards.

The Hero feels like an authored photographic spread, but avoids a literal magazine simulation. The memorable element is a precise visual rhyme between the distant room and the near surface.

Entrance concept: readable statement and context first; detail and connecting caption join as one association. No masking of every line, no implied animation of daylight. Exact timing remains for a later keyframe study.

Mobile starts with the masthead, two-line statement and full-width context image. The detail and its one-sentence observation appear just below the opening screen. This preserves the primary image's authority; the pair is discovered naturally rather than compressed into the viewport.

### F. Implementation feasibility

| Item | Assessment |
| --- | --- |
| Assets | Four contextual photographs, four useful detail crops or matched companion photos, a separate mobile Hero crop and two font families. Reuse the Hero pair in the Archive/Outro. No video or custom 3D. |
| Techniques | CSS grid for paired compositions; GSAP opacity and small block transforms; a modest Archive view/detail state. Flip is optional only if a later approved interaction physically changes layout. A dissolve in a fixed frame does not require Flip. |
| Engineering complexity | **Low–Medium overall.** Pair layout is simple; responsive art direction, informative cropping and accessible image-state changes need care. |
| Performance risks | Pairing can double decoded image surfaces and downloads if handled carelessly. Load only needed views, use correct resolutions, reserve dimensions and avoid stacking many off-screen full-resolution images. Large serif fallback differences can alter line breaks. |
| Simplification | Derive detail crops from the same photograph, leave both views visible, and remove the exchange animation. The relational composition must still work. |
| Hardest creative dependency | Four convincing pairs with consistent light and color. A collection of unrelated colorful walls would reduce the project to a mood board. This is an editorial production risk more than an engineering risk. |

## 5. Feasibility principles for either direction

Use native Astro for all four editorial sections. Scoped CSS is sufficient for the layout and responsive composition. Direct GSAP can own the few enhancements; TypeScript clarifies the lifecycle and control states. React is **not currently required**. Reconsider it only if a later approved Archive interaction acquires meaningful shared state beyond a small disclosure or two-view control.

Centralize cross-section scroll ownership, not every local effect into one file. Keep one clear setup/cleanup boundary, responsive and reduced-motion variants, and readable static markup. SplitText and Flip remain available tools, not a checklist to satisfy.

**Native scrolling is the recommendation for both proposals.** Neither direction currently needs Lenis. A later comparison would have to demonstrate a perceptual benefit before introducing another scroll owner. WebGL, Three.js, canvas pixelation and many-cell SVG masks offer no necessary benefit to either concept.

The project currently lists Astro and GSAP; the research also found an @gsap/react dependency without a directly declared React integration. That is repository context, not a reason to add React now. No dependency or application file is changed by this proposal.

## 6. Critical comparison and recommendation

These are creative judgments, not measured scores or predictions of awards.

| Criterion | A — Occupied Void | B — Chromatic Memory |
| --- | --- | --- |
| Originality | The cross-chapter empty interval and emphasis on the unbuilt create a specific argument. Risk: familiar austere architecture minimalism if the alignment is merely decorative. | The systematic view/trace relationship and chromatic editorial voice are less expected for a monumental archive. Risk: becoming a tasteful but generic culture-magazine spread. |
| Artistic sophistication | Strong hierarchy and structural restraint; one formal rule can sustain the whole experience. Requires exact crop and spacing decisions. | Rich relationships between close/far, color and language. Requires exceptional editing to avoid miscellaneous imagery. |
| First impression | Stronger immediate sense of scale and spatial tension. One excellent photograph does most of the work. | More intimate and intriguing; the second image rewards attention, but the emotional effect develops less instantly. |
| Narrative quality | Clear progression from encountering a void to understanding and revisiting it. The same alignment changes meaning. | Clear progression from noticing a room to retaining its material trace. Pairing can become repetitive if every chapter has the same spread. |
| Senior frontend portfolio value | Demonstrates responsive composition, restrained motion direction, continuity and lifecycle judgment. It will not hide weak craft behind an effects stack. | Demonstrates editorial systems, responsive pairing and accessible interactive state. Its technical craft may be less obvious in a fast portfolio review. |
| Astro / GSAP fit | Excellent; one simple reveal, optional short sticky relationship, light disclosure behavior. | Excellent; static pairs with small transitions and optional view/detail control. |
| Speed of iteration | Faster to compare layouts once a Hero image is found; slower if the composition relies on an unsuitable image. | Fast CSS iteration, but each paired crop/caption needs additional editorial work. |
| Asset availability | Broad subject pool of monumental openings; a compelling dual-crop Hero is the key unresolved dependency. No asset secured. | Colored architectural images are available in principle, but a coherent four-record series is less certain. No asset secured. |

**Recommend A — Occupied Void.** Its strongest advantage is that its formal device expresses STILLFORM's subject at three levels simultaneously: the empty space in the photograph, the interval in the layout, and the controlled opening in motion. That connection gives the four chapters a clear argument and a stronger immediate architectural identity. The manageable technical scope supports that artistic idea; it is not the reason for choosing it.

B is the stronger alternative if the intended emphasis shifts toward lived perception, chromatic intimacy and reading. Its color is not a skin to place over A. Combining A's monumental spine with B's paired-photo structure would dilute both unless the concept is deliberately rewritten.

A has a serious weakness: without a strong principal image and precise static composition, it could resemble many minimal architecture sites. **Do not compensate with extra GSAP effects.** The next approved phase should test the Hero as a static composition at desktop and mobile, then explore keyframes. If the selected photography cannot sustain the idea, revise the concept before implementation.

### Five decisions with the highest value

1. **Make the empty interval carry meaning:** align layout, photographic subject and one reveal around the same idea.
2. **Edit four excellent records:** specific observations and credible image relationships provide more authorship than a large anonymous gallery.
3. **Give type a clear role:** structural display, readable reflection and functional captions must be distinguishable without motion.
4. **Design continuity before effects:** carry an edge or image relationship between chapters; avoid four separate Hero templates.
5. **Keep the implementation proportional to the idea:** Astro-first content, native scroll and a few owned GSAP enhancements leave time for responsive art direction and finishing.

## 7. Human approval checkpoint

Choose **A**, **B**, or request a specific revision to either proposal. No final direction has been locked. The explicit approval gate in the Phase 02 brief is the reason work stops here.

After creative approval, the next separate deliverable is the chosen Hero's composition, keyframes and asset requirements. No Astro/React components, GSAP timelines, production assets, Hero implementation or AGENTS.md direction updates belong to this phase.

