"""10 s cheerful ukulele-style strum + snaps + glockenspiel, with paper-slap and pen-tick sounds.
Synthesized from scratch (royalty free)."""
import numpy as np, wave
from scipy.signal import lfilter, butter

SR = 44100; DUR = 10.0; N = int(SR * DUR)
rng = np.random.default_rng(21)
L = np.zeros(N); R = np.zeros(N)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def add(sig, st, pan=.5, g=1.0):
    s0 = int(st * SR)
    if s0 >= N: return
    n = min(len(sig), N - s0); L[s0:s0 + n] += sig[:n] * g * (1 - pan); R[s0:s0 + n] += sig[:n] * g * pan
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)

def ks(f, dur=1.2, bright=.5):  # Karplus-Strong plucked string
    n = int(dur * SR); p = int(SR / f)
    buf = rng.uniform(-1, 1, p) * bright + rng.uniform(-1, 1, p) * (1 - bright) * .3
    out = np.zeros(n)
    for i in range(n):
        v = buf[i % p]; out[i] = v
        buf[i % p] = .996 * .5 * (v + buf[(i + 1) % p])
    return out
def strum(notes, st, down=True, g=.22):
    order = notes if down else notes[::-1]
    for k, m in enumerate(order): add(ks(hz(m), .9), st + k * .012, .35 + .1 * k, g)
def snap():
    t = np.arange(int(.12 * SR)) / SR
    return bp(rng.standard_normal(len(t)), 1800, 6000) * np.exp(-t * 45)
def glock(f, dur=1.2):
    t = np.arange(int(dur * SR)) / SR
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 8)) * np.exp(-t * 4) * np.minimum(1, t / .002)
def slap():
    t = np.arange(int(.25 * SR)) / SR
    return bp(rng.standard_normal(len(t)), 300, 3000) * np.exp(-t * 30) + np.sin(2 * np.pi * 120 * t) * np.exp(-t * 25) * .6
def tick():
    t = np.arange(int(.06 * SR)) / SR
    return bp(rng.standard_normal(len(t)), 3000, 8000) * np.exp(-t * 70)
def kick():
    t = np.arange(int(.3 * SR)) / SR
    return np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-t * 30)) / SR) * np.exp(-t * 12)

# C  G  Am  F  @ 110 bpm, island strum pattern D-DU-UDU
BEAT = 60 / 110; BAR = 4 * BEAT
CH = [[60, 64, 67, 72], [59, 62, 67, 71], [57, 60, 64, 69], [57, 60, 65, 69]]
PAT = [(0, 1, .24), (1, 1, .18), (1.5, 0, .14), (2.5, 0, .14), (3, 1, .18), (3.5, 0, .14)]
b = 0
while b * BAR < DUR - .4:
    c = CH[b % 4]
    for off, dn, g in PAT:
        st = .3 + b * BAR + off * BEAT
        if st < DUR - 1.0: strum(c, st, bool(dn), g)
    for k in (1, 3):
        st = .3 + b * BAR + k * BEAT
        if b >= 1 and st < DUR - 1: add(snap(), st, .6, .3)
    for k in (0, 2):
        st = .3 + b * BAR + k * BEAT
        if b >= 1 and st < DUR - 1: add(kick(), st, .5, .35)
    b += 1
# glockenspiel melody
mel = [(76, 0), (79, .5), (81, 1), (79, 1.5), (76, 2.5), (74, 3), (72, 4), (74, 4.5), (76, 5), (79, 6), (84, 7)]
for m, beat in mel:
    st = .3 + BAR + beat * BEAT
    if st < DUR - .8: add(glock(hz(m)), st, .55, .12)
# sound effects synced to the animation
add(slap(), 0.45, .5, .25)                       # page lands
for st in (2.9, 3.65, 4.4): add(tick(), st + .6, .5, .25)   # check marks
add(slap(), 5.75, .5, .4)                         # sticky note
strum([60, 64, 67, 72, 76], 8.4, True, .3)          # final strum
for m in (72, 76, 79, 84): add(glock(hz(m), 1.6), 8.1 + (m - 72) * .02, .5, .1)

def reverb(x, seed, secs=1.0, mix=.15):
    r = np.random.default_rng(seed); n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 6.0); ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    return x * (1 - mix) + np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)] * mix
L = reverb(L, 1); R = reverb(R, 2)
fade = np.ones(N); fo = int(1.2 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
L *= fade; R *= fade
pk = max(abs(L).max(), abs(R).max()); L, R = L / pk * .88, R / pk * .88
pcm = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
