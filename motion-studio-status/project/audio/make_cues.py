"""Cue list derived from the Remotion code (frame / 30). Counter ticks reuse the same bezier easing."""
import json
FPS = 30
def bez(x1, y1, x2, y2):
    def f(x):
        lo, hi = 0.0, 1.0
        for _ in range(60):
            t = (lo + hi) / 2
            bx = 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3
            lo, hi = (t, hi) if bx < x else (lo, t)
        t = (lo + hi) / 2
        return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3
    return f
inout = bez(0.45, 0, 0.55, 1)
def ticks(scene_start, a, b, frm, to):
    out, last = [], frm
    for fr in range(a, b + 1):
        v = round(frm + (to - frm) * inout((fr - a) / (b - a)))
        if v != last:
            out.append((scene_start + fr) / FPS); last = v
    return out
s = lambda fr: round(fr / FPS, 3)
cues = [
    {"t": s(26), "kind": "whoosh", "dur": .75, "apex": .6, "lead": .45, "what": "key flies in", "gain_db": -2},
    {"t": s(44), "kind": "click", "what": "key turns / lock clicks", "gain_db": 2},
    {"t": s(45), "kind": "hit", "what": "unlock (music drop)", "gain_db": -1},
    {"t": s(46), "kind": "shimmer", "what": "keyhole glow", "gain_db": -4},
    {"t": s(70), "kind": "whoosh", "dur": .7, "apex": .5, "lead": .35, "what": "keyhole iris opens", "gain_db": -3},
    {"t": s(62 + 27), "kind": "pop", "what": "OPEN lands", "gain_db": 0},
    {"t": s(62 + 30), "kind": "shimmer", "what": "OPEN sparkle burst", "gain_db": -6},
    {"t": s(148), "kind": "whoosh", "dur": .6, "apex": .5, "lead": .3, "what": "blue flood -> CBSE", "gain_db": -2},
    {"t": s(246), "kind": "whoosh", "dur": .6, "apex": .5, "lead": .3, "what": "magenta flood -> State Board", "gain_db": -2},
    {"t": s(238 + 77), "kind": "hit", "what": "Commerce badge lands", "gain_db": -7},
    {"t": s(238 + 78), "kind": "chime", "what": "Commerce badge", "gain_db": -6},
    {"t": s(355), "kind": "whoosh", "dur": .5, "apex": .5, "lead": .25, "what": "whip push -> location", "gain_db": 0},
    {"t": s(350 + 27), "kind": "thud", "what": "map pin lands", "gain_db": 0},
    {"t": s(444), "kind": "riser", "dur": .6, "lead": .6, "what": "zoom through the pin", "gain_db": -2},
    {"t": s(444), "kind": "hit", "what": "flash into CTA (final)", "gain_db": 1},
    {"t": s(436 + 31), "kind": "pop", "what": "Enroll Now button", "gain_db": -1},
    {"t": s(436 + 47), "kind": "tick", "pitch": -600, "what": "button press", "gain_db": 0},
]
for i, t in enumerate(ticks(140, 40, 72, 5, 10)):
    cues.append({"t": round(t, 3), "kind": "tick", "pitch": i * 120, "what": f"CBSE count {6 + i}", "gain_db": -4})
for i, t in enumerate(ticks(238, 40, 72, 5, 12)):
    cues.append({"t": round(t, 3), "kind": "tick", "pitch": i * 90, "what": f"State count {6 + i}", "gain_db": -4})
cues.sort(key=lambda c: c["t"])
json.dump({"fps": FPS, "duration": 510 / FPS, "bed": "music", "drop": s(45), "break": s(426), "final": s(444), "cues": cues}, open("cues.json", "w"), indent=1)
print(len(cues), "cues"); [print(c["t"], c["kind"], c["what"]) for c in cues]
