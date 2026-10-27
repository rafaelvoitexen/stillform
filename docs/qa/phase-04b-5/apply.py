from pathlib import Path

def replace(path, old, new):
    p=Path(path)
    s=p.read_text(encoding='utf-8')
    assert old in s, (path,old[:90])
    p.write_text(s.replace(old,new,1),encoding='utf-8')

p='src/scripts/pointer.ts'
replace(p,"let mode: Mode = 'NORMAL', constrained = false;","let mode: Mode = 'NORMAL';")
replace(p,'const rendered = { x: 0, y: 0, diameter: 34, imageOpacity: 0, negativeOpacity: 0 };','const rendered = { x: 0, y: 0, normalX: 0, normalY: 0, magneticX: 0, magneticY: 0, diameter: 34, imageOpacity: 0, negativeOpacity: 0 };')
replace(p,"""        let x = clamp(radius, Math.max(radius, vw - radius), state.x);
        let y = clamp(radius, Math.max(radius, vh - radius), state.y);
        if (constrained && zone.diameter >= 100) {
          const safe = safeBounds(radius);
          x = clamp(safe.left, safe.right, x); y = clamp(safe.top, safe.bottom, y);
        }
""".replace('+',''),"""        const normalX = clamp(radius, Math.max(radius, vw - radius), state.x);
        const normalY = clamp(radius, Math.max(radius, vh - radius), state.y);
        let magneticX = normalX, magneticY = normalY;
        if (zone.diameter >= 100) {
          const safe = safeBounds();
          magneticX = clamp(safe.left, safe.right, normalX + ((zone.left + zone.right) / 2 - normalX) * TUNING.influence);
          magneticY = clamp(safe.top, safe.bottom, normalY + ((zone.top + zone.bottom) / 2 - normalY) * TUNING.influence);
        }
        // Free tracking never stops. Size and spatial attraction release in the same phase.
        const x = normalX + (magneticX - normalX) * state.progress;
        const y = normalY + (magneticY - normalY) * state.progress;
""".replace('+        ','        '))
replace(p,'Object.assign(rendered, { x, y, diameter, imageOpacity:', 'Object.assign(rendered, { x, y, normalX, normalY, magneticX, magneticY, diameter, imageOpacity:')
start=Path(p).read_text(encoding='utf-8')
a=start.index('    const steer = () => {')
b=start.index('    const setMode =',a)
Path(p).write_text(start[:a]+"""    const steer = () => {
      // Progress updates render the blend; only changed raw input retargets tracking.
      if (target.x !== rawX) { target.x = rawX; xTo(rawX); }
      if (target.y !== rawY) { target.y = rawY; yTo(rawY); }
    };
""".replace('+      ','      ').replace('+    ','    ')+start[b:],encoding='utf-8')
replace(p,"      if (next === 'MAGNETIC_REVEAL') constrained = true;\n",'')
start=Path(p).read_text(encoding='utf-8');a=start.index('        onComplete: () => {');b=start.index('\n      });',a)
Path(p).write_text(start[:a]+start[b:],encoding='utf-8')
replace(p,'state.x = rendered.x; state.y = rendered.y; constrained = false;\n      if (inside) steer(); render();',"""state.x = rendered.x; state.y = rendered.y;
      if (inside) {
        Object.assign(target, { x: rawX, y: rawY });
        xTo(rawX, rendered.x); yTo(rawY, rendered.y);
      }
      render();""".replace('+      ','      ').replace('+        ','        '))
replace(p,'if (zone.diameter < 100 && constrained)', "if (zone.diameter < 100 && (state.progress > 0 || mode === 'MAGNETIC_REVEAL'))")
replace(p,'image.style.width = `${Math.max(0, zone.width)}px`; image.style.height = `${zone.planeHeight}px`;',"""image.style.width = `${Math.max(0, zone.width)}px`; image.style.height = `${zone.planeHeight}px`;
        // The stationary photographic window retains its existing bounds as the cursor leaves.
        image.style.clipPath = `inset(${Math.max(0, zone.top - zone.planeY)}px ${Math.max(0, zone.planeX + zone.width - zone.right)}px ${Math.max(0, zone.planeY + zone.planeHeight - zone.bottom)}px ${Math.max(0, zone.left - zone.planeX)}px)`;""".replace('+        ','        '))
replace(p,"magneticInfluence: mode === 'MAGNETIC_REVEAL' ? TUNING.influence : 0,", "magneticInfluence: state.progress * TUNING.influence, constraintStrength: state.progress,\n        normalPosition: { x: rendered.normalX, y: rendered.normalY }, magneticPosition: { x: rendered.magneticX, y: rendered.magneticY },")

p='src/components/SiteHeader.astro'
replace(p,"""    <span class="label-row" aria-hidden="true"><span>01 / 04</span></span>
    <span class="label-row" aria-hidden="true"><span>02 / 04</span></span>""".replace('+    ','    '),"""    <span class="chapter-current" aria-hidden="true">
      <span class="label-row"><span>01</span></span>
      <span class="label-row"><span>02</span></span>
    </span><span class="chapter-total" aria-hidden="true"> / 04</span>""".replace('+    ','    ').replace('+      ','      '))
replace(p,'.chapter { justify-self: end; min-width: 4em; text-align: right; }','.chapter { justify-self: end; min-width: 4em; text-align: right; display: flex; justify-content: flex-end; align-items: center; font-variant-numeric: tabular-nums; }\n  .chapter-current { position: relative; display: block; overflow: clip; flex: 0 0 2ch; width: 2ch; height: 100%; }\n  .chapter-total { white-space: pre; }\n  .descriptor, .chapter { -webkit-user-select: none; user-select: none; }')
replace(p,'.label-row:nth-of-type(3)', '.label-row + .label-row')

p='src/components/Hero.astro'
replace(p,'  /* Bound blur surfaces to their glyph content instead of the entire viewport. */','  .opening, .closing, .footer { -webkit-user-select: none; user-select: none; }\n  :global([data-hero-overlay]) { -webkit-user-select: none; user-select: none; }\n  /* Bound blur surfaces to their glyph content instead of the entire viewport. */')
p='src/components/Manifesto.astro'
replace(p,'  .footnote { max-width: 29ch; }','  .footnote { max-width: 29ch; }\n  .line-one, .line-two, .line-three, .manifesto-footer > span { -webkit-user-select: none; user-select: none; }')
