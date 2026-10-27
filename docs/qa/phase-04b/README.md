# STILLFORM — Phase 04B

26 October 2026. **Manifesto Direction A implemented; stopped for human creative approval.** No Hero-to-Manifesto transition, Archive or Outro is implemented.

[Production preview](http://127.0.0.1:4326/#manifesto) · [Background development server](http://127.0.0.1:4325/)

## Review

- [Complete desktop interaction, WebM](playback/desktop-entrance.webm): entry, negative typography, photographic discovery, movement within the interval, return to inversion and departure toward Hero.
- [Active photographic portal](portal-active.png), [negative cursor](negative-cursor.png), [registered image after movement](portal-moved.png).
- [1440×900](static/1440x900.png), [1920×1080](static/1920x1080.png), [2560×1440](static/2560x1440.png), [3440×1440](static/3440x1440.png), [768×1024](static/768x1024.png), [390×844](static/390x844.png), [360×780](static/360x780.png).

These are real Chrome renders of the integrated Astro page. The static section was implemented, captured and inspected before adding the controller; `static-pass1/` preserves that evidence. `static/` contains final production captures with JavaScript disabled. The approved standalone [Direction A proof](../../creative/proofs/manifesto/direction-a.html) remains untouched.

## Implementation

`src/components/Manifesto.astro` reproduces the approved copy, 12-column asymmetry, typography, moss SEE., reading passage, observation and metadata. It uses the shared page gutter and query container, with no global width cap. Content remains in flow and the minimum height can grow. One h2 exposes the complete sentence; visible headline spans surround the independent editorial passage through CSS grid. The browser accessibility tree exposes “What we leave open lets us see.” once as a heading.

`src/pages/index.astro` adds the section after Hero. Hero component, styles, admission and entrance sources were not edited in this phase. No new application dependencies were added.

`src/scripts/manifesto.ts` owns one pointer controller. GSAP matchMedia admits only desktop width ≥1024px, fine pointer, hover and no reduced-motion preference. QuickTo smoothing is 0.14s, power3.out; entry/departure opacity uses 0.18s, power2.out. The circle is 120–160px depending on page width. Native cursor, scrolling, links and focus remain usable.

The white difference-blended circle is local to the isolated mineral section. A separate, unblended circular photographic layer shares its position. Its image plane is registered to the actual empty flex track between LETS US and SEE.; the image translates inversely to the aperture, revealing different areas of one stationary architectural surface. It is not a moving thumbnail. The fade derives from clearance to the real interval edges; the existing 20px spaces next to the words protect the glyphs during the 18px transition band. No photographic reveal is active over the paragraph or upper headline.

The photograph reuses the existing 1920×1440 [E Vos / Tulach a’ tSolais asset](../../creative/HERO_ASSET_SHORTLIST.md), with local grayscale treatment inside the small aperture. Existing Hero attribution and local licensing records are preserved. No download, new asset pipeline or additional photograph was required. The crop remains an artistic review point.

Geometry is measured on initial setup, section/interval size changes, font readiness, scrolling and viewport resize. It is cached for pointer updates. There is no perpetual custom animation loop. Scroll/resize hides the decorative effect until the next mouse movement. Scoped listeners, observers, quickTo tweens and the decorative image are disposed on media changes, navigation and HMR; BFCache return reinitializes once. `data-reveal-ready="false"` disables both effects immediately, allowing later transition orchestration without changing Hero ownership. Default true is appropriate for this static, normal-flow section.

## Browser and accessibility validation

Chrome 156 via CDP, at real CSS viewport dimensions, against background Astro dev and the dedicated production preview. This is headless Chrome evidence, not physical mouse/touch hardware or a screen-reader session. Chrome DevTools MCP was not available; the existing CDP capture tooling was reused.

- Static measurements/screenshots cover the eleven shared target viewports, 320px and intermediate 600/900px. No horizontal overflow was found. Default 1440 and 390 compositions were inspected against the approved proof; tablet, mobile 360 and full native ultrawide were also visually inspected. A full-height 3440×1440 capture succeeds here, unlike the historical proof tool limitation.
- At 200% root text size, widths 320, 390, 768, 1440 and 3440 have no overflowing Manifesto elements; natural section heights grow, including 1134px at 320px. Screenshots: `reflow/`. This is text enlargement, not a claim of testing every browser zoom mode.
- Actual pointer delivery confirms negative opacity 1 / portal 0 over type, negative 0 / portal 1 in the interval, registered photographic movement, return to inversion and opacity 0 for both on section exit. [State evidence](interaction.json), [boundary checks](boundaries.json).
- Reduced motion and touch/mobile remove the decorative image and listeners through matchMedia cleanup; CSS also hides the effect. Both the static text and the semantic sentence remain present. The future readiness gate was tested separately.
- A blocked photograph keeps ordinary inversion and all text; a blocked Onest file preserves readable copy without horizontal overflow at 390 and 1440. JavaScript-disabled screenshots show the complete section with neither effect.
- Native Tab reaches the STILLFORM anchor with a visible solid focus outline. There are no new focusable decorations, pointer traps or duplicated accessible images. [Accessibility tree](accessibility.json) is structural evidence, not a full assistive-technology audit.
- No runtime exceptions were recorded in interaction or regression suites.

## Hero regression

At 1440, 2560, 3440, 768, 390 and 360, the existing entrance completed normally, with its approved final zoom, no overlays/masks, restored page styles and no overflow. [Results](validation.json), [PNGs](hero/), [pixel comparison](comparison.json).

Against Phase 03B.4 static references, tablet and both mobile images match exactly. Desktop differences are limited to 295 / 527 / 116 pixels respectively, at most 2 / 3 / 2 channel values out of 255; no pixel differs by more than 3. These are text antialiasing variations, not geometry/crop changes. This is a settled-frame regression, not a new claim of native F5 reliability.

## Performance and recording

Uncaptured pointer movement at 1440×900 and 3440×1440 produced **zero pointer-phase getBoundingClientRect calls**, zero long tasks and zero frame intervals above 33ms in the sampled runs. Median rAF intervals were 6.9ms; p95 7.2ms and 7.1ms. These observations describe this host/session and do not guarantee physical-device frame rates. [Profile](performance.json). Clipping and grayscale are bounded to the 120–160px aperture; there is no full-screen image mask or blur. The production Manifesto module is about 2.9KB before transfer compression and shares the existing GSAP chunk.

The WebM uses 724 actual browser JPEG frames across 8.321s, encoded on a 60fps clock with a final hold to 9.05s. Captured timestamps select actual frames; none are synthesized or interpolated. Raw frames, timing manifest, state checkpoints and [encoding audit](encoding-audit.json) are preserved. A decoded portal frame was independently inspected in `playback/portal-decoded.png`.

Pixel isolation needs a qualification: Chrome changes text-edge antialiasing when the difference layer becomes composited. The paired capture has changes outside the circle on existing glyph fringes; after excluding a 2px fringe, **zero changed pixels occur outside the aperture**. This supports no photograph leakage, not whole-page pixel identity while blending. See `comparison.json` and the paired `portal-before.png` / `portal-isolation.png`.

## Remaining review points

- Approve the reused photographic crop and the 144px anchor circle in continuous playback. The portal deliberately fades near the interval boundary to protect lettering.
- The generous tablet lower interval and long ultrawide eye journey preserve Direction A rather than introducing a new composition.
- Windows/Chrome blending changes text antialiasing during compositing. No text layout or underlying color values are changed, but other browser/GPU combinations still need review.
- No Safari/Firefox, physical touch-device or screen-reader audit is claimed. Those remain compatibility checks before release.

Build and strict TypeScript results are saved in `checks.txt`. Human approval of the section and cursor/portal interaction is the next step. The later “Void Takes the Page” transition remains out of scope.
