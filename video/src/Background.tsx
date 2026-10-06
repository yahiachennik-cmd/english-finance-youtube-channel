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

export type BgVariant = 'navy' | 'royal' | 'aurora' | 'market';

const BASE: Record<BgVariant, string> = {
  navy: `radial-gradient(120% 80% at 50% 20%, ${C.navyTop} 0%, ${C.navyBottom} 75%)`,
  royal: 'radial-gradient(130% 85% at 50% 18%, #2a63e0 0%, #1238a8 38%, #0a2170 70%, #061447 100%)',
  aurora: 'linear-gradient(180deg, #0f2f8f 0%, #0a2272 45%, #061650 100%)',
  market: 'radial-gradient(120% 90% at 50% 30%, #1d55cf 0%, #0f348f 50%, #071c58 100%)',
};

// Soft light orbs drifting slowly (royal)
const Orbs: React.FC<{frame: number}> = ({frame}) => (
  <>
    {[
      {x: 200, y: 500, r: 520, c: 'rgba(80,160,255,0.35)', sx: 140, sy: 90, sp: 110},
      {x: 880, y: 1150, r: 600, c: 'rgba(40,110,255,0.30)', sx: 120, sy: 140, sp: 140},
      {x: 540, y: 1700, r: 480, c: 'rgba(245,183,49,0.14)', sx: 160, sy: 60, sp: 170},
    ].map((o, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: o.x + Math.sin(frame / o.sp + i) * o.sx - o.r / 2,
          top: o.y + Math.cos(frame / o.sp + i * 2) * o.sy - o.r / 2,
          width: o.r,
          height: o.r,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
        }}
      />
    ))}
  </>
);

// Flowing aurora bands (aurora)
const Aurora: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{filter: 'blur(60px)', mixBlendMode: 'screen'}}>
    {[
      {y: 380, h: 260, c: '#2f7bff', sp: 70, amp: 220, rot: -12, o: 0.55},
      {y: 760, h: 220, c: '#19c3ff', sp: 95, amp: 260, rot: 8, o: 0.4},
      {y: 1250, h: 300, c: '#5a46ff', sp: 120, amp: 200, rot: -6, o: 0.45},
      {y: 1650, h: 200, c: '#f5b731', sp: 150, amp: 160, rot: 4, o: 0.18},
    ].map((b, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: -300 + Math.sin(frame / b.sp + i) * b.amp,
          top: b.y + Math.sin(frame / (b.sp * 0.7) + i * 3) * 60,
          width: 1700,
          height: b.h * (1 + 0.2 * Math.sin(frame / 40 + i)),
          borderRadius: '50%',
          background: b.c,
          opacity: b.o,
          transform: `rotate(${b.rot + Math.sin(frame / 80 + i) * 5}deg)`,
        }}
      />
    ))}
  </AbsoluteFill>
);

// Faint stock lines scrolling left + candles (market)
const MARKET_LINES = [0, 1, 2].map((k) => {
  let y = 0;
  return Array.from({length: 90}, (_, i) => {
    y += (random(`m${k}-${i}`) - 0.42) * 38;
    return y;
  });
});
const Market: React.FC<{frame: number}> = ({frame}) => {
  const step = 40;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {MARKET_LINES.map((ln, k) => {
          const off = (frame * (1.2 + k * 0.5)) % (step * 30);
          const baseY = [1500, 1150, 800][k];
          const pts = ln.map((v, i) => `${i * step - off},${baseY - v - i * 4}`).join(' ');
          return (
            <polyline
              key={k}
              points={pts}
              fill="none"
              stroke={k === 1 ? 'rgba(245,183,49,0.22)' : 'rgba(140,200,255,0.22)'}
              strokeWidth={k === 1 ? 5 : 4}
              strokeLinejoin="round"
            />
          );
        })}
        {Array.from({length: 30}, (_, i) => {
          const x = ((i * 70 - frame * 1.5) % 2100 + 2100) % 2100 - 60;
          const h = 60 + random(`c${i}`) * 160;
          const up = random(`u${i}`) > 0.4;
          return (
            <rect
              key={i}
              x={x}
              y={1780 - h - random(`cy${i}`) * 120}
              width={26}
              height={h}
              rx={4}
              fill={up ? 'rgba(61,220,151,0.10)' : 'rgba(255,90,95,0.08)'}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Background: React.FC<{burst: number; variant?: BgVariant}> = ({burst, variant = 'navy'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BASE[variant] ?? BASE.navy}}>
      {variant === 'royal' && <Orbs frame={frame} />}
      {variant === 'aurora' && <Aurora frame={frame} />}
      {variant === 'market' && <Market frame={frame} />}
      {/* grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)',
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
      <AbsoluteFill style={{background: 'radial-gradient(100% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)'}} />
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
