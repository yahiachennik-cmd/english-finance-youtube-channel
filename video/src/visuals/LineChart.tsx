import React from 'react';
import {C, FONT, glassDark} from '../theme';
import {pop, prog, enter} from '../anim';
import {Center, Pill, atF, VProps} from './common';

// {type:'chart', points:number[], color?:'gold'|'red'|'green', yLabel?, xLabel?, startLabel?, endLabel?,
//  markers?:[{index, text, at?}], dur?:1.6}
export const LineChart: React.FC<VProps> = ({v, f}) => {
  const W = 900, H = 640, pad = 70;
  const pts: number[] = v.points;
  const min = Math.min(...pts), max = Math.max(...pts);
  const xy = pts.map((y, i) => [
    pad + (i / (pts.length - 1)) * (W - pad * 2),
    H - pad - ((y - min) / (max - min || 1)) * (H - pad * 2),
  ]);
  const d = xy.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const len = xy.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - xy[i - 1][0], p[1] - xy[i - 1][1]) : 0), 0);
  const k = prog(f, 6, Math.round((v.dur ?? 1.6) * 30));
  const color = v.color === 'red' ? C.red : v.color === 'green' ? C.green : C.gold;
  // head position
  const target = k * len;
  let acc = 0, head = xy[0];
  for (let i = 1; i < xy.length; i++) {
    const seg = Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
    if (acc + seg >= target) {
      const r = (target - acc) / seg;
      head = [xy[i - 1][0] + (xy[i][0] - xy[i - 1][0]) * r, xy[i - 1][1] + (xy[i][1] - xy[i - 1][1]) * r];
      break;
    }
    acc += seg;
    head = xy[i];
  }
  return (
    <Center>
      <div style={{...glassDark, width: W, height: H, position: 'relative', ...enter(pop(f, 0))}}>
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <line x1={pad} y1={pad - 20} x2={pad} y2={H - pad} stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
          <line x1={pad} y1={H - pad} x2={W - pad + 20} y2={H - pad} stroke="rgba(255,255,255,0.5)" strokeWidth={3} />
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - k)}
            style={{filter: `drop-shadow(0 0 14px ${color})`}}
          />
          {k > 0.02 && <circle cx={head[0]} cy={head[1]} r={14} fill={C.white} style={{filter: `drop-shadow(0 0 16px ${color})`}} />}
        </svg>
        {v.yLabel && (
          <div style={{position: 'absolute', left: pad - 40, top: 14, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.muted}}>
            {v.yLabel}
          </div>
        )}
        {v.xLabel && (
          <div style={{position: 'absolute', right: 24, bottom: 18, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.muted}}>
            {v.xLabel}
          </div>
        )}
        {(v.markers ?? []).map((m: any, i: number) => {
          const [x, y] = xy[m.index];
          return (
            <div
              key={i}
              style={{position: 'absolute', left: x, top: y - 90, transform: 'translateX(-50%)'}}
            >
              <div style={enter(pop(f, atF(m.at, 30 + i * 10)))}>
                <Pill style={{fontSize: 30, padding: '10px 20px', whiteSpace: 'nowrap'}}>{m.text}</Pill>
              </div>
            </div>
          );
        })}
      </div>
    </Center>
  );
};
