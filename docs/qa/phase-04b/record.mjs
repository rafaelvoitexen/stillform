import fs from 'node:fs/promises';
import {send,evaluate,delay,target,ws,out} from './cdp.mjs';
await fs.mkdir(new URL('playback/desktop-frames/',out),{recursive:true});
await send('Page.bringToFront');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://127.0.0.1:4326/'});await delay(4800);
await evaluate("document.querySelector('#manifesto').scrollIntoView()");await delay(250);
const gap=await evaluate("document.querySelector('.revealing-void').getBoundingClientRect().toJSON()");
const frames=[];let recording=false;
ws.addEventListener('message',({data})=>{const e=JSON.parse(data);if(e.method==='Page.screencastFrame'){if(recording)frames.push({data:e.params.data,timestamp:e.params.metadata.timestamp});void send('Page.screencastFrameAck',{sessionId:e.params.sessionId});}});
await send('Page.startScreencast',{format:'jpeg',quality:90,maxWidth:1440,maxHeight:900,everyNthFrame:1});recording=true;
const checkpoints=[[10,70],[300,200],[520,200],[700,320],[gap.x+gap.width/2,gap.y+gap.height/2],[gap.x+gap.width*.7,gap.y+gap.height/2],[gap.x+gap.width*.3,gap.y+gap.height/2],[950,500],[300,200],[10,70]];
let previous=checkpoints[0];
const states=[];
for(const [index,next] of checkpoints.entries()){
 for(let tick=1;tick<=30;tick++){const p=tick/30;await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:previous[0]+(next[0]-previous[0])*p,y:previous[1]+(next[1]-previous[1])*p});await delay(1000/60);}
 await delay(index===4?450:150);
 states.push(await evaluate("({time:performance.now(),negative:getComputedStyle(document.querySelector('.void-negative')).opacity,portal:getComputedStyle(document.querySelector('.void-portal')).opacity,overflow:document.documentElement.scrollWidth>innerWidth})"));previous=next;
}
await evaluate('scrollTo(0,0)');await delay(400);recording=false;await send('Page.stopScreencast');
for(const [index,frame]of frames.entries())await fs.writeFile(new URL('playback/desktop-frames/'+String(index).padStart(4,'0')+'.jpg',out),Buffer.from(frame.data,'base64'));
await fs.writeFile(new URL('playback/desktop-frames.json',out),JSON.stringify(frames.map((f,i)=>({timestamp:f.timestamp,file:'playback/desktop-frames/'+String(i).padStart(4,'0')+'.jpg'})),null,2));
await fs.writeFile(new URL('playback/states.json',out),JSON.stringify({states,frames:frames.length,gap},null,2));console.log(frames.length+' actual frames');
await fetch('http://127.0.0.1:9229/json/close/'+target.id);ws.close();

