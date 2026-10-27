import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import {spawn} from 'node:child_process';import {once} from 'node:events';
const out=path.dirname(fileURLToPath(import.meta.url));const ffmpeg=path.resolve(out,'../../../.qa-chrome/media-tools/ffmpeg-1011/ffmpeg-win64.exe');const results=[];const fps=60;
for(const name of ['header','interaction']){
 const frames=JSON.parse(await fs.readFile(path.join(out,'playback',name+'-frames.json'),'utf8')).sort((a,b)=>a.timestamp-b.timestamp);const buffers=await Promise.all(frames.map(f=>fs.readFile(path.join(out,f.file))));const span=frames.at(-1).timestamp-frames[0].timestamp;const count=Math.ceil((span+.7)*fps)+1;
 const args=['-hide_banner','-loglevel','error','-f','image2pipe','-c:v','mjpeg','-r',String(fps),'-i','pipe:0','-an','-c:v','libvpx','-deadline','realtime','-cpu-used','8','-threads','2','-b:v','6M','-pix_fmt','yuv420p','-y',path.join(out,'playback',name+'-entrance.webm')];
 const child=spawn(ffmpeg,args,{windowsHide:true,stdio:['pipe','ignore','pipe']});let errors='';child.stderr.on('data',d=>errors+=d);const done=new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(errors)));});let cursor=0;
 for(let tick=0;tick<count;tick++){const time=frames[0].timestamp+tick/fps;while(cursor+1<frames.length&&frames[cursor+1].timestamp<=time)cursor++;if(!child.stdin.write(buffers[cursor]))await once(child.stdin,'drain');}
 child.stdin.end();await done;results.push({name,sourceFrames:frames.length,sourceSpanSeconds:span,encodedFrames:count,fps,expectedDuration:count/fps,maxTimestampQuantizationMs:1000/fps,interpolation:false,method:'Hold original captured JPEG until its next timestamp; quantize to 60fps, then hold settled frame for 700ms.'});console.log(name+': '+count+' output ticks / '+(count/fps).toFixed(3)+'s');
}
await fs.writeFile(path.join(out,'encoding-audit.json'),JSON.stringify(results,null,2));


