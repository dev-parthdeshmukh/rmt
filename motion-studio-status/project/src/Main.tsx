import React from "react";
import { AbsoluteFill, Sequence, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { C, T } from "./theme";
import { IN, INOUT, OUT, lerp, p } from "./anim";
import { Background, Grain } from "./parts";
import { KH, S1Hook } from "./scenes/S1Hook";
import { S2Admissions } from "./scenes/S2Admissions";
import { S3CBSE, S4State } from "./scenes/S3S4Boards";
import { PIN, S5Location } from "./scenes/S5Location";
import { S6CTA } from "./scenes/S6CTA";

const len = (r: readonly [number, number]) => r[1] - r[0];

/** Diagonal colour flood that covers the frame, then clears it (cut happens mid-way). */
const Flood: React.FC<{ win: readonly [number, number]; colors: [string, string] }> = ({ win, colors }) => {
  const f = useCurrentFrame();
  const k = p(f, win[0], win[1], INOUT);
  if (k <= 0 || k >= 1) return null;
  const y = lerp(2600, -2600, k);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -600,
            top: -400,
            width: 2300,
            height: 2700,
            background: i === 0 ? `linear-gradient(180deg, ${colors[0]}, ${colors[1]})` : "rgba(255,255,255,0.9)",
            rotate: "-14deg",
            translate: `0 ${y + (i === 0 ? 0 : 160)}px`,
            opacity: i === 0 ? 1 : 0.0,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const tint = [
    interpolateColors(f, [0, 80, 150, 250, 360, 440], ["#3b2a8a", "#2c6cb0", "#2c6cb0", "#7a1f6a", "#1f6a8a", "#8a5a1a"]),
    interpolateColors(f, [0, 80, 150, 250, 360, 440], ["#6a2a6a", "#7a2a8a", "#1f7a9a", "#a3245e", "#2a4a9a", "#7a2a8a"]),
    interpolateColors(f, [0, 80, 150, 250, 360, 440], ["#1d4a7a", "#a3245e", "#245aa3", "#c2581a", "#3f7a52", "#2c6cb0"]),
  ] as [string, string, string];

  // --- transition maths (global frames) ---
  const iris = p(f, T.iris[0], T.iris[1], INOUT);
  const s1Zoom = p(f, T.iris[0], T.iris[1], IN);
  const cut1 = (T.flood1[0] + T.flood1[1]) / 2;
  const cut2 = (T.flood2[0] + T.flood2[1]) / 2;
  const whip = p(f, T.whip[0], T.whip[1], INOUT);
  const whipVel = Math.sin(Math.PI * whip); // 0..1..0 for motion blur
  const zoom = p(f, T.zoom[0], T.zoom[1], IN);
  const zoomIn = p(f, T.zoom[0] + 6, T.zoom[1] + 4, OUT);
  const flash = interpolate(f, [T.zoom[0] + 6, T.zoom[0] + 10, T.zoom[1] + 2], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background tint={tint} />

      {/* S1 hook → keyhole iris + push-through */}
      <Sequence from={T.s1[0]} durationInFrames={len(T.s1)} name="Hook">
        <AbsoluteFill style={{ scale: String(lerp(1, 2.4, s1Zoom)), transformOrigin: `${KH.x}px ${KH.y - 30}px`, opacity: 1 - p(f, T.iris[0] + 8, T.iris[1]) }}>
          <S1Hook />
        </AbsoluteFill>
      </Sequence>

      {/* S2 revealed through an expanding keyhole circle */}
      <Sequence from={T.s2[0]} durationInFrames={len(T.s2)} name="Admissions">
        <AbsoluteFill
          style={{
            clipPath: f < T.iris[1] ? `circle(${lerp(0, 1500, iris)}px at ${KH.x}px ${KH.y - 30}px)` : "none",
            scale: String(lerp(1.25, 1, p(f, T.iris[0], T.iris[1] + 6))),
            display: f < cut1 ? "block" : "none",
          }}
        >
          <S2Admissions />
        </AbsoluteFill>
      </Sequence>

      {/* S3 CBSE, revealed by the blue flood */}
      <Sequence from={T.s3[0]} durationInFrames={len(T.s3)} name="CBSE">
        <AbsoluteFill style={{ display: f >= cut1 && f < cut2 ? "block" : "none", scale: String(lerp(1.08, 1, p(f, cut1, cut1 + 14))) }}>
          <S3CBSE />
        </AbsoluteFill>
      </Sequence>

      {/* S4 State Board, revealed by the magenta flood, leaves with a whip push */}
      <Sequence from={T.s4[0]} durationInFrames={len(T.s4)} name="StateBoard">
        <AbsoluteFill
          style={{
            display: f >= cut2 ? "block" : "none",
            scale: String(lerp(1.08, 1, p(f, cut2, cut2 + 14))),
            translate: `${lerp(0, -1300, whip)}px 0`,
            filter: whipVel > 0.02 ? `blur(${whipVel * 22}px)` : "none",
          }}
        >
          <S4State />
        </AbsoluteFill>
      </Sequence>

      {/* S5 location, whips in from the right, then zooms through the pin */}
      <Sequence from={T.s5[0]} durationInFrames={len(T.s5)} name="Location">
        <AbsoluteFill
          style={{
            translate: `${lerp(1300, 0, whip)}px 0`,
            filter: whipVel > 0.02 ? `blur(${whipVel * 22}px)` : "none",
            scale: String(lerp(1, 7, zoom)),
            transformOrigin: `${PIN.x}px ${PIN.y - 60}px`,
            opacity: 1 - p(f, T.zoom[0] + 6, T.zoom[1] - 2),
          }}
        >
          <S5Location />
        </AbsoluteFill>
      </Sequence>

      {/* S6 CTA */}
      <Sequence from={T.s6[0]} durationInFrames={len(T.s6)} name="CTA">
        <AbsoluteFill style={{ opacity: zoomIn, scale: String(lerp(0.75, 1, zoomIn)) }}>
          <S6CTA />
        </AbsoluteFill>
      </Sequence>

      <Flood win={T.flood1} colors={[C.blue, "#2a3fb0"]} />
      <Flood win={T.flood2} colors={[C.magenta, C.coral]} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #fff6d8, rgba(255,201,74,0.6) 40%, transparent 75%)", opacity: flash, mixBlendMode: "screen" }} />
      <Grain />
    </AbsoluteFill>
  );
};
