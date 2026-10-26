# STILLFORM — Typography system

**Phase 02C · 25 October 2026**

**Approved foundation:** Occupied Void, Variant B / The Cut, Onest, uppercase main headlines, mineral/graphite palette. Onest supersedes the earlier Bricolage/Instrument and Archivo/Source Serif proposals for future work. Previous documents and proofs remain unchanged as historical evidence. Exact Hero scale and weight remain subject to approval of the [two new studies](HERO_ONEST_STUDY.md).

## One family, differentiated roles

Use **Onest Variable**, normal style, for display, reading text and UI. The Hero reads **BUILT AROUND ABSENCE.** Body copy remains sentence case. Scale, weight and the interval between blocks create hierarchy; no artificial stretching, outlined type or animated font axes.

| Role | Desktop | Mobile | Weight / spacing / leading |
| --- | --- | --- | --- |
| Hero, study 1 — recommended | 176px | Opening words ≈72px; closing word ≈68px | 500; −0.055em; 1.02 |
| Hero, study 2 | 144px | ≈65px | 450; −0.045em; 1.03 desktop / 1.02 mobile |
| Future section heading — proposed, not rendered | 72–96px | 38–48px | 450–500; −0.035em; 1.04 |
| Editorial reading text — proposed | 18px, maximum 55ch | 16px, maximum 36ch | 400; 0; 1.5 |
| Hero supporting sentence — rendered | 16px | 14px | 400; −0.015em; 1.45 / 1.4 |
| Navigation | 13px | 12px | 400; 0; natural line-height |
| Image metadata / credit | 12px | 10px | 400; 0; 1.5 |
| STILLFORM wordmark | 25px | 22px | 550; −0.045em; natural line-height |

The wordmark has a small **0.12em interval before FORM**: a restrained spatial break inside an otherwise continuous name. It remains live text, not a new symbol or an imitation of AIR's separated letters. Approve this optical detail separately. Keep compact credits secondary; 10px is the proof's smallest text and should be reconsidered at 11–12px during production accessibility review.

Study 1's 500 balances uppercase mass and open counters. Study 2's 450 gives the photograph priority. 550 is useful for the small wordmark; 600 was rendered for comparison and is unnecessary for the monumental headline. Do not increase weight to compensate for weak composition.

## Color and optical rules

Mineral **#E5E8E4**, graphite **#292D2B**, chalk **#F7F8F5**, moss **#35463D**, stone **#747D76** remain unchanged. Reading text and small credits use graphite on mineral; stone is not the default for small text. Chalk is confined to the portion of ABSENCE. intersecting a dark photographic plane.

Keep BUILT and AROUND entirely in the mineral field. ABSENCE. alone crosses the photographic boundary on desktop. Its hard graphite/chalk division aligns with that edge; this is not an accent applied to a whole word. Do not cover the photograph's light shaft. The desktop optical left edge of the display sits at 30px while the normal text gutter is 36px. Mobile uses 17px versus 20px.

The mobile studies deliberately change composition. Their line breaks are authored, not an automatic desktop wrap. Never force the complete headline onto a line by horizontally compressing glyphs. The target proofs are static; production still needs text zoom and broader viewport testing.

## License, local file and verification

The official [Google Fonts Onest directory](https://github.com/google/fonts/tree/main/ofl/onest) supplies an OFL license and metadata naming **Dmitri Voloshin and Andrey Kudryavtsev**, with a **100–900 wght axis**. The bundled [metadata](proofs/onest/assets/METADATA.pb) and complete [SIL Open Font License 1.1](proofs/onest/assets/OFL.txt) are preserved. Upstream project: [simpals/onest](https://github.com/simpals/onest).

The actual proof file is the Google Fonts **Latin variable WOFF2**, [Onest-Latin-Variable.woff2](proofs/onest/assets/Onest-Latin-Variable.woff2), **33,760 bytes**, downloaded from [fonts.gstatic.com](https://fonts.gstatic.com/s/onest/v11/gNMKW3F-SZuj7xmf-HY.woff2). [Source CSS](proofs/onest/assets/font-source.css) records its declared variable range. It is served locally through `shared.css`; there is no remote font request from the proofs. `font-synthesis: none` prevents synthetic bold/italic. Only the Latin subset is bundled; other scripts require corresponding licensed subsets if later introduced.

SHA-256: `052DF74533250C2E0CA0C4BDD32DE594E107D99C1648E63820EF9C6142067828`.

**Browser evidence:** font readiness completed; `document.fonts.check` passed at 450/500/550/600. At 64px with zero tracking, the same uppercase sample measured **803.08 / 807.56 / 812.30 / 816.71px**, versus **804.98px for Arial 500**. The differing widths, computed family/weights, local font declaration and rendered specimen collectively confirm actual Onest use rather than merely a CSS family name. [Audit JSON](proofs/onest/font-verification.json) · [specimen HTML](proofs/onest/font-verification.html) · [browser specimen screenshot](proofs/onest/screenshots/font-verification.jpg).

No production font configuration or Astro component was changed. **Pending approval:** study 1 versus 2, exact display values, wordmark interval and smallest credit size. The family and uppercase headline direction are already approved.
