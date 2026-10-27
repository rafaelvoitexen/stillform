import fs from 'node:fs/promises';
import {send,evaluate,delay,shot,target,ws,out} from './cdp.mjs';
await send('Page.bringToFront');
const errors=[];let frames=[],recording=false;
ws.addEventListener('message',({data})=>{const e=JSON.parse(data);if(e.method==='Runtime.exceptionThrown')errors.push(e.params);if(e.method==='Page.screencastFrame'){if(recording)frames.push({timestamp:e.params.metadata.timestamp,data:e.params.data});void send('Page.screencastFrameAck',{sessionId:e.params.sessionId});}});
let last=[100,200];
const path=async(points,seconds,hz=120)=>{
 const steps=Math.max(2,Math.ceil(seconds*hz));
 for(let n=1;n<=steps;n++){
  const p=n/steps,scaled=p*(points.length-1),i=Math.min(points.length-2,Math.floor(scaled)),t=scaled-i;
  last=[points[i][0]+(points[i+1][0]-points[i][0])*t,points[i][1]+(points[i+1][1]-points[i][1])*t];
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:last[0],y:last[1]});await delay(1000/hz);
 }
};
const stamp=label=>evaluate(`qa.phase=${JSON.stringify(label)}`);
const setup=async(width,height,name)=>{
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:4326/?run='+name+'#manifesto'});
 for(let i=0;i<100;i++){await delay(20);if(await evaluate('!!window.__stillformPointer?.snapshot().imageReady'))break;}
 await evaluate(`window.qa={phase:'setup',events:[],frames:[],run:true};document.addEventListener('pointermove',e=>qa.events.push({time:performance.now(),phase:qa.phase,...__stillformPointer.snapshot()}));requestAnimationFrame(function tick(t){if(!qa.run)return;qa.frames.push({time:t,phase:qa.phase,...__stillformPointer.snapshot()});requestAnimationFrame(tick)});`);
 return evaluate('__stillformPointer.snapshot().region');
};
const exercise=async(r,kind='all')=>{
 const cx=(r.left+r.right)/2,cy=(r.top+r.bottom)/2,w=r.right-r.left,h=r.bottom-r.top;
 await stamp('ordinary');await path([last,[300,200],[500,250]],.45);
 if(kind!=='natural'){
  await stamp('A-fast-crossings');
  for(let n=0;n<5;n++){await path([[r.left-60,cy],[r.right+60,cy]],.12);await path([[r.right+60,cy],[r.left-60,cy]],.12);}
 }
 if(kind!=='stress'){
  await stamp('B-moving-expansion');await path([last,[cx-w*.3,cy],[cx+w*.3,cy-10],[cx-w*.2,cy+10]],.8);
  await stamp('C-continuous-inside');const points=Array.from({length:100},(_,i)=>[cx+w*.43*Math.sin(i/7),cy+h*.4*Math.sin(i/11)]);await path([last,...points],2.4);
 }
 await stamp('D-boundary-hysteresis');await path([last,[r.left+4,cy]],.12);
 await path(Array.from({length:32},(_,i)=>[r.left+(i%2?8:-8),cy+12*Math.sin(i)]),.8);
 if(kind!=='natural'){
  await stamp('E-rapid-reversal');for(let n=0;n<9;n++){await path([last,[r.left+30,cy]],.055);await path([last,[r.left-35,cy]],.055);}
 }
 await stamp('F-slow-release');await path([last,[cx,cy],[r.right+120,cy]],.85);
 await stamp('F-normal-moving');await path([last,[r.right+140,cy-50],[r.right+120,cy-100]],.55);
 await stamp('F-fast-release');await path([last,[cx,cy]],.08);await path([last,[r.left-140,cy]],.08);
 await path([last,[r.left-180,cy-90],[300,200]],.6);
};
const audits=[];
for(const [width,height,name,kind] of [[1440,900,'natural','natural'],[1440,900,'stress','stress']]){
 last=[100,200];const r=await setup(width,height,name);
 const video=kind!=='all';frames=[];
 if(video){await send('Page.startScreencast',{format:'jpeg',quality:86,maxWidth:width,maxHeight:height,everyNthFrame:1});recording=true;}
 await exercise(r,kind);
 // No stationary waits are inserted between gestures. This hold is only for the closing video frame.
 if(video)await delay(150);
 await evaluate('qa.run=false');const data=await evaluate('({origin:performance.timeOrigin,events:qa.events,frames:qa.frames,transitions:__stillformPointer.transitions(),end:__stillformPointer.snapshot()})');
 await fs.writeFile(new URL(name+'-diagnostics.json',out),JSON.stringify(data));
 if(video){recording=false;await send('Page.stopScreencast');const dir=new URL('playback/'+name+'-frames/',out);await fs.mkdir(dir,{recursive:true});for(const[i,f]of frames.entries())await fs.writeFile(new URL(String(i).padStart(4,'0')+'.jpg',dir),Buffer.from(f.data,'base64'));await fs.writeFile(new URL('playback/'+name+'-frames.json',out),JSON.stringify(frames.map((f,i)=>({timestamp:f.timestamp,file:'playback/'+name+'-frames/'+String(i).padStart(4,'0')+'.jpg'}))));}
 audits.push({name,width,height,video,events:data.events.length,frames:frames.length,transitions:data.transitions.length,end:data.end});console.log(name+' events='+data.events.length+' transitions='+data.transitions.length);
 if(!video){const cx=(r.left+r.right)/2,cy=(r.top+r.bottom)/2;await path([last,[cx,cy],[cx+5,cy]],.5);await shot('portal-'+width);}
}
await fs.writeFile(new URL('recording-audit.json',out),JSON.stringify({audits,errors},null,2));await fetch('http://127.0.0.1:9231/json/close/'+target.id);ws.close();

