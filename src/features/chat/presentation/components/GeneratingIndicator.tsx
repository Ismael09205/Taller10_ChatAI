import React, { useEffect, useState } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import { Icon } from './ui/Icon';
import { colors, spacing } from '../theme/tokens';

interface Props { label: string }

/**
 * Estado "generando respuesta": esfera con anillo pulsante,
 * inspirada en el orbe de la pantalla Journal del diseño.
 */
export const GeneratingIndicator: React.FC<Props> = ({ label }) => {
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] }) }],
  };

  return (
    <View style={styles.row} accessibilityLiveRegion='polite'>
      <View style={styles.orbBox}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <View style={styles.orb}>
          <Icon name='auto_awesome' size={22} color={colors.textStrong} />
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const ORB = 48;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: 20 },
  orbBox: { width: ORB, height: ORB, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute', width: ORB, height: ORB, borderRadius: ORB / 2,
    borderWidth: 2, borderColor: colors.accent,
  },
  orb: {
    width: ORB, height: ORB, borderRadius: ORB / 2,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: 14, color: colors.textMuted, fontStyle: 'italic' },
});
