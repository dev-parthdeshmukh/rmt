# Rapid Mind's Tutorials – 30 s Chalkboard Ad (Style 2)

**Video:** [`rapid-minds-tutorials-chalkboard-ad.mp4`](rapid-minds-tutorials-chalkboard-ad.mp4) – 1920×1080, 30 fps, 30 s, H.264 + AAC

This ad uses a completely different look from the first one. It shows a dark green chalkboard in a wooden frame, with hand-drawn chalk lettering and doodles. An eraser wipes the board between scenes. The music is an upbeat marimba tune with light percussion, synthesized in `source/music.py`.

| Time | Scene |
|------|-------|
| 0 – 5 s | Logo pinned to the board, "Rapid Mind's Tutorials" written in chalk and the tagline |
| 5 – 11 s | **CBSE Board**: number line of Classes 5th → 10th, each circled in coloured chalk |
| 11 – 18 s | **State Board**: Classes 5th → 12th, with 11th & 12th bracketed as **COMMERCE** |
| 18 – 24 s | **Find Us Here**: chalk map and the address, First Floor, Lagad Pride, Line Ali, Old Panvel, Maharashtra 410206 |
| 24 – 30 s | **Admissions Open!**: checklist of boards and classes, "Enroll Today!" and the address |

## Re-rendering
```bash
cd source
python3 music.py
node render.js video video_noaudio.mp4 30 30
ffmpeg -i video_noaudio.mp4 -i music.wav -c:v copy -c:a aac -b:a 192k -af loudnorm=I=-15:TP=-1.5 \
       -shortest -movflags +faststart ../rapid-minds-tutorials-chalkboard-ad.mp4
```
Fonts: Cabin Sketch and Kalam (SIL Open Font License).
