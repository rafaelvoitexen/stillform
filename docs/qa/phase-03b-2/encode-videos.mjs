import fs from 'node:fs/promises';
import { evaluate, target, ws, out } from './cdp.mjs';

for (const name of ['desktop', 'mobile', 'tablet']) {
  const frames = JSON.parse(await fs.readFile(new URL('playback/' + name + '-frames.json', out), 'utf8')).slice(0);
  const data = await Promise.all(frames.map(async frame => ({
    timestamp: frame.timestamp,
    data: 'data:image/jpeg;base64,' + (await fs.readFile(new URL(frame.file, out))).toString('base64'),
  })));
  const encoded = await evaluate(`(async () => {
    const frames = ${JSON.stringify(data)};
    const images = await Promise.all(frames.map(async frame => createImageBitmap(await (await fetch(frame.data)).blob())));
    const canvas = document.createElement('canvas'); canvas.width = images[0].width; canvas.height = images[0].height;
    const context = canvas.getContext('2d'); context.drawImage(images[0], 0, 0);
    const stream = canvas.captureStream(60), chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 6000000 });
    recorder.ondataavailable = event => chunks.push(event.data);
    const done = new Promise(resolve => { recorder.onstop = resolve; });
    recorder.start(); const start = performance.now();
    for (let index = 0; index < frames.length; index++) {
      const remaining = (frames[index].timestamp - frames[0].timestamp) * 1000 - (performance.now() - start);
      if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
      context.drawImage(images[index], 0, 0);
    }
    await new Promise(resolve => setTimeout(resolve, 700)); recorder.stop(); await done;
    stream.getTracks().forEach(track => track.stop()); images.forEach(image => image.close());
    const blob = new Blob(chunks, { type: recorder.mimeType });
    return await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.readAsDataURL(blob); });
  })()`);
  const buffer = Buffer.from(encoded, 'base64');
  await fs.writeFile(new URL('playback/' + name + '-entrance.webm', out), buffer);
  console.log(name + ' video: ' + buffer.length + ' bytes');
}
await fetch('http://127.0.0.1:9223/json/close/' + target.id); ws.close();
