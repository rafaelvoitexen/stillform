import fs from'node:fs/promises';import{send,evaluate,delay,shot,target,ws,out}from'./cdp.mjs';
const results=[],errors=[];await send('Page.bringToFront');
ws.addEventListener('message',({data})=>{const e=JSON.parse(data);if(e.method==='Runtime.exceptionThrown')errors.push(e.params);});
const drag=async(selector)=>{
 const r=await evaluate(`getSelection().removeAllRanges();document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect().toJSON()`);
 const a=[r.x+3,r.y+Math.min(12,r.height/3)],b=[r.right-4,r.bottom-Math.min(8,r.height/4)];
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:a[0],y:a[1]});await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,x:a[0],y:a[1]});
 for(let n=1;n<=12;n++){await send('Input.dispatchMouseEvent',{type:'mouseMoved',button:'left',buttons:1,x:a[0]+(b[0]-a[0])*n/12,y:a[1]+(b[1]-a[1])*n/12});await delay(8);}
 await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:b[0],y:b[1]});
 return evaluate(`({selection:getSelection().toString(),css:getComputedStyle(document.querySelector(${JSON.stringify(selector)})).userSelect})`);
};
await fs.mkdir(new URL('screenshots/',out),{recursive:true});
for(const[width,height]of[[1440,900],[1920,1080],[390,844]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/?micro='+width});await delay(1000);
 results.push({width,name:'temporary-type',value:await evaluate("[...document.querySelectorAll('[data-identity-word]')].map(e=>getComputedStyle(e).userSelect)")});
 await delay(3800);results.push({width,name:'hero',...await evaluate("({state:{...document.documentElement.dataset},overflow:document.documentElement.scrollWidth>innerWidth,photo:document.querySelector('.photo').getBoundingClientRect().toJSON()})")});await shot('screenshots/'+width+'-hero');
 results.push({width,name:'hero-selection',...await drag('.built .line-motion')});
 await evaluate("getSelection().removeAllRanges();document.querySelector('#manifesto').scrollIntoView()");await delay(700);
 const info=()=>evaluate(`({chapter:document.documentElement.dataset.activeChapter,total:document.querySelector('.chapter-total').getBoundingClientRect().toJSON(),current:document.querySelector('.chapter-current').getBoundingClientRect().toJSON(),totalTransform:getComputedStyle(document.querySelector('.chapter-total')).transform,rows:[...document.querySelectorAll('.chapter-current .label-row')].map(e=>e.style.transform)})`);
 const down=await info();await evaluate('scrollTo(0,0)');await delay(250);const mid=await info();await delay(400);const up=await info();await evaluate("document.querySelector('#manifesto').scrollIntoView()");await delay(650);const downAgain=await info();results.push({width,name:'pagination',down,mid,up,downAgain});
 await shot('screenshots/'+width+'-manifesto');
 for(const selector of['.line-one','.descriptor','.chapter','.reading','.footnote'])results.push({width,name:'selection',selector,...await drag(selector)});
 await evaluate('getSelection().removeAllRanges()');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});results.push({width,name:'keyboard',...await evaluate("({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outlineStyle,native:getComputedStyle(document.body).cursor})")});
}
await send('Accessibility.enable');await fs.writeFile(new URL('accessibility.json',out),JSON.stringify(await send('Accessibility.getFullAXTree'),null,2));
await fs.writeFile(new URL('qa.json',out),JSON.stringify({results,errors},null,2));console.log(results.filter(r=>r.name.includes('selection')||r.name==='selection').map(r=>({width:r.width,name:r.name,selector:r.selector,selection:r.selection,css:r.css})));console.log('errors',errors.length);
await fetch('http://127.0.0.1:9232/json/close/'+target.id);ws.close();
