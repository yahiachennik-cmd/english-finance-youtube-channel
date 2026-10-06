import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {FONT} from './theme';

export const fontsReady = Promise.all(
  [600, 700, 800, 900].map((w) =>
    loadFont({
      family: FONT,
      url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`),
      weight: String(w),
    }),
  ),
);
