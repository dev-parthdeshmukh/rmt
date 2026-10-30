import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, COPY, GOLD, display } from "../theme";
import { IN, INOUT, OUT, lerp, p, pop } from "../anim";
import { Burst, KeyShape, shine } from "../parts";

export const KH = { x: 540, y: 1080 }; // keyhole centre

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();

  // keyhole plate
  const plate = pop(f, 0, 13);
  const rim = p(f, 2, 22);
  // key flight: from bottom-right, tilted, big -> seated in keyhole
  const fly = p(f, 14, 34, OUT);
  const turn = p(f, 38, 46, INOUT); // the "click"
  const glow = p(f, 44, 56);
  const keyScale = lerp(1.5, 0.62, fly);
  const keyX = lerp(360, 0, fly);
  const keyY = lerp(820, 0, fly);
  const keyRot = lerp(-38, 0, fly) + turn * 90;
  // anticipation: tiny push before the turn
  const nudge = interpolate(f, [34, 37, 40], [0, 10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const letters = COPY.hook1.split("");
  return (
    <AbsoluteFill>
      {/* headline */}
      <div style={{ position: "absolute", top: 380, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 700, fontSize: 76, color: C.text, letterSpacing: 6 }}>
        {letters.map((ch, i) => {
          const k = p(f, 3 + i * 1.3, 15 + i * 1.3);
          return (
            <span key={i} style={{ display: "inline-block", opacity: k, translate: `0 ${lerp(60, 0, k)}px`, filter: `blur(${(1 - k) * 8}px)` }}>
              {ch === " " ? " " : ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 490,
          width: "100%",
          textAlign: "center",
          fontFamily: display,
          fontWeight: 900,
          fontSize: 132,
          letterSpacing: -2,
          backgroundImage: `${shine(f, 30, 90)}, ${GOLD}`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          scale: String(lerp(1.35, 1, p(f, 12, 30))),
          opacity: p(f, 12, 22),
          filter: `blur(${(1 - p(f, 12, 26)) * 14}px) drop-shadow(0 0 30px rgba(255,190,70,0.45))`,
        }}
      >
        {COPY.hook2}
      </div>

      {/* light rays behind keyhole once unlocked */}
      <div
        style={{
          position: "absolute",
          left: KH.x - 700,
          top: KH.y - 700,
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background: `repeating-conic-gradient(from ${f * 1.5}deg, rgba(255,201,74,0.22) 0deg 6deg, transparent 6deg 18deg)`,
          maskImage: "radial-gradient(circle, black 10%, transparent 60%)",
          opacity: glow,
          scale: String(lerp(0.4, 1, glow)),
        }}
      />

      {/* keyhole plate */}
      <div style={{ position: "absolute", left: KH.x - 190, top: KH.y - 190, width: 380, height: 380, scale: String(plate) }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #2c2470, #120d3a 70%)",
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 3px rgba(255,255,255,0.08), 0 0 ${90 * glow}px ${30 * glow}px rgba(255,190,70,${0.5 * glow})`,
          }}
        />
        <svg width={380} height={380} style={{ position: "absolute", inset: 0 }}>
          <circle cx={190} cy={190} r={176} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - rim} transform="rotate(-90 190 190)" />
          {/* keyhole cut-out */}
          <circle cx={190} cy={160} r={48} fill={glow > 0 ? `rgba(255,214,120,${0.25 + glow * 0.75})` : "#05040f"} />
          <path d="M168 190 L150 290 L230 290 L212 190 Z" fill={glow > 0 ? `rgba(255,214,120,${0.25 + glow * 0.75})` : "#05040f"} />
        </svg>
      </div>

      {/* key */}
      <div
        style={{
          position: "absolute",
          left: KH.x - 110,
          top: KH.y - 30 - 110,
          opacity: p(f, 14, 18),
          translate: `${keyX}px ${keyY + nudge}px`,
          rotate: `${keyRot}deg`,
          scale: String(keyScale),
          transformOrigin: "110px 110px",
          filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.55)) blur(${(1 - p(f, 14, 30)) * 6}px)`,
          // blade hides inside the keyhole once seated
          clipPath: `inset(0 0 ${lerp(0, 58, p(f, 26, 36, IN))}% 0)`,
        }}
      >
        <KeyShape />
      </div>
      <Burst x={KH.x} y={KH.y} start={44} n={44} dist={520} />
    </AbsoluteFill>
  );
};
