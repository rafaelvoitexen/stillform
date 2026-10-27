import fs from'node:fs/promises';import{send,evaluate,delay,shot,target,ws,out}from'./cdp.mjs';
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'https://cursify.ui-layouts.com/components/magnetic-cursor'});await delay(3000);
const before=await evaluate("(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='ENTER');return e?e.getBoundingClientRect().toJSON():null})()");
let after=null;
if(before){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:before.x+before.width/2+90,y:before.y+before.height/2+30});await delay(300);after=await evaluate("[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='ENTER').getBoundingClientRect().toJSON()");await shot('reference-demo');}
await fs.writeFile(new URL('reference.json',out),JSON.stringify({url:'https://cursify.ui-layouts.com/components/magnetic-cursor',before,after},null,2));console.log({before,after});await fetch('http://127.0.0.1:9231/json/close/'+target.id);ws.close();
