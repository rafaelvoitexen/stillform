import fs from 'node:fs/promises';
const out = new URL('./validation/', import.meta.url);
const target = await (await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let next = 0;
const pending = new Map();
ws.addEventListener('message', ({data}) => { const message = JSON.parse(data); if (message.id) { const p = pending.get(message.id); pending.delete(message.id); message.error ? p.reject(message.error) : p.resolve(message.result); } });
const send = (method, params = {}) => new Promise((resolve,reject) => { const id = ++next; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params})); });
const evaluate = async expression => { const r = await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true}); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
await send('Emulation.setScrollbarsHidden',{hidden:true});
await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
const delay = ms => new Promise(resolve => setTimeout(resolve,ms));
const load = async () => { await send('Page.navigate',{url:'http://localhost:4321/'}); await delay(500); await evaluate('document.fonts.ready'); await delay(150); };
const metrics = () => ({ width: innerWidth, height:innerHeight, scrollWidth:document.documentElement.scrollWidth, scrollHeight:document.documentElement.scrollHeight, stacked:document.querySelector('.hero').hasAttribute('data-stacked') || document.querySelector('h1') && getComputedStyle(document.querySelector('h1')).display==='contents', font:document.fonts.check('500 176px Onest'), fontStatus:[...document.fonts].map(f=>({family:f.family,status:f.status})), image:document.querySelector('img').naturalWidth, heading:document.querySelector('h1').textContent, elements:Object.fromEntries(['.header','.opening','.around','.closing','.photo','.intro','.image-note','.credit','.footer'].map(s=>{const el=document.querySelector(s),r=el.getBoundingClientRect(),c=getComputedStyle(el);return [s,{x:r.x,y:r.y,width:r.width,height:r.height,fontSize:c.fontSize,weight:c.fontWeight,display:c.display}]})), overflow:[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();return r.width && (r.left<-.5||r.right>innerWidth+.5)}).map(el=>el.className) });
const read = () => evaluate('('+metrics.toString()+')()');
const shot = async (name, full=false) => {const layout=await send('Page.getLayoutMetrics'); const viewport=await evaluate('({width:innerWidth,height:innerHeight})'); const params={format:'png',captureBeyondViewport:full,clip:{x:0,y:0,width:viewport.width,height:viewport.height,scale:1}}; if(full)params.clip={x:0,y:0,width:layout.cssContentSize.width,height:layout.cssContentSize.height,scale:1};const s=await send('Page.captureScreenshot',params);await fs.writeFile(new URL(name+'.png',out),Buffer.from(s.data,'base64'));};
const results=[];
for (const [width,height] of [[1440,900],[1280,800],[1024,768],[768,1024],[390,844],[360,780],[320,780],[900,700],[1100,700],[1600,1000],[1440,600]]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false}); await load(); const r=await read();r.case=width+'x'+height;results.push(r);await shot(r.case);if(width<1024)await shot(r.case+'-full',true);
}
for (const width of [1440,1024,768,390,320]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});await load();await evaluate("document.documentElement.style.fontSize='200%'");await delay(300);const r=await read();r.case=width+'-text-200';results.push(r);await shot(r.case+'-full',true);
}
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
await send('Emulation.setScriptExecutionDisabled',{value:true});await load();results.push({case:'no-js',...await read()});await shot('no-js-full',true);await send('Emulation.setScriptExecutionDisabled',{value:false});
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await load();results.push({case:'reduced-motion',...await read()});await shot('reduced-motion-full',true);await send('Emulation.setEmulatedMedia',{features:[]});
await send('Network.setBlockedURLs',{urls:['*tulach-e-vos.jpg']});await load();results.push({case:'image-failure',...await read(),message:await evaluate("!document.querySelector('.image-failure').hidden")});await shot('image-failure-full',true);
await send('Network.setBlockedURLs',{urls:['*Onest-Latin-Variable.woff2']});await send('Network.setCacheDisabled',{cacheDisabled:true});await load();results.push({case:'font-failure',...await read()});await shot('font-failure-full',true);await send('Network.setBlockedURLs',{urls:[]});
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await load();await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});results.push({case:'keyboard-first',focus:await evaluate('document.activeElement.outerHTML'),outline:await evaluate('getComputedStyle(document.activeElement).outlineStyle')});await shot('keyboard-focus');
await fs.writeFile(new URL('audit.json',out),JSON.stringify({browser:await(await fetch('http://127.0.0.1:9223/json/version')).json(),results},null,2));
console.log(JSON.stringify(results.map(r=>({case:r.case,overflow:r.overflow,scrollWidth:r.scrollWidth,height:r.scrollHeight,stacked:r.stacked,photo:r.elements?.['.photo'],font:r.font,focus:r.focus})),null,2));
await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
