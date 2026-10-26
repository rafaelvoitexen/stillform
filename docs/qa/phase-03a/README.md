# STILLFORM — Phase 03A

Static Hero complete; awaiting human visual approval.

## Implemented files

- `src/pages/index.astro`: semantic page, metadata and local font preload.
- `src/components/Hero.astro`: header, single h1, image, attribution, supporting copy, footer, scoped CSS and TypeScript layout/failure guards.
- `src/styles/global.css`: Onest Variable, palette, reset and focus styling.
- `public/fonts/Onest-Latin-Variable.woff2`, `public/images/tulach-e-vos.jpg`: unchanged approved asset copies.
- `public/licenses/Onest-OFL.txt`, `public/licenses/tulach-provenance.json`: preserved license and provenance.
- `astro.config.mjs`: disable the development toolbar for unobstructed review.
- `.gitignore`: exclude the local Chrome QA profile.
- This directory: screenshots, audit data and reproducible DevTools scripts.

Existing creative studies, screenshots and unrelated workspace changes were preserved. No dependencies were added; existing GSAP packages are not imported.

## Screenshot evidence

| Requested viewport | Exact viewport capture | Full composition |
| --- | --- | --- |
| 1440 × 900 | [Screenshot](1440x900.png) | Fits viewport |
| 1280 × 800 | [Screenshot](1280x800.png) | Natural content height: 828px |
| 1024 × 768 | [Screenshot](1024x768.png) | Fits viewport |
| 768 × 1024 | [Screenshot](768x1024.png) | [1299px full page](768x1024-full.png) |
| 390 × 844 | [Screenshot](390x844.png) | [881px full page](390x844-full.png) |
| 360 × 780 | [Screenshot](360x780.png) | [831px full page](360x780-full.png) |

All six PNG dimensions verified in [capture-verification.json](capture-verification.json).

Chrome DevTools MCP was unavailable. QA used real headless Chrome 156.0.8078.47 through native Chrome DevTools Protocol against the Astro development server. The final exact-width capture pass hides browser scrollbars through Chrome emulation without changing application overflow CSS. A preliminary [native Windows-scrollbar audit](audit-windows-scrollbars.json) is retained: a 1024px viewport with a classic 15px scrollbar has a 1009px container and correctly uses stacked mode.

## Comparison with Study 1

Approved reference screenshots exist at 1440 × 900 and 390 × 844. Other sizes were assessed against the final specification's interpolation checkpoints.

- Desktop: headline 176px, weight 500, tracking −0.055em, leading 1.02; heading origin x=30/y=132. Photograph x=748.80/y=112, 655.19 × 650px. The third-line gap, centered crop and hard text/photo color boundary preserve the approved signature. Supporting copy starts at x=36/y=790; metadata at x=748.80/y=783.
- Mobile 390: opening 72px, closing 68px; photograph x=71.98/y=279.86, 298 × 400px. The mineral backing overlaps the photo by 24px. Credits are 12px, copy 15px, navigation 14px. These specified production refinements create an 881px document rather than forcing the original 844px height.
- Tablet/intermediate widths retain offset photography and centered crop, with natural content growth and no text compression.
- Unavailable navigation destinations remain noninteractive labels. Only the real #top destination and photographer source are links.

No important visual deviations remain in the inspected Chrome states. Supporting copy remains provisional. Safari, Firefox, physical devices and a screen-reader listening pass remain unverified.

## Build and validation

- Production `astro build` passed: one static page. Astro/Vite compiled the TypeScript browser code; no standalone type-check command or test runner is configured.
- `git diff --check` passed.
- All six required viewports visually inspected, including full-page tablet/mobile states.
- Additional checks: 320px reflow; 900, 1023, 1024, 1100, 1150, 1400 and 1600px widths; short 1440 × 600 and tall 1600 × 1000 states.
- Root font-size 200% simulation at 1440, 1024, 768, 390 and 320px: wide mode reflows, words may emergency-wrap, metadata stacks and the page grows. Header wrapping was refined to preserve the whole wordmark when space permits. This is font-size simulation, not manual browser font-only zoom testing.
- Recorded overflow checks found no horizontal content overflow. Application CSS does not mask body overflow.
- Chrome platform-font inspection reports custom Onest / Onest-Medium for the headline; actual local assets load.
- Accessibility tree contains exactly one level-one heading named “Built around absence.” on desktop and mobile. Keyboard Tab reaches STILLFORM then E Vos with visible solid outlines; no dead anchors.
- JavaScript-disabled and reduced-motion mobile full-page captures have identical SHA-256 hashes to the normal static capture.
- Blocked image/font requests retain readable content and reserved geometry; image failure exposes “Photograph unavailable.” Wide fallback-font layout also checked.
- A throttled cold load retained heading opacity 1, and its settled state had no overflow. No loading concealment exists in this phase.

Detailed results: [main audit](audit.json), [supplementary audit](supplementary-audit.json). Scripts: [capture.mjs](capture.mjs), [supplementary.mjs](supplementary.mjs). They expect Chrome debugging port 9223 and the development server on port 4321.

## Approval boundary

Review at [localhost:4321](http://localhost:4321/). Stop here for human visual approval. No animation, ScrollTrigger, Manifesto, Archive, Outro or extra visual effects were implemented.
