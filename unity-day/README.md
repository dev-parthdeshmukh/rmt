# राष्ट्रीय एकता दिवस – National Unity Day video (31 October)

**Video:** [`national-unity-day-rapid-minds.mp4`](national-unity-day-rapid-minds.mp4) – 1080×1920 (9:16), 30 fps, 21 s, H.264 + AAC, −14.9 LUFS, 11.8 MB
**Poster:** [`national-unity-day-poster.png`](national-unity-day-poster.png) · **Thumbnail:** [`thumbnail.png`](thumbnail.png)

Made with the motion-studio skill in Remotion, from images generated in ChatGPT and clips from Gemini, all supplied by the client.

**Concept: "एकत्र" (Together).** A sweep of three tricolour ribbons is the signature transition, and the story moves from the nation to the students to the tutorial.

| Time | Scene | Text |
|---|---|---|
| 0–3 s | Tricolour smoke rises on navy (Gemini clip) | NATIONAL UNITY DAY · ३१ ऑक्टोबर · राष्ट्रीय **एकता दिवस** |
| 3–8.3 s | Statue of Unity flyover ending on the face close-up (Gemini clip, 1.6× speed) | लोहपुरुष · **सरदार वल्लभभाई पटेल** · यांना विनम्र अभिवादन |
| 8.3–10.9 s | Glowing puzzle-piece map of India | एक भारत, **श्रेष्ठ भारत** |
| 10.9–12.8 s | Students running with flags | **एकत्र शिकूया,** |
| 12.8–15.1 s | Students holding hands at sunrise (slide-push in) | **एकत्र घडूया!** · Rapid Mind's Tutorials सोबत |
| 15.1–16.9 s | The flag waving (Gemini clip), entered through a golden flash | none |
| 16.9–21 s | End card on the tricolour silk | राष्ट्रीय एकता दिवसाच्या **हार्दिक शुभेच्छा!** · logo · Rapid Mind's Tutorials · Line Ali, Old Panvel |

**Sound.** An original score is synthesized in `project/audio/sound.py`: tanpura drone, bansuri-style flute, strings, dhol, timpani, santoor and bells. Ribbon-wipe whooshes, a riser into the flag, and shimmer and bell accents on the titles are timed to the frames. The separate effects track is `project/audio/sfx_track.wav`.

**Facts checked:** 31 October is Rashtriya Ekta Diwas, the birth anniversary of Sardar Vallabhbhai Patel ("Iron Man of India"). Ek Bharat Shreshtha Bharat was announced on Ekta Diwas 2015.

## Re-render
```bash
cd project && npm i
npx remotion studio                                      # preview / edit (copy and timing live in src/theme.ts)
npx remotion render src/index.ts Main out/video.mp4 --codec=h264 --crf=16
python3 audio/sound.py                                   # -> audio/mix.wav
ffmpeg -i out/video.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v libx264 -crf 21 -c:a aac -b:a 192k \
       -af loudnorm=I=-14:TP=-1.5 -shortest -movflags +faststart final.mp4
```
`project/remotion.config.ts` points at a local Chromium. Remove that line on another machine. Fonts (Yatra One, Mukta – SIL OFL) are bundled in `public/fonts`.
Source media is in `project/public/media`: the clips are already cropped to 9:16 (removing the Gemini watermark) and upscaled, and the images are scaled to 1080×1920.
For business use, check Remotion's licence terms: https://remotion.dev/license
