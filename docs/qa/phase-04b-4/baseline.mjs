import fs from'node:fs/promises';import{send,evaluate,delay,shot,target,ws,out}from'./cdp.mjs';
await send('Page.bringToFront');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/#manifesto'});await delay(800);
const gap=await evaluate("document.querySelector('.revealing-void').getBoundingClientRect().toJSON()");const results=[];
const inspect=()=>evaluate("({now:performance.now(),diameter:document.querySelector('.global-negative').getBoundingClientRect().width,photo:getComputedStyle(document.querySelector('.global-portal')).opacity,negative:getComputedStyle(document.querySelector('.global-negative')).opacity})");
for(let n=0;n<180;n++){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:gap.x+gap.width*(.5+.16*Math.sin(n/10)),y:gap.y+gap.height/2+12*Math.sin(n/17)});if(n%10===0)results.push({phase:'moving',n,...await inspect()});await delay(1000/120);}
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:gap.x+gap.width/2,y:gap.y+gap.height/2});await delay(650);results.push({phase:'stopped-center',...await inspect()});await shot('before/center');
await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:gap.x+40,y:gap.y+gap.height/2});await delay(650);results.push({phase:'stopped-edge',...await inspect()});await shot('before/black-circle');
await fs.writeFile(new URL('before-measurement.json',out),JSON.stringify({gap,results},null,2));console.log(results.filter((r,i)=>i%5===0||r.phase!=='moving'));
await fetch('http://127.0.0.1:9231/json/close/'+target.id);ws.close();
