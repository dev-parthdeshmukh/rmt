"""Upbeat, playful marimba + pluck bass + light percussion, 30 s, synthesized from scratch (royalty free)."""
import numpy as np, wave
from scipy.signal import lfilter

SR = 44100
DUR = 30.0
N = int(SR * DUR)
BPM = 100
BEAT = 60 / BPM          # 0.6 s
BAR = 4 * BEAT           # 2.4 s
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.5, gain=1.0):
    s0 = int(start * SR)
    if s0 >= N: return
    n = min(len(sig), N - s0)
    L[s0:s0 + n] += sig[:n] * gain * (1 - pan)
    R[s0:s0 + n] += sig[:n] * gain * pan

def marimba(f, dur=1.0):
    t = np.arange(int(dur * SR)) / SR
    e = np.exp(-t * 7) * np.minimum(1, t / 0.002)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)
            + 0.15 * np.sin(2 * np.pi * f * 10 * t) * np.exp(-t * 60)) * e

def pluck_bass(f, dur=0.5):
    t = np.arange(int(dur * SR)) / SR
    e = np.exp(-t * 6) * np.minimum(1, t / 0.004)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) * np.exp(-t * 12)) * e

def kick():
    t = np.arange(int(0.35 * SR)) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)

def shaker():
    t = np.arange(int(0.08 * SR)) / SR
    n = rng.standard_normal(len(t))
    n = lfilter([1, -1], [1, -0.6], n)  # high-pass-ish
    return n * np.exp(-t * 60) * np.minimum(1, t / 0.006)

def snap():
    t = np.arange(int(0.15 * SR)) / SR
    n = lfilter([1, -0.9], [1], rng.standard_normal(len(t)))
    return n * np.exp(-t * 35) * 0.6 + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 50) * 0.3

def swoosh(dur=0.7):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n); y = 0.0
    # sweeping one-pole low-pass
    fc = 400 + 3500 * np.sin(np.pi * t / dur)
    a = np.exp(-2 * np.pi * fc / SR)
    for i in range(n):
        y = (1 - a[i]) * x[i] + a[i] * y; out[i] = y
    return out * np.sin(np.pi * t / dur) ** 2

# F major: F  C/E  Dm  Bb
CH = [[53, 57, 60, 65, 69], [52, 55, 60, 64, 67], [50, 57, 62, 65, 69], [46, 53, 58, 62, 65]]
ROOTS = [41, 40, 38, 34]
MEL = [[72, 69, 72, 74, 72, 69, 67, 69],
       [67, 64, 67, 72, 71, 67, 64, 67],
       [69, 65, 69, 74, 72, 69, 65, 62],
       [70, 65, 70, 74, 72, 70, 69, 67]]
RHY = [1, 0, 1, 1, 0, 1, 1, 0]

nbars = int(np.ceil(DUR / BAR))
for b in range(nbars):
    c = b % 4
    t0 = b * BAR
    last = b == nbars - 1
    # chord stab (soft marimba roll) on beat 1
    for j, m in enumerate(CH[c][1:]):
        add(marimba(hz(m), 1.2), t0 + j * 0.012, 0.35 + 0.1 * j, 0.10)
    if last:
        add(marimba(hz(65 + 12), 2.0), t0, 0.5, 0.25)
        add(pluck_bass(hz(ROOTS[0]), 1.5), t0, 0.5, 0.45)
        add(kick(), t0, 0.5, 0.35)
        break
    # bass: 1, 2&, 3, 4
    for k, off in enumerate([0, 1.5, 2, 3]):
        f = hz(ROOTS[c] + (12 if k == 1 else 0))
        add(pluck_bass(f), t0 + off * BEAT, 0.5, 0.42 if k != 1 else 0.3)
    # melody from bar 1
    if b >= 1:
        for k in range(8):
            if RHY[k] or (b % 2 and k == 7):
                add(marimba(hz(MEL[c][k]), 0.9), t0 + k * BEAT / 2 + rng.normal(0, .004),
                    0.3 + 0.4 * (k % 2), 0.20 * (0.85 + 0.3 * rng.random()))
    # percussion from bar 2
    if b >= 2:
        for k in (0, 2):
            add(kick(), t0 + k * BEAT, 0.5, 0.32)
        for k in (1, 3):
            add(snap(), t0 + k * BEAT, 0.55, 0.10)
        for k in range(8):
            add(shaker(), t0 + k * BEAT / 2, 0.65, 0.05 if k % 2 else 0.03)

# eraser swooshes at scene changes
for st in (4.4, 10.4, 17.4, 23.4):
    add(swoosh(0.6), st, 0.5, 0.12)

# light room reverb
def reverb(x, seed, secs=1.4, mix=0.18):
    r = np.random.default_rng(seed); n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 5.0)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)]
    return x * (1 - mix) + wet * mix
L = reverb(L, 1); R = reverb(R, 2)

fade = np.ones(N); fi, fo = int(0.3 * SR), int(2.0 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
L *= fade; R *= fade
pk = max(np.abs(L).max(), np.abs(R).max()); L, R = L / pk * 0.85, R / pk * 0.85
pcm = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('music.wav', pcm.shape)
