import React from 'react';
import {OffthreadVideo, Img, staticFile} from 'remotion';
import {C, FONT} from '../theme';
import {pop, enter} from '../anim';
import {Center, VProps} from './common';

// Short licensed clip or photo in a gold frame.
// {type:'clip', src:'clips/x.mp4' | 'images/x.jpg', startFrom?: seconds, credit (required), caption?}
export const Clip: React.FC<VProps> = ({v, f}) => {
  const isVideo = /\.(mp4|mov|webm)$/i.test(v.src);
  const zoom = 1 + Math.min(f, 300) * 0.0004; // slow push-in
  return (
    <>
      <Center>
        <div
          style={{
            width: 960,
            height: 720,
            borderRadius: 34,
            overflow: 'hidden',
            border: `5px solid ${C.gold}`,
            boxShadow: '0 0 60px rgba(245,183,49,0.35), 0 30px 60px rgba(0,0,0,0.45)',
            ...enter(pop(f, 0)),
          }}
        >
          <div style={{width: '100%', height: '100%', transform: `scale(${zoom})`}}>
            {isVideo ? (
              <OffthreadVideo
                src={staticFile(v.src)}
                startFrom={Math.round((v.startFrom ?? 0) * 30)}
                muted
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            ) : (
              <Img src={staticFile(v.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            )}
          </div>
        </div>
        {v.caption && (
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.white, ...enter(pop(f, 10))}}>{v.caption}</div>
        )}
      </Center>
      <div
        style={{position: 'absolute', bottom: 70, left: 40, right: 40, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.55)'}}
      >
        {v.credit}
      </div>
    </>
  );
};
