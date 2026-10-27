import fs from 'node:fs/promises';import {send,evaluate,delay,target,ws,out} from './cdp.mjs';
await send('Page.bringToFront');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
let recording=false,frames=[];const logs=[];
ws.addEventListener('message',({data})=>{const e=JSON.parse(data);if(e.method==='Page.screencastFrame'){if(recording)frames.push({data:e.params.data,timestamp:e.params.metadata.timestamp});void send('Page.screencastFrameAck',{sessionId:e.params.sessionId});}});
const move=async(from,to,seconds=.6)=>{for(let n=1;n<=Math.ceil(seconds*60);n++){const p=n/Math.ceil(seconds*60);await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:from[0]+(to[0]-from[0])*p,y:from[1]+(to[1]-from[1])*p});await delay(1000/60);}};
const scroll=async(from,to,seconds=1.1)=>{for(let n=1;n<=Math.ceil(seconds*60);n++){const p=n/Math.ceil(seconds*60);await evaluate(`scrollTo(0,${from+(to-from)*p})`);await delay(1000/60);}};
for(const name of['header','interaction']){
 await send('Page.navigate',{url:'http://127.0.0.1:4326/'});await delay(4800);frames=[];
 await send('Page.startScreencast',{format:'jpeg',quality:86,maxWidth:1440,maxHeight:900,everyNthFrame:1});recording=true;
 const top=await evaluate("document.querySelector('#manifesto').getBoundingClientRect().top+scrollY");
 await delay(250);
 if(name==='header'){
  await scroll(0,top);await delay(850);await scroll(top,0);await delay(850);await scroll(0,top,.6);await delay(700);
 }else{
  await move([50,150],[400,200]);await move([400,200],[560,300]);await scroll(0,top,.7);await delay(650);
  const g=await evaluate("document.querySelector('.revealing-void').getBoundingClientRect().toJSON()");const cy=g.y+g.height/2;
  await move([560,300],[g.x-80,cy]);await move([g.x-80,cy],[g.x+g.width/2,cy],1.1);await delay(650);
  await move([g.x+g.width/2,cy],[g.x+g.width*.68,cy],.8);await move([g.x+g.width*.68,cy],[g.x+g.width*.32,cy],.8);
  await move([g.x+g.width*.32,cy],[400,300],.8);await delay(600);await move([400,300],[-10,300],.5);await delay(250);
 }
 recording=false;await send('Page.stopScreencast');const dir=new URL('playback/'+name+'-frames/',out);await fs.mkdir(dir,{recursive:true});
 for(const[i,f]of frames.entries())await fs.writeFile(new URL(String(i).padStart(4,'0')+'.jpg',dir),Buffer.from(f.data,'base64'));
 await fs.writeFile(new URL('playback/'+name+'-frames.json',out),JSON.stringify(frames.map((f,i)=>({file:'playback/'+name+'-frames/'+String(i).padStart(4,'0')+'.jpg',timestamp:f.timestamp})),null,2));
 logs.push({name,frames:frames.length,span:frames.at(-1).timestamp-frames[0].timestamp});console.log(logs.at(-1));
}
await fs.writeFile(new URL('recording.json',out),JSON.stringify(logs,null,2));await fetch('http://127.0.0.1:9230/json/close/'+target.id);ws.close();
