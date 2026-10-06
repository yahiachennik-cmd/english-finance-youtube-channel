import React from 'react';
import {C, FONT, goldGradient} from '../theme';
import {pop, enter} from '../anim';
import {Center, Icon, atF, VProps} from './common';

// Engagement call-to-action. {type:'cta', actions:[{icon:'MessageCircle', text:'Comment', at?}, {icon:'Send', text:'Share', at?}]}
export const Cta: React.FC<VProps> = ({v, f}) => {
  const actions: any[] = v.actions ?? [
    {icon: 'MessageCircle', text: 'Comment'},
    {icon: 'Send', text: 'Share'},
  ];
  return (
    <Center style={{flexDirection: 'row', gap: 70}}>
      {actions.map((a, i) => {
        const p = pop(f, atF(a.at, i * 10));
        const bob = Math.sin((f - i * 8) / 7) * 6;
        return (
          <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, ...enter(p)}}>
            <div
              style={{
                width: 230,
                height: 230,
                borderRadius: '50%',
                background: goldGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translateY(${bob}px)`,
                boxShadow: '0 0 60px rgba(245,183,49,0.55), inset 0 6px 0 rgba(255,255,255,0.45)',
              }}
            >
              <Icon name={a.icon} size={110} />
            </div>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.white}}>{a.text}</div>
          </div>
        );
      })}
    </Center>
  );
};
