import fs from'node:fs/promises';import{send,evaluate,delay,target,ws,out}from'./cdp.mjs';
await send('Page.bringToFront');let recording=false,frames=[];const audits=[];
ws.addEventListener('message',({data})=>{const e=JSON.parse(data);if(e.method==='Page.screencastFrame'){if(recording)frames.push({data:e.params.data,timestamp:e.params.metadata.timestamp});void send('Page.screencastFrameAck',{sessionId:e.params.sessionId});}});
let last=[300,200];
const move=async(to,seconds)=>{const from=last;const steps=Math.max(2,Math.ceil(seconds*100));for(let n=1;n<=steps;n++){last=[from[0]+(to[0]-from[0])*n/steps,from[1]+(to[1]-from[1])*n/steps];await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:last[0],y:last[1]});await delay(10);}};
for(const[width,height,name]of[[1440,900,'1440'],[1920,1080,'1920'],[1440,900,'demonstration']]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/?release='+name+'#manifesto'});
 for(let n=0;n<100;n++){await delay(20);if(await evaluate('!!window.__stillformPointer?.snapshot().imageReady'))break;}
 const r=await evaluate('__stillformPointer.snapshot().region');const cy=(r.top+r.bottom)/2,cx=(r.left+r.right)/2;
 await evaluate(`window.qa={phase:'setup',frames:[],run:true};requestAnimationFrame(function tick(t){if(!qa.run)return;const e=document.querySelector('.global-negative').getBoundingClientRect();qa.frames.push({time:t,phase:qa.phase,...__stillformPointer.snapshot(),actual:{x:e.x+e.width/2,y:e.y+e.height/2,diameter:e.width}});requestAnimationFrame(tick)});`);
 if(name==='demonstration'){frames=[];await send('Page.startScreencast',{format:'jpeg',quality:86,maxWidth:1440,maxHeight:900,everyNthFrame:1});recording=true;}
 const phase=label=>evaluate(`qa.phase=${JSON.stringify(label)}`);
 for(const kind of['slow','fast','diagonal','unfinished','reentry']){
  await phase(kind+'-prepare');await move([r.left-120,cy],.35);
  await move([r.left+40,cy],kind==='unfinished'?.055:.25);
  if(kind!=='unfinished'){await move([r.left+45,cy+4],.4);await move([r.left+40,cy],.15);}
  await phase(kind+'-release');
  await move([r.left-170,kind==='diagonal'?cy-190:cy],kind==='slow'?.8:.065);
  if(kind==='reentry'){await move([r.left+50,cy],.065);await move([r.left-90,cy],.07);await move([cx,cy],.09);await move([r.left-160,cy],.07);}
  await move([r.left-220,cy-70],.5);await move([r.left-240,cy-100],.3);
 }
 await evaluate('qa.run=false');const data=await evaluate('({origin:performance.timeOrigin,frames:qa.frames,transitions:__stillformPointer.transitions(),end:__stillformPointer.snapshot()})');await fs.writeFile(new URL(name+'-trajectory.json',out),JSON.stringify(data));
 if(recording){recording=false;await send('Page.stopScreencast');const dir=new URL('playback/release-frames/',out);await fs.mkdir(dir,{recursive:true});for(const[i,f]of frames.entries())await fs.writeFile(new URL(String(i).padStart(4,'0')+'.jpg',dir),Buffer.from(f.data,'base64'));await fs.writeFile(new URL('playback/release-frames.json',out),JSON.stringify(frames.map((f,i)=>({timestamp:f.timestamp,file:'playback/release-frames/'+String(i).padStart(4,'0')+'.jpg'}))));}
 audits.push({name,frames:data.frames.length,sourceVideoFrames:frames.length,end:data.end});console.log(name+' samples='+data.frames.length);
}
await fs.writeFile(new URL('release-audit.json',out),JSON.stringify(audits,null,2));await fetch('http://127.0.0.1:9232/json/close/'+target.id);ws.close();
