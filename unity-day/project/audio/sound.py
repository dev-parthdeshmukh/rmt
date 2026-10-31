"""Patriotic score + designed SFX for the National Unity Day video, synthesized from scratch (no licence risk).
Cue times come from src/theme.ts (frames / 30). Outputs mix.wav, music_bed.wav, sfx_track.wav next to this file."""
import os, wave
import numpy as np
from scipy.signal import butter, lfilter

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 44100; DUR = 21.0; N = int(SR * DUR)
rng = np.random.default_rng(31)
fr = lambda x: x / 30.0

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): b, a = butter(o, min(f, SR / 2 - 200) / (SR / 2)); return lfilter(b, a, x)
def hp(x, f, o=2): b, a = butter(o, f / (SR / 2), "high"); return lfilter(b, a, x)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], "band"); return lfilter(b, a, x)

class Bus:
    def __init__(s): s.L = np.zeros(N); s.R = np.zeros(N)
    def add(s, sig, t, pan=.5, g=1.0):
        s0 = int(round(t * SR))
        if s0 < 0: sig = sig[-s0:]; s0 = 0
        if s0 >= N: return
        n = min(len(sig), N - s0)
        s.L[s0:s0 + n] += sig[:n] * g * (1 - pan) * 1.41; s.R[s0:s0 + n] += sig[:n] * g * pan * 1.41
music, sfx = Bus(), Bus()

# ---------- instruments ----------
def ks(f, dur, bright=.7, decay=.997):
    n = int(dur * SR); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p) * bright
    out = np.zeros(n)
    for i in range(n):
        v = buf[i % p]; out[i] = v; buf[i % p] = decay * .5 * (v + buf[(i + 1) % p])
    return out
def tanpura(f, dur=2.2):  # pluck with jawari-like buzz
    x = ks(f, dur, .9, .9985); return np.tanh(2.2 * x) * .6
def strings(notes, dur, att=.8, rel=1.0, cut=2600):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for m in notes:
        for d in (-.004, 0, .004):
            ph = rng.random() * 6.28
            x += 2 * ((hz(m) * (1 + d) * t + ph / 6.28) % 1) - 1
    x /= len(notes) * 3
    e = np.minimum(1, t / att) * np.clip((dur - t) / rel, 0, 1)
    return lp(x, cut) * e * (1 + .08 * np.sin(2 * np.pi * 5 * t))
def flute(notes, t0, bus, g=.22):
    """bansuri-like legato line: notes = [(midi, start_beat, len_beats)], with vibrato, breath and glides."""
    for i, (m, st, ln) in enumerate(notes):
        dur = ln * BEAT + .08; n = int(dur * SR); t = np.arange(n) / SR
        prev = notes[i - 1][0] if i else m
        f = hz(m) * (1 + (hz(prev) / hz(m) - 1) * np.exp(-t * 28))  # glide in from previous note
        vib = 1 + .006 * np.sin(2 * np.pi * 5.4 * t) * np.minimum(1, t / .35)
        ph = 2 * np.pi * np.cumsum(f * vib) / SR
        tone = np.sin(ph) + .18 * np.sin(2 * ph) + .06 * np.sin(3 * ph)
        breath = bp(rng.standard_normal(n), 1500, 6000) * .05
        e = np.minimum(1, t / .07) * np.clip((dur - t) / .12, 0, 1)
        bus.add((tone + breath) * e, t0 + st * BEAT, .55, g)
def dhol_lo():
    t = np.arange(int(.5 * SR)) / SR
    return np.sin(2 * np.pi * np.cumsum(62 + 70 * np.exp(-t * 24)) / SR) * np.exp(-t * 7)
def dhol_hi():
    t = np.arange(int(.18 * SR)) / SR
    return (np.sin(2 * np.pi * 360 * t) * .5 + bp(rng.standard_normal(len(t)), 1800, 6000) * .5) * np.exp(-t * 26)
def timpani(f=46):
    t = np.arange(int(2.0 * SR)) / SR
    x = sum(a * np.sin(2 * np.pi * hz(f) * r * t) for r, a in ((1, 1), (1.5, .5), (1.98, .3)))
    return x * np.exp(-t * 2.2) * np.minimum(1, t / .004) + lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 18) * .4
def bell(m, dur=3.0):
    t = np.arange(int(dur * SR)) / SR; f = hz(m)
    return sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in ((1, 1, 1.1), (2.76, .45, 2.4), (5.4, .2, 4.5))) * np.minimum(1, t / .002)
def santoor(m, dur=1.4):
    t = np.arange(int(dur * SR)) / SR; f = hz(m)
    x = sum(np.sin(2 * np.pi * f * (1 + d) * t) for d in (-.002, 0, .002)) / 3 + .3 * np.sin(4 * np.pi * f * t) * np.exp(-t * 6)
    return x * np.exp(-t * 3.2) * np.minimum(1, t / .002)

# ---------- SFX ----------
def whoosh(dur=.6, apex=.55):
    n = int(dur * SR); t = np.arange(n) / SR; x = rng.standard_normal(n)
    env = np.where(t / dur < apex, (t / dur / apex) ** 2, ((1 - t / dur) / (1 - apex)) ** 1.5)
    a = np.exp(-2 * np.pi * (300 + 6500 * env) / SR); out = np.zeros(n); y = 0.0
    for i in range(n): y = (1 - a[i]) * x[i] + a[i] * y; out[i] = y
    return out * env * 3
def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR; k = t / dur
    return (whoosh(dur, .98) * .6 + sum(np.sin(2 * np.pi * np.cumsum(hz(m) * (1 + .8 * k ** 2)) / SR) for m in (62, 69)) * .2) * k ** 2
def shimmer():
    t = np.arange(int(1.8 * SR)) / SR; out = np.zeros_like(t)
    for i, m in enumerate((86, 90, 93, 98)):
        d = i * .06; out += (t >= d) * np.sin(2 * np.pi * hz(m) * (t - d)) * np.exp(-np.clip(t - d, 0, None) * 3.2)
    return out * .3
def popfx():
    t = np.arange(int(.2 * SR)) / SR
    return np.sin(2 * np.pi * np.cumsum(300 + 800 * np.exp(-t * 40)) / SR) * np.exp(-t * 26)

# ---------- score (D major, 90 bpm) ----------
BEAT = 60 / 90; BAR = 4 * BEAT
D, G, A = [50, 57, 62, 66], [55, 59, 62, 67], [57, 61, 64, 69]
# tanpura cycle (Pa Sa Sa Sa) throughout
t = 0.0
while t < DUR - 1.5:
    for k, m in enumerate((45, 50, 50, 38)):
        music.add(tanpura(hz(m)), t + k * .55, .35 + .1 * k, .16)
    t += 2.2
# strings: soft pad from the start, swelling with the story
prog = [(0.0, D, 3.3), (3.07, G, 2.7), (5.6, D, 2.7), (8.27, A, 2.6), (10.87, G, 2.0), (12.8, A, 2.3)]
for st, ch, ln in prog:
    music.add(strings([m + 12 for m in ch], ln + .6, .7, .8), st, .5, .19 if st > 3 else .14)
# bansuri phrase over statue + map (tribute)
flute([(74, 0, 1), (78, 1, .5), (81, 1.5, 1.5), (83, 3, .5), (81, 3.5, .5), (78, 4, 1), (76, 5, .5), (74, 5.5, 2.5)], 3.4, music, .2)
flute([(78, 0, .5), (81, .5, .5), (86, 1, 1.5), (83, 2.5, .5), (81, 3, 1), (78, 4, .5), (76, 4.5, .5), (81, 5, 2)], 8.6, music, .2)
# dhol groove: light from the statue, full from the run scene, stops for the break
def groove(t0, t1, full):
    pat = "L.HL.HH." if full else "L...H..."
    t = t0
    while t < t1:
        for k, c in enumerate(pat):
            tk = t + k * BEAT / 2
            if tk >= t1: break
            if c == "L": music.add(dhol_lo(), tk, .45, .5)
            if c == "H": music.add(dhol_hi(), tk, .6, .2)
        t += BAR
groove(3.07, 10.87, False)
groove(10.87, 14.3, True)
# break (music steps down) then the flag hit
music.add(strings([74, 78, 81], 1.0, .2, .3, 1500), 14.2, .5, .1)
music.add(timpani(38), fr(454), .5, .7)
music.add(strings([62, 66, 69, 74, 78], 2.0, .05, 1.0, 3500), fr(454), .5, .26)
# finale: triumphant D chord, santoor run, bells, ending on the tonic
music.add(timpani(38), fr(508), .5, .8)
music.add(strings([50, 57, 62, 66, 69, 74], 4.1, .05, 2.0, 4000), fr(508), .5, .3)
for k, m in enumerate([74, 78, 81, 86, 90, 86, 81, 86]): music.add(santoor(m), fr(508) + .35 + k * .17, .3 + .05 * k, .13)
music.add(bell(81), fr(534), .55, .11); music.add(bell(74), 19.0, .45, .09)
flute([(86, 0, 1), (83, 1, .5), (81, 1.5, .5), (78, 2, 1), (81, 3, 2.5)], 18.0, music, .16)

# ---------- SFX placed from the timeline ----------
for cut in (92, 248, 326, 508):
    sfx.add(whoosh(.65), fr(cut) - .36, .5, .6)
sfx.add(whoosh(.45, .5), fr(385) - .22, .5, .45)              # slide-push run -> hands
sfx.add(riser(.85), fr(454) - .85, .5, .45)                   # into the flag flash
sfx.add(timpani(43) * .6, fr(28), .5, .55)                    # hook title lands
sfx.add(shimmer(), fr(14), .5, .5)                            # date appears
sfx.add(bell(86, 2.0), fr(84 + 40), .6, .14)                  # Sardar Patel name
sfx.add(shimmer(), fr(240 + 26), .5, .45)                     # Shreshtha Bharat
sfx.add(shimmer(), fr(378 + 12), .5, .4)                      # Ekatra ghaduya
sfx.add(popfx(), fr(500 + 16), .5, .5)                        # logo pops
sfx.add(shimmer(), fr(500 + 34), .5, .5)                      # final greeting

def reverb(x, seed, secs=2.2, mix=.24):
    r = np.random.default_rng(seed); n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2); ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    return x * (1 - mix) + np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)] * mix
for b, s in ((music, 1), (sfx, 4)):
    b.L = reverb(b.L, s); b.R = reverb(b.R, s + 1)
fade = np.ones(N); fo = int(2.0 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.4
L = (music.L + sfx.L) * fade; R = (music.R + sfx.R) * fade
g = .9 / max(abs(L).max(), abs(R).max())
def write(name, l, r):
    pcm = (np.stack([l, r], 1).clip(-1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(HERE, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
write("mix.wav", L * g, R * g); write("music_bed.wav", music.L * fade * g, music.R * fade * g); write("sfx_track.wav", sfx.L * fade * g, sfx.R * fade * g)
print("ok")
