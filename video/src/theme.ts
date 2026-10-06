export const C = {
  navyTop: '#16294f',
  navyBottom: '#060d1f',
  gold: '#F5B731',
  goldLight: '#FFD978',
  goldDeep: '#C98A12',
  red: '#FF5A5F',
  green: '#3DDC97',
  white: '#F4F6FB',
  muted: '#8F9CB8',
  ink: '#0B1630',
};

export const FONT = 'Montserrat';

export const goldGradient = `linear-gradient(160deg, ${C.goldLight} 0%, ${C.gold} 45%, ${C.goldDeep} 100%)`;

// Glassy gold card used for cards / compare / list buttons
export const glassGold: React.CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(255,236,190,0.92) 0%, rgba(214,172,84,0.92) 38%, rgba(160,118,40,0.94) 100%)',
  border: '2px solid rgba(255,236,190,0.9)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.6)',
  borderRadius: 34,
};

export const glassDark: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(18,52,150,0.55), rgba(8,26,90,0.7))',
  backdropFilter: 'blur(14px)',
  border: '2px solid rgba(245,183,49,0.5)',
  boxShadow: '0 20px 60px rgba(3,10,40,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
  borderRadius: 30,
};
