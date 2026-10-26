import fs from 'node:fs/promises';
const out = new URL('./settled/', import.meta.url);
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
const load = async () => { await send('Page.navigate',{url:'http://localhost:4321/'}); await delay(1800); await evaluate('document.fonts.ready'); await delay(150); };
const metrics = () => ({ width: innerWidth, height:innerHeight, scrollWidth:document.documentElement.scrollWidth, scrollHeight:document.documentElement.scrollHeight, stacked:document.querySelector('.hero').hasAttribute('data-stacked') || document.querySelector('h1') && getComputedStyle(document.querySelector('h1')).display==='contents', font:document.fonts.check('500 176px Onest'), fontStatus:[...document.fonts].map(f=>({family:f.family,status:f.status})), image:document.querySelector('img').naturalWidth, heading:document.querySelector('h1').textContent, elements:Object.fromEntries(['.header','.opening','.around','.closing','.photo','.intro','.image-note','.credit','.footer'].map(s=>{const el=document.querySelector(s),r=el.getBoundingClientRect(),c=getComputedStyle(el);return [s,{x:r.x,y:r.y,width:r.width,height:r.height,fontSize:c.fontSize,weight:c.fontWeight,display:c.display}]})), overflow:[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();return r.width && (r.left<-.5||r.right>innerWidth+.5)}).map(el=>el.className) });
const read = () => evaluate('('+metrics.toString()+')()');
const shot = async (name, full=false) => {const layout=await send('Page.getLayoutMetrics'); const viewport=await evaluate('({width:innerWidth,height:innerHeight})'); const params={format:'png',captureBeyondViewport:full,clip:{x:0,y:0,width:viewport.width,height:viewport.height,scale:1}}; if(full)params.clip={x:0,y:0,width:layout.cssContentSize.width,height:layout.cssContentSize.height,scale:1};const s=await send('Page.captureScreenshot',params);await fs.writeFile(new URL(name+'.png',out),Buffer.from(s.data,'base64'));};
const results=[];
for (const [width,height] of [[360,780],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1600,1000],[320,780],[600,900],[900,900]]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false}); await load();const r=await read();r.case=width+'x'+height;results.push(r);await shot(r.case);await shot(r.case+'-full',true);
}
await fs.writeFile(new URL('audit.json',out),JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({case:r.case,overflow:r.overflow,height:r.scrollHeight,closing:r.elements['.closing'],photo:r.elements['.photo']})),null,2));await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
