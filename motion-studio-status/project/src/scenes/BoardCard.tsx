import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, body, display } from "../theme";
import { lerp, p, pop } from "../anim";
import { MaskWord } from "../parts";

const COUNT = Easing.bezier(0.45, 0, 0.55, 1); // gentle in-out so the count never skips a number

const SEG = [C.blue, C.teal, C.green, C.sand, C.coral, C.plum, C.magenta, C.gold];

/** Glass card that flips in, with a title, a 5th→Nth count-up and a segmented bar. Shared by CBSE and State Board. */
export const BoardCard: React.FC<{
  titleLines: string[];
  titleSize: number;
  accent: string;
  from: number;
  to: number;
  cardTop: number;
  cardH: number;
  extra?: React.ReactNode;
}> = ({ titleLines, titleSize, accent, from, to, cardTop, cardH, extra }) => {
  const f = useCurrentFrame();
  const flip = p(f, 4, 26);
  const n = to - from + 1;
  // count-up: one second, eased, never skips a number
  const count = Math.round(interpolate(f, [40, 72], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: COUNT }));
  const lit = count - from + 1;
  const push = lerp(1, 1.04, f / 110);
  const titleBottom = 120 + titleLines.length * titleSize * 1.02;

  return (
    <AbsoluteFill style={{ perspective: 1800, scale: String(push) }}>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: cardTop,
          width: 920,
          height: cardH,
          borderRadius: 56,
          background: "linear-gradient(160deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
          border: `2px solid ${C.stroke}`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 120px ${accent}33`,
          backdropFilter: "blur(14px)",
          rotate: `y ${lerp(75, 0, flip)}deg`,
          translate: `0 ${lerp(120, 0, flip)}px`,
          opacity: p(f, 4, 10),
          overflow: "hidden",
        }}
      >
        {/* accent edge glow */}
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 10, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

        <div style={{ position: "absolute", left: 70, top: 70, fontFamily: body, fontWeight: 800, fontSize: 30, letterSpacing: 10, color: accent, opacity: p(f, 12, 20) }}>
          ADMISSIONS OPEN
        </div>
        <div style={{ position: "absolute", left: 64, top: 120, fontFamily: display, fontWeight: 900, fontSize: titleSize, lineHeight: 1.02, color: C.text, letterSpacing: -3 }}>
          {titleLines.map((l, i) => (
            <div key={l}>
              <MaskWord start={14 + i * 5} dur={14} style={{ textShadow: `0 0 40px ${accent}88` }}>
                {l}
              </MaskWord>
            </div>
          ))}
        </div>

        {/* classes + counter */}
        <div style={{ position: "absolute", left: 70, top: titleBottom + 40, fontFamily: body, fontWeight: 700, fontSize: 44, color: C.muted, opacity: p(f, 30, 40) }}>
          Classes
        </div>
        <div style={{ position: "absolute", left: 64, top: titleBottom + 100, display: "flex", alignItems: "baseline", gap: 26, fontFamily: display, fontWeight: 900, color: C.text, opacity: p(f, 32, 42), translate: `0 ${lerp(30, 0, p(f, 32, 44))}px` }}>
          <span style={{ fontSize: 150 }}>
            {from}
            <sup style={{ fontSize: 50, verticalAlign: 70 }}>th</sup>
          </span>
          <svg width={110} height={60} viewBox="0 0 110 60" style={{ alignSelf: "center" }}>
            <path d="M5 30 H95 M70 8 L98 30 L70 52" fill="none" stroke={accent} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p(f, 36, 48)} />
          </svg>
          <span style={{ fontSize: 150, color: accent, textShadow: `0 0 40px ${accent}99`, minWidth: 260, display: "inline-block" }}>
            {count}
            <sup style={{ fontSize: 50, verticalAlign: 70, color: C.text }}>th</sup>
          </span>
        </div>

        {/* segmented bar */}
        <div style={{ position: "absolute", left: 70, top: titleBottom + 300, width: 780, display: "flex", gap: 12 }}>
          {new Array(n).fill(0).map((_, i) => {
            const on = i < lit && f >= 40;
            const k = pop(f, 40 + (i * 30) / n, 12);
            return (
              <div key={i} style={{ flex: 1, height: 64, borderRadius: 18, position: "relative", background: "rgba(255,255,255,0.08)", border: `2px solid ${C.stroke}` }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background: SEG[i % SEG.length],
                    boxShadow: `0 0 24px ${SEG[i % SEG.length]}`,
                    opacity: on ? 1 : 0,
                    scale: on ? String(k) : "0",
                  }}
                />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontWeight: 700, fontSize: n > 6 ? 26 : 30, color: on ? "#0b0a24" : C.muted }}>
                  {from + i}
                </div>
              </div>
            );
          })}
        </div>
        {extra}
      </div>
    </AbsoluteFill>
  );
};
