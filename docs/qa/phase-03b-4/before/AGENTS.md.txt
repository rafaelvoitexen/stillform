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
- Build editorial markup with native Astro and TypeScript; scoped CSS and direct GSAP where needed. React only for a genuinely stateful island that warrants it, not this Hero. Keep future cross-section scroll orchestration centralized.
- Hero entrance: **Find the Opening**, with asset-readiness, interruption and reduced-motion behavior from the keyframe document. No WebGL, Three.js, Lenis or extra scroll framework. ScrollTrigger/Flip are for later justified interactions, not dependencies required by the Hero entrance.
- Creative approval is not blanket implementation authorization. During handoff/documentation tasks, do not modify application source. When separately asked to implement the Hero, implement only the Hero and its entrance; exclude the Hero-to-Manifesto transition, other sections and Archive interaction unless explicitly requested.
- During implementation, verify the six specified widths, intermediate widths, 320px reflow, text resizing, keyboard access, font/image failures, reduced motion and static final-state parity. Do not describe proposed responsive rules or keyframes as already rendered/tested.

## Astro documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
