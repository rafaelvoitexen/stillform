import fs from'node:fs/promises';import{send,evaluate,delay,target,ws,out}from'./cdp.mjs';
const results=[];await send('Page.bringToFront');
for(const[width,height]of[[1440,900],[1920,1080],[2560,1440],[3440,1440]]){
await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/?edges='+width+'#manifesto'});await delay(600);const r=await evaluate('__stillformPointer.snapshot().region');let last=[(r.left+r.right)/2,(r.top+r.bottom)/2];
// Expand while moving in the center, then traverse all four hysteresis edges without pauses.
for(let n=0;n<55;n++){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:last[0]+3*Math.sin(n),y:last[1]});await delay(8);}
const before=await evaluate('__stillformPointer.snapshot()');let minProgress=1,maxSafetyError=0;
for(const next of[[r.left+4,r.top+4],[r.left-8,r.top-8],[r.right+8,r.top-8],[r.right+8,r.bottom+8],[r.left-8,r.bottom+8],[r.left-8,r.top-8],[r.right+8,r.top-8]]){
for(let n=1;n<=24;n++){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:last[0]+(next[0]-last[0])*n/24,y:last[1]+(next[1]-last[1])*n/24});const s=await evaluate('__stillformPointer.snapshot()');minProgress=Math.min(minProgress,s.progress);const a=s.diameter/2;maxSafetyError=Math.max(maxSafetyError,r.left-(s.visual.x-a),(s.visual.x+a)-r.right,r.top-(s.visual.y-a),(s.visual.y+a)-r.bottom);await delay(8);}last=next;}
const after=await evaluate('__stillformPointer.snapshot()');results.push({width,minProgress,maxSafetyError,extraTransitions:after.transitions-before.transitions,mode:after.mode});}
await fs.writeFile(new URL('boundaries.json',out),JSON.stringify(results,null,2));console.log(results);await fetch('http://127.0.0.1:9231/json/close/'+target.id);ws.close();
