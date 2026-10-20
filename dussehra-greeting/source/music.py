"""6 s festive sting: dhol-style drums, santoor-like arpeggio, arrow whoosh, firework pops,
temple-bell finish. Synthesized from scratch (royalty free)."""
import numpy as np, wave
from scipy.signal import lfilter, butter

SR = 44100; DUR = 6.0; N = int(SR * DUR)
rng = np.random.default_rng(9)
L = np.zeros(N); R = np.zeros(N)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def add(sig, st, pan=.5, g=1.0):
    s0 = int(st * SR)
    if s0 >= N: return
    n = min(len(sig), N - s0); L[s0:s0 + n] += sig[:n] * g * (1 - pan); R[s0:s0 + n] += sig[:n] * g * pan
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)

def dhol_low():
    t = np.arange(int(.5 * SR)) / SR
    f = 70 + 60 * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
def dhol_high():
    t = np.arange(int(.2 * SR)) / SR
    return (np.sin(2 * np.pi * 330 * t) * .5 + bp(rng.standard_normal(len(t)), 1500, 5000) * .6) * np.exp(-t * 28)
def santoor(f, dur=1.4):
    t = np.arange(int(dur * SR)) / SR
    x = sum(np.sin(2 * np.pi * f * (1 + d) * t) for d in (-.002, 0, .002)) / 3
    x += .3 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 6) + .15 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 10)
    return x * np.exp(-t * 3) * np.minimum(1, t / .002)
def whoosh(dur):
    n = int(dur * SR); t = np.arange(n) / SR; x = rng.standard_normal(n); y = 0; out = np.zeros(n)
    a = np.exp(-2 * np.pi * (500 + 6000 * (t / dur) ** 2) / SR)
    for i in range(n): y = (1 - a[i]) * x[i] + a[i] * y; out[i] = y
    return out * (t / dur) ** 2
def boom():
    t = np.arange(int(1.6 * SR)) / SR
    return (np.sin(2 * np.pi * np.cumsum(45 + 90 * np.exp(-t * 15)) / SR) * np.exp(-t * 3)
            + lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 5) * .5)
def crackle(dur):
    n = int(dur * SR); out = np.zeros(n)
    for _ in range(int(dur * 60)):
        p = rng.integers(0, n - 400); k = np.arange(300)
        out[p:p + 300] += rng.standard_normal(300) * np.exp(-k / 40) * rng.random()
    t = np.arange(n) / SR
    return bp(out, 2000, 9000) * np.exp(-t * 1.5)
def bell(f, dur=3.0):
    t = np.arange(int(dur * SR)) / SR
    parts = [(1, 1, 1.2), (2.76, .5, 2.5), (5.4, .25, 4), (8.93, .12, 6)]
    return sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in parts) * np.minimum(1, t / .002)

# dhol groove (keherwa-ish) 0.25s grid over the whole piece
pat = "L.HHL.H.L.HHL.HH"
for i in range(int(5.5 / .25)):
    c = pat[i % len(pat)]; st = .25 + i * .25
    if c == 'L': add(dhol_low(), st, .45, .55)
    if c == 'H': add(dhol_high(), st, .6, .22)

# rising santoor arpeggio (D major pentatonic) up to the arrow, then a sparkle run
notes = [62, 66, 69, 71, 74, 78, 81, 83]
for i, m in enumerate(notes): add(santoor(hz(m)), .3 + i * .17, .3 + .05 * i, .16)
add(whoosh(.45), 1.5, .5, .25)                  # arrow flight
add(boom(), 1.95, .5, .5); add(crackle(1.8), 2.0, .5, .25)
for st, p in ((3.0, .25), (3.5, .75), (4.6, .7), (5.1, .3)):
    add(crackle(1.0), st, p, .14); add(boom()[:int(.6 * SR)] * .5, st, p, .15)
for i, m in enumerate([74, 78, 81, 86, 81, 78, 86]): add(santoor(hz(m), 1.8), 2.1 + i * .2, .4 + .06 * (i % 3), .13)
for i, m in enumerate([62, 69, 74]): add(santoor(hz(m), 2.5), 3.9 + i * .12, .5, .14)
add(bell(hz(81)), 3.8, .55, .12); add(bell(hz(74)), 4.6, .45, .10)

def reverb(x, seed, secs=1.6, mix=.25):
    r = np.random.default_rng(seed); n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 4.0); ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    return x * (1 - mix) + np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)] * mix
L = reverb(L, 1); R = reverb(R, 2)
fade = np.ones(N); fo = int(1.0 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
L *= fade; R *= fade
pk = max(abs(L).max(), abs(R).max()); L, R = L / pk * .88, R / pk * .88
pcm = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
