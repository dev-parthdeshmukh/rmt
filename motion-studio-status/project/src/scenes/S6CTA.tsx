import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, COPY, GOLD, body, display } from "../theme";
import { lerp, p, pop } from "../anim";
import { Burst, KeyShape, LogoDisc, MaskWord, shine } from "../parts";

export const S6CTA: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(1, 1.05, f / 75);
  const btn = pop(f, 30, 11);
  // button "press" after landing
  const press = interpolate(f, [44, 48, 52], [1, 0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyIn = p(f, 2, 22);
  return (
    <AbsoluteFill style={{ scale: String(push) }}>
      {/* the key motif returns, orbiting behind the logo */}
      <div
        style={{
          position: "absolute",
          left: 540 - 110,
          top: 520 - 110,
          transformOrigin: "110px 110px",
          rotate: `${lerp(-200, -35, keyIn) + Math.sin(f / 14) * 3}deg`,
          translate: `${lerp(-500, 210, keyIn)}px ${lerp(300, -40, keyIn)}px`,
          scale: "0.55",
          opacity: keyIn,
          filter: "drop-shadow(0 0 30px rgba(255,190,70,0.6))",
        }}
      >
        <KeyShape withLogo={false} />
      </div>

      <div style={{ position: "absolute", left: 540 - 140, top: 380 }}>
        <LogoDisc size={280} start={4} />
      </div>
      <Burst x={540} y={520} start={8} n={50} dist={600} seed={21} />

      <div style={{ position: "absolute", top: 730, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 104, color: C.text, letterSpacing: -1 }}>
        <MaskWord start={10}>{COPY.brand1}</MaskWord>
      </div>
      <div style={{ position: "absolute", top: 860, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 800, fontSize: 46, color: C.muted, letterSpacing: interpolate(f, [14, 34], [40, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), opacity: p(f, 14, 26) }}>
        {COPY.brand2}
      </div>

      {/* CTA button */}
      <div style={{ position: "absolute", top: 990, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 680,
            height: 150,
            borderRadius: 80,
            backgroundImage: `${shine(f, 50, 45)}, ${GOLD}`,
            boxShadow: `0 0 0 ${8 + 8 * Math.abs(Math.sin(f / 9))}px rgba(255,201,74,0.18), 0 30px 70px rgba(255,157,46,0.45)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            fontFamily: display,
            fontWeight: 900,
            fontSize: 66,
            color: "#2a1500",
            scale: String(btn * press),
          }}
        >
          {COPY.cta}
          <svg width={60} height={60} viewBox="0 0 60 60" style={{ translate: `${Math.sin(f / 5) * 6}px 0` }}>
            <path d="M8 30 H50 M32 12 L50 30 L32 48" fill="none" stroke="#2a1500" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1200, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 44, color: C.text, opacity: p(f, 38, 50), translate: `0 ${lerp(30, 0, p(f, 38, 52))}px` }}>
        📍 Line Ali, Old Panvel
      </div>
      <div style={{ position: "absolute", top: 1290, width: "100%", textAlign: "center", fontFamily: body, fontStyle: "italic", fontWeight: 600, fontSize: 36, color: C.muted, opacity: p(f, 44, 56) }}>
        {COPY.tagline}
      </div>
    </AbsoluteFill>
  );
};
