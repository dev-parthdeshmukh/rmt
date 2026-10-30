import React from "react";
import { useCurrentFrame } from "remotion";
import { C, COPY, GOLD, body, display } from "../theme";
import { lerp, p, pop } from "../anim";
import { BoardCard } from "./BoardCard";
import { Burst, shine } from "../parts";

export const S3CBSE: React.FC = () => (
  <BoardCard titleLines={[COPY.cbse.title]} titleSize={210} accent={C.blue} from={COPY.cbse.from} to={COPY.cbse.to} cardTop={580} cardH={800} />
);

const CommerceBadge: React.FC = () => {
  const f = useCurrentFrame();
  const s = pop(f, 76, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 870,
        width: 780,
        height: 180,
        borderRadius: 40,
        background: "linear-gradient(120deg, #9d2265, #dd4f3b 60%, #ff9d2e)",
        boxShadow: "0 24px 60px rgba(221,79,59,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
        scale: String(s),
        rotate: `${lerp(-8, -1.5, Math.min(1, s))}deg`,
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        gap: 30,
      }}
    >
      <svg width={110} height={110} viewBox="0 0 64 64">
        <rect x="8" y="36" width="10" height="20" rx="3" fill="#fff" opacity={p(f, 82, 88)} />
        <rect x="26" y="26" width="10" height="30" rx="3" fill="#fff" opacity={p(f, 85, 91)} />
        <rect x="44" y="14" width="10" height="42" rx="3" fill="#fff" opacity={p(f, 88, 94)} />
        <path d="M6 30 L22 18 L32 24 L56 6" fill="none" stroke="#ffe08a" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p(f, 86, 98)} />
      </svg>
      <div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 78,
            lineHeight: 1,
            backgroundImage: `${shine(f, 90, 70)}, ${GOLD}`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {COPY.commerce}
        </div>
        <div style={{ fontFamily: body, fontWeight: 800, fontSize: 40, color: "#fff", marginTop: 8 }}>
          for 11<sup style={{ fontSize: 22 }}>th</sup> &amp; 12<sup style={{ fontSize: 22 }}>th</sup> Std.
        </div>
      </div>
      <Burst x={390} y={90} start={78} n={30} dist={420} seed={11} colors={[C.gold, "#fff", C.coral]} />
    </div>
  );
};

export const S4State: React.FC = () => (
  <BoardCard
    titleLines={[COPY.state.title1, COPY.state.title2]}
    titleSize={170}
    accent={C.magenta}
    from={COPY.state.from}
    to={COPY.state.to}
    cardTop={330}
    cardH={1110}
    extra={<CommerceBadge />}
  />
);
