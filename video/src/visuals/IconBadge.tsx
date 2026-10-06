import React from 'react';
import {C, FONT, goldGradient} from '../theme';
import {pop, enter} from '../anim';
import {Center, Icon, Pill, VProps, atF} from './common';

// {type:'icon', icon:'Crown', label?, pills?:[{text, icon?, at?}]}
export const IconBadge: React.FC<VProps> = ({v, f}) => {
  const p = pop(f, 0);
  const pulse = 1 + 0.03 * Math.sin(f / 9);
  return (
    <Center>
      <div
        style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: goldGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 ${80 * pulse}px rgba(245,183,49,0.55), inset 0 6px 0 rgba(255,255,255,0.45), inset 0 -10px 20px rgba(120,70,0,0.35)`,
          ...enter(p),
          transform: `${enter(p).transform} scale(${pulse})`,
        }}
      >
        <Icon name={v.icon} size={150} stroke={2.2} />
      </div>
      {v.label && (
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.white, ...enter(pop(f, 8))}}>
          {v.label}
        </div>
      )}
      {v.pills && (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', maxWidth: 940}}>
          {v.pills.map((pl: any, i: number) => (
            <div key={i} style={enter(pop(f, atF(pl.at, 10 + i * 8)))}>
              <Pill icon={pl.icon}>{pl.text}</Pill>
            </div>
          ))}
        </div>
      )}
    </Center>
  );
};
