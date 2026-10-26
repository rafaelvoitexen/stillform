import fs from 'node:fs/promises';
import {send,evaluate,delay,target,ws,out} from './cdp.mjs';
await send('Page.bringToFront');const results=[];
for(const [width,height,name] of [[1440,900,'desktop'],[768,1024,'tablet'],[390,844,'mobile']]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await delay(80);
 await send('Page.navigate',{url:'http://127.0.0.1:4324/'});
 const samples=[];let started=false;
 for(let i=0;i<260;i++){
  const s=await evaluate(`(()=>{const p=document.querySelector('[data-photo-proxy]'),im=p?.querySelector('img'),white=document.querySelector('[data-hero-overlay="headline"]');return {now:performance.now(),state:{...document.documentElement.dataset},marks:performance.getEntriesByType('mark').map(m=>({name:m.name,time:m.startTime,detail:m.detail})),proxy:p?{rect:p.getBoundingClientRect().toJSON(),transform:p.style.transform,clip:p.style.clipPath,zoom:new DOMMatrix(getComputedStyle(im).transform).a}:null,identity:[...document.querySelectorAll('[data-identity-word]')].map(e=>({word:e.textContent,transform:e.style.transform,opacity:e.style.opacity,clip:e.parentElement.parentElement.style.clipPath})),lines:[...document.querySelectorAll('.line-motion')].map((e,i)=>{const w=document.querySelector('[data-headline-white="'+i+'"]');const a=e.getBoundingClientRect(),b=w?.getBoundingClientRect();return {opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform,filter:getComputedStyle(e).filter,whiteDelta:b?{x:b.x-a.x,y:b.y-a.y,width:b.width-a.width,height:b.height-a.height}:null};}),whiteClip:white?.style.clipPath,overflow:document.documentElement.scrollWidth>innerWidth,overlays:document.querySelectorAll('[data-hero-overlay]').length,masks:document.querySelectorAll('[data-headline-base-mask]').length};})()`);
  samples.push(s);if(s.state.heroState==='running')started=true;if(started&&['settled','static-final'].includes(s.state.heroState))break;await delay(20);
 }
 results.push({name,samples});console.log(name+' samples '+samples.length);
}
await fs.writeFile(new URL('motion-verification.json',out),JSON.stringify(results,null,2));await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
