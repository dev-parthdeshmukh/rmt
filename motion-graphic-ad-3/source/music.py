"""Punchy electro-pop bed: four-on-the-floor kick, claps, saw bass, chord stabs, pluck hook,
riser + impact on each scene wipe. 30 s, synthesized from scratch (royalty free)."""
import numpy as np, wave
from scipy.signal import lfilter, butter

SR = 44100
DUR = 30.0
N = int(SR * DUR)
BPM = 120
BEAT = 60 / BPM          # 0.5 s
BAR = 4 * BEAT           # 2 s
rng = np.random.default_rng(5)
L = np.zeros(N); R = np.zeros(N)
CUTS = [4.75, 10.85, 17.85, 23.45]

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.5, gain=1.0):
    s0 = int(round(start * SR))
    if s0 >= N or s0 < 0: return
    n = min(len(sig), N - s0)
    L[s0:s0 + n] += sig[:n] * gain * (1 - pan)
    R[s0:s0 + n] += sig[:n] * gain * pan

def lp(x, fc, order=2):
    b, a = butter(order, min(fc, SR / 2 - 100) / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), 'high'); return lfilter(b, a, x)

def saw(f, n, detune=0.0):
    t = np.arange(n) / SR
    return 2 * ((f * (1 + detune) * t + rng.random()) % 1) - 1

def kick():
    t = np.arange(int(0.4 * SR)) / SR
    f = 48 + 130 * np.exp(-t * 35)
    return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9))

def clap():
    n = int(0.25 * SR); t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 900)
    e = np.exp(-t * 22)
    for d in (0.0, 0.011, 0.022):
        e = e + 0.6 * np.exp(-np.clip(t - d, 0, None) * 150) * (t >= d)
    return x * e * 0.5

def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t * (18 if open_ else 80))

def bass(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = saw(f, n) + 0.5 * np.sin(2 * np.pi * f / 2 * t)
    x = lp(x, 700) * np.minimum(1, t / 0.005) * np.exp(-t * 5)
    return x

def stab(notes, dur=0.32):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(saw(hz(m), n, d) for m in notes for d in (-0.004, 0.004))
    x = lp(x, 2600) * np.exp(-t * 9) * np.minimum(1, t / 0.003)
    return x / len(notes)

def pluck(f, dur=0.35):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * 2 * t) * 0.3
    return lp(x, 3500) * np.exp(-t * 10) * np.minimum(1, t / 0.002)

def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    out = np.zeros(n); y = 0.0
    fc = 300 + 7000 * (t / dur) ** 2
    a = np.exp(-2 * np.pi * fc / SR)
    for i in range(n):
        y = (1 - a[i]) * x[i] + a[i] * y; out[i] = y
    return out * (t / dur) ** 1.5

def impact():
    t = np.arange(int(1.0 * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-t * 18)) / SR) * np.exp(-t * 4)
    nz = lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 7) * 0.4
    return boom + nz

# A minor pop: Am  F  C  G
CH = [[57, 60, 64], [57, 60, 65], [55, 60, 64], [55, 59, 62]]
ROOT = [45, 41, 48, 43]
HOOK = [76, 74, 72, 74, 76, 79, 76, 72]

nb = int(DUR / BAR)
for b in range(nb):
    c = b % 4; t0 = b * BAR
    last = b == nb - 1
    if last:
        add(kick(), t0, 0.5, 0.9); add(stab([57, 60, 64, 69], 1.2), t0, 0.5, 0.5)
        add(bass(hz(ROOT[0]), 1.5), t0, 0.5, 0.6); add(impact(), t0, 0.5, 0.35)
        break
    for k in range(4):
        tb = t0 + k * BEAT
        add(kick(), tb, 0.5, 0.85 if b >= 1 else 0.0)
        if k in (1, 3) and b >= 1: add(clap(), tb, 0.55, 0.45)
        add(hat(), tb + BEAT / 2, 0.68, 0.10)
        if b >= 2: add(hat(), tb + BEAT / 4, 0.32, 0.04); add(hat(), tb + 3 * BEAT / 4, 0.32, 0.04)
        # chord stab on offbeat
        add(stab(CH[c]), tb + BEAT / 2, 0.45, 0.30)
    # bass 8ths with octave bounce
    for k in range(8):
        f = hz(ROOT[c] + (12 if k % 2 else 0))
        add(bass(f, BEAT / 2 * 0.95), t0 + k * BEAT / 2, 0.5, 0.55)
    # hook from bar 2
    if b >= 2:
        for k, m in enumerate(HOOK):
            if (k + b) % 3 == 2 and k % 2: continue
            add(pluck(hz(m - (0 if c < 2 else 2))), t0 + k * BEAT / 2, 0.35 + 0.3 * (k % 2), 0.16)

for c in CUTS:
    add(riser(0.8), c - 0.8, 0.5, 0.18)
    add(impact(), c, 0.5, 0.30)

# simple bus glue: soft saturation + light reverb
def reverb(x, seed, secs=1.0, mix=0.12):
    r = np.random.default_rng(seed); n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 6.0); ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    return x * (1 - mix) + np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)] * mix
L = reverb(L, 1); R = reverb(R, 2)
pk = max(np.abs(L).max(), np.abs(R).max()); L, R = L / pk, R / pk
L, R = np.tanh(1.3 * L) / np.tanh(1.3), np.tanh(1.3 * R) / np.tanh(1.3)
fade = np.ones(N); fo = int(1.5 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
fade[:int(0.02 * SR)] = np.linspace(0, 1, int(0.02 * SR))
L *= fade * 0.85; R *= fade * 0.85
pcm = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('music.wav', pcm.shape)
