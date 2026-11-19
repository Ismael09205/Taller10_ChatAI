/**
 * Tokens de diseño extraídos de Figma (Mansa App).
 * Fondo oscuro #151B1E, acento verde #06845C, texto blanco con opacidades.
 * Tipografías: Cellofy (display serif) -> serif del sistema Android;
 * Inter / Fustat -> fuente del sistema (Roboto).
 */
export const colors = {
  background: '#151B1E',
  surface: '#0E1113',
  primary: '#06845C',
  primarySoft: 'rgba(6,132,92,0.1)',
  accent: '#3EEBB4',
  danger: '#EF4444',
  dangerSoft: 'rgba(239,68,68,0.12)',

  text: 'rgba(255,255,255,0.9)',
  textStrong: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.6)',
  textFaint: 'rgba(255,255,255,0.3)',

  card: 'rgba(255,255,255,0.07)',      // aprox. degradado 0.11 -> 0.03
  cardSubtle: 'rgba(255,255,255,0.03)',
  glass: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.4)',
  borderSoft: 'rgba(255,255,255,0.2)',
  divider: 'rgba(255,255,255,0.12)',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export const fonts = {
  display: 'serif',
} as const;

export const spacing = {
  screen: 24,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 51, lineHeight: 52, letterSpacing: 0.4, color: colors.text },
  title: { fontFamily: fonts.display, fontSize: 32, lineHeight: 36, letterSpacing: 0.4, color: colors.text },
  section: { fontFamily: fonts.display, fontSize: 18, fontWeight: '700' as const, letterSpacing: 0.5, color: colors.text },
  name: { fontFamily: fonts.display, fontSize: 14, color: colors.textSecondary },
  body: { fontSize: 14, lineHeight: 18, color: colors.textStrong },
  caption: { fontSize: 14, lineHeight: 19, color: colors.textMuted },
  time: { fontSize: 14, fontWeight: '300' as const, color: colors.textFaint },
  rowLabel: { fontSize: 16, fontWeight: '700' as const, letterSpacing: 0.4, color: colors.text },
  cardTitle: { fontSize: 18, fontWeight: '700' as const, letterSpacing: 0.4, color: colors.text },
} as const;
