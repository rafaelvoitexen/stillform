from PIL import Image, ImageChops
from pathlib import Path
import json
base=Path(__file__).resolve().parent
results=[]
for f in (base/'settled').glob('*.png'):
    old=base.parent/'phase-03b'/'settled'/f.name
    if old.exists():
        a,b=Image.open(old).convert('RGB'),Image.open(f).convert('RGB')
        bbox=ImageChops.difference(a,b).getbbox() if a.size==b.size else 'dimension mismatch'
        results.append({'file':f.name,'identical':bbox is None,'bbox':bbox,'size':b.size})
(base/'pixel-regression.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
