# STILLFORM — Current cinematic timeline amendment

**Phase 03B.4 · 26 October 2026 · Fluid layout and continuous zoom implemented for review**

The current production rules are in [HERO_FLUID_SYSTEM.md](HERO_FLUID_SYSTEM.md). They supersede the archived text below wherever it specifies a 1440px maximum page width, old image crop/scale, static left-edge assumptions, vertical headline travel, a light-corridor lettering mask, completed-transfer-before-headline timing, prior-entry suppression or older timing/deadline values.

Retain the approved Phase 03B.3 narrative and rhythm: opposing STILL / FORM motion; main headline entering from the left concurrently with image transfer; strict white over the actual photo aperture; replay on every eligible new entry; no replay for scrolling to the top within that entry. Phase 03B.4 adds a single monotonic inner zoom to the same CSS final crop, full-width fluid geometry, and a provisional subdued ABSENCE ink.

The new layout/crop screenshots and both ink alternatives await human visual approval. [Current QA and recordings](../qa/phase-03b-4/README.md) record the actual tested implementation and remaining limits. No other section or cross-section motion is in scope.

---

## Archived previous contract — retained historical evidence

The following prior document is preserved for research. Its conflicting implementation instructions are historical, not current production requirements.

# STILLFORM — Cinematic Hero implementation blueprint

**Phase 03B.1 · 26 October 2026 · Documentation only**

Implement the Creative Director's seven events, as specified in [HERO_KEYFRAMES.md](HERO_KEYFRAMES.md). Preserve Occupied Void, Onest, the photograph and the current static Hero. Timings and blur amplitudes below are **testable first-pass targets**, not final artistic measurements.

## 1. Existing implementation and evidence

Read: [Hero.astro](../../src/components/Hero.astro), [hero-entrance.ts](../../src/scripts/hero-entrance.ts), [hero.ts](../../src/scripts/hero.ts), [index.astro](../../src/pages/index.astro), [global.css](../../src/styles/global.css), [Phase 03B report](../qa/phase-03b/README.md), final specification, previous keyframes and motion direction.

Confirmed in source: two 46% shutters open laterally in the **final** photographic frame; no centered journey or temporary identity exists. Desktop line starts are 0.55/0.63/0.71s, total 1.36s; stacked total is 1.14s. Header/footer remain visible. Admission checks paint entries and an animation-frame deadline before assets resolve, then allows only 160ms for runtime handoff. This explains skipped playback without implying a GSAP failure.

Reviewed existing sequential recording frames: [desktop early](../qa/phase-03b/desktop-frames/0020.jpg), [desktop intermediate](../qa/phase-03b/desktop-frames/0040.jpg), [tablet](../qa/phase-03b/tablet-frames/0025.jpg), [mobile](../qa/phase-03b/mobile-frames/0030.jpg), plus the 100/800/1550ms desktop PNG states and mobile 550ms state. The slit stays on the right on desktop; headline lines converge quickly while the header remains present. WebM/GIF recordings exist in the report; this review inspected their extracted frames, not continuous video playback. The report states its repeatable recordings delayed the stylesheet 80ms to obtain admission; that is **not** an acceptable production playback dependency.

Final-state authority is the existing implementation and [settled audit](../qa/phase-03b/settled/audit.json). Preserve the current 01 / 04 indicator, 12px maximum mobile overlap and 500px tablet photo cap. Older design-document values are not instructions to undo Phase 03A.1 refinements.

## 2. Geometry: center once, preserve the crop

After local Onest is ready, image decode succeeds and the existing fit guard settles, measure the real photo rectangle **F = (x, y, w, h)** in viewport coordinates. Keep the real figure in layout. Build one decorative image proxy with the **same source, w/h, object-fit: cover and 50% 50% crop**. Do not measure a running transform as the final destination.

Let Vw/Vh be the current visible viewport dimensions and G the measured composition gutter. Initial uniform scale **s = min(1, (Vw−2G)/w, (Vh−2G)/h)**. Its centered rectangle is **C = ((Vw−sw)/2, (Vh−sh)/2, sw, sh)**. Use visual-viewport offsets if applicable; all measurements must share one coordinate system. If pinch zoom, keyboard or inaccessible text reflow makes that coordinate system unstable, skip/settle instead of guessing.

| Existing target viewport | Final photo F, rounded | Initial centered C at s=1 |
| --- | --- | --- |
| 1440 × 900 | 748.8, 112; 655.2 × 650 | 392.4, 125; 655.2 × 650 |
| 1280 × 800 | 665.6, 112; 582.4 × 577.8 | 348.8, 111.1; same size |
| 1024 × 768 | 532.5, 112; 465.9 × 462.2 | 279.1, 152.9; same size |
| 768 × 1024 | 126.4, 394.1; 617.6 × 500 | 75.2, 262; same size |
| 390 × 844 | 72, 279.9; 298 × 400 | 46, 222; same size |
| 360 × 780 | 68, 268.6; 272 × 365.1 | 44, 207.5; same size |

These are reference checkpoints, **not positioning constants**. On shorter screens, s may be below 1; animate uniformly to 1 during transfer. This explicit exception to the older no-scaling entrance rule does not distort architecture. Do not interpolate width and height independently or change object-position mid-flight. At ordinary target sizes, transfer is translation only.

Proxy is anchored at F, with transform-origin 0 0; initial translation is C.topLeft−F.topLeft and scale is s. Transfer returns translation to zero and scale to one. The source's cropped content therefore remains identical throughout. At the endpoint, show the real image and remove the registered proxy **in the same render transaction**, without a crossfade. Do not revert the entire timeline context at this partial handoff, since headline/header animations are still pending.

### Aperture

Use one rectangular inset clip on the proxy frame. At wipe start: left/right insets 46%, top 0%, bottom 100%. Animate bottom to 0% for the top-to-bottom wipe, leaving width at 8%. Only after that reaches the base, animate left/right insets 46%→0%. The image pixels do not move behind the clip. No silhouette tracing, SVG mesh or perspective effect is required. Apply the same aperture geometry to any image-dependent text-color layer.

### Temporary identity composition

Use **Onest Variable 500**, two lines, no punctuation: STILL then FORM. This is a decorative identity moment, not a replacement h1 or new wordmark design. At desktop, STILL's rendered glyph span targets **0.667 of usable composition width** (container width minus its two gutters), left-aligned to that composition margin. FORM uses the same font size, right-aligned to the opposite margin. Start with **+0.06em tracking** and **0.95 line-height**; fixed tracking, never animated.

Measure after the font loads; choose font size once to meet that span, fitting both lines inside at most 72% of viewport height. Center the two-line group vertically around the centered photo's midpoint. A short viewport may reduce the width target to retain both lines. On stacked tablet/mobile, target STILL at **90% of usable width**, with +0.025em tracking and 1.00 leading; FORM remains right-aligned. Keep at least the existing gutters. Do not reuse desktop lettering size or horizontally stretch glyphs. If enlarged user text cannot fit, use the final readable Hero rather than scale user text down.

### Graphite/chalk treatment

Default: two registered decorative text copies, a graphite base and chalk overlay clipped to the **currently visible dark photographic side planes**. A first-pass chalk mask permits only the outer 28% on each side of the image, protecting the central 44% light corridor in graphite. Intersect that mask with the expanding aperture. Use the same font metrics and opacity/blur driver on both copies. These percentages require a frame-by-frame contrast check against this exact photograph; they are not proven contrast boundaries.

Identity stays stationary while the aperture expands. Freeze its image-color mask at the centered frame for its short exit, then remove both copies before the photo finishes moving; no ongoing text-mask registration is needed after the identity disappears. Check the brief overlap with transfer for edge artifacts. If necessary, finish the color layer's opacity slightly earlier within the same identity exit, not with an extra effect.

**Do not use mix-blend-mode by default.** It cannot guarantee the approved palette or contrast over the light shaft. If explicit clipping still makes letters unreadable, adjust the protected light corridor against sampled frames and reduce blur; bring unresolved contrast to motion review rather than shipping illegible text or silently replacing the seven events. No new outline, translucent panel, glass effect or full-photo tint.

## 3. Master timeline

One paused GSAP timeline; add labels first, then place tweens relative to those labels. No chain of independent timeout animations. [GSAP timeline/position documentation](https://gsap.com/docs/v3/GSAP/Timeline/).

| Label and relationship | Desktop | Stacked | Attached action / duration desktop, stacked |
| --- | --- | --- | --- |
| canvas | 0.00 | 0.00 | Initial empty visual state, zero hold; start wipe immediately |
| wipe = canvas | 0.00 | 0.00 | Top→bottom clip: 0.80, 0.65 |
| identityIn = wipe+0.30 / +0.22 | 0.30 | 0.22 | STILL opacity/blur: 0.70, 0.58; FORM at +0.10 / +0.08 |
| expand = wipe+0.80 / +0.65 | 0.80 | 0.65 | Lateral aperture: 0.80, 0.65 |
| identityOut = expand+0.70 / +0.57 | 1.50 | 1.22 | Both identity words fade/blur out: 0.45, 0.36 |
| transfer = expand+0.80 / +0.65 | 1.60 | 1.30 | Proxy C→F: 0.75, 0.60 |
| headline = transfer+0.75 / +0.60 | 2.35 | 1.90 | BUILT: 0.80, 0.71; AROUND at +0.15 / +0.12; ABSENCE. at +0.30 / +0.24 |
| wordmark = headline+0.15 / +0.12 | 2.50 | 2.02 | Header identity opacity/blur: 0.55, 0.48 |
| secondary = headline+0.73 / +0.62 | 3.08 | 2.52 | All secondary targets together: 0.37, 0.33 |
| settled = headline+1.10 / +0.95 | **3.45** | **2.85** | Restore clean static state, remove temporary layers |

Use the easing, travel and blur caps in [keyframes](HERO_KEYFRAMES.md). Secondary starts when the first word is nearly complete and the last has visibly resolved; adjust that relationship after real playback, rather than treating a percentage as perceptual truth. No dead pause between image transfer and headline. Keep the desktop total within 3.2–3.6s when tuning.

## 4. DOM and layer ownership

- **Static semantic layer:** retain current header, stage, one h1, one figure, details and footer in their existing flow. Keep layout measurements stable while opacity changes. Real image is visually suppressed only while its registered proxy is active. Do not hide the whole stage with its background above the proxy.
- **Temporary intro root:** root-level viewport overlay, pointer-transparent, aria-hidden, no focusable descendants; isolate its stacking context. Keep it outside transformed/filtered ancestors and the container-query page wrapper. It does not add height or intercept scrolling. Its background is transparent; the underlying mineral page provides the clean canvas.
- **Ordering:** within the intro root, photo proxy z=0, temporary graphite identity z=1, clipped chalk identity z=2. The static visual content is withheld while this root is active. Remove the root at photo transfer completion, before final headline motion. Normal static stacking then owns the final text/photo intersection.
- **Final groups:** existing .line-motion spans for the three words; .wordmark separately; secondary set = .details, .descriptor, .chapter and .footer when displayed. Group their opacity/blur without translating metadata. The closing mineral backing stays stationary and becomes visible at transfer completion, not during the centered identity scene. No giant blur on .hero or .page.
- Preserve hero.ts fit/failure logic, AbortController cleanup and Astro lifecycle hooks. One state owner coordinates admission and entrance. Replace the old parser-side preparation and shutter controller; do not run two entrances or reuse its 1800ms watchdog for a 3.45s sequence.

## 5. Reliable progressive enhancement

**Tradeoff:** guaranteed playback with arbitrarily slow assets, zero initial reservation and no concealment flash cannot all be promised. Choose a short bounded opportunity; slow/failing loads become static, never a late forced intro. This is the empty-canvas opening itself, not a separate preloader.

State model: **static → reserved → running → settled**, or **reserved → static-final**. Settled/static-final are terminal for that visit.

1. Server HTML/CSS is fully readable by default. An extremely small synchronous head bootstrap, before Hero markup can paint, may reserve the opening only for a fresh top-of-page navigation, visible document and no reduced-motion preference. Install fail-open handling **before** setting any concealment flag. If the bootstrap is blocked, late or missing, the page stays static.
2. Reservation uses critical local CSS to suppress the Hero's visual targets while retaining layout and semantics; the background is mineral. Begin font/image preparation and runtime loading immediately. **Maximum reservation: 450ms from bootstrap**, never a minimum delay. Start as soon as the actual Onest face, decoded image, styled/fitted geometry, DOM and GSAP owner are ready. Do not require those resources to beat the first paint: only the reservation flag must precede visible Hero content.
3. Independent JS deadline plus a critical-CSS fail-open safety must reveal static content if the module never arrives. The CSS safety must also remove any temporary overlay and clear temporary opacity/filter/transform on animated targets; merely revealing an ancestor is insufficient. Its delayed terminal rules must not compete with active GSAP values before expiry. Test blocking the module after bootstrap, not just disabling all JS.
4. Claim the reservation atomically before expiry, switch to running and initialize all layers before releasing the reserved state. If the deadline has elapsed or CSS has already failed open, reject the claim regardless of promise completion order. No late asset callback may conceal the Hero again. Keep existing preload URLs and avoid duplicate resource downloads.
5. At running start, replace the reservation watchdog with a **4.2s maximum running lease** plus matching CSS fail-open protection. Normal sequence completes at 3.45/2.85s. Deadline values are safety ceilings, not timeline holds; preserve elapsed deadlines across async work. Failure/interruption immediately resolves to the static Hero. Remove safety rules/classes after normal cleanup.
6. At any phase, keyboard focus, pointer activation, scroll away, hash change, reduced-motion change, page hiding, viewport resize/orientation or content-fit/text-size change settles first. Do not cancel the user's input. On bfcache/pageshow, restore settled, never reserve again. Do not treat mobile browser-toolbar height changes as a reason to restart.

Log explicit admission/skip/settle reasons in QA, with reservation, readiness, start, transfer and end marks. Retain a once-per-document latch. No artificial stylesheet delay, recurring retries, mandatory session loader or hidden navigation wait.

## 6. Risks, accessibility and simplest choices

| Risk | Simplest solution |
| --- | --- |
| Crop jump or warped architecture | Same-sized proxy with final crop; translation and optional **uniform** fit scale only; atomic handoff. |
| Blur paint cost and clipping | Blur only bounded text layers, capped at 6px desktop/3px stacked identity, 4px/2px headline, 2px wordmark, 1.5px/1px secondary. Leave padding for blur, remove filters at rest. No backdrop-filter. Profile rather than assume compositor-only work; [filter reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter). |
| Duplicate glyph halos / blend artifacts | Registered copies driven together; explicit mask, no blend dependency. Reduce blur first if contrast suffers. |
| Clip paint cost | One rectangular photo clip, not many slices. If profiling shows a bottleneck, substitute translating opaque covers with the identical two-stage aperture geometry. |
| Interaction with fit observer | Measure static geometry before animation; transforms must not feed the fit guard. Genuine changes settle then reassess, never rebuild mid-flight. |
| Stalled runtime leaves hidden content | Bounded independent fail-open mechanisms for pending and running states; remove overlay and reset child styles. |
| Screen reader/focus duplicates | Exactly one semantic headline and image. Temporary identity/photo aria-hidden. Keep semantic content available, settle on focus before displaying the focus ring; no focus trap or aria-live announcement. |

Reduced motion, JS disabled, font/image failure, restored history or emergency text wrapping show the existing final static Hero immediately. Preserve its image-unavailable state and natural page growth. No scroll lock, reduced credits or new scroll behavior. Performance degradation should first remove blur (retain opacity/travel), then simplify the mask; if still unreliable use the static fallback and report it, not an unapproved replacement animation.

## 7. Implementation acceptance

1. Capture actual playback at 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 360×780; also check 320px, intermediate widths, short screens and text resizing. No production QA-only timing bypass.
2. In recordings, all seven events are perceptible in order with the specified overlaps: vertical slit before lateral expansion, temporary identity while widening, continuous photo transfer, then final headline, wordmark overlap and unified secondary reveal.
3. Compare settled screenshots against the existing Phase 03B static baseline on the same browser/environment. Preserve pixel geometry/crop/type/01 / 04, tolerating only documented rasterization variation. No final decorative nodes, filters, transforms, clips, stale opacity or will-change.
4. Record normal cold and warm loads: reservation never intentionally exceeds 450ms; running fallback occurs by its ceiling; misses settle without replay. Test ready assets with delayed runtime, delayed font/image, CSP-blocked bootstrap, failed module, decode rejection and thrown setup errors. No readable→hidden flash and no indefinite blank canvas. Publish admission counts/reasons, not a promise that every load animates.
5. During both reservation and playback, test Tab/focus, credit activation, scroll, resize, orientation, 200% text, backgrounding, history and reduced-motion changes. Final content must become immediately usable and stay settled.
6. Profile real playback on a representative mobile device and desktop. Report paint/composite cost, long tasks and dropped frames; no universal 60fps claim from headless recordings. No frame-by-frame layout reads, new scroll framework or oversized persistent layers.
7. One GSAP owner and cleanup path; no ScrollTrigger, Flip, WebGL, Three.js, React or Lenis needed. No changes to final layout, photograph, typography, other chapters or Hero-to-Manifesto transition.

This blueprint does not implement or validate the new sequence. Remaining motion review is tuning the proposed timing, temporary identity spacing and contrast mask through recordings of the future implementation—not reopening the Hero design.
