import fs from 'node:fs/promises';
import { send, evaluate, delay, shot, target, ws, out } from './cdp.mjs';
const errors = [], records = [];
ws.addEventListener('message', ({data}) => { const event = JSON.parse(data); if(event.method === 'Runtime.exceptionThrown') errors.push(event.params); });
for (const [width,height,name] of [[1440,900,'desktop'],[768,1024,'tablet'],[390,844,'mobile']]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:4324/'});
  let start;
  for(let poll=0;poll<100;poll++) {
    await delay(10);
    start=await evaluate('performance.getEntriesByName("stillform:hero:start")[0]?.startTime');
    if(start)break;
  }
  if(!start){records.push({name,state:await evaluate('({...document.documentElement.dataset})')});continue;}
  for(const time of [.15,.65,1.5,2.15,2.8,3.55,4.3]){
    await delay(Math.max(0,time*1000-((await evaluate('performance.now()'))-start)));
    await shot('pass-1/'+name+'-'+Math.round(time*1000));
    records.push({name,time,state:await evaluate('({...document.documentElement.dataset})'),photo:await evaluate('(()=>{const p=document.querySelector("[data-photo-proxy]");return p?{rect:p.getBoundingClientRect().toJSON(),transform:p.style.transform,clip:p.style.clipPath}:null})()')});
  }
}
await fs.writeFile(new URL('pass-1/audit.json',out),JSON.stringify({records,errors},null,2));
console.log(JSON.stringify({records:records.filter(r=>r.time===1.5||!r.time),errors},null,2));
await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
