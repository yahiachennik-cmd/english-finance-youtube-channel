import React from 'react';
import {C, FONT, glassGold} from '../theme';
import {pop, enter, prog} from '../anim';
import {Center, Icon, atF, VProps} from './common';

// Vertical list of gold buttons.
// {type:'list', items:[{text, icon?, at?, mark?:'check'|'cross', markAt?}], highlight?:{index, at}}
export const ListCards: React.FC<VProps> = ({v, f}) => {
  const items: any[] = v.items;
  const hl = v.highlight;
  const hlOn = hl ? prog(f, atF(hl.at, 0), 8) : 0;
  return (
    <Center style={{gap: 34}}>
      {items.map((it, i) => {
        const p = pop(f, atF(it.at, i * 9));
        const isHl = hl && hl.index === i;
        const dim = hl && !isHl ? 1 - 0.55 * hlOn : 1;
        const scale = isHl ? 1 + 0.06 * hlOn : 1;
        const mp = it.mark ? pop(f, atF(it.markAt, atF(it.at, i * 9) + 10), 30, 9) : 0;
        return (
          <div key={i} style={{...enter(p), position: 'relative'}}>
            <div
              style={{
                ...glassGold,
                width: 820,
                height: 150,
                borderRadius: 32,
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                padding: '0 44px',
                opacity: dim,
                transform: `scale(${scale})`,
                boxShadow: isHl && hlOn > 0 ? `0 0 ${60 * hlOn}px rgba(245,183,49,0.8), ${glassGold.boxShadow}` : glassGold.boxShadow,
              }}
            >
              {it.icon && <Icon name={it.icon} size={64} color={C.ink} />}
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.ink}}>{it.text}</div>
            </div>
            {it.mark && mp > 0 && (
              <div
                style={{
                  position: 'absolute',
                  right: -26,
                  top: -26,
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: it.mark === 'check' ? C.green : C.red,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${mp})`,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                }}
              >
                <Icon name={it.mark === 'check' ? 'Check' : 'X'} size={48} color="#fff" stroke={4} />
              </div>
            )}
          </div>
        );
      })}
    </Center>
  );
};

// Two tall glass cards side by side.
// {type:'compare', left:{title, icon?, value?, sub?}, right:{...}, winner?:'left'|'right', winnerAt?, loserMark?:'cross'}
export const Compare: React.FC<VProps> = ({v, f}) => {
  const winOn = v.winner ? prog(f, atF(v.winnerAt, 24), 10) : 0;
  const side = (s: any, key: 'left' | 'right', i: number) => {
    const p = pop(f, atF(s.at, i * 8));
    const isWin = v.winner === key;
    const isLose = v.winner && !isWin;
    return (
      <div key={key} style={{...enter(p), position: 'relative'}}>
        <div
          style={{
            ...glassGold,
            width: 440,
            height: 640,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 26,
            padding: 30,
            opacity: isLose ? 1 - 0.55 * winOn : 1,
            transform: `scale(${isWin ? 1 + 0.07 * winOn : 1 - (isLose ? 0.04 * winOn : 0)})`,
            boxShadow: isWin && winOn > 0 ? `0 0 ${70 * winOn}px rgba(245,183,49,0.85)` : glassGold.boxShadow,
          }}
        >
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: '#4b3a17', textAlign: 'center'}}>{s.title}</div>
          {s.icon && <Icon name={s.icon} size={130} color={C.ink} stroke={2} />}
          {s.value && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.ink}}>{s.value}</div>}
          {s.sub && (
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#3d2f12', textAlign: 'center'}}>{s.sub}</div>
          )}
        </div>
        {isLose && v.loserMark === 'cross' && winOn > 0 && (
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div
              style={{
                width: 170,
                height: 170,
                borderRadius: '50%',
                border: `10px solid ${C.red}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${winOn})`,
                background: 'rgba(255,90,95,0.15)',
              }}
            >
              <Icon name="X" size={110} color={C.red} stroke={4} />
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <Center style={{flexDirection: 'row', gap: 44}}>
      {side(v.left, 'left', 0)}
      {side(v.right, 'right', 1)}
    </Center>
  );
};
