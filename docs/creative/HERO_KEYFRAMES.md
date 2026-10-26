# STILLFORM — Current Hero keyframes amendment

**Phase 03B.4 · 26 October 2026 · Fluid layout and continuous zoom implemented for review**

The current production rules are in [HERO_FLUID_SYSTEM.md](HERO_FLUID_SYSTEM.md). They supersede the archived text below wherever it specifies a 1440px maximum page width, old image crop/scale, static left-edge assumptions, vertical headline travel, a light-corridor lettering mask, completed-transfer-before-headline timing, prior-entry suppression or older timing/deadline values.

Retain the approved Phase 03B.3 narrative and rhythm: opposing STILL / FORM motion; main headline entering from the left concurrently with image transfer; strict white over the actual photo aperture; replay on every eligible new entry; no replay for scrolling to the top within that entry. Phase 03B.4 adds a single monotonic inner zoom to the same CSS final crop, full-width fluid geometry, and a provisional subdued ABSENCE ink.

The new layout/crop screenshots and both ink alternatives await human visual approval. [Current QA and recordings](../qa/phase-03b-4/README.md) record the actual tested implementation and remaining limits. No other section or cross-section motion is in scope.

---

## Archived previous contract — retained historical evidence

The following prior document is preserved for research. Its conflicting implementation instructions are historical, not current production requirements.

# STILLFORM — Hero keyframes: cinematic Find the Opening

**Phase 03B.1 · 26 October 2026 · Approved narrative; unimplemented blueprint**

The Creative Director's seven events below supersede the Phase 02D/03B entrance: fixed right-hand reveal, permanently visible header, opacity-only lettering, 1.36s duration and asset-ready-before-first-paint admission. The final static Hero is unchanged. [Technical timeline and initialization contract](HERO_CINEMATIC_TIMELINE.md) are normative companions.

The [final design specification](HERO_FINAL_SPEC.md) still governs identity. For exact current geometry, preserve the Phase 03A.1/03B implementation and [settled evidence](../qa/phase-03b/settled/audit.json), including the 01 / 04 indicator, 12px mobile overlap and 500px tablet photo-height cap. Do not restore older navigation labels, 24px overlap or 650px tablet height while implementing motion.

## Seven-event storyboard

Times are **first-pass tuning targets from playback start**, not immutable artistic decisions. Desktop proposal ends at **3.45s**; mobile/tablet at **2.85s**. Asset reservation, if needed, is separately bounded and is not added as an artistic hold.

| Event | Initial → transformation → final | Desktop / stacked target |
| --- | --- | --- |
| **01 — Empty canvas & vertical wipe** | Mineral #E5E8E4 only. The same photo crop is centered in the viewport, concealed. A narrow 8%-wide slit reveals **top to bottom**, from zero height to the full frame height. No lateral expansion yet; no header/footer visible. | 0.00–0.80 / 0.00–0.65 |
| **02 — Temporary STILL / FORM** | STILL above FORM emerges while the vertical wipe is active. Onest Variable 500, uppercase, deliberate fixed tracking. Opacity 0→1 and restrained blur→0; no letter cascade. STILL spans about two thirds of usable desktop width; FORM aligns to the right composition margin. Both overlap the centered photo. | STILL 0.30–1.00, FORM 0.40–1.10 / 0.22–0.80, 0.30–0.88 |
| **03 — Photographic expansion** | After the slit reaches its lower endpoint, its left/right edges open symmetrically to reveal the surrounding concrete mass. STILL / FORM remains clearly visible. The pixels behind the aperture do not pan or change crop. | 0.80–1.60 / 0.65–1.30 |
| **04 — Identity transformation** | Temporary lettering fades and blurs away as the photo begins its continuous journey from the centered frame to its measured final frame. Complete the photo transfer before the main headline appears. | Identity exit 1.50–1.95; transfer 1.60–2.35 / exit 1.22–1.58; transfer 1.30–1.90 |
| **05 — Main headline** | BUILT, AROUND, ABSENCE. enter individually with overlapping opacity, blur and upward travel. Increase line duration and staggering from Phase 03B. The image is now settled; preserve the exact graphite/chalk ABSENCE. intersection. | Starts 2.35 / 2.50 / 2.65; each 0.80s / starts 1.90 / 2.02 / 2.14; each 0.71s |
| **06 — Small wordmark** | The existing header STILLFORM resolves from opacity 0 and controlled blur while the final headline is entering. Do not morph the temporary lettering into the header or change the wordmark's dimensions. | 2.50–3.05 / 2.02–2.50 |
| **07 — Secondary information** | Support, photo credit, visible location, descriptor, footer metadata and 01 / 04 reveal **together**, with subtle opacity/blur and no travel. No extra stagger. Elements normally absent on mobile stay absent. | 3.08–3.45 / 2.52–2.85 |

## Composition checkpoints

- **K0:** centered photograph exists behind a zero-height aperture; all visual editorial text withheld only under the bounded enhancement lease. No loader, progress number or new screen.
- **K1 (0.80 desktop / 0.65 stacked):** full-height narrow slit; temporary identity resolving across it. Architecture is still an interval.
- **K2 (1.50 / 1.22):** temporary identity fully readable; photographic mass nearly revealed. Preserve a perceptible still identity before its exit begins.
- **K3 (2.35 / 1.90):** temporary identity gone; image exactly at the static destination. Restore the real photo beneath its identical proxy without a dissolve or crop change.
- **K4 (3.45 / 2.85):** exact static composition, all content sharp and readable, no temporary image/text layers, filters, transforms or animation hints.

The overlapping events are one entrance, not seven stops. Do not accelerate all actions uniformly just to meet a stopwatch; tune the identity hold and overlapping headline entrances within **3.2–3.6s desktop** and approximately **2.7–3.0s stacked**.

## Motion character and adaptations

Wipe/expansion/transfer: deliberate acceleration and deceleration, starting with power2.inOut. Text entrance and wordmark: power2.out. Identity exit: power2.inOut. Secondary information: power1.out. No elastic, bounce, rotation, perspective warp or constant motion.

Main headline travels **0.18 line height desktop / 0.12 stacked**, from below to its final position; starting blur **4px / 2px**, ending at zero. Temporary identity blur **6px / 3px**, wordmark **2px**, secondary text **1.5px / 1px**. These are initial caps for profiling, not a requirement to retain blur on a device where it harms clarity or smoothness.

On mobile/tablet, the initial image is viewport-centered and the temporary words occupy two authored lines within margins. The destination remains the existing **stacked** photo between AROUND and ABSENCE.; do not force the desktop right-hand layout onto mobile. Offscreen final content settles on the same timeline without a later scroll reveal.

## Fallback and scope

Reduced motion or JavaScript disabled: immediate final static Hero, no reservation, wipe, temporary identity, blur or delayed text. Scroll, focus, pointer activation, resize, text resizing, history restoration or page hiding cancels playback and settles the final layout without replay. Never lock scroll or delay an intended link action.

The new bounded admission strategy is defined in the [cinematic timeline](HERO_CINEMATIC_TIMELINE.md); do not keep the old 160ms asset-ready pre-paint race or combine both controllers.

Hero-to-Manifesto **The Void Takes the Page** remains documented in [motion direction](MOTION_DIRECTION.md), but is outside this task and subsequent Hero-entrance implementation scope. No ScrollTrigger, Flip, React, Lenis, WebGL, other sections or production code is introduced here.

Historical entrance: [Phase 03B report and recordings](../qa/phase-03b/README.md). Their measurements apply only to that implementation; they do not verify this new sequence.
