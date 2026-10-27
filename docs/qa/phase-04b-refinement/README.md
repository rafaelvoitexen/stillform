# STILLFORM — Global header + magnetic reveal

26 October 2026. **Implemented; stopped for human creative review.** Hero and Manifesto compositions remain approved. No chapter transition, ScrollTrigger, Archive or Outro is implemented.

[Production preview](http://127.0.0.1:4326/) · [Manifesto](http://127.0.0.1:4326/#manifesto) · [Background development](http://127.0.0.1:4325/)

## Review evidence

- [Header transition video](playback/header-entrance.webm): downward, upward and repeat chapter changes through normal scrolling.
- [Complete cursor/reveal video](playback/interaction-entrance.webm): small global negative cursor over Hero, approach to Manifesto, magnetic expansion, stationary image discovery, movement, release and viewport exit.
- Final Manifesto: [1440](final/1440-manifesto.png), [1920](final/1920-manifesto.png), [2560](final/2560-manifesto.png), [3440](final/3440-manifesto.png), [768](final/768-manifesto.png), [390](final/390-manifesto.png).
- Active portal: [1440](final/1440-portal.png), [1920](final/1920-portal.png), [2560](final/2560-portal.png), [3440](final/3440-portal.png).
- Fixed header over [the photograph](final/header-over-photo.png), [decoded rolling labels](playback/header-rolling-decoded.png), [enlarged text at 320](regression/320-text.png).

All are actual Chrome captures. Header-only validation was completed before replacing the local pointer controller. `header/` and `header.json` preserve that pass; `final/` and `pointer.json` record the combined implementation. Previous Phase 04B artifacts and studies are untouched. The prior local controller source is preserved in `before/manifesto.ts`.

## Ownership and implementation

New native Astro components: `SiteHeader.astro` and `GlobalPointer.astro`, rendered outside the page's query/stacking containers. New TypeScript controllers: `site-header.ts` and `pointer.ts`. The old section headers and local cursor layers/controller are removed. No application dependencies were added.

The transparent fixed header uses white difference lettering and shared fluid gutters. Only one brand and chapter presentation exists. Descriptor and pagination reserve the maximum measured height of their labels; both roll over 0.52s, power2.inOut, from one shared progress value. Rapid reversal kills the previous tween and continues from current progress. The brand does not participate in chapter rolling.

The original Hero master timeline still animates wordmark opacity/filter at its original wordmark label, and header metadata at its secondary label. Its timing, temporary identity, photograph journey, headline choreography and final crop are unchanged. Explicit target lookup moves to the shared component; critical fail-open CSS includes it. Hero's former header footprint becomes editorial top padding, preserving the approved stage position without an empty header element. Manifesto's old labels are removed and its main composition retains the approved lead-in. The header wraps naturally at enlarged text sizes, with measured content clearance and a CSS-only fallback.

The sole global pointer is normally 34px with 0.14s power3.out tracking. A distance field progressively attracts the **visual** target toward the measured interval; real pointer coordinates are unchanged. Engagement expands/releases over 0.52s power2.inOut, with photographic opacity replacing difference blending. Target size considers the gap width and clearance from reading text, annotation, upper statement and footer. Actual settled diameters: **197.6px at 1440, 242.8px at 1920, 300px at 2560/3440**. No static typography is moved to create those diameters.

The registered image plane remains stationary as the aperture moves. A fixed 320×320 clipping surface bounds the effect; there is no full-screen photo mask or ambient loop. The licensed local E Vos Hero image remains an explicitly temporary placeholder. Hero attribution and the existing [license/source record](../../creative/HERO_ASSET_SHORTLIST.md) remain intact. No asset research or downloads were introduced.

[GLOBAL_INTERFACE.md](../../creative/GLOBAL_INTERFACE.md) documents detailed ownership and future integration: a single active-chapter store with `getActiveChapter()` / `setChapterOverride()` and `stillform:chapterchange`; the existing `data-reveal-ready` gate disables only photographic engagement while preserving the small global cursor. A later coordinator must respect Hero entrance ownership and release its explicit chapter override on disposal.

## Validation

Chrome 156 via CDP, at real viewport sizes, on background Astro dev and production preview. This is headless browser evidence; it does not replace physical-device or screen-reader testing. Chrome DevTools MCP was unavailable, so existing CDP tooling was reused.

- Six requested viewports: 1440×900, 1920×1080, 2560×1440, 3440×1440, 768×1024, 390×844. Header stays fixed and changes correctly in both directions. Deep links and a history return select Manifesto with one header and one pointer root. The 24px hysteresis band produced zero state changes during sixteen ±8px boundary oscillations. [Header pass](header.json), [combined pass](pointer.json), [regression](regression.json).
- Measured brand timing: opacity **0 at 0.20s and 2.65s**, **0.9466 at 3.10s**, **1 at 4.60s**, relative to the real Hero start. Thus the global migration does not show a premature duplicate mark.
- Six CDP reloads (three desktop, three mobile, including cache-ignoring reloads) all completed at scrollY=0. Reloading `#manifesto` also returns to top and plays the Hero. These are **CDP reload tests, not native F5 tests**. The reload admission script was not modified by this refinement.
- The pointer is 34px in Hero and ordinary Manifesto areas, expands in the actual interval, returns to 34px on release, and restores native cursor on viewport exit and keyboard navigation. The readiness gate removes the photo while preserving the global cursor. Reduced motion, mobile and coarse pointer at desktop width remove custom interaction and retain native cursor. No runtime exceptions or horizontal overflow occurred in the combined pass.
- A real mouse click on the shared brand reaches `#top`, scrollY=0 and Hero chapter. History restoration returns to Manifesto without duplicating controllers. Failed-image and unsupported-feature checks are in [lifecycle.json](lifecycle.json); the failure cases use new documents/cache control, not same-document hash navigation.
- Default-width reflow checks cover 320 through 3840, including intermediate 600/900. Enlarged 200% root text at 320, 390, 768, 1440 and 3440 has no horizontal overflow; the header and section statement no longer overlap. At 320 the enlarged header ends at y=181.4 and the statement begins at y=287.5. [Final reflow](final-reflow.json).
- The JS-disabled mobile capture retains readable static content, visible header and native cursor. Without JS, labels retain their initial Hero metadata; dynamic chapter detection requires the controller. Reduced-motion labels update immediately. Decorative layers are aria-hidden, nonfocusable and pointer-events:none. Current label text is exposed once, without scroll-driven live announcements. The recorded Tab test retains a visible focus outline. [Accessibility tree](accessibility.json) is structural evidence, not a full assistive-technology audit.
- A failed stylesheet also retains the native cursor: admission checks the actual styled circle before activating native-cursor suppression. JS-disabled 200% text at 320px remains readable without header/statement overlap. [Final fallback checks](fallback.json), [final normal portal smoke](final-smoke.json).
- Hero's photo retains its measured geometry: at 1440 it is (748.796875,112), 655.2×650; mobile 390 remains (71.984375,279.875), 298×400. Global header differences are intentional. Below the header, comparison against prior Hero screenshots quantifies residual raster differences in [comparison.json](comparison.json); no static photo/headline displacement was introduced.

## Performance and recordings

Uncaptured ordinary and magnetic movement at 1440 and 3440 recorded **zero pointer-phase layout reads**, zero long tasks and zero rAF gaps >33ms in four samples. Median rAF intervals were 6.9–7.0ms, p95 7.1–7.2ms on this host. [Profile](performance.json). These are bounded browser observations, not universal frame-rate guarantees or a GPU memory audit. No permanent application RAF loop is added. The QA sampler uses a run token to avoid carrying measurement callbacks between samples.

Header video: **236 actual frames / 5.368s captured**, exported to 6.100s including review hold. Interaction video: **932 actual frames / 10.691s captured**, exported to 11.417s. Export selects real browser frames by timestamp on a 60fps clock and adds a final hold; no poses are synthesized or interpolated. Header capture readback has a lower cadence than uncaptured rendering. [Encoding audit](encoding-audit.json), [source capture audit](recording.json), raw frames and independently decoded PNGs are preserved.

## Remaining artistic/compatibility risks

- Approve the circle's magnetic restraint, 198px anchor size and larger ultrawide expansion in continuous playback. The photograph is still a placeholder by instruction.
- Difference blending has an inherent low-contrast range over middle-gray photographic pixels; the selected source is readable in the captured photo position, but arbitrary future imagery cannot inherit a blanket contrast guarantee. Text antialiasing also changes with browser compositing. Review on the target browsers/displays before release.
- No native OS F5 session, physical touch hardware, Safari/Firefox or full screen-reader audit is claimed here.

Build and strict TypeScript results are in `checks.txt`. Creative review is the next step; no Hero-to-Manifesto ScrollTrigger work has started.
