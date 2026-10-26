from PIL import Image
from pathlib import Path
import json
b=Path(__file__).resolve().parent
for name in ['large','ultrawide','ultrawide-review']:
 m=json.loads((b/'playback'/f'{name}-frames.json').read_text());thumbs=[list(Image.open(b/f['file']).convert('RGB').resize((48,24)).getdata()) for f in m]
 result=[]
 for i,t in enumerate([.1,.8,1.8,2.5,3,3.55,4.05,5.15]):
  p=b/'playback'/f'{name}-video-check-{i}.png'
  if not p.exists():continue
  im=list(Image.open(p).convert('RGB').resize((48,24)).getdata());scores=[sum((c-d)**2 for p,q in zip(im,tm) for c,d in zip(p,q)) for tm in thumbs];index=scores.index(min(scores));result.append({'requested':t,'closestCapturedTime':m[index]['timestamp']-m[0]['timestamp']})
 print(name,result)
