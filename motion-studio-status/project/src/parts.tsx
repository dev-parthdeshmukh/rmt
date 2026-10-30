import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, GOLD, SPECTRUM, display } from "./theme";
import { lerp, p, pop, rand } from "./anim";

/** Deep-indigo night sky with drifting glow orbs, a faint dot grid and film grain. Tint follows `hue`. */
export const Background: React.FC<{ tint: [string, string, string] }> = ({ tint }) => {
  const f = useCurrentFrame();
  const orbs = [
    { x: 200, y: 380, r: 700, c: tint[0], px: 90, py: 70, per: 140 },
    { x: 900, y: 900, r: 820, c: tint[1], px: 110, py: 90, per: 170 },
    { x: 300, y: 1550, r: 760, c: tint[2], px: 80, py: 60, per: 155 },
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 40%, ${C.bg2} 0%, ${C.bg} 60%, #05040f 100%)` }}>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x - o.r / 2,
            top: o.y - o.r / 2,
            width: o.r,
            height: o.r,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.c} 0%, transparent 65%)`,
            opacity: 0.55,
            translate: `${Math.sin((f / o.per) * Math.PI * 2 + i) * o.px}px ${Math.cos((f / o.per) * Math.PI * 2 + i * 2) * o.py}px`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.10) 1.5px, transparent 1.6px)",
          backgroundSize: "54px 54px",
          backgroundPosition: `0px ${(-f * 0.6) % 54}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)",
        }}
      />
      <Stars />
    </AbsoluteFill>
  );
};

/** Slow-rising twinkling motes for depth. */
const Stars: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(46).fill(0).map((_, i) => {
        const x = rand(i) * 1080;
        const speed = 0.4 + rand(i + 50) * 1.2;
        const y = (((rand(i + 99) * 2100 - f * speed) % 2100) + 2100) % 2100 - 90;
        const s = 2 + rand(i + 7) * 4;
        const tw = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(f / (6 + rand(i) * 9) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: i % 5 === 0 ? C.gold : "#fff",
              opacity: tw,
              boxShadow: `0 0 ${s * 3}px ${i % 5 === 0 ? C.gold : "#9fd8ff"}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Static film grain on top of everything (3%). */
export const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
  </AbsoluteFill>
);

/** The golden key. Drawn pointing down; origin at the centre of the bow ring. */
export const KeyShape: React.FC<{ size?: number; withLogo?: boolean }> = ({ size = 1, withLogo = true }) => (
  <div style={{ position: "relative", width: 220 * size, height: 520 * size }}>
    <svg width={220 * size} height={520 * size} viewBox="0 0 220 520" style={{ position: "absolute", overflow: "visible" }}>
      <defs>
        <linearGradient id="kg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff4c4" />
          <stop offset="0.45" stopColor="#ffc94a" />
          <stop offset="1" stopColor="#d9771a" />
        </linearGradient>
      </defs>
      {/* blade */}
      <rect x="95" y="190" width="30" height="300" rx="10" fill="url(#kg)" />
      <path d="M125 400 h45 v28 h-22 v20 h22 v28 h-45 z" fill="url(#kg)" />
      <rect x="98" y="215" width="8" height="250" rx="4" fill="rgba(255,255,255,0.45)" />
      {/* bow */}
      <circle cx="110" cy="110" r="100" fill="url(#kg)" />
      <circle cx="110" cy="110" r="74" fill="#fff" />
      <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="4" />
    </svg>
    {withLogo ? (
      <Img
        src={staticFile("emblem.png")}
        style={{ position: "absolute", left: 40 * size, top: 40 * size, width: 140 * size, height: 140 * size, borderRadius: "50%" }}
      />
    ) : null}
  </div>
);

/** Logo disc with a rotating spectrum ring. */
export const LogoDisc: React.FC<{ size: number; start: number }> = ({ size, start }) => {
  const f = useCurrentFrame();
  const s = pop(f, start, 12);
  const ring = p(f, start + 2, start + 26);
  return (
    <div style={{ position: "relative", width: size, height: size, scale: String(s) }}>
      <div
        style={{
          position: "absolute",
          inset: -18,
          borderRadius: "50%",
          background: `conic-gradient(from ${f * 4}deg, ${C.blue}, ${C.teal}, ${C.green}, ${C.sand}, ${C.coral}, ${C.plum}, ${C.blue})`,
          mask: `conic-gradient(#000 ${ring * 360}deg, transparent 0)`,
          WebkitMask: `conic-gradient(#000 ${ring * 360}deg, transparent 0)`,
          filter: "drop-shadow(0 0 22px rgba(120,200,255,0.55))",
        }}
      />
      <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: C.bg }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#fff",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <Img src={staticFile("emblem.png")} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

/** Radial spark burst, deterministic. */
export const Burst: React.FC<{ x: number; y: number; start: number; n?: number; dist?: number; colors?: string[]; seed?: number }> = ({
  x,
  y,
  start,
  n = 40,
  dist = 420,
  colors = [C.gold, "#fff", C.blue, C.coral],
  seed = 1,
}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t > 40) return null;
  const k = 1 - Math.pow(1 - Math.min(1, t / 26), 3);
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const a = rand(i * 3 + seed) * Math.PI * 2;
        const d = dist * (0.35 + rand(i * 7 + seed) * 0.65) * k;
        const len = 18 + rand(i + seed) * 26;
        const op = interpolate(t, [0, 6, 40], [0, 1, 0], { extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * d,
              top: y + Math.sin(a) * d + t * t * 0.08,
              width: len * (1 - k * 0.6),
              height: 5,
              borderRadius: 3,
              background: colors[i % colors.length],
              rotate: `${(a * 180) / Math.PI}deg`,
              opacity: op,
              boxShadow: `0 0 12px ${colors[i % colors.length]}`,
            }}
          />
        );
      })}
    </>
  );
};

/** Word that rises out of a mask. */
export const MaskWord: React.FC<{ children: React.ReactNode; start: number; dur?: number; style?: React.CSSProperties }> = ({
  children,
  start,
  dur = 14,
  style,
}) => {
  const f = useCurrentFrame();
  const k = p(f, start, start + dur);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.08em" }}>
      <span style={{ display: "inline-block", translate: `0 ${lerp(110, 0, k)}%`, rotate: `${lerp(8, 0, k)}deg`, ...style }}>{children}</span>
    </span>
  );
};

/** Diagonal light sweep across text (used on gradient words). */
export const shine = (f: number, start: number, period = 60) => {
  const t = ((f - start) % period) / period;
  const x = lerp(-60, 160, Math.min(1, t * 1.6));
  return `linear-gradient(105deg, transparent ${x - 12}%, rgba(255,255,255,0.85) ${x}%, transparent ${x + 12}%)`;
};

export const GradientText: React.FC<{ text: string; size: number; grad?: string; start: number; style?: React.CSSProperties }> = ({
  text,
  size,
  grad = SPECTRUM,
  start,
  style,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: -2,
        backgroundImage: `${shine(f, start)}, ${grad}`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.45))",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export { GOLD };
