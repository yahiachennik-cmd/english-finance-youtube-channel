import React from 'react';
import {Composition} from 'remotion';
import {Short} from './Short';
import {ShortProps} from './types';
import demo from './demo-props.json';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Short"
    component={Short as unknown as React.FC<Record<string, unknown>>}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={demo as unknown as Record<string, unknown>}
    calculateMetadata={({props}) => {
      const p = props as unknown as ShortProps;
      return {durationInFrames: p.durationInFrames, fps: p.fps};
    }}
  />
);
