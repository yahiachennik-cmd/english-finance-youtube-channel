import React from 'react';
import {C, FONT, goldGradient} from '../theme';
import {pop, prog, enter} from '../anim';
import {Center, Icon, atF, VProps} from './common';

// {type:'bars', bars:[{label, value, display?, at?, color?}], prefix?, suffix?, icon?}
export const Bars: React.FC<VProps> = ({v, f}) => {
  const bars: any[] = v.bars;
  const max = Math.max(...bars.map((b) => b.value));
  const H = 720;
  const gap = bars.length > 8 ? 14 : 26;
  const bw = Math.min(150, (900 - gap * (bars.length - 1)) / bars.length);
  return (
    <Center>
      <div style={{display: 'flex', alignItems: 'flex-end', gap, height: H + 120, ...enter(pop(f, 0))}}>
        {bars.map((b, i) => {
          const start = atF(b.at, 4 + i * 7);
          const k = prog(f, start, 16);
          const h = Math.max(8, (b.value / max) * H * k);
          const bg = b.color === 'red' ? C.red : b.color === 'green' ? C.green : goldGradient;
          return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: bars.length > 8 ? 34 : 42, color: C.white, opacity: k, whiteSpace: 'nowrap', width: bw, display: 'flex', justifyContent: 'center'}}>
                {b.display ?? `${v.prefix ?? ''}${b.value}${v.suffix ?? ''}`}
              </div>
              <div
                style={{
                  width: bw,
                  height: h,
                  borderRadius: 18,
                  background: bg,
                  boxShadow: '0 0 30px rgba(245,183,49,0.35), inset 0 4px 0 rgba(255,255,255,0.45)',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: 16,
                }}
              >
                {v.icon && k > 0.5 && <Icon name={v.icon} size={40} />}
              </div>
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.muted, opacity: k}}>{b.label}</div>
            </div>
          );
        })}
      </div>
    </Center>
  );
};
