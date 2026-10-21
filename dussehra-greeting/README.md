# Happy Dussehra – 6 s Greeting Video

**Poster:** [`happy-dussehra-poster.png`](happy-dussehra-poster.png) – 1080×1920 still with the same design (fireworks at the top corners, clear of the text)

**Video:** [`happy-dussehra-rapid-minds.mp4`](happy-dussehra-rapid-minds.mp4) – 1080×1920 (9:16, for WhatsApp Status / Instagram Stories & Reels), 30 fps, 6 s, with music

The video has a deep maroon, saffron and gold palette. A marigold toran garland drops in and a golden mandala rotates slowly behind the scene. A golden bow fires an arrow that bursts into fireworks, revealing **HAPPY DUSSEHRA** and **दसऱ्याच्या हार्दिक शुभेच्छा!**. Next comes the line *"May the victory of good over evil light your path to knowledge & success"*, followed by the Rapid Mind's Tutorials logo with "Line Ali, Old Panvel". Diyas flicker along the bottom throughout.

The music has dhol-style drums and a santoor-like melody, with an arrow whoosh, firework bursts and temple bells. It is synthesized in `source/music.py`.

Re-render the video: `cd source && python3 music.py && node render.js video video_noaudio.mp4 30 6`, then add `music.wav` with ffmpeg.
Re-render the poster: `cd source && PAGE=poster.html node render.js stills 5.85` (writes `stills/t_5.85.png`).
Fonts: Cinzel, Yatra One, Fredoka and Nunito (SIL Open Font License).
