from PIL import Image, ImageOps, ImageDraw, ImageChops
from pathlib import Path
import json
base=Path(__file__).resolve().parent
old=base.parent/'phase-03b-2'/'playback'
for name,label in [('desktop','03-expanded'),('mobile','03-expanded')]:
    before=Image.open(old/f'{name}-{label}.png').convert('RGB')
    after=Image.open(base/'playback'/f'{name}-04-inner-zoom.png').convert('RGB')
    if name=='desktop': before=before.resize((960,600));after=after.resize((960,600))
    width,height=after.size
    comparison=Image.new('RGB',(width*2,height+40),'#e5e8e4')
    comparison.paste(before,(0,40));comparison.paste(after,(width,40))
    d=ImageDraw.Draw(comparison);d.text((20,12),'PHASE 03B.2',fill='#292d2b');d.text((width+20,12),'PHASE 03B.3',fill='#292d2b')
    comparison.save(base/f'{name}-identity-before-after.png')
# Inspect consecutive actual captured frames at the moving ABSENCE boundary.
manifest=json.loads((base/'playback'/'desktop-frames.json').read_text())
states=json.loads((base/'playback'/'desktop-video-states.json').read_text())
start=states[0]['origin']+next(m['time'] for m in states[0]['marks'] if m['name']=='stillform:hero:start')
strip=Image.new('RGB',(260*7,240),'#e5e8e4');d=ImageDraw.Draw(strip)
for i,t in enumerate([3.2,3.4,3.6,3.8,3.98,4.08,4.25]):
    frame=min(manifest,key=lambda f:abs(f['timestamp']*1000-start-t*1000))
    im=Image.open(base/frame['file']).convert('RGB');strip.paste(im.crop((620,510,880,720)),(i*260,30));d.text((i*260+8,8),f'{t:.2f}s actual frame',fill='#292d2b')
strip.save(base/'desktop-moving-boundary-filmstrip.png')
results=[]
for name,size in [('desktop','1440x900'),('tablet','768x1024'),('mobile','390x844')]:
    a=Image.open(base/'playback'/f'{name}-08-settled.png').convert('RGB')
    b=Image.open(base.parent/'phase-03b'/'settled'/f'{size}.png').convert('RGB')
    bbox=ImageChops.difference(a,b).getbbox();results.append({'recording':name,'identical':bbox is None,'bbox':bbox})
(base/'recorded-final-parity.json').write_text(json.dumps(results,indent=2));print(results)
