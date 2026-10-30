import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, COPY, body, display } from "../theme";
import { OUT, lerp, p, pop } from "../anim";

export const PIN = { x: 540, y: 905 }; // pin tip on screen (used by the zoom-through)

const roads = [
  "M-40 260 C 200 240 420 300 980 250",
  "M300 -40 C 330 200 300 420 340 660",
  "M640 -40 C 610 180 700 420 660 660",
  "M-40 470 C 260 500 640 430 980 480",
];

export const S5Location: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(1, 1.04, f / 100);
  const drop = pop(f, 22, 9, 0.9);
  const mapIn = p(f, 2, 18);
  return (
    <AbsoluteFill style={{ scale: String(push) }}>
      <div style={{ position: "absolute", top: 290, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 800, fontSize: 40, letterSpacing: 14, color: C.gold, opacity: p(f, 4, 12) }}>
        {COPY.visit}
      </div>
      <div style={{ position: "absolute", top: 350, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 112, color: C.text, letterSpacing: -2, opacity: p(f, 6, 14), translate: `0 ${lerp(50, 0, p(f, 6, 20))}px` }}>
        {COPY.place}
      </div>

      {/* stylised map */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 540,
          width: 900,
          height: 620,
          borderRadius: 48,
          overflow: "hidden",
          background: "linear-gradient(160deg, #1b2a5c, #142047)",
          border: `2px solid ${C.stroke}`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          opacity: mapIn,
          scale: String(lerp(0.92, 1, mapIn)),
        }}
      >
        <svg width={900} height={620} style={{ position: "absolute" }}>
          <rect x={60} y={60} width={200} height={150} rx={20} fill="rgba(159,203,88,0.18)" />
          <rect x={700} y={300} width={170} height={140} rx={20} fill="rgba(78,173,221,0.18)" />
          <rect x={380} y={300} width={220} height={130} rx={20} fill="rgba(255,255,255,0.06)" />
          <path d="M-40 560 C 200 520 500 600 960 540" stroke="rgba(78,173,221,0.35)" strokeWidth={46} fill="none" />
          {roads.map((d, i) => (
            <path key={i} d={d} stroke="rgba(255,255,255,0.75)" strokeWidth={i < 2 ? 16 : 11} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p(f, 4 + i * 3, 22 + i * 3)} />
          ))}
          {/* ripples under the pin */}
          {[0, 1, 2].map((i) => {
            const t = Math.max(0, f - 34 - i * 10);
            const ph = (t % 30) / 30;
            return f > 34 + i * 10 ? (
              <ellipse key={i} cx={450} cy={365} rx={20 + ph * 150} ry={8 + ph * 55} fill="none" stroke={C.gold} strokeWidth={4} opacity={(1 - ph) * 0.8} />
            ) : null;
          })}
        </svg>
        {/* pin */}
        <svg
          width={150}
          height={190}
          viewBox="0 0 64 80"
          style={{ position: "absolute", left: 450 - 75, top: 365 - 182, translate: `0 ${lerp(-520, 0, drop)}px`, scale: `${lerp(1, 1.08, Math.max(0, drop - 1) * 6)} ${lerp(1, 0.9, Math.max(0, drop - 1) * 6)}`, transformOrigin: "50% 100%", opacity: p(f, 22, 24), filter: "drop-shadow(0 18px 18px rgba(0,0,0,0.5))" }}
        >
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffe08a" />
              <stop offset="1" stopColor="#ff9d2e" />
            </linearGradient>
          </defs>
          <path d="M32 2C17 2 6 13 6 28c0 20 26 48 26 48s26-28 26-48C58 13 47 2 32 2z" fill="url(#pg)" />
          <circle cx="32" cy="28" r="12" fill={C.bg} />
        </svg>
      </div>

      {/* address, line by line */}
      <div style={{ position: "absolute", left: 90, top: 1200, width: 900 }}>
        {COPY.address.map((line, i) => {
          const k = p(f, 34 + i * 6, 48 + i * 6, OUT);
          return (
            <div
              key={line}
              style={{
                fontFamily: body,
                fontWeight: 800,
                fontSize: 54,
                lineHeight: 1.35,
                color: i === 2 ? C.gold : C.text,
                opacity: k,
                translate: `${lerp(80, 0, k)}px 0`,
                filter: `blur(${(1 - k) * 6}px)`,
                textAlign: "center",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
