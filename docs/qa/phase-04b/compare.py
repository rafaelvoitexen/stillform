from pathlib import Path
from PIL import Image, ImageChops, ImageFilter
import json

root = Path(__file__).resolve().parent
results = []
for size in ['1440x900','2560x1440','3440x1440','768x1024','390x844','360x780']:
    old = Image.open(root.parent/'phase-03b-4'/'baseline'/f'{size}.png').convert('RGB')
    new = Image.open(root/'hero'/f'{size}.png').convert('RGB')
    diff = ImageChops.difference(old,new)
    pixels = list(diff.getdata())
    results.append(dict(size=size,changedPixels=sum(any(p) for p in pixels),maxChannelDifference=max(max(p) for p in pixels),pixelsOver3=sum(max(p)>3 for p in pixels),bbox=diff.getbbox()))
ax = json.loads((root/'accessibility.json').read_text())
headings = [dict(role=n.get('role',{}).get('value'),name=n.get('name',{}).get('value')) for n in ax['nodes'] if n.get('role',{}).get('value')=='heading']
before=Image.open(root/'portal-before.png').convert('RGB')
active=Image.open(root/'portal-isolation.png').convert('RGB')
diff=ImageChops.difference(before,active)
rect=json.loads((root/'boundaries.json').read_text())[0]['rect']
cx,cy=rect['x']+rect['width']/2,rect['y']+rect['height']/2
outside=0
outside_ink=0
ink=Image.new('L',before.size)
ink.putdata([255 if pixel!=(229,232,228) else 0 for pixel in before.getdata()])
ink=ink.filter(ImageFilter.MaxFilter(5))
for y in range(active.height):
    for x in range(active.width):
        if any(diff.getpixel((x,y))) and (x+.5-cx)**2+(y+.5-cy)**2>(rect['width']/2+1.5)**2:
            outside+=1
            if not ink.getpixel((x,y)): outside_ink+=1
report=dict(hero=results,headings=headings,portal=dict(changedBounds=diff.getbbox(),pixelsOutsideAperture=outside,pixelsOutsideApertureAndTextFringes=outside_ink,edgeTolerance=1.5,note='Difference blending changes Chrome text antialiasing when promoted. Exclude a 2px text fringe to distinguish rerasterization from photographic leakage.'))
(root/'comparison.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
