import React from 'react';
import * as Icons from 'lucide-react';
import {C, FONT} from '../theme';
import {Visual} from '../types';

export type VProps = {v: Visual; f: number};

export const Icon: React.FC<{name?: string; size?: number; color?: string; stroke?: number}> = ({
  name = 'Circle',
  size = 64,
  color = C.ink,
  stroke = 2.4,
}) => {
  const Cmp = (Icons as unknown as Record<string, React.FC<any>>)[name] ?? Icons.Circle;
  return <Cmp size={size} color={color} strokeWidth={stroke} />;
};

export const Pill: React.FC<{children: React.ReactNode; style?: React.CSSProperties; icon?: string}> = ({
  children,
  style,
  icon,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '16px 30px',
      borderRadius: 999,
      background: C.white,
      color: C.ink,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 38,
      boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
      ...style,
    }}
  >
    {icon && <Icon name={icon} size={36} />}
    {children}
  </div>
);

/** Frame (local to the visual) at which an item triggers. */
export const atF = (at: number | undefined, fallback: number) =>
  at === undefined || at === null ? fallback : Math.round(at * 30);

export const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 470,
      height: 1150,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
      ...style,
    }}
  >
    {children}
  </div>
);
