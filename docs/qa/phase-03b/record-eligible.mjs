import fs from 'node:fs/promises';
const out = new URL('./', import.meta.url);
const target = await (await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let next = 0;
const pending = new Map();
ws.addEventListener('message', ({data}) => { const message = JSON.parse(data); if (message.id) { const p = pending.get(message.id); pending.delete(message.id); message.error ? p.reject(message.error) : p.resolve(message.result); } });
const send = (method, params = {}) => new Promise((resolve,reject) => { const id = ++next; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params})); });
const evaluate = async expression => { const r = await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true}); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
await send('Emulation.setScrollbarsHidden',{hidden:true});
await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
const delay = ms => new Promise(resolve => setTimeout(resolve,ms));
const load = async () => { await send('Page.navigate',{url:'http://127.0.0.1:4324/'}); await delay(500); await evaluate('document.fonts.ready'); await delay(150); };
const metrics = () => ({ width: innerWidth, height:innerHeight, scrollWidth:document.documentElement.scrollWidth, scrollHeight:document.documentElement.scrollHeight, stacked:document.querySelector('.hero').hasAttribute('data-stacked') || document.querySelector('h1') && getComputedStyle(document.querySelector('h1')).display==='contents', font:document.fonts.check('500 176px Onest'), fontStatus:[...document.fonts].map(f=>({family:f.family,status:f.status})), image:document.querySelector('img').naturalWidth, heading:document.querySelector('h1').textContent, elements:Object.fromEntries(['.header','.opening','.around','.closing','.photo','.intro','.image-note','.credit','.footer'].map(s=>{const el=document.querySelector(s),r=el.getBoundingClientRect(),c=getComputedStyle(el);return [s,{x:r.x,y:r.y,width:r.width,height:r.height,fontSize:c.fontSize,weight:c.fontWeight,display:c.display}]})), overflow:[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();return r.width && (r.left<-.5||r.right>innerWidth+.5)}).map(el=>el.className) });
const read = () => evaluate('('+metrics.toString()+')()');
const shot = async (name, full=false) => {const layout=await send('Page.getLayoutMetrics'); const viewport=await evaluate('({width:innerWidth,height:innerHeight})'); const params={format:'png',captureBeyondViewport:full,clip:{x:0,y:0,width:viewport.width,height:viewport.height,scale:1}}; if(full)params.clip={x:0,y:0,width:layout.cssContentSize.width,height:layout.cssContentSize.height,scale:1};const s=await send('Page.captureScreenshot',params);await fs.writeFile(new URL(name+'.png',out),Buffer.from(s.data,'base64'));};

// A cold stylesheet / warm image-font cache reproduces an eligible pre-paint opportunity.
await send('Fetch.enable',{patterns:[{urlPattern:'*/_astro/*.css',requestStage:'Request'}]});
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Fetch.requestPaused')setTimeout(()=>{void send('Fetch.continueRequest',{requestId:m.params.requestId});},80);});
const samples=[];
let recording=false,frames=[];
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Page.screencastFrame'){if(recording)frames.push({data:m.params.data,timestamp:m.params.metadata.timestamp});void send('Page.screencastFrameAck',{sessionId:m.params.sessionId});}});
const state=()=>evaluate('({state:document.querySelector(".hero")?.dataset.entrance,reason:document.querySelector(".hero")?.dataset.entranceReason,now:performance.now(),marks:performance.getEntriesByType("mark").map(e=>({name:e.name,time:e.startTime})),paint:performance.getEntriesByType("paint").map(e=>({name:e.name,time:e.startTime}))})');
for(const [width,height,name] of [[1440,900,'desktop'],[390,844,'mobile'],[768,1024,'tablet']].filter(r=>!process.argv[2]||r[2]===process.argv[2])){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await send('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:width,maxHeight:height,everyNthFrame:1});
 let admitted=false;
 for(let attempt=0;attempt<4;attempt++){
  recording=true;frames=[];
  await send('Page.navigate',{url:'http://127.0.0.1:4324/'});
  let current;
  for(let poll=0;poll<60;poll++){await delay(10);try{current=await state();}catch{}if(current?.state==='running'||current?.state==='settled'||current?.state==='skipped')break;}
  if(current?.state!=='running'){samples.push({name,attempt,...current});recording=false;await delay(80);continue;}
  admitted=true;const start=current.marks.find(m=>m.name==='stillform:hero:start').time;
  const states=[];
  for(const time of [.10,.55,.80,1.10,1.55]){
   const elapsed=(await evaluate('performance.now()'))-start;await delay(Math.max(0,time*1000-elapsed));
   await shot(name+'-'+Math.round(time*1000)+'ms');
   states.push({...await state(),geometry:await read(),elapsed:(await evaluate('performance.now()'))-start});
  }
  recording=false;await send('Page.stopScreencast');
  const dir=new URL(name+'-frames/',out);await fs.mkdir(dir,{recursive:true});
  await Promise.all(frames.map((f,i)=>fs.writeFile(new URL(String(i).padStart(4,'0')+'.jpg',dir),Buffer.from(f.data,'base64'))));
  await fs.writeFile(new URL(name+'-frames.json',out),JSON.stringify(frames.map((f,i)=>({file:name+'-frames/'+String(i).padStart(4,'0')+'.jpg',timestamp:f.timestamp})),null,2));
  await fs.writeFile(new URL(name+'-states.json',out),JSON.stringify(states,null,2));
  samples.push({name,attempt,admitted:true,frameCount:frames.length,states});console.log(name+' recorded '+frames.length+' frames at attempt '+attempt);break;
 }
 if(!admitted){await send('Page.stopScreencast');console.log(name+' no eligible load in 4 attempts');}
}
await fs.writeFile(new URL('recording-audit-'+(process.argv[2]||'all')+'.json',out),JSON.stringify(samples,null,2));await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
