# STILLFORM — Implementation opportunities

Research: **24–25 October 2026** (America/Sao_Paulo). These are options for review, not a chosen artistic direction. No application components or animation code were implemented.

Evidence and captures: [Reference teardown](REFERENCE_TEARDOWN.md). Source paths, timings and limitations: [Technical patterns](TECHNICAL_PATTERNS.md).

## Evaluation criteria

Complexity estimates assume production basics: responsive behavior, interruption, readable fallback, reduced motion and cleanup. They are relative engineering judgments, not measured delivery estimates.

- **Low:** mainly semantic markup/CSS, with little runtime coordination.
- **Medium:** scoped timeline or modest geometry/state management and a few responsive cases.
- **High:** multiple rendering surfaces, changing geometry, lengthy scene orchestration or substantial device validation.
- **Visual impact:** expected effect on hierarchy, continuity or memorability, independent of novelty.
- **Appropriate:** fits the stated portfolio/stack principles; it does not mean the visual treatment is approved.

Every option includes a React/GSAP translation because the brief requests it. **That translation does not imply React is required.** Astro is the preferred home for static editorial content.

## Ranked shortlist

| Rank | Principle / technique | Complexity | Visual impact | STILLFORM disposition |
| --- | --- | --- | --- | --- |
| 1 | Stable grid with unequal image scale and deliberate intervals | Low | High | Strong candidate |
| 2 | Typography-led hierarchy with selective text choreography | Low–Medium | High | Strong candidate |
| 3 | Simple masked image reveal with restrained scale correction | Medium | High | Strong candidate; exact reveal remains open |
| 4 | Sticky narrative composition with coordinated phases | Medium | High | Strong candidate for one justified sequence |
| 5 | Astro editorial rendering with one motion lifecycle owner | Low–Medium | Medium directly; high enabling value | Strong architectural principle |

The shortlist intentionally prioritizes fundamentals over the most conspicuous effects. It does not prescribe a palette, typeface, hero layout, number of sections or signature motion.

## 1. Stable grid, unequal emphasis

1. **Original achievement:** OH and Atelier establish order while allowing a large image, small caption and open space to coexist without uniform cards.
2. **Implementation:** OH runtime shows 12 columns and 16 px gaps; its imagery alternates landscape and portrait crops. Atelier explicitly places cards across a 12-track grid, with different spans and offsets above/below 1024 px.
3. **Artistic purpose:** create pauses and a clear reading sequence. Image size communicates editorial importance.
4. **React + GSAP recreation:** render semantic figures from data and assign a small set of CSS layout roles. No GSAP is needed for the baseline composition. If a future user action changes arrangement, refs and Flip could preserve spatial continuity; do not add it for a static grid.
5. **Complexity:** Low.
6. **Expected visual impact:** High.
7. **Appropriate for STILLFORM:** Yes. Prefer native Astro figures/cards and scoped CSS. Preserve source order, meaningful captions and crop focal points on mobile.

Evidence: [OH project capture](evidence/oh-wide-04-works.jpg); [Atelier top.scss L553](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/styles/top.scss#L553).

**Review question for later:** does the arrangement communicate a hierarchy of projects, or merely scatter them?

## 2. Typography-led hierarchy and selective text choreography

1. **Original achievement:** OH creates a major scale contrast using one family. Atelier pairs condensed display type with small mono text and uses clipped title entrances.
2. **Implementation:** OH's font and responsive sizes are runtime-confirmed; its exact line-reveal code is unknown. Atelier uses overflow-hidden wrappers, duplicated title layers and manually generated character spans with GSAP transforms.
3. **Artistic purpose:** establish the page's voice and signal a new chapter without introducing unrelated graphic decoration.
4. **React + GSAP recreation:** keep headings semantic; scope a timeline to a ref and use word/line transforms inside masks. SplitText can handle responsive splitting when justified. Revert splits and animations on disposal/reflow; hide decorative duplicates from assistive technology. Avoid React state updates per animation frame.
5. **Complexity:** Low for hierarchy; Medium for robust responsive splitting.
6. **Expected visual impact:** High.
7. **Appropriate for STILLFORM:** Yes, selectively. Astro headings plus a client script are sufficient. Do not choose Anton, mono metadata, all-caps treatment or OH's family merely because they worked in the references.

Evidence: [OH typography](evidence/oh-wide-02-about-entry.jpg); [Atelier title functions](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L95); [SplitText documentation](https://gsap.com/docs/v3/Plugins/SplitText/).

**Acceptance:** the heading remains legible when the animation is removed, and its entrance does not delay access to the next content.

## 3. Simple image mask plus scale correction

1. **Original achievement:** OH's oversized image layers and restrained reveals maintain photographic presence; Atelier's canvas also settles from scale 1.1 to 1 while resolving.
2. **Implementation:** OH's precise reveal timeline is unknown. The reusable mechanism proposed here is an overflow-hidden wrapper or simple inset clip with a slightly oversized image animated toward its final transform. It is an adaptation, not a recovered OH algorithm.
3. **Artistic purpose:** make the framing feel intentional and introduce a photograph without turning the reveal into the subject.
4. **React + GSAP recreation:** render a real image with reserved dimensions and a ref; use a scoped timeline for clipping and scale after image readiness. Keep a visible fallback, avoid animating layout dimensions, and cancel on unmount. A triggered entrance usually needs less scroll orchestration than a scrubbed scene.
5. **Complexity:** Medium.
6. **Expected visual impact:** High.
7. **Appropriate for STILLFORM:** Yes, as a candidate baseline. Implement later with Astro and direct GSAP unless an interactive gallery already requires React.

Evidence: [OH runtime sample](evidence/runtime-observations.json); [Atelier scale tween L418](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L418).

**Acceptance:** a failed/slow image load never leaves a blank mask; the final crop preserves the architectural subject.

## 4. Sticky narrative composition

1. **Original achievement:** Atelier lets team cards pass over a fixed visual statement. C keeps image/text scenes inside a stationary viewport while the narrative advances.
2. **Implementation:** CSS sticky supplies the stable layer; a taller containing section supplies scroll distance. Ordinary flow moves Atelier's cards. C additionally maps a master timeline to the stage's scroll interval.
3. **Artistic purpose:** preserve a spatial reference so successive information feels related rather than disconnected.
4. **React + GSAP recreation:** put a semantic scene inside a sticky wrapper; use a ref-scoped timeline only for changing child states. Let one controller coordinate its phases. Avoid combining CSS sticky and GSAP pin on the same element without a concrete need. Provide a natural reading layout for reduced motion and short screens.
5. **Complexity:** Medium; High if it becomes a many-scene system.
6. **Expected visual impact:** High.
7. **Appropriate for STILLFORM:** Conditional yes, for one meaningful case-study or process passage. The reference's 600vh length is not a sensible default requirement.

Evidence: [Atelier sticky CSS L716](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/styles/top.scss#L716); [C stage CSS](https://github.com/Hiro-kiii/Scroll-Transition/blob/6bb67c598f767a014ac595c904d85b86119670ee/css/style.css).

**Acceptance:** readers can move forward/backward and find all content without waiting through a long forced sequence.

## 5. Native editorial HTML and explicit motion ownership

1. **Original achievement:** Atelier delivers substantial visual behavior without a React tree or hydrated editorial components. C groups scene transitions in a master sequence.
2. **Implementation:** Astro layout/page/card composition plus direct DOM scripting; C adds nested animation segments to one scroll timeline. Atelier's centralized file lacks full lifecycle isolation, so its organization is a starting example, not a complete production pattern.
3. **Artistic purpose:** reliable coordination keeps the experience coherent while preserving fast layout/content iteration.
4. **React + GSAP recreation:** when an island is justified, use one scoped useGSAP setup with refs and explicit cleanup for external resources. Let a parent own cross-island scroll orchestration; do not let each island create its own Lenis/RAF system. Stateful UI may live in React, while animation progress remains with GSAP.
5. **Complexity:** Low–Medium with plain functions.
6. **Expected visual impact:** Medium directly; High as support for continuity and reliability.
7. **Appropriate for STILLFORM:** Yes. Native Astro sections, TypeScript initializers and a small page coordinator match the brief. Do not add a general animation framework.

Evidence: [Atelier layout](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/layouts/Layout.astro); [C master timeline](https://github.com/Hiro-kiii/Scroll-Transition/blob/6bb67c598f767a014ac595c904d85b86119670ee/js/script.js); [GSAP React lifecycle](https://gsap.com/resources/React/).

**Acceptance:** repeated initialization, route re-entry or island disposal does not duplicate listeners, canvas cells, timelines or scroll drivers.

## Additional options, dependent on direction

### 6. Outline-to-filled typography

1. **Original achievement:** Atelier makes a large stationary title change emphasis with scroll.
2. **Implementation:** an outlined text layer under a filled duplicate; a polygon clip reveals the latter from left to right. Trigger top 80% to top 20%, numeric scrub 1.5.
3. **Artistic purpose:** give reading progress a visible graphic correlate.
4. **React + GSAP recreation:** two aligned visual layers under a single accessible heading; animate one layer's clip path inside a scoped setup. Reflow must keep both layers identical.
5. **Complexity:** Low–Medium.
6. **Expected visual impact:** Medium–High.
7. **Appropriate for STILLFORM:** Conditional. Useful for one short statement if outline typography belongs to the chosen language. It should not become a default treatment for every heading; Astro is sufficient.

Evidence: [aboutTitle](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L130).

### 7. Canvas resolution reveal

1. **Original achievement:** Atelier's image gradually gains detail from coarse pixel blocks.
2. **Implementation:** downsample to a temporary canvas, upscale with smoothing disabled, tween sample resolution and visible scale for 1.5 seconds.
3. **Artistic purpose:** relate photographic presentation to the site's digital/pixel identity.
4. **React + GSAP recreation:** canvas/image refs and a mutable progress object inside scoped setup; render through onUpdate, without per-frame setState. Cap backing resolution, preserve a real image alternative, await decoding and stop work after completion.
5. **Complexity:** Medium for the effect; High if generalized across many image sizes/devices with strong fallback guarantees.
6. **Expected visual impact:** High.
7. **Appropriate for STILLFORM:** Defer. The effect is memorable but its visual meaning may conflict with architectural material clarity. Use only if pixel resolution becomes an intentional concept; no React requirement.

Evidence: [pixelateImage](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L366); [coarse state](evidence/atelier-desktop-04-projects-entry.jpg).

### 8. Grid-based color boundary

1. **Original achievement:** Atelier turns a sharp section color change into a textured threshold.
2. **Implementation:** generate 25×6 cells, choose them with row-weighted randomness and scrub color changes; six selected cells get an accent.
3. **Artistic purpose:** make the transition itself express the site's pixel language.
4. **React + GSAP recreation:** render stable decorative cells from deterministic data, scope a color timeline to their wrapper, avoid React rerenders during scroll and hide cells from accessibility APIs. Match density to viewport and remove generated resources on disposal.
5. **Complexity:** Medium.
6. **Expected visual impact:** High.
7. **Appropriate for STILLFORM:** Defer. Adopt the principle of a deliberate section threshold if needed; do not adopt Atelier's recognizable pixel edge automatically. Direct Astro/GSAP is enough.

Evidence: [pixelTransition](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L431); [boundary capture](evidence/atelier-desktop-06-transition-entry.jpg).

### 9. SVG aperture/blinds scene transition

1. **Original achievement:** C turns several fullscreen photographs into a continuous scene with coordinated titles and intervals.
2. **Implementation:** white SVG rectangles reveal stacked image layers; paired slits change geometry or grid cells change opacity. One master timeline drives sequential scenes over a sticky stage.
3. **Artistic purpose:** evoke apertures or structural divisions while carrying attention from one spatial composition to another.
4. **React + GSAP recreation:** semantic content plus decorative SVG layers with unique IDs; calculate geometry in a scoped setup and own one timeline. Rebuild on meaningful size changes, preserve progress, dispose ticker/listeners if present and offer static content for reduced motion. GSAP can animate attributes directly; React need not own frame updates.
5. **Complexity:** High for a responsive production scene; Medium for one limited two-image passage.
6. **Expected visual impact:** High.
7. **Appropriate for STILLFORM:** Conditional, later sections only. Prototype only after identifying a narrative reason to exchange those particular images.

Evidence: [horizontal source](https://github.com/Hiro-kiii/Scroll-Transition/blob/6bb67c598f767a014ac595c904d85b86119670ee/js/script.js); [live sequence](https://tympanus.net/Tutorials/SVGMaskScrollTransition/).

**Acceptance:** no visible seams, crop distortion, unreadable overlapping text or divergence between progress display and visible scene; desktop/mobile/Safari checks are required.

### 10. Menu sequencing with explicit interaction state

1. **Original achievement:** OH's dark navigation becomes a separate spatial mode; Atelier's rotating menu expresses its more graphic tone.
2. **Implementation:** OH sequencing is observed, with original code unknown. Atelier has separate paused open/close timelines and stops Lenis while open.
3. **Artistic purpose:** make the mode change clear and focus attention on choices.
4. **React + GSAP recreation:** semantic menu/dialog controls, one explicit open state, refs and a reversible timeline or canceled opposing animation. Add focus transfer/return, Escape, inert background and a meaningful expanded state. CSS may handle simpler label transitions.
5. **Complexity:** Medium.
6. **Expected visual impact:** Medium–High.
7. **Appropriate for STILLFORM:** Yes if an overlay menu is needed. A small Astro script is sufficient for a basic menu; React is justified only by wider stateful behavior, not by the presence of animation.

Evidence: [OH menu sequence](evidence/oh-wide-07-menu-entry.jpg); [Atelier initMenu](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L174).

### 11. Smooth scrolling as a deliberate pacing choice

1. **Original achievement:** Atelier and C continue settling after input, giving scroll-controlled graphics an inertial feel.
2. **Implementation:** both use Lenis; Atelier has its own RAF loop, while C connects Lenis to GSAP's ticker and ScrollTrigger. Numeric scrub adds another source of trailing animation.
3. **Artistic purpose:** regulate the perceived acceleration of scene changes.
4. **React + GSAP recreation:** create the scroll driver once at the page shell, never per card/island; synchronize explicitly and remove its ticker/listener/instance on teardown. All anchors and back-to-top behavior must share the same ownership. React does not improve this mechanism.
5. **Complexity:** Medium when integrated and tested properly.
6. **Expected visual impact:** Medium.
7. **Appropriate for STILLFORM:** Undecided. Begin future evaluation with native scrolling. Introduce Lenis only if a side-by-side prototype demonstrates a meaningful gain without sluggishness or interaction regressions.

Evidence: [Atelier initLenis](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L10); [Lenis official integration](https://github.com/darkroomengineering/lenis).

## Choices to keep open

- **Art direction:** no fonts, palette, hero concept or signature effect chosen.
- **React:** no investigated editorial technique requires hydration by itself.
- **Flip:** reserve for actual layout-state transitions, not static entrance animation. No source-confirmed Atelier usage.
- **Lenis:** not accepted as a default dependency.
- **Canvas versus native image:** prefer the simpler visible/semantic image unless pixel resolution is central to the concept.
- **Section length:** derive it from content and reading time, not demo viewport counts.
- **Motion language:** preserve coherence; combining OH line reveals, Atelier pixels and C blinds everywhere would multiply visual vocabularies without establishing a reason.

## Recommended review outcome

Discuss the five ranked principles first. Then decide whether any additional effect contributes to STILLFORM's subject and voice. A future prototype should compare one restrained baseline against one justified expressive variation, with mobile and reduced-motion modes considered from the start.

This research ends here. It does not authorize or begin that prototype.

