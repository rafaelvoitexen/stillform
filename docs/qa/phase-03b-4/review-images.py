from PIL import Image,ImageChops,ImageDraw
from pathlib import Path
import json
b=Path(__file__).resolve().parent
stats=[]
for f in (b/'baseline').glob('*.png'):
 for mode in ['settled','reduced']:
  other=b/mode/f.name
  if not other.exists():continue
  a,c=Image.open(f).convert('RGB'),Image.open(other).convert('RGB');d=ImageChops.difference(a,c)
  channels=d.split();anyd=ImageChops.lighter(ImageChops.lighter(channels[0],channels[1]),channels[2]);h=anyd.histogram();n=sum(h[1:]);maximum=max(x[1] for x in d.getextrema())
  stats.append({'file':f.name,'mode':mode,'identical':maximum==0,'changedPixels':n,'changedFraction':n/(a.width*a.height),'maxChannelDelta':maximum,'withinThreeLevels':maximum<=3,'bbox':d.getbbox()})
(b/'pixel-parity.json').write_text(json.dumps(stats,indent=2));print('Exact',sum(r['identical'] for r in stats),'/',len(stats),'max channel delta',max(r['maxChannelDelta'] for r in stats),'max changed fraction',max(r['changedFraction'] for r in stats))
for size in ['1440x900','390x844','2560x1440']:
 images=[Image.open(b/'variants'/f'{size}-{v}.png').convert('RGB') for v in ['a','b']]
 if size!='390x844':images=[im.resize((960,round(im.height*960/im.width))) for im in images]
 w,h=images[0].size;c=Image.new('RGB',(w*2,h+36),'#e5e8e4');draw=ImageDraw.Draw(c)
 for i,im in enumerate(images):c.paste(im,(w*i,36));draw.text((w*i+16,12),'VARIANT '+['A 58%','#'][i] if i==0 else 'VARIANT B 68% (provisional)',fill='#292d2b')
 c.save(b/'variants'/f'{size}-comparison.png')
a=Image.open(b.parent/'phase-03b-3'/'settled'/'1440x900.png').convert('RGB');c=Image.open(b/'baseline'/'1440x900.png').convert('RGB');out=Image.new('RGB',(1920,636),'#e5e8e4');out.paste(a.resize((960,600)),(0,36));out.paste(c.resize((960,600)),(960,36));draw=ImageDraw.Draw(out);draw.text((16,12),'PHASE 03B.3',fill='#292d2b');draw.text((976,12),'PHASE 03B.4 candidate',fill='#292d2b');out.save(b/'1440-before-after.png')
# Resolution budget is source pixels per displayed CSS pixel, including the final crop.
reg=json.loads((b/'regression.json').read_text());asset=[]
for r in reg:
 if r['mode']!='baseline':continue
 p=r['geometry']['elements']['.photo'];z=1.03 if r['width']<600 else 1.04 if r['width']<1024 else 1.06;s=max(p['width']/1920,p['height']/1440)*z
 asset.append({'viewport':str(r['width'])+'x'+str(r['height']),'frame':p,'finalZoom':z,'sourcePixelsPerCssPixel':1/s,'sufficientAtDpr1':s<=1,'sufficientAtDpr2':s*2<=1,'rgbaFrameMiB':p['width']*p['height']*4/1024**2})
(b/'image-resolution.json').write_text(json.dumps(asset,indent=2))
