# STILLFORM — Technical patterns

Research: **24–25 October 2026** (America/Sao_Paulo). This document describes inspected implementations and possible adaptations. It is not an implementation plan approved for execution. See [the teardown](REFERENCE_TEARDOWN.md) for access limits and screenshots, and [opportunities](IMPLEMENTATION_OPPORTUNITIES.md) for priorities.

## 1. Evidence and source map

Atelier source base: [commit 6703fc3f15ec92979964070814a99855d0baa38f](https://github.com/codrops/atelier-north/tree/6703fc3f15ec92979964070814a99855d0baa38f).

Local source root:

`C:/Users/Rafael/.codex/visualizations/2026/10/24/01a16fb4-9e2b-7842-a505-f62f179ecdce/references/atelier-north/`

| File | Responsibility and useful evidence |
| --- | --- |
| [package.json](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/package.json) | Declares Astro ^7.3.2, GSAP ^3.15.0, Lenis ^1.3.26, Sass ^1.104.1. These are manifest ranges; the lockfile was not downloaded |
| [src/layouts/Layout.astro](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/layouts/Layout.astro) | Shared HTML/head, mobile menu, header, slot and footer; global stylesheet and animation entry |
| [src/pages/index.astro](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/pages/index.astro) | Composes all homepage sections; imports local images and repeats ProjectCard with typed props |
| [src/components/ProjectCard.astro](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/components/ProjectCard.astro) | Plain article, number, canvas, hidden source image and two-part caption |
| [src/components/Header.astro](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/components/Header.astro) | Anchor navigation, duplicated hover labels and mobile menu button |
| [src/components/Footer.astro](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/components/Footer.astro) | Contact content, display title, repeated label layers and final pixel band |
| [src/components/Head.astro](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/components/Head.astro) | Google Fonts preconnections/styles, metadata and icon paths |
| [src/scripts/global.js](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js) | All runtime animation functions, Lenis and navigation events |
| [src/styles/global.scss](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/styles/global.scss) | Reset, type utilities, header/menu/footer and shared clipped wrappers |
| [src/styles/top.scss](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/styles/top.scss) | Homepage layouts, image canvas styles, breakpoint changes and sticky team |
| [src/styles/variable.scss](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/styles/variable.scss) | Color variables and min-width breakpoint mixin |
| [astro.config.mjs](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/astro.config.mjs), [tsconfig.json](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/tsconfig.json) | Minimal Astro configuration; strict Astro TypeScript configuration |

The README links to an MIT license file, but the inspected repository tree contains no LICENSE file. This study takes no code or asset reuse permission for granted; its output is analysis. Reference photography and fonts have not been copied into STILLFORM.

## 2. Astro architecture: what is worth retaining

**Source-confirmed:** no React components, hydration directives, React integration, SplitText or Flip appear in the selected application source. Static content is rendered by Astro, then enhanced by a DOM-oriented JS module. Only navigation/menu state and animation objects require runtime state.

The architecture is shallow:

`index.astro → Layout.astro → Head/Header/slot/Footer`

`index.astro → ProjectCard.astro × 5`

`Layout.astro → global.scss + global.js`

The page owns editorial arrangement, the card owns repeated markup, and the global script owns interactions. This gives a small demo quick iteration without a client component tree.

**What not to inherit unchanged:** a single approximately 730-line global file eagerly queries page-specific selectors and initializes everything. It is centralized in location, but it is **not** a reusable cross-section orchestration/lifecycle system. It assumes one document and lacks a returned disposal boundary for listeners, RAF, generated markup and animation instances.

**STILLFORM adaptation, for later review:** a small page-level initializer can coordinate section initializers in document order; each section returns a disposal function. Keep local details with their section and shared scroll ownership at page level. This needs ordinary TypeScript functions, not an animation framework or generic effect registry. A single narrative stage can own a timeline; unrelated editorial sections do not need a single giant timeline.

Astro renders native components without requiring UI-framework hydration. Client scripts can enhance that HTML directly. Framework components become interactive when an appropriate client directive is supplied. Scoped Astro styles are a natural default; global typography/tokens and narrowly named runtime classes can remain global. These recommendations follow the official [components](https://docs.astro.build/en/basics/astro-components/), [framework components](https://docs.astro.build/en/guides/framework-components/) and [styling](https://docs.astro.build/en/guides/styling/) guides.

The reference imports its animation module from a `type="module"` script in the layout, and the deployed page exposes a bundled Astro script URL. Treat that as observed source/build behavior, not a reason to copy script attributes blindly across Astro versions. STILLFORM's existing manifest declares Astro ^7.4.2 and GSAP ^3.15.0; no version changes were made.

## 3. Exact Atelier animation mechanisms

The following values come from [global.js](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js), not from stopwatch measurement.

| Function / source line | Mechanism | Timing/control |
| --- | --- | --- |
| [initLenis, L10](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L10) | One Lenis instance and recursive requestAnimationFrame | duration 1.2; cubic-out function |
| [displayHeader, L28](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L28) | Whole-page trigger reads direction; kills prior header tween; suppresses changes while auto-scrolling | Header 0.45 s; returning links 0.5 s, stagger 0.1 |
| [headerHover, L74](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L74) | Rotated duplicate label enters while original scales out | 28° initial rotation; 0.6 s power4.out; overwrite auto |
| [fvTitle, L95](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L95) | Manual character splitting; scaleY from zero around bottom edge | 1.2 s power4.out; random 0.05 s stagger |
| [aboutTitle, L130](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L130) | Filled duplicate title revealed by polygon clip over outlined text | top 80% → top 20%; scrub 1.5; ease none |
| [floatingBox, L151](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L151) | Three decorative boxes translate between -8 and +8 px | Random 1.2–1.8 s, sine.inOut, infinite yoyo |
| [initMenu, L174](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L174) | Separate paused open/close timelines; panel rotation, opacity, labels, colors; Lenis stop/start | Mostly simultaneous at position 0; 1 s power4.out; item stagger 0.1 |
| [projectTitle, L332](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L332) | Paired title layers move in opposite vertical directions inside overflow-hidden wrappers | Trigger top 65%; 1.5 s power3.out; stagger 0.3; parallel groups |
| [pixelateImage, L366](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L366) | Tween an ordinary JS progress object; redraw a canvas at increasing effective resolution; scale canvas 1.1 → 1 | top center; play/none/none/none; both tweens 1.5 s; no explicit ease |
| [pixelTransition, L431](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L431) | Generated 25 × 6 DOM grid; selected cells change color | top bottom → top 20%; scrub true; 0.05 tween duration and random 0.003 stagger |
| [memberTitle, L497](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L497) | Manual character spans move from yPercent 100 to 0 | Trigger top top; 1.2 s power4.out; stagger 0.05 |
| [pixelLeaveTransition, L530](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L530) | Same grid strategy, dark → cream | Same scroll range as entry |
| [footerTitle, L595](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L595) | Character scaleY from top origin | top 80%; 1.5 s power3.out; random 0.05 stagger |
| [footerPixelTransition, L630](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L630) | Third pixel band, blue → cream with cyan accents | top bottom → bottom bottom; scrub true |
| [smoothScroll, L695](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L695) | Intercepts section links; closes menu and invokes Lenis scrollTo | 1 s quadratic-out, lock true; completion resets header guard |
| [backTop, L722](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/scripts/global.js#L722) | Separate GSAP ScrollToPlugin path | 2 s power2.inOut |

The canvas trigger's `play none none none` means it is not a reverse-scroll pixelation. It also does not mean the ScrollTrigger is destroyed after playback: there is no `once: true` here.

### Canvas reveal in detail

The source image remains in the markup but CSS sets it to `display: none`. Each project receives a visible canvas and a temporary offscreen canvas. At each update:

1. Set the visible backing size to the image's natural dimensions.
2. Compute effective sample width as **18 + (naturalWidth − 18) × progress^2.5**.
3. Derive sample height from the source image ratio.
4. Draw the source into that small temporary canvas.
5. Draw the temporary image onto the full canvas with smoothing disabled.

This produces true coarse sampling rather than CSS blur or a tile mask. The simultaneous 1.1 → 1 scale makes the image settle into its frame.

The reference preserves image proportions through its canvas; it does not normalize the five photographs with a shared cover crop. Runtime natural sizes were 852×1278, 906×708, 906×1360, 906×604 and 1360×906.

**Cost analysis, not measured performance:** those five full-resolution RGBA canvas surfaces total approximately **18.1 MiB** of pixel data. Temporary canvases, decoded source images and browser copies add further cost. The source reassigns backing sizes on each draw, including the temporary size. Smaller displayed mobile images still use natural-size backing surfaces. The five source JPEGs total approximately **3.64 MiB in the repository**, not a measured network transfer size.

**Adaptation:** preserve a real responsive image as semantic/failure fallback; cap decorative canvas resolution based on displayed size and DPR; initialize after image readiness; avoid redundant backing-buffer resets; stop drawing when complete. Use canvas only if resolution change is essential to the chosen concept.

### Pixel section bands

The three bands add **450 DOM cells** in total, confirmed by runtime count. Entry/exit choose target cells with row probabilities `[0.1, 0.2, 0.5, 0.7, 1, 1]`, and recolor six eligible cells with an accent. The footer uses a different probability curve. Selection and staggering are randomized at initialization.

The CSS uses a 25-column/6-row grid, and negative 1 px margins help hide seams. This is background-color animation with paint work, not a composited image mask. Randomness can also change screenshots between reloads. If later appropriate, a seeded sequence would make visual review more repeatable.

### Sticky team composition

[Top styles, L641 onward](https://github.com/codrops/atelier-north/blob/6703fc3f15ec92979964070814a99855d0baa38f/src/styles/top.scss#L641) define a **600vh** wrapper, a **100vh sticky** layer at top 0, and a higher-z-index card grid. Desktop cards use column spans, 400 px offsets/gaps and an 800 px starting margin; mobile retains a long wrapper but reduces starting margin to 400 px and row gaps to 120 px.

No `pin` appears in the animation file. The large title remains in view because of CSS, while ordinary scrolling moves cards across it. This is a useful example of letting layout provide continuity before adding scroll scripting.

## 4. OH: confirmed runtime versus unknown implementation

| Evidence | What can be concluded | What cannot be concluded |
| --- | --- | --- |
| Webflow CSS/JS URLs and Webflow DOM classes | Webflow-delivered runtime assets are present | Original component architecture or CMS schemas |
| GSAP/ScrollTrigger/SplitText/Lenis/Barba script elements | These dependencies are referenced by the page | All loaded successfully, or a particular effect uses a particular plugin |
| Line wrappers and clipped text states | Text reveals occur at line-like boundaries | Exact SplitText configuration, CustomEase curve or duration |
| Hero image layers with transform and clip-path values | Layered, oversized media exists in the rendered DOM | A full original hero timeline or exact progress mapping |
| Twelve computed grid tracks, cover crop and aspect ratios | Concrete layout and image behavior at inspected widths | All breakpoint formulas or all page templates |
| Menu entry and settled screenshots | Panel/text sequencing is visible | Route transition implementation |
| No pin spacers in sampled DOM | No GSAP pin spacer was found at those moments | Proof that no pin exists on any route or condition |

The recommended Astro/GSAP equivalents are original engineering proposals. They are not recovered OH source.

## 5. SVG mask reference: scene-level orchestration

Source root: [Scroll-Transition at 6bb67c5](https://github.com/Hiro-kiii/Scroll-Transition/tree/6bb67c598f767a014ac595c904d85b86119670ee); local sibling directory `references/svg-mask/`.

[Shared CSS](https://github.com/Hiro-kiii/Scroll-Transition/blob/6bb67c598f767a014ac595c904d85b86119670ee/css/style.css) sets a 500vh stage and sticky 100vh layers. Masked SVG images stack absolutely. The timeline operates from stage top/top to bottom/bottom. There is no ScrollTrigger pin; `anticipatePin` in several variants does not create one.

| Variant | Inspected source | Actual mechanism |
| --- | --- | --- |
| Horizontal blinds | [js/script.js](https://github.com/Hiro-kiii/Scroll-Transition/blob/6bb67c598f767a014ac595c904d85b86119670ee/js/script.js) | 30 slits × two rectangles per image; animate y/height apart from each center; bottom-to-top ordering, 0.02 stagger, power3.out, scrub 2.5 |
| Random grid | [js/script2.js](https://github.com/Hiro-kiii/Scroll-Transition/blob/6bb67c598f767a014ac595c904d85b86119670ee/js/script2.js) | 6/10/14 columns at ≤599/≤1024/>1024; aspect-derived rows; shuffle cells and tween opacity, 1 s/0.02 stagger, scrub 2.5 |
| Vertical blinds | [js/script3.js](https://github.com/Hiro-kiii/Scroll-Transition/blob/6bb67c598f767a014ac595c904d85b86119670ee/js/script3.js) | 12 paired strips; first image starts open; animate x/width; text transitions overlap the next image, scrub 2.0 |
| Column grid | [js/script4.js](https://github.com/Hiro-kiii/Scroll-Transition/blob/6bb67c598f767a014ac595c904d85b86119670ee/js/script4.js) | Same responsive grid density; order columns left-to-right but randomize cells within each column, scrub 2.5 |

**Important source/article distinction:** the horizontal and grid scripts keep viewBox width at 100 and derive height from viewport ratio. The vertical version keeps height at 100 and derives width. Do not treat the article's simplified coordinate explanation as one identical formula across all variants.

White mask geometry reveals the image over a black mask base. The HTML uses SVG image slicing; the calculated viewBox matches viewport proportions. Tiny overlaps are explicit in the blinds variants; the random/column grid source uses exact cell dimensions plus `crispEdges`, without the same extra overlap. Seam-free behavior still needs device testing.

The master adds mask animation, text entrance overlap and reading intervals in one sequence. Resize is debounced by 250 ms and rebuilds geometry/timeline. Randomized grids can change on rebuild. The progress bar is a **separate ScrollTrigger** using raw scroll progress and writing width; it is not necessarily synchronized to the lagging visual timeline or unequal scene durations. Its standalone numeric scrub does not smooth direct writes inside `onUpdate` the way a linked animation would.

**Adaptation:** one scene timeline should own masks, text and progress if their displayed states must agree. Preserve progress across resize, handle image readiness, use unique SVG mask IDs per instance and keep static text/images available when motion is reduced or unavailable.

## 6. Performance, accessibility and lifecycle review

These are source findings and engineering risks, not measured benchmark failures.

| Finding | Why it matters | Adaptation worth considering |
| --- | --- | --- |
| Atelier uses natural-resolution canvas surfaces and hidden source images | Extra draw work and loss of a visible image fallback; hidden image alternatives are absent from the sampled accessibility snapshot | Keep semantic responsive images; decorative canvas overlay only |
| Images in ProjectCard are plain img elements without explicit dimensions/loading attributes | Importing ImageMetadata alone does not prove responsive optimization or layout reservation | Reserve ratio/dimensions; responsive sizes; load according to viewport importance |
| Repeated visual text layers appear in accessible names | Runtime snapshot exposes duplicated headings, link labels and letter-by-letter title content | One accessible label; hide purely decorative duplicates |
| Reset removes outlines; menu has no authored focus trap, Escape handling or aria-expanded updates | Visual polish does not establish keyboard usability | Explicit focus styles, focus management, semantic controls and restored focus |
| No reduced-motion branch found in Atelier JS/CSS | Character effects, floating loops and long motion run unconditionally in source | Static readable mode; disable nonessential looping and scroll trails |
| Separate open/close menu timelines | Rapid toggling can create competing ownership unless managed | One reversible timeline or explicit cancellation, with tested state transitions |
| Page-level selectors and no complete teardown | Reinitialization/navigation could duplicate events, cells and RAF | Scope ownership; dispose animations, listeners, generated nodes and scroll driver |
| Global refresh is called mid-initialization | It is not a dedicated post-image/font-readiness refresh strategy | Refresh after relevant layout is ready; avoid frame-by-frame refresh |
| Floating loops are initialized even when their boxes are hidden on mobile | Unnecessary background work is possible | Match media conditions and pause offscreen decoration |
| Long 600vh / 500vh stages | Scrolling and overlap can burden short screens and keyboard reading | Content-driven length; shorter/static mobile variant if needed |

The source calls `gsap.utils` for randomness; it does not require a separate utility library. CSS already handles several hover transitions. Preserve that restraint.

## 7. Scroll ownership, React and plugin decisions

**Lenis:** Atelier owns an independent RAF loop; it does not explicitly connect Lenis events to ScrollTrigger or use GSAP's ticker. C demonstrates `lenis.on('scroll', ScrollTrigger.update)` plus a GSAP ticker callback converting seconds to milliseconds. Neither observation proves Lenis is necessary for STILLFORM.

Proposed evaluation order: native scrolling first; small ScrollTrigger catch-up only if needed; Lenis only after a clear pacing benefit appears. If used, retain one RAF owner, consistent anchor/back-to-top behavior, and cleanup for the ticker/listener/instance. Do not combine auto RAF and an additional manual RAF. The official [Lenis integration guidance](https://github.com/darkroomengineering/lenis) supports explicit synchronization; adding a scroller proxy is not automatically required for its normal native-scroll integration.

**React:** every researched editorial effect can be applied directly to Astro-rendered DOM. If a later interactive gallery/filter truly needs React, use refs and a scoped `useGSAP` setup, clean up listeners separately and wrap deferred animation creation with `contextSafe`. Keep per-frame progress out of React state. The hook's context cleanup does not automatically cancel arbitrary application timers or remove custom listeners. See [official React guidance](https://gsap.com/resources/React/).

**SplitText:** appropriate for robust responsive line/word splitting when a text reveal needs it. Preserve accessible wording and rebuild/revert around text reflow. Do not mistake Atelier's manual spans for this plugin. See [SplitText documentation](https://gsap.com/docs/v3/Plugins/SplitText/).

**Flip:** no inspected Atelier use and no evidence establishing OH use. It is a candidate only if a future interaction changes layout state, such as filtered project reordering or grid-to-detail expansion. It adds no necessary value to an ordinary editorial reveal.

**ScrollTrigger:** choose triggered playback or scrub according to the content's relationship to scroll; use CSS sticky when sufficient. A single section timeline can coordinate multiple visual properties. Refresh after geometry-changing content loads, and tear down only the instances owned by the relevant section/page. See [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## 8. Validation gates for a future prototype

No prototype was built in this research. Before accepting any effect later, test:

1. Readability with JS unavailable, delayed image loads and reduced motion.
2. Keyboard menu/anchor behavior and continuous semantic labels.
3. Forward/reverse scroll, abrupt scroll jumps and interrupted interactions.
4. Narrow screens, short landscape viewports, resize and font reflow.
5. Trigger geometry after image/font readiness and navigation re-entry.
6. CPU/paint traces, frame pacing, decoded image/canvas memory and real mobile behavior.
7. Visual seams and SVG cropping in Chromium and Safari.
8. Whether removing the effect actually weakens the intended editorial meaning.

A successful screenshot is evidence of composition, not evidence that these gates have passed.

