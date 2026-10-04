# Rapid Mind's Tutorials – 40 s Motion Graphic Ad

**Video:** [`rapid-minds-tutorials-ad.mp4`](rapid-minds-tutorials-ad.mp4) – 1920×1080, 30 fps, 40 s, H.264 + AAC

| Time | Scene |
|------|-------|
| 0 – 6.5 s | Logo reveal with tagline *"Empower Your Mind, Education is the Key!"* |
| 6.5 – 11.5 s | "Where young minds learn, grow & shine" |
| 11.5 – 19.5 s | **CBSE Board** – Classes 5th to 10th |
| 19.5 – 28.5 s | **State Board** – Classes 5th to 12th (Commerce for 11th & 12th) |
| 28.5 – 35.5 s | Location: First Floor, Lagad Pride, Line Ali, Old Panvel, Maharashtra 410206 |
| 35.5 – 40 s | End card with summary, address and "Enroll Today" |

The look is soft pastel gradients, slowly floating maths symbols, calm easing and brand colours from the logo. The background music is a gentle ambient pad with a music-box arpeggio. It is synthesized in `source/music.py`, so there are no licensing concerns.

## Re-rendering / editing

Everything lives in `source/`. To change text, timing or colours, edit `source/index.html`. Each scene's timing is in the `render(t)` function.

```bash
cd source
npm i playwright              # or use a globally installed copy
python3 music.py              # -> music.wav (needs numpy, scipy)
node render.js stills 4 16 39 # preview frames -> stills/
node render.js video video_noaudio.mp4 30 40
ffmpeg -i video_noaudio.mp4 -i music.wav -c:v copy -c:a aac -b:a 192k \
       -af "volume=-3dB" -shortest -movflags +faststart ../rapid-minds-tutorials-ad.mp4
```

Fonts: [Fredoka](https://fonts.google.com/specimen/Fredoka) and [Nunito](https://fonts.google.com/specimen/Nunito) (SIL Open Font License).
