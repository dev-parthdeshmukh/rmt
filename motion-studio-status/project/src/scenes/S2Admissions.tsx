import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, COPY, body, display } from "../theme";
import { lerp, p, pop } from "../anim";
import { Burst, GradientText, LogoDisc, MaskWord } from "../parts";

export const S2Admissions: React.FC = () => {
  const f = useCurrentFrame();
  const push = lerp(1, 1.05, f / 90); // never static
  const openPop = pop(f, 26, 11);
  return (
    <AbsoluteFill style={{ scale: String(push) }}>
      <div style={{ position: "absolute", left: 540 - 150, top: 420 }}>
        <LogoDisc size={300} start={6} />
      </div>

      <div style={{ position: "absolute", top: 860, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 104, color: C.text, letterSpacing: 2 }}>
        <MaskWord start={16}>{COPY.adm1}</MaskWord>
      </div>
      <div style={{ position: "absolute", top: 980, width: "100%", display: "flex", justifyContent: "center", scale: String(openPop), opacity: p(f, 26, 30) }}>
        <GradientText text={COPY.adm2} size={260} start={34} />
      </div>
      <Burst x={540} y={1110} start={30} n={36} dist={560} seed={7} />

      {/* sub line in a glass pill */}
      <div style={{ position: "absolute", top: 1300, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "22px 44px",
            borderRadius: 60,
            background: C.surface,
            border: `2px solid ${C.stroke}`,
            backdropFilter: "blur(12px)",
            fontFamily: body,
            fontWeight: 700,
            fontSize: 42,
            color: C.text,
            opacity: p(f, 40, 52),
            translate: `0 ${lerp(40, 0, p(f, 40, 54))}px`,
          }}
        >
          {COPY.admSub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
