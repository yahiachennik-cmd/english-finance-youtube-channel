import React from 'react';
import {C, FONT, goldGradient} from '../theme';
import {pop, prog, enter} from '../anim';
import {Center, atF, VProps} from './common';

// Vertical timeline. {type:'timeline', events:[{year, text, at?, color?}]}
export const Timeline: React.FC<VProps> = ({v, f}) => {
  const ev: any[] = v.events;
  const gap = Math.min(220, 900 / ev.length);
  const total = (ev.length - 1) * gap;
  const lastAt = atF(ev[ev.length - 1].at, (ev.length - 1) * 14);
  const k = prog(f, 0, Math.max(10, lastAt));
  return (
    <Center>
      <div style={{position: 'relative', width: 860, height: total + 80}}>
        <div style={{position: 'absolute', left: 230, top: 40, width: 8, height: total, background: 'rgba(255,255,255,0.15)', borderRadius: 4}} />
        <div
          style={{position: 'absolute', left: 230, top: 40, width: 8, height: total * k, background: goldGradient, borderRadius: 4, boxShadow: `0 0 20px ${C.gold}`}}
        />
        {ev.map((e, i) => {
          const p = pop(f, atF(e.at, i * 14));
          const color = e.color === 'red' ? C.red : e.color === 'green' ? C.green : C.gold;
          return (
            <div key={i} style={{position: 'absolute', top: i * gap, left: 0, right: 0, height: 88, display: 'flex', alignItems: 'center', ...enter(p, 20)}}>
              <div style={{width: 190, textAlign: 'right', fontFamily: FONT, fontWeight: 900, fontSize: 56, color}}>{e.year}</div>
              <div
                style={{marginLeft: 22, width: 44, height: 44, borderRadius: '50%', background: color, border: `6px solid ${C.navyBottom}`, boxShadow: `0 0 24px ${color}`}}
              />
              <div style={{marginLeft: 30, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.white}}>{e.text}</div>
            </div>
          );
        })}
      </div>
    </Center>
  );
};
