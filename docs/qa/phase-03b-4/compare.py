from PIL import Image, ImageChops
from pathlib import Path
import json
base=Path(__file__).resolve().parent
results=[]
for f in (base/'baseline').glob('*.png'):
    for mode in ['settled','reduced']:
        other=base/mode/f.name
        if not other.exists():continue
        a,b=Image.open(f).convert('RGB'),Image.open(other).convert('RGB')
        bbox=ImageChops.difference(a,b).getbbox() if a.size==b.size else 'dimension mismatch'
        results.append({'file':f.name,'mode':mode,'identical':bbox is None,'bbox':bbox,'size':a.size})
(base/'pixel-parity.json').write_text(json.dumps(results,indent=2))
print('Identical',sum(r['identical'] for r in results),'of',len(results))
print([r for r in results if not r['identical']])
