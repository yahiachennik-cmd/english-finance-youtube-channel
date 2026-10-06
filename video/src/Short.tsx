import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Background, burstLevel} from './Background';
import {Captions} from './Captions';
import {VISUALS, Outro} from './visuals';
import {ShortProps, Visual} from './types';
import {exitStyle, sec} from './anim';
import {fontsReady} from './fonts';

const VisualLayer: React.FC<{v: Visual; brand: ShortProps['brand']}> = ({v, brand}) => {
  const frame = useCurrentFrame();
  const s = sec(v.start);
  const e = sec(v.end);
  const f = frame - s;
  if (frame < s || frame >= e) return null;
  if (v.type === 'outro') return <Outro v={v} f={f} brand={brand} />;
  const Cmp = VISUALS[v.type];
  if (!Cmp) return null;
  return (
    <AbsoluteFill style={exitStyle(frame, e, 8)}>
      <Cmp v={v} f={f} />
    </AbsoluteFill>
  );
};

const Flash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 2, at + 9], [0, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: '#cfd6e6', opacity: o}} />;
};

export const Short: React.FC<ShortProps> = (p) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    fontsReady.then(() => continueRender(handle));
  }, [handle]);

  const bursts = p.visuals
    .filter((v) => v.burst || v.type === 'outro')
    .map((v) => ({from: sec(v.start), to: sec(v.end)}));
  const total = p.durationInFrames;
  const musicVol = (f: number) =>
    p.musicVolume * interpolate(f, [0, 15, total - 45, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#060d1f'}}>
      <Background burst={burstLevel(frame, bursts)} />
      {p.visuals.map((v, i) => (
        <VisualLayer key={i} v={v} brand={p.brand} />
      ))}
      <Captions captions={p.captions} />
      {p.visuals.filter((v) => v.flash).map((v, i) => (
        <Flash key={i} at={sec(v.start)} />
      ))}
      {p.voice && <Audio src={staticFile(p.voice)} />}
      {p.music && <Audio src={staticFile(p.music)} loop volume={musicVol} />}
      {p.visuals.slice(1).map((v, i) => (
        <Sequence key={`w${i}`} from={Math.max(0, sec(v.start) - 4)} durationInFrames={20}>
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.22} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
