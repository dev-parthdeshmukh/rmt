import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { C, DEV, FPS, GOLD } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IN = Easing.bezier(0.7, 0, 0.84, 0);
export const INOUT = Easing.bezier(0.83, 0, 0.17, 1);
export const p = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const pop = (f: number, start: number, damping = 14) =>
  spring({ frame: f - start, fps: FPS, config: { damping, mass: 0.8, stiffness: 140 } });
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Devanagari-safe mask reveal: a word rises out of a clip box with room for matras above and below. */
export const Rise: React.FC<{ children: React.ReactNode; start: number; dur?: number; style?: React.CSSProperties }> = ({
  children,
  start,
  dur = 14,
  style,
}) => {
  const f = useCurrentFrame();
  const k = p(f, start, start + dur);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", padding: "0.28em 0.08em 0.22em", margin: "-0.28em -0.08em -0.22em", verticalAlign: "bottom" }}>
      <span style={{ display: "inline-block", translate: `0 ${lerp(120, 0, k)}%`, opacity: k > 0 ? 1 : 0, ...style }}>{children}</span>
    </span>
  );
};

/** Gold gradient Devanagari headline with a moving shine and a deep shadow for contrast on photos. */
export const GoldText: React.FC<{ text: string; size: number; start: number; shineAt?: number }> = ({ text, size, start, shineAt }) => {
  const f = useCurrentFrame();
  const t = shineAt === undefined ? -1 : (f - shineAt) / 40;
  const x = lerp(-40, 140, Math.min(1, Math.max(0, t)));
  return (
    <Rise start={start} dur={16}>
      <span
        style={{
          fontFamily: DEV,
          fontSize: size,
          lineHeight: 1.25,
          backgroundImage: `linear-gradient(105deg, transparent ${x - 14}%, rgba(255,255,255,0.9) ${x}%, transparent ${x + 14}%), ${GOLD}`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 6px 0 rgba(60,20,0,0.55)) drop-shadow(0 0 26px rgba(0,0,0,0.55))",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </Rise>
  );
};

export const WhiteText: React.FC<{ text: string; size: number; start: number; font?: string; weight?: number; color?: string }> = ({
  text,
  size,
  start,
  font = DEV,
  weight = 400,
  color = C.white,
}) => (
  <Rise start={start} dur={14}>
    <span
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.25,
        color,
        textShadow: "0 4px 0 rgba(0,0,0,0.35), 0 0 30px rgba(0,0,0,0.65)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  </Rise>
);

/** Floating golden embers (depth layer used over every scene). */
export const Embers: React.FC<{ n?: number; seed?: number; opacity?: number }> = ({ n = 40, seed = 1, opacity = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {new Array(n).fill(0).map((_, i) => {
        const r = (k: number) => rand(i * 13 + seed * 7 + k);
        const sp = 0.8 + r(1) * 2.2;
        const y = (((r(2) * 2100 - f * sp) % 2100) + 2100) % 2100 - 90;
        const x = r(3) * 1080 + Math.sin(f / (20 + r(4) * 30) + i) * 18;
        const s = 2 + r(5) * 5;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / (5 + r(6) * 8) + i));
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: i % 4 ? "#ffcf66" : "#fff", opacity: tw, boxShadow: `0 0 ${s * 4}px #ffb43a` }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Slow Ken-Burns push on a still or clip so nothing is ever static. */
export const push = (f: number, len: number, from = 1.0, to = 1.08) => lerp(from, to, Math.min(1, f / len));

/** Gentle readability scrim. */
export const Scrim: React.FC<{ side: "top" | "bottom"; size: number; strength?: number }> = ({ side, size, strength = 0.7 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      [side]: 0,
      height: size,
      background: `linear-gradient(${side === "top" ? "180deg" : "0deg"}, rgba(4,10,35,${strength}) 0%, rgba(4,10,35,${strength * 0.6}) 45%, transparent 100%)`,
    }}
  />
);
