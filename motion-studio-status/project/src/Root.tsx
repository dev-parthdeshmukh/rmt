import React from "react";
import { AbsoluteFill, Composition, Folder } from "remotion";
import { C, FPS, H, T, W } from "./theme";
import { Main } from "./Main";
import { S1Hook } from "./scenes/S1Hook";
import { S2Admissions } from "./scenes/S2Admissions";
import { S3CBSE, S4State } from "./scenes/S3S4Boards";
import { S5Location } from "./scenes/S5Location";
import { S6CTA } from "./scenes/S6CTA";
import { Background } from "./parts";

const len = (r: readonly [number, number]) => r[1] - r[0];
const withBg = (Scene: React.FC) => {
  const Wrapped: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background tint={["#3b2a8a", "#6a2a6a", "#1d4a7a"]} />
      <Scene />
    </AbsoluteFill>
  );
  return Wrapped;
};

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Scenes">
      <Composition id="S1-Hook" component={withBg(S1Hook)} width={W} height={H} fps={FPS} durationInFrames={len(T.s1)} />
      <Composition id="S2-Admissions" component={withBg(S2Admissions)} width={W} height={H} fps={FPS} durationInFrames={len(T.s2)} />
      <Composition id="S3-CBSE" component={withBg(S3CBSE)} width={W} height={H} fps={FPS} durationInFrames={len(T.s3)} />
      <Composition id="S4-StateBoard" component={withBg(S4State)} width={W} height={H} fps={FPS} durationInFrames={len(T.s4)} />
      <Composition id="S5-Location" component={withBg(S5Location)} width={W} height={H} fps={FPS} durationInFrames={len(T.s5)} />
      <Composition id="S6-CTA" component={withBg(S6CTA)} width={W} height={H} fps={FPS} durationInFrames={len(T.s6)} />
    </Folder>
    <Composition id="Main" component={Main} width={W} height={H} fps={FPS} durationInFrames={T.total} />
  </>
);
