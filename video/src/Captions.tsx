import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption} from './types';
import {C, FONT} from './theme';
import {pop, sec, exitStyle} from './anim';

const CaptionLine: React.FC<{cap: Caption}> = ({cap}) => {
  const frame = useCurrentFrame();
  const endF = sec(cap.end);
  return (
    <div
      style={{
        position: 'absolute',
        top: 210,
        left: 70,
        right: 70,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 22px',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 76,
        lineHeight: 1.18,
        textAlign: 'center',
        ...exitStyle(frame, endF, 7),
      }}
    >
      {cap.words.map((w, i) => {
        // reveal slightly before the word is spoken so it feels in sync
        const p = pop(frame, sec(w.start) - 2, 30, 14);
        if (p <= 0.001) return <span key={i} style={{opacity: 0}}>{w.text}</span>;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: w.hl ? C.gold : C.white,
              textShadow: w.hl
                ? `0 0 28px rgba(245,183,49,0.65), 0 4px 0 rgba(0,0,0,0.35)`
                : '0 4px 0 rgba(0,0,0,0.35), 0 0 24px rgba(0,0,0,0.4)',
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${(1 - p) * 26}px) scale(${0.86 + 0.14 * p})`,
              filter: `blur(${Math.max(0, (1 - p) * 8)}px)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const Captions: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <>
      {captions
        .filter((c) => t >= c.start - 0.2 && t < c.end)
        .map((c, i) => (
          <CaptionLine key={`${c.start}-${i}`} cap={c} />
        ))}
    </>
  );
};
