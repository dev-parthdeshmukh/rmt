"""Soft ambient pad + music-box arpeggio, 40 s, synthesized from scratch (royalty free)."""
import numpy as np, wave

SR = 44100
DUR = 40.0
N = int(SR * DUR)
t = np.arange(N) / SR
BPM = 72
BEAT = 60 / BPM
BAR = 4 * BEAT  # 3.333 s -> 12 bars

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

# D major, gentle progression ending on the tonic
CH = {
    'D':  [50, 57, 61, 64, 66],   # Dmaj9-ish
    'Bm': [47, 54, 57, 62, 66],   # Bm7
    'G':  [43, 50, 54, 59, 62],   # Gmaj7
    'A':  [45, 52, 57, 59, 64],   # Asus2
    'Em': [40, 52, 55, 59, 62],   # Em7
}
PROG = ['D', 'Bm', 'G', 'A', 'D', 'Bm', 'Em', 'A', 'Bm', 'G', 'A', 'D']

def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na) ** 2
    e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e

L = np.zeros(N); Rr = np.zeros(N)

# --- pad
for i, name in enumerate(PROG):
    start = i * BAR - 0.6 if i else 0.0
    length = BAR + 1.6 if i < len(PROG) - 1 else DUR - start
    s0 = int(start * SR); n = min(int(length * SR), N - s0)
    tt = np.arange(n) / SR
    e = env_adsr(n, 1.2, 1.4 if i < len(PROG) - 1 else 3.5)
    for j, m in enumerate(CH[name]):
        f = hz(m)
        for d, pan in ((-0.0025, 0.3), (0.0, 0.5), (0.0025, 0.7)):
            ff = f * (1 + d)
            ph = np.random.rand() * 6.28
            v = np.sin(2 * np.pi * ff * tt + ph) + 0.22 * np.sin(4 * np.pi * ff * tt + ph) + 0.06 * np.sin(6 * np.pi * ff * tt)
            v *= (0.9 + 0.1 * np.sin(2 * np.pi * 0.17 * tt + j))  # slow shimmer
            amp = 0.032 if j else 0.045
            L[s0:s0 + n] += v * e * amp * (1 - pan)
            Rr[s0:s0 + n] += v * e * amp * pan
    # soft sub bass on the root
    f = hz(CH[name][0] - 12)
    vb = np.sin(2 * np.pi * f * tt) * env_adsr(n, 0.5, 1.2) * 0.07
    L[s0:s0 + n] += vb; Rr[s0:s0 + n] += vb

# --- music-box / bell arpeggio (starts in bar 2, rests in last bar)
PAT = [0, 2, 3, 4, 3, 2, 1, 2]
rng = np.random.default_rng(7)
for i, name in enumerate(PROG):
    if i == 0:
        continue
    notes = CH[name]
    for k in range(8):
        if i == len(PROG) - 1 and k > 0:
            break
        st = i * BAR + k * BEAT / 2 + rng.normal(0, 0.006)
        m = notes[PAT[k]] + 12
        if m < 66: m += 12
        f = hz(m)
        dur = 2.2
        s0 = int(st * SR); n = min(int(dur * SR), N - s0)
        tt = np.arange(n) / SR
        e = np.exp(-tt * 2.6) * np.minimum(1, tt / 0.004)
        v = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 2.0 * tt) * np.exp(-tt * 6) \
            + 0.12 * np.sin(2 * np.pi * f * 3.01 * tt) * np.exp(-tt * 9)
        vel = (0.050 if k in (0, 4) else 0.036) * (0.85 + 0.3 * rng.random())
        pan = 0.5 + 0.25 * np.sin(k * 1.3 + i)
        L[s0:s0 + n] += v * e * vel * (1 - pan)
        Rr[s0:s0 + n] += v * e * vel * pan

# --- soft high "sparkle" swells at scene changes
for st in (6.5, 11.5, 19.5, 28.5, 35.5):
    s0 = int((st - 0.9) * SR); n = int(2.6 * SR)
    tt = np.arange(n) / SR
    e = np.sin(np.pi * np.clip(tt / 2.6, 0, 1)) ** 2
    for m in (81, 85, 88):
        v = np.sin(2 * np.pi * hz(m) * tt + rng.random() * 6) * e * 0.010
        L[s0:s0 + n] += v; Rr[s0:s0 + n] += v

# --- one-pole low-pass to keep it warm
def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    from scipy.signal import lfilter  # noqa
    return lfilter([1 - a], [1, -a], x)
try:
    L = lowpass(L, 5200); Rr = lowpass(Rr, 5200)
except ImportError:
    pass

# --- reverb: convolution with decaying noise (FFT)
def reverb(x, seed, secs=2.8, mix=0.38):
    r = np.random.default_rng(seed)
    n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.0 / secs * 2.2)
    ir[:int(0.02 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)]
    return x * (1 - mix) + wet * mix * 0.9

L = reverb(L, 1); Rr = reverb(Rr, 2)

# --- master fades + normalize
fade = np.ones(N)
fi, fo = int(1.2 * SR), int(3.0 * SR)
fade[:fi] = np.linspace(0, 1, fi) ** 2
fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
L *= fade; Rr *= fade
peak = max(np.abs(L).max(), np.abs(Rr).max())
L, Rr = L / peak * 0.82, Rr / peak * 0.82

pcm = (np.stack([L, Rr], axis=1) * 32767).astype(np.int16)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('music.wav written', pcm.shape)
