import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, interpolate} from 'remotion';
import {C} from './theme';

const PARTICLES = Array.from({length: 46}, (_, i) => ({
  x: random(`x${i}`) * 1080,
  y: random(`y${i}`) * 1920,
  r: 2 + random(`r${i}`) * 5,
  speed: 0.15 + random(`s${i}`) * 0.5,
  phase: random(`p${i}`) * Math.PI * 2,
}));

export const Background: React.FC<{burst: number}> = ({burst}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 20%, ${C.navyTop} 0%, ${C.navyBottom} 75%)`}}>
      {/* grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px)',
          backgroundSize: '120px 120px',
          backgroundPosition: `0px ${(frame * 0.4) % 120}px`,
          maskImage: 'radial-gradient(90% 70% at 50% 45%, black 30%, transparent 100%)',
        }}
      />
      {/* sunburst rays */}
      {burst > 0 && (
        <AbsoluteFill
          style={{
            opacity: burst * 0.55,
            background: `repeating-conic-gradient(from ${frame * 0.25}deg at 50% 50%, rgba(255,255,255,0.07) 0deg 5deg, transparent 5deg 15deg)`,
            maskImage: 'radial-gradient(60% 45% at 50% 50%, black 0%, transparent 100%)',
          }}
        />
      )}
      {/* bottom gold glow */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(70% 28% at 70% 100%, rgba(245,183,49,0.22) 0%, transparent 100%)',
        }}
      />
      {/* particles */}
      {PARTICLES.map((p, i) => {
        const y = (p.y - frame * p.speed * 2 + 1920 * 4) % 1920;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / 18 + p.phase));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: y,
              width: p.r,
              height: p.r,
              borderRadius: '50%',
              background: C.gold,
              opacity: tw * 0.7,
              boxShadow: `0 0 ${p.r * 3}px ${C.gold}`,
            }}
          />
        );
      })}
      {/* vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(100% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

export const burstLevel = (frame: number, ranges: {from: number; to: number}[]) => {
  let v = 0;
  for (const r of ranges) {
    v = Math.max(
      v,
      interpolate(frame, [r.from, r.from + 12, r.to - 8, r.to], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    );
  }
  return v;
};
