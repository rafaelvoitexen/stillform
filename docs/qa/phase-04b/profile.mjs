import fs from 'node:fs/promises';import {send,evaluate,delay,target,ws,out} from './cdp.mjs';
const results=[];await send('Page.bringToFront');
for(const[width,height]of[[1440,900],[3440,1440]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/'});await delay(4700);await evaluate("document.querySelector('#manifesto').scrollIntoView()");await delay(250);
 const g=await evaluate("document.querySelector('.revealing-void').getBoundingClientRect().toJSON()");
 await evaluate(`window.qa={reads:0,raf:[],tasks:[]};window.qaRect=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){qa.reads++;return qaRect.call(this)};window.qaObserver=new PerformanceObserver(l=>qa.tasks.push(...l.getEntries().map(e=>e.duration)));qaObserver.observe({type:'longtask'});window.qaRun=true;requestAnimationFrame(function tick(t){qa.raf.push(t);if(qaRun)requestAnimationFrame(tick)});`);
 for(let i=0;i<180;i++){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:g.x+g.width*(.5+.25*Math.sin(i/20)),y:g.y+g.height/2});await delay(1000/60);}
 const data=await evaluate(`qaRun=false;qaObserver.disconnect();Element.prototype.getBoundingClientRect=qaRect;({...qa,raf:qa.raf.slice(1).map((t,i)=>t-qa.raf[i])})`);const gaps=data.raf.toSorted((a,b)=>a-b);results.push({width,height,frames:gaps.length,median:gaps[Math.floor(gaps.length*.5)],p95:gaps[Math.floor(gaps.length*.95)],gapsOver33:gaps.filter(x=>x>33).length,layoutReads:data.reads,longTasks:data.tasks});
}
await fs.writeFile(new URL('performance.json',out),JSON.stringify(results,null,2));console.log(results);await fetch('http://127.0.0.1:9229/json/close/'+target.id);ws.close();

