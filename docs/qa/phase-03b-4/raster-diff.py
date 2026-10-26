from PIL import Image,ImageChops,ImageEnhance
from pathlib import Path
import json
b=Path(__file__).resolve().parent
out=[]
for name in ['1440x900','2560x1440','3440x1440']:
 a=Image.open(b/'baseline'/f'{name}.png').convert('RGB');c=Image.open(b/'settled'/f'{name}.png').convert('RGB');d=ImageChops.difference(a,c)
 pixels=list(d.getdata()); changed=sum(any(p) for p in pixels)
 out.append({'viewport':name,'changedPixels':changed,'fraction':changed/(a.width*a.height),'maxChannelDelta':max(max(p) for p in pixels)})
 if name=='1440x900':
  box=(32,150,270,210);ims=[a.crop(box),c.crop(box),ImageEnhance.Contrast(d.crop(box)).enhance(4)]
  canvas=Image.new('RGB',(238*3,60));[canvas.paste(im,(238*i,0)) for i,im in enumerate(ims)];canvas.resize((1428,120)).save(b/'raster-diff-detail.png')
(b/'raster-diff.json').write_text(json.dumps(out,indent=2));print(out)
