import fs from'node:fs/promises';import{send,evaluate,delay,target,ws,out}from'./cdp.mjs';
await send('Page.bringToFront');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/?registration#manifesto'});await delay(700);const r=await evaluate('__stillformPointer.snapshot().region');const samples=[];
for(let n=0;n<70;n++){
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:(r.left+r.right)/2+(r.right-r.left)*.38*Math.sin(n/5),y:(r.top+r.bottom)/2+50*Math.sin(n/8)});
if(n%4===0)samples.push(await evaluate("({s:__stillformPointer.snapshot(),image:document.querySelector('.global-portal img').getBoundingClientRect().toJSON()})"));await delay(1000/120);
}
await fs.writeFile(new URL('registration.json',out),JSON.stringify(samples,null,2));console.log('world-plane range',Math.max(...samples.map(x=>x.image.x))-Math.min(...samples.map(x=>x.image.x)),Math.max(...samples.map(x=>x.image.y))-Math.min(...samples.map(x=>x.image.y)));await fetch('http://127.0.0.1:9231/json/close/'+target.id);ws.close();
