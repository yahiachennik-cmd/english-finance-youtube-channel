import {interpolate, spring, Easing} from 'remotion';

export const FPS = 30;

/** Spring "pop" from 0→1 starting at frame `from`. */
export const pop = (frame: number, from: number, fps = FPS, damping = 12) =>
  spring({frame: frame - from, fps, config: {damping, stiffness: 140, mass: 0.7}});

/** Linear-ish progress 0→1 over `dur` frames starting at `from`, eased. */
export const prog = (frame: number, from: number, dur: number) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });

/** Entrance style: scale + fade + blur + rise. */
export const enter = (p: number, rise = 40): React.CSSProperties => ({
  opacity: Math.min(1, p * 1.4),
  transform: `translateY(${(1 - p) * rise}px) scale(${0.82 + 0.18 * p})`,
  filter: `blur(${Math.max(0, (1 - p) * 10)}px)`,
});

/** Exit style for the last frames of a segment. */
export const exitStyle = (frame: number, endFrame: number, len = 8): React.CSSProperties => {
  const e = interpolate(frame, [endFrame - len, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (e <= 0) return {};
  return {opacity: 1 - e, filter: `blur(${e * 14}px)`, transform: `scale(${1 - e * 0.06})`};
};

export const sec = (s: number, fps = FPS) => Math.round(s * fps);
