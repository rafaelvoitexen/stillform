# Occupied Void — standalone Hero proofs

Disposable Phase 02B visual studies. These files do not import or modify the Astro application. No JavaScript, animation, later sections or production components are included.

- [Variant A: Open field](variant-a.html)
- [Variant B: The cut](variant-b.html)
- [Visual comparison and screenshots](../HERO_VISUAL_STUDY.md)
- [Image provenance](assets/asset-provenance.json)

Open either HTML file directly in a browser. Local CSS, JPEGs and fonts are relative to that file. For HTTP preview, run from the repository root:

```powershell
pwsh -NoProfile -File docs/creative/proofs/serve.ps1
```

Open `http://127.0.0.1:4179/variant-a.html` or `http://127.0.0.1:4179/variant-b.html`. The optional helper serves only this directory on loopback, accepts GET requests, and stops with Ctrl+C. It is a study helper, not a production server or Astro dev server.

## Captures

The four JPEGs in `screenshots/` are real browser renders at desktop **1440 × 900** and mobile **390 × 844**. Font readiness and image loading were checked before capture. Full-page screenshots were used with document size equal to the viewport; the resulting image dimensions were checked independently. `capture-audit.json` records the observed page dimensions and image/script state. Its empty `fontFaces` arrays are an enumeration limitation of the browser bridge, not evidence of missing fonts; separate `document.fonts.check` calls passed for Bricolage 600 and Instrument 400.

Navigation is intentionally static typography. Credit links work. The proofs use fixed target compositions and a mobile breakpoint; they are not a completed responsive website.

## Actual study assets and permissions

Both variants use `assets/tulach-e-vos.jpg`, photographed by **E Vos**, sourced from the photographer's Unsplash page and credited in the HTML. Two alternative study photographs are retained for comparison. Source URLs, original/offered and local dimensions, license observations and known attribution gaps are in the [shortlist](../HERO_ASSET_SHORTLIST.md) and provenance JSON. These bounded study copies are not a final production asset pack.

Local fonts are **Bricolage Grotesque 600** and **Instrument Sans 400/500**. Full SIL Open Font License notices are included as [BRICOLAGE-OFL.txt](assets/BRICOLAGE-OFL.txt) and [INSTRUMENT-OFL.txt](assets/INSTRUMENT-OFL.txt). `assets/font-source.css` preserves the download-source declarations; the proofs load local files through `shared.css`, not that remote stylesheet.

The next phase requires creative approval and separate Hero/keyframe/asset definition. These files do not approve a final direction.
