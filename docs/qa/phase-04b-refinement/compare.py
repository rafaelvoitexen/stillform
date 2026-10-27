from PIL import Image, ImageChops
from pathlib import Path
import json
p=Path(__file__).resolve().parent
results=[]
for w,h in [(1440,900),(2560,1440),(3440,1440),(768,1024),(390,844)]:
    old=Image.open(p.parent/'phase-04b'/'hero'/f'{w}x{h}.png').convert('RGB').crop((0,100,w,h))
    new=Image.open(p/'header'/f'{w}-hero.png').convert('RGB').crop((0,100,w,h))
    d=ImageChops.difference(old,new)
    pixels=list(d.getdata())
    results.append(dict(width=w,changedPixels=sum(any(v) for v in pixels),maxChannelDelta=max(max(v) for v in pixels),pixelsOver3=sum(max(v)>3 for v in pixels)))
(p/'comparison.json').write_text(json.dumps(results,indent=2))
print(results)
