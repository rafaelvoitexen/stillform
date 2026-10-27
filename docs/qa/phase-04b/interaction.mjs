import fs from 'node:fs/promises';
import {send,evaluate,delay,shot,target,ws,out} from './cdp.mjs';
await send('Page.bringToFront');
const errors=[];ws.addEventListener('message',({data})=>{const e=JSON.parse(data);if(e.method==='Runtime.exceptionThrown')errors.push(e.params);});
const read=()=>evaluate(`({media:matchMedia('(hover:hover) and (pointer:fine)').matches,state:{...document.documentElement.dataset},overflow:document.documentElement.scrollWidth>innerWidth,negative:(()=>{const e=document.querySelector('.void-negative');return {opacity:getComputedStyle(e).opacity,blend:getComputedStyle(e).mixBlendMode,rect:e.getBoundingClientRect().toJSON()}})(),portal:(()=>{const e=document.querySelector('.void-portal');return {opacity:getComputedStyle(e).opacity,rect:e.getBoundingClientRect().toJSON(),image:!!e.querySelector('img')}})(),gap:document.querySelector('.revealing-void').getBoundingClientRect().toJSON()})`);
const move=async(x,y)=>{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});await delay(260);};
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://127.0.0.1:4326/'});await delay(4700);await evaluate("document.querySelector('#manifesto').scrollIntoView()");await delay(300);
const steps=[];
await move(300,200);steps.push({name:'negative',...await read()});await shot('negative-cursor');
const g=(await read()).gap;await move(g.x+g.width/2,g.y+g.height/2);steps.push({name:'portal',...await read()});await shot('portal-active');
await move(g.x+g.width*.7,g.y+g.height/2);steps.push({name:'portal-moved',...await read()});await shot('portal-moved');
await move(950,500);steps.push({name:'return-negative',...await read()});await shot('return-negative');
await evaluate("document.querySelector('#manifesto').dataset.revealReady='false'");await delay(220);steps.push({name:'gate-disabled',...await read()});
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await delay(100);steps.push({name:'reduced',...await read()});
await send('Emulation.setEmulatedMedia',{features:[]});await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setTouchEmulationEnabled',{enabled:true});await delay(100);steps.push({name:'touch-mobile',...await read()});
await fs.writeFile(new URL('interaction.json',out),JSON.stringify({steps,errors},null,2));console.log(JSON.stringify({steps,errors},null,2));
await fetch('http://127.0.0.1:9229/json/close/'+target.id);ws.close();

