import fs from 'node:fs/promises';
import {send,evaluate,delay,shot,read,target,ws,out} from './cdp.mjs';
const results=[], reliability=[];
const status=()=>evaluate(`({state:{...document.documentElement.dataset},marks:performance.getEntriesByType('mark').map(e=>({name:e.name,time:e.startTime,detail:e.detail})),expired:getComputedStyle(document.documentElement).getPropertyValue('--sf-expired'),overlays:document.querySelectorAll('[data-hero-overlay]').length,styles:[...document.querySelectorAll('.line-motion,.photo,.wordmark,.details')].map(e=>({class:e.className,opacity:getComputedStyle(e).opacity,filter:getComputedStyle(e).filter,transform:getComputedStyle(e).transform,inline:e.getAttribute('style')}))})`);
const sizes=[[1440,900],[1280,800],[1024,768],[768,1024],[390,844],[360,780],[1600,1000]];
for(const [width,height] of sizes){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await delay(60);
 await send('Page.navigate',{url:'http://127.0.0.1:4324/'});await delay(width>=1024?6100:5100);await evaluate('document.fonts.ready');
 const snapshot=await status();const geometry=await read();results.push({case:width+'x'+height,...snapshot,geometry});await shot('settled/'+width+'x'+height);await shot('settled/'+width+'x'+height+'-full',true);
 console.log(width+' settled: '+snapshot.state.heroState+' / '+snapshot.state.heroReason);
}
for(const [width,height] of sizes.slice(0,6)){
 for(const cache of ['cold','warm']){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await delay(70);
  if(cache==='cold'){await send('Network.clearBrowserCache');await send('Network.setCacheDisabled',{cacheDisabled:true});}else await send('Network.setCacheDisabled',{cacheDisabled:false});
  for(let sample=0;sample<2;sample++){
   await send('Page.navigate',{url:'http://127.0.0.1:4324/'});await delay(600);
   reliability.push({width,height,cache,sample,...await status()});
  }
 }
}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
for(const [width,height] of [[320,780],[600,900],[900,900],[1440,500]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4324/'});await delay(400);await evaluate('document.fonts.ready');
 results.push({case:width+'x'+height,...await status(),geometry:await read()});await shot('settled/'+width+'x'+height);await shot('settled/'+width+'x'+height+'-full',true);
 await evaluate('document.documentElement.style.fontSize="200%"');await delay(150);results.push({case:width+'-text200',...await status(),geometry:await read()});await shot('settled/'+width+'-text200-full',true);
}
await fs.writeFile(new URL('regression.json',out),JSON.stringify({results,reliability},null,2));
console.log('Admissions: '+reliability.filter(r=>r.marks.some(m=>m.name==='stillform:hero:start')).length+'/'+reliability.length);
await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
