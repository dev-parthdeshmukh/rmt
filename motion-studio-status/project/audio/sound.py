"""Music bed + designed SFX for the Remotion status video, placed from cues.json.
Everything is synthesized here (no licence risk). Outputs: mix.wav, music_bed.wav, sfx_track.wav.
earshot / Openverse were not reachable from this environment, so designed gestures are made in code."""
import json, wave, sys
import numpy as np
from scipy.signal import butter, lfilter

SR = 44100
here = sys.argv[1] if len(sys.argv) > 1 else "."
cues = json.load(open(f"{here}/cues.json"))
DUR = cues["duration"]; N = int(SR * DUR)
rng = np.random.default_rng(3)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): b, a = butter(o, min(f, SR / 2 - 200) / (SR / 2)); return lfilter(b, a, x)
def hp(x, f, o=2): b, a = butter(o, f / (SR / 2), "high"); return lfilter(b, a, x)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], "band"); return lfilter(b, a, x)
def db(g): return 10 ** (g / 20)

class Bus:
    def __init__(s): s.L = np.zeros(N); s.R = np.zeros(N)
    def add(s, sig, t, pan=.5, g=1.0):
        s0 = int(round(t * SR))
        if s0 < 0: sig = sig[-s0:]; s0 = 0
        if s0 >= N: return
        n = min(len(sig), N - s0)
        s.L[s0:s0 + n] += sig[:n] * g * (1 - pan) * 2 ** .5
        s.R[s0:s0 + n] += sig[:n] * g * pan * 2 ** .5

music, sfx = Bus(), Bus()

# ---------------- instruments ----------------
def saw(f, n, det=0.0):
    t = np.arange(n) / SR; return 2 * ((f * (1 + det) * t + rng.random()) % 1) - 1
def pad(notes, dur, cutoff=1800):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(saw(hz(m), n, d) for m in notes for d in (-.006, 0, .006)) / (len(notes) * 3)
    e = np.minimum(1, t / .25) * np.minimum(1, (dur - t) / .4).clip(0)
    return lp(x, cutoff) * e
def pluck(f, dur=.3):
    n = int(dur * SR); t = np.arange(n) / SR
    x = saw(f, n) * .6 + np.sin(2 * np.pi * f * 2 * t) * .3
    return lp(x, 4200) * np.exp(-t * 11) * np.minimum(1, t / .002)
def kick():
    t = np.arange(int(.38 * SR)) / SR
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(46 + 120 * np.exp(-t * 32)) / SR) * np.exp(-t * 8))
def clap():
    n = int(.22 * SR); t = np.arange(n) / SR
    e = np.exp(-t * 22) + sum(.5 * np.exp(-np.clip(t - d, 0, None) * 160) * (t >= d) for d in (0, .01, .02))
    return bp(rng.standard_normal(n), 900, 6000) * e * .45
def hat(op=False):
    n = int((.16 if op else .045) * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500) * np.exp(-t * (16 if op else 85))
def sub(f, dur):
    t = np.arange(int(dur * SR)) / SR
    return np.sin(2 * np.pi * f * t) * np.minimum(1, t / .01) * np.exp(-t * 2.2)

# ---------------- designed SFX ----------------
def whoosh(dur, apex=.6, lo=300, hi=7000):
    n = int(dur * SR); t = np.arange(n) / SR; x = rng.standard_normal(n)
    env = np.where(t / dur < apex, (t / dur / apex) ** 2, ((1 - t / dur) / (1 - apex)) ** 1.6)
    fc = lo + (hi - lo) * env; a = np.exp(-2 * np.pi * fc / SR)
    out = np.zeros(n); y = 0.0
    for i in range(n): y = (1 - a[i]) * x[i] + a[i] * y; out[i] = y
    return out * env * 3
def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR; k = t / dur
    tone = sum(np.sin(2 * np.pi * np.cumsum(hz(m) * (1 + 1.0 * k ** 2)) / SR) for m in (62, 69, 74)) / 3
    return (whoosh(dur, .97, 400, 9000) * .6 + tone * .35) * k ** 2
def hit():
    t = np.arange(int(1.2 * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(42 + 110 * np.exp(-t * 20)) / SR) * np.exp(-t * 3.2)
    crack = lp(rng.standard_normal(len(t)), 5000) * np.exp(-t * 14) * .6
    return np.tanh(1.5 * (boom + crack))
def click_lock():
    t = np.arange(int(.25 * SR)) / SR
    a = bp(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t * 90)
    b = np.zeros_like(t); d = int(.07 * SR)
    b[d:] = (bp(rng.standard_normal(len(t) - d), 900, 5000) * np.exp(-np.arange(len(t) - d) / SR * 70))
    metal = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 40) * .3
    return a + b * 1.2 + metal
def shimmer(dur=1.6):
    t = np.arange(int(dur * SR)) / SR; out = np.zeros_like(t)
    for i, m in enumerate((86, 90, 93, 98, 102)):
        d = i * .05; k = (t >= d)
        out += k * np.sin(2 * np.pi * hz(m) * (t - d)) * np.exp(-np.clip(t - d, 0, None) * 3.5)
    return out * .35
def tick(pitch=0):
    t = np.arange(int(.08 * SR)) / SR
    return (np.sin(2 * np.pi * (1800 + pitch) * t) * .5 + bp(rng.standard_normal(len(t)), 3000, 9000) * .5) * np.exp(-t * 70)
def popfx():
    t = np.arange(int(.18 * SR)) / SR
    return np.sin(2 * np.pi * np.cumsum(300 + 900 * np.exp(-t * 40)) / SR) * np.exp(-t * 28)
def chime(root=81):
    t = np.arange(int(1.8 * SR)) / SR
    return sum(np.sin(2 * np.pi * hz(m) * t) * np.exp(-t * 3) for m in (root, root + 4, root + 7)) / 3 * np.minimum(1, t / .003)
def thud():
    t = np.arange(int(.4 * SR)) / SR
    return np.sin(2 * np.pi * np.cumsum(60 + 90 * np.exp(-t * 30)) / SR) * np.exp(-t * 12) + lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 30) * .5

FX = {"whoosh": lambda c: whoosh(c.get("dur", .6), c.get("apex", .6)), "riser": lambda c: riser(c["dur"]), "hit": lambda c: hit(),
      "click": lambda c: click_lock(), "shimmer": lambda c: shimmer(), "tick": lambda c: tick(c.get("pitch", 0)),
      "pop": lambda c: popfx(), "chime": lambda c: chime(), "thud": lambda c: thud()}

# ---------------- music: D major, 120 bpm ----------------
BPM = 120; B = 60 / BPM; BAR = 4 * B
PROG = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]]  # D Bm G A
drop = cues["drop"]; brk = cues["break"]; final = cues["final"]
# intro pad + riser into the drop (unlock)
music.add(pad([62, 66, 69, 74], drop + .2, 1200), 0, .5, .22)
t0 = drop; bar = 0
while t0 < brk:
    ch = PROG[bar % 4]
    music.add(pad([m + 12 for m in ch[1:]], min(BAR, brk - t0) + .1, 2400), t0, .5, .16)
    music.add(sub(hz(ch[0] - 12), BAR * .9), t0, .5, .5)
    for k in range(4):
        tb = t0 + k * B
        if tb >= brk: break
        music.add(kick(), tb, .5, .55)
        if k in (1, 3): music.add(clap(), tb, .55, .32)
        music.add(hat(), tb + B / 2, .7, .09); music.add(hat(), tb + B / 4, .3, .035); music.add(hat(), tb + 3 * B / 4, .3, .035)
    arp = [ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 24, ch[3] + 12, ch[2] + 12, ch[1] + 24, ch[3] + 12]
    for k, m in enumerate(arp):
        tk = t0 + k * B / 2
        if tk < brk: music.add(pluck(hz(m)), tk, .3 + .4 * (k % 2), .14)
    t0 += BAR; bar += 1
# break: music steps down (pad only) before the final hit
music.add(pad([69, 74, 78], final - brk + .1, 900), brk, .5, .12)
# final chord + tail
music.add(pad([62, 66, 69, 74, 78], DUR - final, 3000), final, .5, .24)
music.add(sub(hz(38), 2.5), final, .5, .6)
for k, m in enumerate([74, 78, 81, 86]): music.add(pluck(hz(m), .6), final + .45 + k * .12, .5, .12)

# ---------------- place SFX from cues ----------------
for c in cues["cues"]:
    sig = FX[c["kind"]](c)
    start = c["t"] - c.get("lead", 0.0)  # whooshes/risers peak on the cue time
    sfx.add(sig, start, c.get("pan", .5), db(c.get("gain_db", 0)) * .35)

def reverb(x, seed, secs=1.2, mix=.14):
    r = np.random.default_rng(seed); n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 5.0); ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    return x * (1 - mix) + np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)] * mix

for bus, seed in ((music, 1), (sfx, 5)):
    bus.L = reverb(bus.L, seed); bus.R = reverb(bus.R, seed + 1)
fade = np.ones(N); fo = int(1.4 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.6
L = (music.L + sfx.L) * fade; R = (music.R + sfx.R) * fade
pk = max(abs(L).max(), abs(R).max()); g = .9 / pk

def write(name, l, r):
    pcm = (np.stack([l, r], 1).clip(-1, 1) * 32767).astype(np.int16)
    with wave.open(f"{here}/{name}", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
write("mix.wav", L * g, R * g)
write("music_bed.wav", music.L * fade * g, music.R * fade * g)
write("sfx_track.wav", sfx.L * fade * g, sfx.R * fade * g)
print("ok", DUR, len(cues["cues"]), "cues")
