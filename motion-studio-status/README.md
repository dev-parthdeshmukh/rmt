# Rapid Mind's Tutorials – "Unlock" WhatsApp Status (made with motion-studio / Remotion)

**Video:** [`rapid-minds-status-unlock.mp4`](rapid-minds-status-unlock.mp4) – 1080×1920 (9:16), 30 fps, 17 s, H.264 + AAC, −14.6 LUFS, ~9.6 MB
**Thumbnail:** [`thumbnail.png`](thumbnail.png)

**Concept.** *"Education is the Key."* A golden key carrying the logo turns in a glowing keyhole, and the keyhole iris opens into the rest of the video.

| Time | Beat | Motion |
|---|---|---|
| 0–2.3 s | **Hook:** UNLOCK YOUR / POTENTIAL | The key flies in with motion blur, seats in the keyhole and turns (lock click). Light rays, a spark burst and the music drop follow. |
| 2.3–4.9 s | **ADMISSIONS OPEN** | The keyhole iris opens. The logo appears with a drawn spectrum ring, the words rise out of masks, and OPEN pops in a gradient with a shine sweep. |
| 4.9–8.2 s | **CBSE**, Classes 5th → 10th | A blue colour flood brings in a 3D glass card. A count-up ticks every number while a segmented bar lights up. |
| 8.2–11.8 s | **STATE BOARD**, Classes 5th → 12th, **COMMERCE** for 11th & 12th | A magenta flood, a count to 12, then the Commerce badge slams in with a growth chart. |
| 11.8–14.8 s | **VISIT US**, Old Panvel, full address | A whip-push in. Roads draw on, a pin drops with squash and ripples, and the address writes on line by line. |
| 14.8–17 s | **RAPID MIND'S TUTORIALS**, **ENROLL NOW** | A zoom through the pin with a gold flash. The key returns, a spark burst plays, and the button pops, presses and shines. |

## Project
`project/` is a Remotion 4 project. Copy, colours and timing are all in `project/src/theme.ts`.

```bash
cd project && npm i
npx remotion studio                          # preview / edit
npx remotion render src/index.ts Main out/video.mp4 --codec=h264 --crf=16
python3 audio/make_cues.py && python3 audio/sound.py audio     # cues from the code timing -> mix.wav
ffmpeg -i out/video.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k \
       -af loudnorm=I=-14:TP=-1.5:LRA=11 -shortest -movflags +faststart final.mp4
```
`remotion.config.ts` points to a local Chromium (`setBrowserExecutable`). Remove that line on another machine. Fonts are bundled in `public/fonts`, so rendering needs no network.
The separate sound-effects track is `project/audio/sfx_track.wav`. For business use, check Remotion's licence terms: https://remotion.dev/license
