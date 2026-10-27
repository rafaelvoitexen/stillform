import fs from 'node:fs/promises';import {send,evaluate,delay,shot,target,ws,out} from './cdp.mjs';
const results=[],errors=[];await send('Page.bringToFront');await fs.mkdir(new URL('regression/',out),{recursive:true});
ws.addEventListener('message',({data})=>{const e=JSON.parse(data);if(e.method==='Runtime.exceptionThrown')errors.push(e.params);});
const inspect=()=>evaluate(`({state:{...document.documentElement.dataset},marks:performance.getEntriesByType('mark').map(e=>({name:e.name,time:e.startTime})),scroll:scrollY,brand:getComputedStyle(document.querySelector('.wordmark')).opacity,overflow:document.documentElement.scrollWidth>innerWidth,proxies:document.querySelectorAll('[data-hero-overlay]').length,header:document.querySelector('.site-header').getBoundingClientRect().toJSON(),photo:document.querySelector('.photo').getBoundingClientRect().toJSON(),text:document.querySelector('.reading').innerText,styles:document.querySelector('.page').getAttribute('style')})`);
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://127.0.0.1:4326/'});let start;for(let i=0;i<80;i++){await delay(10);start=await evaluate("performance.getEntriesByName('stillform:hero:start')[0]?.startTime");if(start)break;}
for(const time of[.2,2.65,3.1,4.6]){await delay(Math.max(0,start+time*1000-await evaluate('performance.now()')));results.push({name:'brand-timing',time,...await inspect()});}
for(const [width,height]of[[1440,900],[390,844]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 for(let n=0;n<3;n++){await evaluate('scrollTo(0,300)');await send('Page.reload',{ignoreCache:n===2});await delay(4800);results.push({name:'CDP-reload',width,n,...await inspect()});}
}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
for(const width of[320,360,390,600,768,900,1024,1280,1440,1600,1920,2560,3440,3840]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/#manifesto'});await delay(250);await evaluate('document.fonts.ready');
 results.push({name:'static-reduced',width,...await inspect()});
 if([320,390,768,1440,3440].includes(width)){
 await evaluate("document.documentElement.style.fontSize='32px'");await delay(100);
 results.push({name:'text-200',width,...await inspect()});await shot('regression/'+width+'-text');
 }
}
await send('Emulation.setScriptExecutionDisabled',{value:true});await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/'});await delay(200);results.push({name:'JS-disabled',...await inspect()});await shot('regression/390-js-off');
await send('Emulation.setScriptExecutionDisabled',{value:false});await send('Emulation.setEmulatedMedia',{features:[]});await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4326/#manifesto'});await delay(500);
const boundary=await evaluate("document.querySelector('#manifesto').getBoundingClientRect().top+scrollY-innerHeight*.35");const events=[];
await evaluate("window.qaChanges=[];document.addEventListener('stillform:chapterchange',e=>qaChanges.push(e.detail.chapter))");
for(let n=0;n<16;n++){await evaluate(`scrollTo(0,${boundary+(n%2?8:-8)})`);await delay(25);}results.push({name:'boundary-jitter',changes:await evaluate('qaChanges'),...await inspect()});
await send('Accessibility.enable');await fs.writeFile(new URL('accessibility.json',out),JSON.stringify(await send('Accessibility.getFullAXTree'),null,2));
await fs.writeFile(new URL('regression.json',out),JSON.stringify({results,errors},null,2));console.log('cases',results.length,'overflow',results.filter(r=>r.overflow).map(r=>[r.name,r.width]),'errors',errors.length);
await fetch('http://127.0.0.1:9230/json/close/'+target.id);ws.close();
