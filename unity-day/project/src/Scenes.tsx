import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, COPY, DEV, UI } from "./theme";
import { Embers, GoldText, Scrim, WhiteText, lerp, p, pop, push } from "./lib";

const center: React.CSSProperties = { position: "absolute", left: 0, width: "100%", textAlign: "center" };

/** 1 · Hook: tricolour smoke rises out of the dark, then the title. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 75%, #12215a 0%, ${C.navy} 60%, #02061a 100%)` }}>
      {/* full-width smoke (keeps saffron, white and green), screen-blended onto navy */}
      <OffthreadVideo
        src={staticFile("media/smoke.mp4")}
        muted
        trimBefore={45}
        style={{
          position: "absolute",
          width: 1900,
          height: 1069,
          left: -410,
          top: 860,
          mixBlendMode: "screen",
          opacity: p(f, 0, 12),
          scale: String(push(f, 100, 1.0, 1.08)),
          maskImage: "radial-gradient(ellipse 60% 70% at 50% 60%, black 55%, transparent 100%)",
        }}
      />
      <Embers n={34} seed={1} opacity={p(f, 6, 30)} />
      <div style={{ ...center, top: 360, fontFamily: UI, fontWeight: 800, fontSize: 30, letterSpacing: 12, color: C.cream, opacity: p(f, 10, 22) }}>
        {COPY.en}
      </div>
      <div style={{ ...center, top: 410 }}>
        <WhiteText text={COPY.date} size={64} start={14} font={UI} weight={800} color={C.gold} />
      </div>
      <div style={{ ...center, top: 500, scale: String(lerp(1.06, 1, p(f, 20, 60))) }}>
        <WhiteText text={COPY.hook1} size={150} start={22} />
      </div>
      <div style={{ ...center, top: 680, scale: String(lerp(1.06, 1, p(f, 26, 66))) }}>
        <GoldText text={COPY.hook2} size={176} start={28} shineAt={52} />
      </div>
    </AbsoluteFill>
  );
};

/** 2 · Statue of Unity flyover ending on the face, with the tribute. */
export const Statue: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile("media/statue.mp4")} muted trimBefore={15} playbackRate={1.6} style={{ width: "100%", height: "100%", scale: String(push(f, 172, 1.0, 1.05)) }} />
      <Scrim side="bottom" size={900} strength={0.82} />
      <Embers n={18} seed={3} opacity={0.6} />
      <div style={{ ...center, top: 1150 }}>
        <WhiteText text={COPY.patelLabel} size={60} start={34} font={UI} weight={800} color={C.gold} />
      </div>
      <div style={{ ...center, top: 1235 }}>
        <WhiteText text={COPY.patelName} size={96} start={40} />
      </div>
      <div style={{ ...center, top: 1380 }}>
        <WhiteText text={COPY.patelTribute} size={60} start={50} font={UI} weight={700} color={C.cream} />
      </div>
    </AbsoluteFill>
  );
};

/** 3 · India map from puzzle pieces: "One India, Great India". */
export const MapScene: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <AbsoluteFill style={{ backgroundColor: "#040b25" }}>
      <Img src={staticFile("media/map.jpg")} style={{ width: "100%", height: "100%", scale: String(push(f, 94, 1.0, 1.07)), transformOrigin: "50% 62%" }} />
      <div style={{ position: "absolute", left: 540 - 260, top: 1050 - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,140,0.5), transparent 65%)", mixBlendMode: "screen", opacity: 0.4 + glow * 0.5 }} />
      <Embers n={22} seed={5} opacity={0.8} />
      <div style={{ ...center, top: 270 }}>
        <WhiteText text={COPY.map1} size={118} start={18} />
      </div>
      <div style={{ ...center, top: 410 }}>
        <GoldText text={COPY.map2} size={128} start={26} shineAt={46} />
      </div>
    </AbsoluteFill>
  );
};

/** 4a · Students running: "Let's learn together," */
export const Run: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img src={staticFile("media/run.jpg")} style={{ width: "100%", height: "100%", scale: String(push(f, 72, 1.04, 1.12)), transformOrigin: "50% 75%" }} />
      <Scrim side="top" size={760} strength={0.55} />
      <div style={{ ...center, top: 330 }}>
        <WhiteText text={COPY.run} size={150} start={16} />
      </div>
    </AbsoluteFill>
  );
};

/** 4b · Students holding hands at sunrise: "...let's grow together!" */
export const Hands: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img src={staticFile("media/hands.jpg")} style={{ width: "100%", height: "100%", scale: String(push(f, 90, 1.0, 1.06)), transformOrigin: "50% 80%" }} />
      <Scrim side="top" size={700} strength={0.35} />
      <Embers n={16} seed={9} opacity={0.6} />
      <div style={{ ...center, top: 330 }}>
        <GoldText text={COPY.hands} size={150} start={12} shineAt={36} />
      </div>
      <div style={{ ...center, top: 540 }}>
        <WhiteText text={COPY.handsSub} size={56} start={26} font={UI} weight={700} />
      </div>
    </AbsoluteFill>
  );
};

/** 5 · The flag, pure emotion, no text. */
export const Flag: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile("media/flag.mp4")} muted trimBefore={60} style={{ width: "100%", height: "100%", scale: String(push(f, 64, 1.12, 1.0)) }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

/** 6 · End card: greeting + brand on the tricolour silk. */
export const End: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, 14, 12);
  const ring = p(f, 16, 40);
  return (
    <AbsoluteFill style={{ backgroundColor: "#081a45" }}>
      <Img src={staticFile("media/silk.jpg")} style={{ position: "absolute", width: 1080, height: 1920, top: 300, scale: String(push(f, 130, 1.0, 1.06)), transformOrigin: "50% 100%" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 700, background: "linear-gradient(180deg, #050f2e 0%, #081a45 70%, transparent 100%)" }} />
      <Embers n={40} seed={11} opacity={0.9} />

      {/* logo with a tricolour ring */}
      <div style={{ position: "absolute", left: 540 - 125, top: 270, width: 250, height: 250, scale: String(logo) }}>
        <div
          style={{
            position: "absolute",
            inset: -16,
            borderRadius: "50%",
            background: `conic-gradient(from ${f * 3}deg, ${C.saffron}, #fff, ${C.green}, ${C.saffron})`,
            mask: `conic-gradient(#000 ${ring * 360}deg, transparent 0)`,
            WebkitMask: `conic-gradient(#000 ${ring * 360}deg, transparent 0)`,
            filter: "drop-shadow(0 0 20px rgba(255,200,90,0.6))",
          }}
        />
        <div style={{ position: "absolute", inset: -6, borderRadius: "50%", background: "#081a45" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <Img src={staticFile("media/emblem.png")} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      <div style={{ ...center, top: 585 }}>
        <WhiteText text={COPY.greet1} size={88} start={26} />
      </div>
      <div style={{ ...center, top: 700 }}>
        <GoldText text={COPY.greet2} size={134} start={34} shineAt={60} />
      </div>

      {/* brand pill over the ribbons */}
      <div style={{ ...center, top: 1380, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "22px 46px",
            borderRadius: 70,
            background: "rgba(5,15,46,0.72)",
            border: "2px solid rgba(255,212,92,0.55)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            opacity: p(f, 50, 62),
            translate: `0 ${lerp(50, 0, p(f, 50, 66))}px`,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 54, color: "#fff", lineHeight: 1.1 }}>{COPY.brand}</div>
          <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 36, color: C.gold, marginTop: 6 }}>📍 {COPY.place}</div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(f, [0, 8], [0.6, 0], { extrapolateRight: "clamp" }), background: "#fff" }} />
    </AbsoluteFill>
  );
};

export { DEV };
