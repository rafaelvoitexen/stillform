import fs from 'node:fs/promises';
import { send, evaluate, delay, shot, target, ws, out } from './cdp.mjs';
let recording = false, frames = [];
const records = [], errors = [];
ws.addEventListener('message', ({data}) => {
  const event = JSON.parse(data);
  if(event.method === 'Runtime.exceptionThrown') errors.push(event.params);
  if(event.method === 'Page.screencastFrame') {
    if(recording) frames.push({data:event.params.data,timestamp:event.params.metadata.timestamp});
    void send('Page.screencastFrameAck',{sessionId:event.params.sessionId}).catch(()=>{});
  }
});
const inspect = () => evaluate(`({
  state: {...document.documentElement.dataset}, origin: performance.timeOrigin, now: performance.now(),
  marks: performance.getEntriesByType('mark').map(m=>({name:m.name,time:m.startTime,detail:m.detail})),
  photo: (()=>{const p=document.querySelector('[data-photo-proxy]');return p?{rect:p.getBoundingClientRect().toJSON(),transform:p.style.transform,clip:p.style.clipPath}:null})(),
  image: (()=>{const p=document.querySelector('.photo');return p?{rect:p.getBoundingClientRect().toJSON(),opacity:getComputedStyle(p).opacity}:null})(),
  overflow: document.documentElement.scrollWidth > innerWidth,
})`);
for(const [width,height,name] of [[1440,900,'desktop'],[768,1024,'tablet'],[390,844,'mobile']]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await delay(100);
  await send('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:width,maxHeight:height,everyNthFrame:1});
  frames=[]; recording=true;
  await send('Page.navigate',{url:'http://127.0.0.1:4324/'});
  let initial,start;
  for(let poll=0;poll<100;poll++) {
    await delay(10); initial=await inspect();
    start=initial.marks.find(m=>m.name==='stillform:hero:start')?.time;
    if(start||['settled','static-final'].includes(initial.state.heroState))break;
  }
  if(!start) {records.push({name,admitted:false,...initial});recording=false;await send('Page.stopScreencast');continue;}
  const handoff=name==='desktop'?4.1:name==='tablet'?3.55:3.2;
  const times=[.12,.55,name==='desktop'?1.65:1.4,name==='desktop'?2.2:name==='tablet'?2:1.68,
    handoff-(name==='desktop'?.775:.6),handoff+.55,handoff+1.65];
  const labels=['01-slit','02-identity-in','03-expanded','04-scale','05-transfer','06-headline','07-settled'];
  const states=[];
  for(let index=0;index<times.length;index++) {
    await delay(Math.max(0,times[index]*1000-((await evaluate('performance.now()'))-start)));
    await shot('playback/'+name+'-'+labels[index]);
    states.push({label:labels[index],requested:times[index],...await inspect()});
  }
  recording=false;await send('Page.stopScreencast');
  const reserved=initial.marks.find(m=>m.name==='stillform:hero:reserved').time;
  frames=frames.filter(frame=>frame.timestamp*1000>=initial.origin+reserved);
  const dir=new URL('playback/'+name+'-frames/',out);await fs.mkdir(dir,{recursive:true});
  await Promise.all(frames.map((frame,index)=>fs.writeFile(new URL(String(index).padStart(4,'0')+'.jpg',dir),Buffer.from(frame.data,'base64'))));
  await fs.writeFile(new URL('playback/'+name+'-frames.json',out),JSON.stringify(frames.map((frame,index)=>({file:'playback/'+name+'-frames/'+String(index).padStart(4,'0')+'.jpg',timestamp:frame.timestamp})),null,2));
  await fs.writeFile(new URL('playback/'+name+'-states.json',out),JSON.stringify(states,null,2));
  records.push({name,admitted:true,frameCount:frames.length,states});console.log(name+': '+frames.length+' actual frames');
}
await fs.writeFile(new URL('recording-audit.json',out),JSON.stringify({records,errors},null,2));
await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
