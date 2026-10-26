from PIL import Image
from pathlib import Path
import json
base=Path(__file__).resolve().parent
bg=(229,232,228); graphite=(41,45,43)
def lum(rgb):
    c=[v/255 for v in rgb];c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c]
    return .2126*c[0]+.7152*c[1]+.0722*c[2]
result=[]
for name,rgb,alpha in [('a',(120,124,121),.58),('b',(101,105,102),.68)]:
    ratio=(lum(bg)+.05)/(lum(rgb)+.05)
    result.append({'variant':name,'color':'#%02x%02x%02x'%rgb,'graphite_equivalent':alpha,'contrast_on_mineral':ratio,'large_text_AA':ratio>=3,'normal_text_AA':ratio>=4.5})
(base/'contrast.json').write_text(json.dumps(result,indent=2));print(result)
