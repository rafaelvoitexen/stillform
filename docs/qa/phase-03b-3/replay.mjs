import fs from 'node:fs/promises';
import {send,evaluate,delay,target,ws,out} from './cdp.mjs';
await send('Page.bringToFront');
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
await send('Page.addScriptToEvaluateOnNewDocument',{source:"window.__historyEvents=[];['pageshow','pagehide'].forEach(type=>addEventListener(type,e=>window.__historyEvents.push({type,persisted:e.persisted,scroll:scrollY,time:performance.now()})));"});
const results=[],errors=[],bfcache=[];
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params);if(m.method==='Page.backForwardCacheNotUsed')bfcache.push(m.params);});
const state=()=>evaluate("({entry:window.__stillformHero?.entry,state:{...document.documentElement.dataset},scroll:scrollY,events:window.__historyEvents,marks:performance.getEntriesByType('mark').filter(m=>m.name.startsWith('stillform:')).map(m=>({name:m.name,time:m.startTime,detail:m.detail})),overlays:document.querySelectorAll('[data-hero-overlay]').length,masks:document.querySelectorAll('[data-headline-base-mask]').length,lines:[...document.querySelectorAll('.line-motion')].map(e=>({opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform,filter:getComputedStyle(e).filter}))})");
const record=async name=>{const r={case:name,...await state()};results.push(r);console.log(name+': '+JSON.stringify({entry:r.entry,state:r.state,scroll:r.scroll,starts:r.marks.filter(m=>m.name==='stillform:hero:start').length,events:r.events}));};
const navigate=async()=>{await send('Page.navigate',{url:'http://127.0.0.1:4324/'});await delay(700);};
const leaveReturn=async()=>{const h=await send('Page.getNavigationHistory');const entryId=h.entries[h.currentIndex].id;await send('Page.navigate',{url:'about:blank'});await delay(250);await send('Page.navigateToHistoryEntry',{entryId});await delay(700);};
await navigate();await record('fresh');await send('Page.reload',{ignoreCache:false});await delay(700);await record('reload');
await send('Page.navigate',{url:'about:blank'});await delay(100);await navigate();await record('new-navigation-after-away');await delay(3400);
await leaveReturn();await record('history-top');await delay(3400);
await evaluate('scrollTo(0,150)');await delay(100);await leaveReturn();await record('history-away');
await evaluate('scrollTo(0,0)');await delay(600);await record('same-entry-return-top');
await leaveReturn();await record('history-new-entry-at-top');
await evaluate('scrollTo(0,150)');await delay(80);await record('scroll-interruption');await evaluate('scrollTo(0,0)');await delay(600);await record('scroll-top-does-not-replay');
// Additional native restoration after an unrelated browser page (BFCache eligibility is recorded).
await send('Page.setWebLifecycleState',{state:'active'});
await send('Page.navigate',{url:'chrome://version/'});await delay(200);await navigate();await delay(3400);
await evaluate("addEventListener('unload',()=>{});scrollTo(0,130)");await delay(100);await leaveReturn();await record('history-away-native-restoration');
// Forward navigation into the Hero is a new entry too.
await evaluate('scrollTo(0,0)');await delay(80);
const h=await send('Page.getNavigationHistory');const currentId=h.entries[h.currentIndex].id;const previousId=h.entries[h.currentIndex-1].id;
await send('Page.navigateToHistoryEntry',{entryId:previousId});await delay(200);await send('Page.navigateToHistoryEntry',{entryId:currentId});await delay(700);await record('history-forward-top');
await fs.writeFile(new URL('replay.json',out),JSON.stringify({results,errors,bfcache},null,2));await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
