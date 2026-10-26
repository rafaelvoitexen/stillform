"""Encode captured Chrome frames at their recorded timing; no generated/interpolated frames."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent
for name in ('desktop', 'mobile', 'tablet'):
    frames = json.loads((root / f'{name}-frames.json').read_text())[1:]
    images = []
    for frame in frames:
        image = Image.open(root / frame['file']).convert('RGB')
        if image.width > 1000:
            image = image.resize((1000, round(image.height * 1000 / image.width)), Image.Resampling.LANCZOS)
        images.append(image.quantize(colors=192))
    durations = [max(10, round((b['timestamp'] - a['timestamp']) * 1000 / 10) * 10) for a, b in zip(frames, frames[1:])]
    durations.append(800)
    images[0].save(root / f'{name}-entrance.gif', save_all=True, append_images=images[1:], duration=durations, loop=0, optimize=False)
    print(name, 'GIF:', len(images), 'captured frames')
