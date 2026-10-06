import React from 'react';
import {C, FONT} from '../theme';
import {pop, enter} from '../anim';
import {Center, Icon, VProps} from './common';

// {type:'quote', text, author}
export const Quote: React.FC<VProps> = ({v, f}) => (
  <Center style={{padding: '0 90px'}}>
    <div style={enter(pop(f, 0))}>
      <Icon name="Quote" size={120} color={C.gold} />
    </div>
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.25, color: C.white, textAlign: 'center', ...enter(pop(f, 6))}}>
      {v.text}
    </div>
    {v.author && (
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.gold, ...enter(pop(f, 14))}}>— {v.author}</div>
    )}
  </Center>
);
