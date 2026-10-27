import fs from 'node:fs/promises';import {send,evaluate,delay,target,ws,out}from'./cdp.mjs';
const results=[];await send('Page.bringToFront');
for(const[width,height]of[[1440,900],[3440,1440]]){
await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/#manifesto'});await delay(600);
const g=await evaluate("document.querySelector('.revealing-void').getBoundingClientRect().toJSON()");
for(const mode of['ordinary','magnetic']){
await evaluate(`window.qa={reads:0,raf:[],tasks:[]};window.qaOriginalRect=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){qa.reads++;return qaOriginalRect.call(this)};window.qaObserver=new PerformanceObserver(l=>qa.tasks.push(...l.getEntries().map(e=>e.duration)));qaObserver.observe({type:'longtask'});window.qaRun=true;window.qaToken=(window.qaToken??0)+1;{const token=qaToken;requestAnimationFrame(function tick(t){if(token!==qaToken)return;qa.raf.push(t);if(qaRun)requestAnimationFrame(tick)})};`);
for(let i=0;i<120;i++){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:mode==='ordinary'?width*.3+100*Math.sin(i/20):g.x+g.width*(.5+.15*Math.sin(i/20)),y:mode==='ordinary'?200:g.y+g.height/2});await delay(1000/60);}
const d=await evaluate(`qaRun=false;qaToken++;qaObserver.disconnect();Element.prototype.getBoundingClientRect=qaOriginalRect;({...qa,raf:qa.raf.slice(1).map((t,i)=>t-qa.raf[i])})`);const a=d.raf.toSorted((a,b)=>a-b);results.push({width,mode,frames:a.length,median:a[Math.floor(a.length*.5)],p95:a[Math.floor(a.length*.95)],over33:a.filter(t=>t>33).length,reads:d.reads,longTasks:d.tasks});
}}
await fs.writeFile(new URL('performance.json',out),JSON.stringify(results,null,2));console.log(results);await fetch('http://127.0.0.1:9230/json/close/'+target.id);ws.close();

