import fs from 'node:fs/promises';import {send,evaluate,delay,shot,target,ws,out} from './cdp.mjs';
await send('Page.bringToFront');const results=[];await fs.mkdir(new URL('header/',out),{recursive:true});
for(const [width,height]of[[1440,900],[1920,1080],[2560,1440],[3440,1440],[768,1024],[390,844]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:4325/'});await delay(4800);
 const state=()=>evaluate(`({chapter:document.documentElement.dataset.activeChapter,hero:{...document.documentElement.dataset},header:document.querySelector('.site-header').getBoundingClientRect().toJSON(),photo:document.querySelector('.photo').getBoundingClientRect().toJSON(),heading:document.querySelector('.opening').getBoundingClientRect().toJSON(),brand:getComputedStyle(document.querySelector('.wordmark')).opacity,blend:getComputedStyle(document.querySelector('.site-header')).mixBlendMode,overflow:document.documentElement.scrollWidth>innerWidth,rows:[...document.querySelectorAll('.label-row')].map(e=>e.style.transform)})`);
 await shot('header/'+width+'-hero');results.push({width,height,position:'hero',...await state()});
 await evaluate("document.querySelector('#manifesto').scrollIntoView()");await delay(260);results.push({width,position:'mid-roll',...await state()});await delay(400);await shot('header/'+width+'-manifesto');results.push({width,position:'manifesto',...await state()});
 await evaluate('scrollTo(0,0)');await delay(650);results.push({width,position:'reverse',...await state()});
}
await fs.writeFile(new URL('header.json',out),JSON.stringify(results,null,2));console.log(results.map(s=>({width:s.width,position:s.position,chapter:s.chapter,hero:s.hero.heroReason,overflow:s.overflow})));
await fetch('http://127.0.0.1:9230/json/close/'+target.id);ws.close();
