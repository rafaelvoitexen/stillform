import fs from 'node:fs/promises';
import {send,evaluate,delay,target,ws,out} from './cdp-gpu.mjs';
await send('Page.bringToFront');
await send('Page.addScriptToEvaluateOnNewDocument',{source:`
window.__profile={frames:[],longTasks:[],shifts:[]};
new PerformanceObserver(list=>{for(const e of list.getEntries())window.__profile.longTasks.push({duration:e.duration,start:e.startTime});}).observe({type:'longtask',buffered:true});
new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__profile.shifts.push({value:e.value,start:e.startTime});}).observe({type:'layout-shift',buffered:true});
let previous,wasRunning=false;
function sample(t){const state=document.documentElement.dataset.heroState;if(state==='running'&&wasRunning&&previous)window.__profile.frames.push(t-previous);previous=t;wasRunning=state==='running';if(state!=='settled'&&state!=='static-final')requestAnimationFrame(sample);}
requestAnimationFrame(sample);
`});
const results=[];
for(const [width,height,name] of [[1440,900,'desktop']]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await delay(70);
 await send('Tracing.start',{categories:'devtools.timeline,blink.user_timing,cc,disabled-by-default-devtools.timeline.frame',transferMode:'ReturnAsStream'});
 await send('Page.navigate',{url:'http://127.0.0.1:4324/'});await delay(name==='desktop'?6200:5300);
 const observed=await evaluate('({state:{...document.documentElement.dataset},profile:window.__profile,marks:performance.getEntriesByType("mark").map(m=>({name:m.name,time:m.startTime,detail:m.detail}))})');
 const done=new Promise(resolve=>{const listener=({data})=>{const m=JSON.parse(data);if(m.method==='Tracing.tracingComplete'){ws.removeEventListener('message',listener);resolve(m.params.stream);}};ws.addEventListener('message',listener);});
 await send('Tracing.end');const stream=await done;let chunks='',eof=false;
 while(!eof){const part=await send('IO.read',{handle:stream});chunks+=part.base64Encoded?Buffer.from(part.data,'base64').toString():part.data;eof=part.eof;}
 await send('IO.close',{handle:stream});await fs.writeFile(new URL(name+'-gpu-warm-trace.json',out),chunks);
 const trace=JSON.parse(chunks);const totals={};
 for(const event of trace.traceEvents){if(['Paint','Layout','UpdateLayoutTree','RasterTask','CompositeLayers'].includes(event.name)&&event.dur){const t=totals[event.name]??={count:0,totalMs:0,maxMs:0};t.count++;t.totalMs+=event.dur/1000;t.maxMs=Math.max(t.maxMs,event.dur/1000);}}
 const intervals=[...observed.profile.frames].sort((a,b)=>a-b);const percentile=p=>intervals[Math.min(intervals.length-1,Math.floor(intervals.length*p))];
 results.push({name,...observed,summary:{samples:intervals.length,medianFrameMs:percentile(.5),p95FrameMs:percentile(.95),maxFrameMs:intervals.at(-1),intervalsOver33ms:intervals.filter(t=>t>33.4).length,cls:observed.profile.shifts.reduce((sum,s)=>sum+s.value,0),trace:totals}});
 console.log(name+': '+JSON.stringify(results.at(-1).summary));
}
await fs.writeFile(new URL('performance-gpu-warm.json',out),JSON.stringify(results,null,2));await fetch('http://127.0.0.1:9225/json/close/'+target.id);ws.close();
