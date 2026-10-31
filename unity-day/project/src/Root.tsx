import React from "react";
import { Composition, Folder } from "remotion";
import { FPS, H, T, W } from "./theme";
import { Main } from "./Main";
import { End, Flag, Hands, Hook, MapScene, Run, Statue } from "./Scenes";

const len = (r: readonly [number, number]) => r[1] - r[0];

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Scenes">
      <Composition id="Hook" component={Hook} width={W} height={H} fps={FPS} durationInFrames={len(T.hook)} />
      <Composition id="Statue" component={Statue} width={W} height={H} fps={FPS} durationInFrames={len(T.statue)} />
      <Composition id="Map" component={MapScene} width={W} height={H} fps={FPS} durationInFrames={len(T.map)} />
      <Composition id="Run" component={Run} width={W} height={H} fps={FPS} durationInFrames={len(T.run)} />
      <Composition id="Hands" component={Hands} width={W} height={H} fps={FPS} durationInFrames={len(T.hands)} />
      <Composition id="Flag" component={Flag} width={W} height={H} fps={FPS} durationInFrames={len(T.flag)} />
      <Composition id="End" component={End} width={W} height={H} fps={FPS} durationInFrames={len(T.end)} />
    </Folder>
    <Composition id="Main" component={Main} width={W} height={H} fps={FPS} durationInFrames={T.total} />
  </>
);
