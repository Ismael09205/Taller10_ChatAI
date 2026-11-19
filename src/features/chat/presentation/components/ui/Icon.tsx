import React from 'react';
import { SymbolView, type AndroidSymbol } from 'expo-symbols';
import light from 'expo-symbols/androidWeights/light';
import { colors } from '../../theme/tokens';

export type IconName = AndroidSymbol;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

/** Iconos de línea fina (Material Symbols Light), equivalentes al set "Light" del diseño. */
export const Icon: React.FC<Props> = ({ name, size = 24, color = colors.textStrong }) => (
  <SymbolView
    name={{ android: name }}
    weight={{ ios: 'light', android: light }}
    size={size}
    tintColor={color}
  />
);
