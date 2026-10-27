import fs from 'node:fs/promises';
import {send,evaluate,delay,shot,target,ws,out} from './cdp.mjs';
const results=[];
await fs.mkdir(new URL('static/',out),{recursive:true});
await send('Emulation.setScriptExecutionDisabled',{value:true});
for(const [width,height] of [[1440,900],[1920,1080],[2560,1440],[3440,1440],[768,1024],[390,844],[360,780],[320,780],[600,900],[900,900],[1024,768],[1280,800],[1600,1000],[3840,1600]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:4326/'}); await delay(450);await evaluate('document.fonts.ready');
 await evaluate("document.querySelector('#manifesto').scrollIntoView()");await delay(80);
 const metrics=await evaluate(`({scroll:scrollY,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,section:document.querySelector('#manifesto').getBoundingClientRect().toJSON(),elements:Object.fromEntries(['.line-one','.line-two','.interval','.line-three','.reading','.annotation','.manifesto-footer'].map(s=>{const e=document.querySelector(s);return [s,{rect:e.getBoundingClientRect().toJSON(),font:getComputedStyle(e).fontSize}]}))})`);
 await shot('static/'+width+'x'+height);results.push({width,height,...metrics});console.log(width,metrics.overflow,metrics.section.height);
}
await fs.writeFile(new URL('static.json',out),JSON.stringify(results,null,2));await fetch('http://127.0.0.1:9229/json/close/'+target.id);ws.close();


