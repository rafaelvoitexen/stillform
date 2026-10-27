import json,math
from pathlib import Path
p=Path(__file__).resolve().parent
reports=[]
for name in ['1440','1920','demonstration']:
 f=p/(name+'-trajectory.json')
 if not f.exists():continue
 d=json.loads(f.read_text());frames=d['frames'];releases=[]
 for transition in d['transitions']:
  if transition['mode']!='NORMAL':continue
  segment=[s for s in frames if s['time']>=transition['time'] and s['time']<=transition['time']+270]
  active=[s for s in segment if s['progress']>.001]
  if len(active)<2:continue
  a,b=active[0],active[-1]
  displacement=math.hypot(b['actual']['x']-a['actual']['x'],b['actual']['y']-a['actual']['y'])
  releases.append(dict(phase=a['phase'],startProgress=transition['progress'],movementWhileContracting=displacement,activeSamples=len(active),firstFrameMs=a['time']-transition['time']))
 error=max(math.hypot(s['actual']['x']-s['visual']['x'],s['actual']['y']-s['visual']['y']) for s in frames)
 residual=max(math.hypot(s['visual']['x']-s['normalPosition']['x'],s['visual']['y']-s['normalPosition']['y']) for s in frames if s['progress']==0)
 blend_error=max(math.hypot(s['visual']['x']-(s['normalPosition']['x']+(s['magneticPosition']['x']-s['normalPosition']['x'])*s['progress']),s['visual']['y']-(s['normalPosition']['y']+(s['magneticPosition']['y']-s['normalPosition']['y'])*s['progress'])) for s in frames)
 reports.append(dict(name=name,releases=releases,actualVsDiagnosticMaxError=error,endpointNormalResidual=residual,blendError=blend_error,end=d['end']))
(p/'trajectory-analysis.json').write_text(json.dumps(reports,indent=2));print(json.dumps([{k:v for k,v in r.items() if k!='end'}for r in reports],indent=2))
qa=p/'qa.json'
if qa.exists():
 data=json.loads(qa.read_text());pagination=[]
 for r in data['results']:
  if r['name']=='pagination':
   boxes=[r[k]['total']for k in ['down','mid','up','downAgain']]
   pagination.append(dict(width=r['width'],maxXDelta=max(b['x']for b in boxes)-min(b['x']for b in boxes),maxYDelta=max(b['y']for b in boxes)-min(b['y']for b in boxes),transforms=[r[k]['totalTransform']for k in ['down','mid','up','downAgain']]))
 (p/'pagination-analysis.json').write_text(json.dumps(pagination,indent=2));print('pagination',pagination)
