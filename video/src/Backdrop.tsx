import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FONT} from './theme';
import {sec} from './anim';

// Full-screen real photo / clip behind a visual, tinted royal blue so captions and gold elements stay readable.
// On a visual: "backdrop": {"src": "images/x.jpg" | "clips/x.mp4", "credit": "...", "startFrom"?: s, "focus"?: "50% 30%", "strength"?: 0..1}
export const Backdrop: React.FC<{b: any; start: number; end: number}> = ({b, start, end}) => {
  const frame = useCurrentFrame();
  const s = sec(start), e = sec(end);
  if (frame < s || frame >= e) return null;
  const f = frame - s;
  const o = interpolate(frame, [s, s + 8, e - 8, e], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const zoom = 1.06 + f * 0.0012;
  const isVideo = /\.(mp4|mov|webm)$/i.test(b.src);
  const strength = b.strength ?? 0.35; // how strongly the photo shows through
  const media: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', objectPosition: b.focus ?? '50% 30%'};
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {isVideo ? (
          <OffthreadVideo src={staticFile(b.src)} startFrom={Math.round((b.startFrom ?? 0) * 30)} muted style={media} />
        ) : (
          <Img src={staticFile(b.src)} style={media} />
        )}
      </AbsoluteFill>
      {/* royal-blue grade: keeps the channel colour and contrast for text */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(10,33,112,${0.92 - strength * 0.5}) 0%, rgba(18,56,168,${0.75 - strength * 0.5}) 35%, rgba(10,33,112,${0.8 - strength * 0.45}) 70%, rgba(6,20,71,0.95) 100%)`,
          mixBlendMode: 'normal',
        }}
      />
      {b.credit && (
        <div style={{position: 'absolute', bottom: 40, left: 30, right: 30, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 20, color: 'rgba(255,255,255,0.6)'}}>
          {b.credit}
        </div>
      )}
    </AbsoluteFill>
  );
};
