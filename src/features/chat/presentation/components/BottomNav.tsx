import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from './ui/Icon';
import { colors, spacing } from '../theme/tokens';

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Inicio', icon: 'home' },
  chat: { label: 'Chat', icon: 'chat_bubble' },
  history: { label: 'Historial', icon: 'history' },
  settings: { label: 'Ajustes', icon: 'settings' },
};

// En la conversación la barra se oculta: abajo va el campo de mensaje (como en el diseño)
const HIDDEN_ON = ['chat'];

/** Barra flotante tipo "pill": la pestaña activa se expande en verde con texto. */
export const BottomNav: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index]?.name;
  if (HIDDEN_ON.includes(currentRoute)) return null;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, i) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = state.index === i;
          return (
            <Pressable
              key={route.key}
              accessibilityRole='tab'
              accessibilityState={{ selected: focused }}
              accessibilityLabel={tab.label}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress', target: route.key, canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={[styles.item, focused ? styles.itemActive : styles.itemIdle]}
            >
              <Icon name={tab.icon} size={24} color={colors.textStrong} />
              {focused && <Text style={styles.label}>{tab.label}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingHorizontal: spacing.screen, paddingTop: spacing.md,
    backgroundColor: 'rgba(21,27,30,0.96)',
  },
  bar: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    height: 64, borderRadius: 32, padding: 4,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  item: { height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 46 },
  itemActive: {
    flex: 1, flexDirection: 'row', gap: 6, backgroundColor: colors.primary,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  itemIdle: { width: 56, borderWidth: 1, borderColor: colors.borderSoft },
  label: { fontSize: 14, fontWeight: '500', color: colors.textStrong },
});
