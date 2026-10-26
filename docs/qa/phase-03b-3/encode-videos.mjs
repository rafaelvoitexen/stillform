import fs from 'node:fs/promises';
import {evaluate,target,ws,out} from './cdp.mjs';
for(const name of ['desktop','tablet','mobile']){
 const original=JSON.parse(await fs.readFile(new URL('playback/'+name+'-frames.json',out),'utf8'));
 // Drop surplus high-refresh samples, never invent an intermediate frame.
 let last=-Infinity;const selected=original.filter((f,i)=>{if(f.timestamp-last>=1/60||i===original.length-1){last=f.timestamp;return true;}return false;});
 const frames=await Promise.all(selected.map(async f=>({timestamp:f.timestamp,data:'data:image/jpeg;base64,'+(await fs.readFile(new URL(f.file,out))).toString('base64')})));
 const encoded=await evaluate(`(async()=>{
 const frames=${JSON.stringify(frames)};
 const decode=async f=>createImageBitmap(await(await fetch(f.data)).blob());
 const first=await decode(frames[0]);const canvas=document.createElement('canvas');canvas.width=first.width;canvas.height=first.height;document.body.append(canvas);
 const context=canvas.getContext('2d',{alpha:false});context.drawImage(first,0,0);first.close();
 const stream=canvas.captureStream(0),track=stream.getVideoTracks()[0],chunks=[];
 const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8',videoBitsPerSecond:6000000});recorder.ondataavailable=e=>chunks.push(e.data);const done=new Promise(r=>recorder.onstop=r);
 recorder.start();const start=performance.now();
 for(const frame of frames){const bitmap=await decode(frame);const remaining=(frame.timestamp-frames[0].timestamp)*1000-(performance.now()-start);if(remaining>0)await new Promise(r=>setTimeout(r,remaining));context.drawImage(bitmap,0,0);track.requestFrame();bitmap.close();}
 // Explicitly emit a final frame after the review hold: static canvas alone emits none.
 await new Promise(r=>setTimeout(r,700));context.drawImage(canvas,0,0);track.requestFrame();await new Promise(r=>setTimeout(r,70));recorder.stop();await done;stream.getTracks().forEach(t=>t.stop());canvas.remove();
 const blob=new Blob(chunks,{type:recorder.mimeType});return await new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result.split(',')[1]);reader.readAsDataURL(blob);});
 })()`);
 const buffer=Buffer.from(encoded,'base64');await fs.writeFile(new URL('playback/'+name+'-entrance.webm',out),buffer);console.log(name+': '+buffer.length+' bytes / '+frames.length+' retained actual frames');
}
await fetch('http://127.0.0.1:9223/json/close/'+target.id);ws.close();
