import fs from 'node:fs/promises';
import {send,evaluate,delay,target,ws,out} from './cdp.mjs';
const results=[];
for(const [width,height] of [[1440,900],[1280,800],[1024,768],[768,1024],[390,844],[360,780]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await delay(70);
 for(const cache of ['cold','warm']){
  if(cache==='cold')await send('Network.clearBrowserCache');
  await send('Network.setCacheDisabled',{cacheDisabled:cache==='cold'});
  for(let sample=0;sample<2;sample++){
   await send('Page.navigate',{url:'http://127.0.0.1:4324/'});await delay(600);
   results.push({width,height,cache,sample,...await evaluate('({state:{...document.documentElement.dataset},marks:performance.getEntriesByType("mark").map(m=>({name:m.name,time:m.startTime,detail:m.detail}))})')});
  }
 }
}
await fs.writeFile(new URL('reliability.json',out),JSON.stringify(results,null,2));
console.log('Admitted '+results.filter(r=>r.marks.some(m=>m.name==='stillform:hero:start')).length+'/'+results.length);
console.log('Reservation range '+Math.min(...results.map(r=>r.marks.find(m=>m.name==='stillform:hero:start')?.time-r.marks.find(m=>m.name==='stillform:hero:reserved')?.time))+' to '+Math.max(...results.map(r=>r.marks.find(m=>m.name==='stillform:hero:start')?.time-r.marks.find(m=>m.name==='stillform:hero:reserved')?.time))+'ms');
await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
