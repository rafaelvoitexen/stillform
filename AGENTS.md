## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Approved creative direction — STILLFORM

Phase 02D closes exploratory design. The final concept is **Occupied Void**: architectural absence, openings, intervals and redistribution of space.

- Official Hero baseline: **Study 1 — Preserve the Cut**. Do not redesign it or revert to Study 2 or earlier concepts.
- Sole type family: locally loaded, licensed **Onest Variable**. Hero headline: **500**, uppercase, exactly **BUILT / AROUND / ABSENCE.** Supporting copy remains provisional.
- Retain the approved mineral/graphite palette and the selected E Vos photograph of Tulach a’ tSolais, with attribution.
- Exactly four chapters: Hero, Manifesto, Archive, Outro. Notes belongs to the Outro.
- Authoritative production handoff: [HERO_FINAL_SPEC.md](docs/creative/HERO_FINAL_SPEC.md) and [HERO_KEYFRAMES.md](docs/creative/HERO_KEYFRAMES.md). These supersede conflicting historical proposals and pending-approval language. Preserve all earlier research, proofs and screenshots.
- Preserve the desktop text/photo intersection. Use the specified mobile overlap refinement, minimum 12px mobile credits, content-fit guards and natural vertical growth. Never hide accidental page overflow or shrink user-resized text to retain a screenshot layout.
- Phase 03B.4 replaces the global 1440px composition cap with a full-width page and shared responsive `--page-gutter`. Apply this rule to future chapters; constrain reading copy and individual assets where justified, not the primary page/section. Keep 1440px as the visual anchor. The current geometry and superseding motion rules are recorded in [HERO_FLUID_SYSTEM.md](docs/creative/HERO_FLUID_SYSTEM.md); historical specifications below its amendments are not instructions to restore the cap.
- The inner photograph now zooms monotonically from 1 to its CSS-defined final crop (1.06 wide, 1.04 tablet/reflow, 1.03 mobile). That crop also applies without motion or JavaScript. Never reset it at handoff or reintroduce zoomReturn. The outer frame separately owns aperture and spatial transfer.
- ABSENCE uses a resolved subdued graphite ink while its photo intersection stays fully chalk-white. Phase 03B.4 composition, crop and implemented variant B (#656966, approximately 68% graphite on mineral) are creatively approved. Preserve the alternative evidence. No parent-opacity reduction.
- Phase 03B.5 interaction policy: ordinary pointer, keyboard, focus, scroll and viewport changes must not settle or restart the Hero. Reconcile changed geometry while retaining the current master timeline. Reload entries deliberately start at the document top; back/forward history keeps its restored scroll. Retain reduced-motion, asset-failure, navigation-disposal and bounded fail-open safeguards. Keep the authored closing-word backing above both photographic representations during transfer.
- Phase 06D.1: `cinematic-scroll-lock.ts` alone owns temporary native input guards and the shared Hero/Return lock. Preserve the root scrollbar gutter from first paint; override Lenis stopped overflow only while locked. Return and Hero hold overlapping leases until replay completion, with no unlock/relock gap. Escape explicitly settles/skips the intro. Do not reintroduce body overflow locks, scroll-correction loops, or independent Return blockers.
- Phase 04B implements approved Manifesto Direction A in normal flow. The refinement migrates header and pointer presentation to page-level components. Keep one accessible statement, approved copy and the actual LETS US / SEE. interval. One global fine-pointer controller owns the small negative cursor and bounded magnetic reveal; reduced motion and touch retain the native experience. `data-reveal-ready="false"` disables the photographic engagement without breaking the global cursor. The global header retains the Hero entrance's wordmark/metadata opacity timing; its separate chapter controller owns label translation. See [GLOBAL_INTERFACE.md](docs/creative/GLOBAL_INTERFACE.md) for ownership and future integration. No Hero-to-Manifesto transition is implemented or authorized by this refinement.
- Build editorial markup with native Astro and TypeScript; scoped CSS and direct GSAP where needed. React only for a genuinely stateful island that warrants it, not this Hero. Keep future cross-section scroll orchestration centralized.
- Hero entrance: **Find the Opening**, with asset-readiness, interruption and reduced-motion behavior from the keyframe document. No WebGL, Three.js, Lenis or extra scroll framework. ScrollTrigger/Flip are for later justified interactions, not dependencies required by the Hero entrance.
- Creative approval is not blanket implementation authorization. During handoff/documentation tasks, do not modify application source. When separately asked to implement the Hero, implement only the Hero and its entrance; exclude the Hero-to-Manifesto transition, other sections and Archive interaction unless explicitly requested.
- During implementation, verify the eleven Phase 03B.4 target viewports from 360px through 3840px, intermediate widths, 320px reflow, text resizing, keyboard access, font/image failures, reduced motion and static final-state parity. Do not describe proposed responsive rules or keyframes as already rendered/tested.

## Astro documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
