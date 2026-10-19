# Rapid Mind's Tutorials – 30 s Pop Ad (Style 3)

**Video:** [`rapid-minds-tutorials-pop-ad.mp4`](rapid-minds-tutorials-pop-ad.mp4) – 1920×1080, 30 fps, 30 s, H.264 + AAC

A bold pop / neo-brutalist look: bright yellow, electric blue and hot pink colour blocks, thick black outlines and hard shadows. Class numbers appear as chunky sticker tiles, coloured stripes sweep across between scenes, and an address ticker scrolls along the bottom. The music is a punchy 120 BPM electro-pop track with a riser and impact on each scene change, synthesized in `source/music.py`.

| Time | Scene |
|------|-------|
| 0 – 4.7 s | Logo sticker, "RAPID MIND'S TUTORIALS" and the tagline |
| 4.7 – 10.9 s | **CBSE Board**: tiles for Classes 5th → 10th |
| 10.9 – 17.9 s | **State Board**: tiles for Classes 5th → 12th, with 11th & 12th leading to a **COMMERCE** card |
| 17.9 – 23.5 s | **Find Us**: address card with a rotating "Old Panvel" stamp |
| 23.5 – 30 s | **Admissions Open!**: course chips and an "Enroll Now →" button |

## Re-rendering
```bash
cd source
python3 music.py
node render.js video video_noaudio.mp4 30 30
ffmpeg -i video_noaudio.mp4 -i music.wav -c:v copy -c:a aac -b:a 192k \
       -af "highshelf=f=8000:g=-3,loudnorm=I=-14:TP=-1.5" -shortest -movflags +faststart ../rapid-minds-tutorials-pop-ad.mp4
```
Fonts: Archivo Black and Space Grotesk (SIL Open Font License).
