import React from 'react';
import {IconBadge} from './IconBadge';
import {Counter} from './Counter';
import {LineChart} from './LineChart';
import {ListCards, Compare} from './Cards';
import {Bars} from './Bars';
import {Person} from './Person';
import {Timeline} from './Timeline';
import {Quote} from './Quote';
import {Clip} from './Clip';
import {VProps} from './common';

export const VISUALS: Record<string, React.FC<VProps>> = {
  icon: IconBadge,
  counter: Counter,
  chart: LineChart,
  list: ListCards,
  compare: Compare,
  bars: Bars,
  person: Person,
  timeline: Timeline,
  quote: Quote,
  clip: Clip,
};
export {Outro} from './Outro';
