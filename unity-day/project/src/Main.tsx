import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { C, T } from "./theme";
import { INOUT, lerp, p } from "./lib";
import { End, Flag, Hands, Hook, MapScene, Run, Statue } from "./Scenes";

type Win = readonly [number, number];
const mid = (w: Win) => Math.round((w[0] + w[1]) / 2);

/** Signature motif: three diagonal tricolour ribbons sweep across; the cut happens while they cover the frame. */
const Ribbons: React.FC<{ win: Win; dir?: 1 | -1 }> = ({ win, dir = 1 }) => {
  const f = useCurrentFrame();
  if (f < win[0] || f > win[1]) return null;
  const cols = [C.saffron, "#ffffff", C.green];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {cols.map((c, i) => {
        const k = p(f, win[0] + i * 2, win[1] - (2 - i) * 2, INOUT);
        const x = lerp(-1900, 1900, k) * dir;
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: -260,
              top: -500 + i * 0,
              width: 1600,
              height: 2900,
              translate: `${x + (i - 1) * 380 * dir}px 0`,
              rotate: "18deg",
              background: c,
              boxShadow: `0 0 80px ${c}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ range: Win; name: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ range, name, children, style }) => (
  <Sequence from={range[0]} durationInFrames={range[1] - range[0]} name={name}>
    <AbsoluteFill style={style}>{children}</AbsoluteFill>
  </Sequence>
);

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const show = (a: number, b: number) => (f >= a && f < b ? "flex" : "none");
  const pushK = p(f, T.push[0], T.push[1], INOUT);
  const flash = interpolate(f, [T.flash[0], mid(T.flash), T.flash[1]], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
      <Scene range={T.hook} name="Hook" style={{ display: show(0, mid(T.wipe1)) }}>
        <Hook />
      </Scene>
      <Scene range={T.statue} name="Statue" style={{ display: show(mid(T.wipe1), mid(T.wipe2)) }}>
        <Statue />
      </Scene>
      <Scene range={T.map} name="Map" style={{ display: show(mid(T.wipe2), mid(T.wipe3)) }}>
        <MapScene />
      </Scene>
      {/* run -> hands: slide-push to the left, like the runners carrying us forward */}
      <Scene range={T.run} name="Run" style={{ display: show(mid(T.wipe3), T.push[1]), translate: `${lerp(0, -1080, pushK)}px 0`, filter: pushK > 0 && pushK < 1 ? `blur(${Math.sin(pushK * Math.PI) * 14}px)` : "none" }}>
        <Run />
      </Scene>
      <Scene range={T.hands} name="Hands" style={{ display: show(T.push[0], mid(T.flash)), translate: `${lerp(1080, 0, pushK)}px 0`, filter: pushK > 0 && pushK < 1 ? `blur(${Math.sin(pushK * Math.PI) * 14}px)` : "none" }}>
        <Hands />
      </Scene>
      <Scene range={T.flag} name="Flag" style={{ display: show(mid(T.flash), mid(T.wipe4)) }}>
        <Flag />
      </Scene>
      <Scene range={T.end} name="End" style={{ display: show(mid(T.wipe4), T.total) }}>
        <End />
      </Scene>

      <Ribbons win={T.wipe1} />
      <Ribbons win={T.wipe2} dir={-1} />
      <Ribbons win={T.wipe3} />
      <Ribbons win={T.wipe4} dir={-1} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #fffbe8 0%, rgba(255,214,120,0.85) 45%, rgba(255,160,60,0.4) 100%)", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
