import React from 'react';
import {C, FONT} from '../theme';
import {pop, prog, enter} from '../anim';
import {Center, Pill, atF} from './common';
import {VProps} from './common';

// {type:'counter', from?:0, to, prefix?, suffix?, decimals?, label?, color?:'gold'|'red'|'green', dur?:1.4, sub?}
export const Counter: React.FC<VProps> = ({v, f}) => {
  const p = pop(f, 0);
  const k = prog(f, 4, Math.round((v.dur ?? 1.4) * 30));
  const from = v.from ?? 0;
  const val = from + (v.to - from) * k;
  const dec = v.decimals ?? 0;
  const txt = val.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});
  const color = v.color === 'red' ? C.red : v.color === 'green' ? C.green : C.gold;
  const done = k >= 1;
  const glow = done ? 1 + 0.25 * Math.sin(f / 7) : 0.7;
  return (
    <Center>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: v.size ?? 230,
          letterSpacing: -6,
          color,
          textShadow: `0 0 ${60 * glow}px ${color}88, 0 10px 0 rgba(0,0,0,0.35)`,
          ...enter(p),
        }}
      >
        {v.prefix ?? ''}
        {txt}
        {v.suffix ?? ''}
      </div>
      {v.label && (
        <div style={enter(pop(f, atF(v.labelAt, 14)))}>
          <Pill icon={v.labelIcon}>{v.label}</Pill>
        </div>
      )}
      {v.sub && (
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.muted, ...enter(pop(f, atF(v.subAt, 22)))}}>
          {v.sub}
        </div>
      )}
    </Center>
  );
};
