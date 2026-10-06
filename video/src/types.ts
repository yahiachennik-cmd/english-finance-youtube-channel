export type Word = {text: string; start: number; end: number; hl?: boolean};

export type Caption = {start: number; end: number; words: Word[]};

// Every visual gets absolute start/end (seconds). Item-level `at` values are seconds
// relative to the visual's start (resolved from trigger words by tools/make_short.py).
export type Visual = {
  type: string;
  start: number;
  end: number;
  flash?: boolean;
  burst?: boolean; // sunburst rays behind the visual
  [k: string]: any;
};

export type Brand = {name: string; tagline: string; handle: string; cta: string};

export type ShortProps = {
  fps: number;
  durationInFrames: number;
  voice: string | null;
  music: string | null;
  musicVolume: number;
  captions: Caption[];
  visuals: Visual[];
  brand: Brand;
};
