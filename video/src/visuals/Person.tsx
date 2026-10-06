import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, FONT, goldGradient} from '../theme';
import {pop, enter} from '../anim';
import {Center, Pill, atF, VProps} from './common';

// {type:'person', name, role?, image?:'images/x.jpg', credit?, badge?:{text, at?}, source?:{title, sub}, sourceAt?}
// Only use images with a free licence (e.g. Wikimedia CC) and always fill `credit`.
export const Person: React.FC<VProps> = ({v, f}) => {
  const p = pop(f, 0);
  const initials = (v.name as string).split(' ').map((s) => s[0]).join('').slice(0, 2);
  return (
    <>
      <Center>
        <div style={{position: 'relative', ...enter(p)}}>
          <div
            style={{
              width: 520,
              height: 640,
              borderRadius: 34,
              border: `5px solid ${C.gold}`,
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(245,183,49,0.4), 0 30px 60px rgba(0,0,0,0.5)',
              background: v.image ? '#111' : 'linear-gradient(180deg,#1d3260,#0b1630)',
              position: 'relative',
            }}
          >
            {v.image ? (
              <Img src={staticFile(v.image)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 220,
                  background: goldGradient,
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {initials}
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: '80px 20px 26px',
                background: 'linear-gradient(transparent, rgba(5,10,25,0.92))',
                textAlign: 'center',
              }}
            >
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.white}}>{v.name}</div>
              {v.role && <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.gold}}>{v.role}</div>}
            </div>
          </div>
          {v.badge && (
            <div
              style={{
                position: 'absolute',
                right: -60,
                top: 60,
                width: 190,
                height: 190,
                borderRadius: '50%',
                background: goldGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 52,
                color: C.ink,
                boxShadow: '0 0 50px rgba(245,183,49,0.6)',
                transform: `scale(${pop(f, atF(v.badge.at, 14), 30, 9)})`,
              }}
            >
              {v.badge.text}
            </div>
          )}
        </div>
        {v.source && (
          <div style={enter(pop(f, atF(v.sourceAt, 20)))}>
            <Pill style={{flexDirection: 'column', alignItems: 'flex-start', gap: 2, borderRadius: 24}}>
              <span>{v.source.title}</span>
              {v.source.sub && <span style={{fontSize: 28, fontWeight: 600, color: '#53607a'}}>{v.source.sub}</span>}
            </Pill>
          </div>
        )}
      </Center>
      {v.credit && (
        <div
          style={{position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.45)'}}
        >
          {v.credit}
        </div>
      )}
    </>
  );
};
