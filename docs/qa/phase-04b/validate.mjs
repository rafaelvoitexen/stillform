import fs from 'node:fs/promises';
import {send,evaluate,delay,shot,target,ws,out} from './cdp.mjs';
const results=[],errors=[];
ws.addEventListener('message',({data})=>{const e=JSON.parse(data);if(e.method==='Runtime.exceptionThrown')errors.push(e.params);});
await fs.mkdir(new URL('hero/',out),{recursive:true});await fs.mkdir(new URL('reflow/',out),{recursive:true});
await send('Page.bringToFront');
for(const[width,height]of [[1440,900],[2560,1440],[3440,1440],[768,1024],[390,844],[360,780]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:4326/'});await delay(4800);
 const state=await evaluate(`({state:{...document.documentElement.dataset},overlays:document.querySelectorAll('[data-hero-overlay]').length,mask:document.querySelectorAll('[data-headline-base-mask]').length,zoom:getComputedStyle(document.querySelector('.photo img')).transform,page:document.querySelector('.page').getAttribute('style'),overflow:document.documentElement.scrollWidth>innerWidth})`);
 await shot('hero/'+width+'x'+height);results.push({name:'hero',width,height,...state});
}
await send('Accessibility.enable');const tree=await send('Accessibility.getFullAXTree');await fs.writeFile(new URL('accessibility.json',out),JSON.stringify(tree,null,2));
for(const width of[320,390,768,1440,3440]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await send('Page.navigate',{url:'http://127.0.0.1:4326/'});await delay(180);await evaluate("document.fonts.ready.then(()=>document.documentElement.style.fontSize='32px')");await delay(100);await evaluate("document.querySelector('#manifesto').scrollIntoView()");
 const state=await evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth,section:document.querySelector('.manifesto').getBoundingClientRect().toJSON(),outliers:[...document.querySelectorAll('.manifesto *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<-.5||r.right>innerWidth+.5)}).map(e=>e.className),image:!!document.querySelector('.void-portal img')})`);
 results.push({name:'text-200-percent',width,...state});await shot('reflow/'+width);
}
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Emulation.setEmulatedMedia',{features:[]});await send('Network.setBlockedURLs',{urls:['*tulach-e-vos.jpg*']});
await send('Page.navigate',{url:'http://127.0.0.1:4326/'});await delay(800);await evaluate("document.querySelector('#manifesto').scrollIntoView()");await delay(100);await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:850,y:680});await delay(300);
results.push({name:'missing-image',...await evaluate("({negative:getComputedStyle(document.querySelector('.void-negative')).opacity,portal:getComputedStyle(document.querySelector('.void-portal')).opacity,copy:document.querySelector('.reading').textContent,overflow:document.documentElement.scrollWidth>innerWidth})")});
await fs.writeFile(new URL('validation.json',out),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));
await fetch('http://127.0.0.1:9229/json/close/'+target.id);ws.close();

