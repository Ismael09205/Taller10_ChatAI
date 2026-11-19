import React from 'react';
import {
  View, Text, Pressable, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { Icon, IconName } from './Icon';
import { colors, radius, spacing, type } from '../../theme/tokens';

/* ---------- Botón circular "glass" (44px, borde fino) ---------- */
interface CircleButtonProps {
  icon: IconName;
  onPress?: () => void;
  size?: number;
  variant?: 'glass' | 'primary' | 'outline';
  disabled?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

export const CircleButton: React.FC<CircleButtonProps> = ({
  icon, onPress, size = 44, variant = 'glass', disabled, accessibilityLabel, style,
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole='button'
    accessibilityLabel={accessibilityLabel}
    hitSlop={8}
    style={({ pressed }) => [
      styles.circle,
      { width: size, height: size, borderRadius: size / 2 },
      variant === 'glass' && styles.circleGlass,
      variant === 'outline' && styles.circleOutline,
      variant === 'primary' && styles.circlePrimary,
      (pressed || disabled) && { opacity: disabled ? 0.4 : 0.7 },
      style,
    ]}
  >
    <Icon
      name={icon}
      size={Math.round(size * 0.52)}
      color={variant === 'primary' ? colors.textStrong : colors.text}
    />
  </Pressable>
);

/* ---------- Pastilla con icono + texto (ej. "Exit Community") ---------- */
interface PillButtonProps {
  icon?: IconName;
  label: string;
  onPress?: () => void;
  trailingIcon?: IconName;
}

export const PillButton: React.FC<PillButtonProps> = ({ icon, label, onPress, trailingIcon }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole='button'
    style={({ pressed }) => [styles.pill, pressed && { opacity: 0.7 }]}
  >
    {icon && <Icon name={icon} size={20} color={colors.textStrong} />}
    <Text style={styles.pillText} numberOfLines={1}>{label}</Text>
    {trailingIcon && <Icon name={trailingIcon} size={18} color={colors.textMuted} />}
  </Pressable>
);

/* ---------- Tarjeta con fondo translúcido ---------- */
interface CardProps {
  children: React.ReactNode;
  tone?: 'default' | 'primary' | 'subtle' | 'danger';
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({ children, tone = 'default', style }) => (
  <View style={[
    styles.card,
    tone === 'primary' && { backgroundColor: colors.primarySoft },
    tone === 'subtle' && { backgroundColor: colors.cardSubtle },
    tone === 'danger' && { backgroundColor: colors.dangerSoft },
    style,
  ]}>
    {children}
  </View>
);

/* ---------- Fila de menú (Profile): icono + texto + botón ">|" ---------- */
interface MenuRowProps {
  icon: IconName;
  label: string;
  detail?: string;
  onPress: () => void;
  destructive?: boolean;
}

export const MenuRow: React.FC<MenuRowProps> = ({ icon, label, detail, onPress, destructive }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole='button'
    style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
  >
    <View style={styles.rowIcon}>
      <Icon name={icon} size={24} color={destructive ? colors.danger : colors.text} />
    </View>
    <View style={styles.rowTextBox}>
      <Text style={[type.rowLabel, destructive && { color: colors.danger }]}>{label}</Text>
      {detail ? <Text style={styles.rowDetail} numberOfLines={1}>{detail}</Text> : null}
    </View>
    <View style={styles.rowChevron}>
      <Icon name='keyboard_tab' size={16} color={colors.accent} />
    </View>
  </Pressable>
);

export const Divider: React.FC = () => <View style={styles.divider} />;

/* ---------- Encabezado de pantalla (fila de controles 44px) ---------- */
interface HeaderBarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ left, center, right }) => (
  <View style={styles.header}>
    <View style={styles.headerSide}>{left}</View>
    <View style={styles.headerCenter}>{center}</View>
    <View style={[styles.headerSide, styles.headerRight]}>{right}</View>
  </View>
);

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  circleGlass: {
    backgroundColor: colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
  },
  circleOutline: { borderWidth: 1, borderColor: colors.borderSoft },
  circlePrimary: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.glass,
    maxWidth: 220,
  },
  pillText: { fontSize: 14, color: colors.textStrong, flexShrink: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  rowIcon: { width: 24, alignItems: 'center' },
  rowTextBox: { flex: 1 },
  rowDetail: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  rowChevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    marginTop: spacing.md,
  },
  headerSide: { width: 44, flexDirection: 'row', alignItems: 'center' },
  headerRight: { justifyContent: 'flex-end' },
  headerCenter: { flex: 1, alignItems: 'center' },
});
