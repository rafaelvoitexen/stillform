from PIL import Image,ImageDraw
from pathlib import Path
import json
b=Path(__file__).resolve().parent;r=json.loads((b/'regression.json').read_text());c=Image.new('RGB',(1800,536),'#e5e8e4');d=ImageDraw.Draw(c)
for i,(w,h) in enumerate([(2560,1440),(3440,1440),(3840,1600)]):
 p=next(x for x in r if x['width']==w and x['mode']=='baseline')['geometry']['elements']['.photo'];im=Image.open(b/'baseline'/f'{w}x{h}.png').convert('RGB');left=round(p['x']+p['width']*.27);top=round(p['y']+p['height']*.25);c.paste(im.crop((left,top,left+600,top+500)),(600*i,36));d.text((600*i+16,12),f'{w}px viewport: native DPR 1 detail, no resize',fill='#292d2b')
c.save(b/'native-photo-detail.png')
