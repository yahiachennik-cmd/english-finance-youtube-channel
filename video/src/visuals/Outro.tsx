import React from 'react';
import {random} from 'remotion';
import {C, FONT, goldGradient} from '../theme';
import {pop, prog, enter} from '../anim';
import {Icon, VProps} from './common';
import {Brand} from '../types';

const BITS = Array.from({length: 70}, (_, i) => ({
  a: random(`oa${i}`) * Math.PI * 2,
  d: 300 + random(`od${i}`) * 500,
  r: 3 + random(`or${i}`) * 6,
}));

export const Outro: React.FC<VProps & {brand: Brand}> = ({f, brand}) => {
  const k = prog(f, 0, 22); // particles converge
  const logo = pop(f, 14, 30, 10);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {BITS.map((b, i) => {
        const d = b.d * (1 - k);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 540 + Math.cos(b.a) * d,
              top: 820 + Math.sin(b.a) * d * 0.6,
              width: b.r,
              height: b.r,
              borderRadius: '50%',
              background: C.gold,
              boxShadow: `0 0 12px ${C.gold}`,
              opacity: 1 - logo,
            }}
          />
        );
      })}
      <div style={{position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 124,
            letterSpacing: -3,
            lineHeight: 1,
            textAlign: 'center',
            background: goldGradient,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            filter: `drop-shadow(0 0 30px rgba(245,183,49,0.45)) blur(${(1 - logo) * 12}px)`,
            opacity: logo,
            transform: `scale(${0.7 + 0.3 * logo})`,
            padding: '0 40px',
          }}
        >
          {brand.name}
        </div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 14, color: C.muted, ...enter(pop(f, 20))}}>
          {brand.handle}
        </div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.white, marginTop: 30, ...enter(pop(f, 26))}}>
          {brand.tagline}
        </div>
        <div
          style={{
            marginTop: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '22px 46px',
            borderRadius: 999,
            border: `3px solid ${C.gold}`,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 44,
            color: C.gold,
            boxShadow: `0 0 ${30 + 20 * Math.sin(f / 6)}px rgba(245,183,49,0.35)`,
            ...enter(pop(f, 34)),
          }}
        >
          <Icon name="Bell" size={44} color={C.gold} />
          {brand.cta}
        </div>
      </div>
    </div>
  );
};
