import json,math
from pathlib import Path
p=Path(__file__).resolve().parent
summary=[]
for name in ['1440','1920','2560','3440','natural','stress']:
 f=p/(name+'-diagnostics.json')
 if not f.exists():continue
 d=json.loads(f.read_text());frames=d['frames'];events=d['events'];rows=[]
 for phase in dict.fromkeys(e['phase'] for e in events):
  e=[x for x in events if x['phase']==phase];s=[x for x in frames if x['phase']==phase]
  velocities=[math.hypot(b['raw']['x']-a['raw']['x'],b['raw']['y']-a['raw']['y'])/((b['time']-a['time'])/1000) for a,b in zip(e,e[1:]) if b['time']>a['time']]
  rows.append(dict(phase=phase,inputs=len(e),maxSpeed=max(velocities,default=0),maxProgress=max((x['progress'] for x in s),default=0),fullFrames=sum(x['progress']>=.999 for x in s),stateChanges=len([t for t in d['transitions'] if e and e[0]['time']-1<=t['time']<=e[-1]['time']+1])))
 violations=[];black=[];registration=[];opacity_error=0
 for i,s in enumerate(frames):
  if s['progress']>.00001:
   r=s['diameter']/2;b=s['region'];v=s['visual']
   if v['x']-r<b['left']-.01 or v['x']+r>b['right']+.01 or v['y']-r<b['top']-.01 or v['y']+r>b['bottom']+.01:violations.append(i)
  if s['progress']>.85 and s['imageOpacity']<.1:black.append(i)
  total=s['imageOpacity']+s['negativeOpacity']
  if total>1e-6:opacity_error=max(opacity_error,abs(s['imageOpacity']/total-s['progress']))
 first=next((x for x in frames if x['phase']=='B-moving-expansion' and x['mode']=='MAGNETIC_REVEAL'),None)
 onset=None
 if first:
  t=next((x for x in frames if x['time']>=first['time'] and x['phase']=='B-moving-expansion' and x['imageOpacity']>=.1),None)
  onset=t['time']-first['time'] if t else None
 delays=[]
 for t in d['transitions']:
  if t['reason']=='pointer':
   e=next((e for e in events if e['raw']['input']==t['input']),None)
   if e:delays.append(e['time']-t['time'])
 summary.append(dict(name=name,phases=rows,transitionCount=len(d['transitions']),sameInputClassificationMaxDelayMs=max(delays,default=0),imageResponseMs=onset,safetyViolations=len(violations),largeBlackFrames=len(black),maxOpacityProgressError=opacity_error,end=d['end']))
(p/'analysis.json').write_text(json.dumps(summary,indent=2));print(json.dumps([{k:v for k,v in s.items() if k not in ['end','phases']} for s in summary],indent=2))
