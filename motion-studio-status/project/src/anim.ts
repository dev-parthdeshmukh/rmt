import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const OUT = Easing.bezier(0.16, 1, 0.3, 1); // expo-ish ease out
export const IN = Easing.bezier(0.7, 0, 0.84, 0); // ease in for exits
export const INOUT = Easing.bezier(0.83, 0, 0.17, 1);

/** 0→1 eased progress between two frames. */
export const p = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });

/** Springy pop with a small overshoot (damping ~14). */
export const pop = (f: number, start: number, damping = 14, mass = 0.8) =>
  spring({ frame: f - start, fps: FPS, config: { damping, mass, stiffness: 140 } });

/** Deterministic pseudo-random in [0,1). */
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
