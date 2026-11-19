import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useChat } from '../hooks/useChat';
import { Card, CircleButton, Divider, HeaderBar, MenuRow } from '../components/ui/Primitives';
import { Icon } from '../components/ui/Icon';
import { ProviderPicker } from '../components/ProviderPicker';
import { colors, spacing, type } from '../theme/tokens';

/** Menú y configuración (diseño "Profile"). */
export const SettingsScreen: React.FC = () => {
  const {
    activeProvider, providers, exhaustedIds, changeProvider,
    voiceEnabled, toggleVoice, conversations, clearHistory, newConversation,
  } = useChat();
  const [pickerOpen, setPickerOpen] = useState(false);

  const confirmClear = () => {
    if (conversations.length === 0) {
      Alert.alert('Historial vacío', 'No hay conversaciones para borrar.');
      return;
    }
    Alert.alert('Borrar historial', 'Se eliminarán todas las conversaciones guardadas.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <HeaderBar
        left={<CircleButton icon='arrow_back' accessibilityLabel='Volver'
          onPress={() => router.navigate('/')} />}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatar}>
          <Icon name='smart_toy' size={72} color={colors.textStrong} />
        </View>
        <Text style={[type.hero, styles.title]}>Ajustes</Text>

        {/* Tarjeta destacada (como "You are not alone") */}
        <Card style={styles.highlight}>
          <Icon name='auto_awesome' size={32} color={colors.accent} />
          <View style={styles.highlightText}>
            <Text style={styles.highlightTitle}>{activeProvider.name}</Text>
            <Text style={styles.highlightSub} numberOfLines={1}>Modelo activo · {activeProvider.model}</Text>
          </View>
          <CircleButton icon='keyboard_tab' variant='primary' size={30}
            accessibilityLabel='Cambiar modelo' onPress={() => setPickerOpen(true)} />
        </Card>

        <Divider />
        <MenuRow icon='tune' label='Modelo de IA'
          detail={`${providers.length} disponibles`} onPress={() => setPickerOpen(true)} />
        <Divider />
        <MenuRow icon={voiceEnabled ? 'volume_up' : 'volume_off'} label='Voz de la IA'
          detail={voiceEnabled ? 'Activada: lee las respuestas en voz alta' : 'Desactivada'}
          onPress={toggleVoice} />
        <Divider />
        <MenuRow icon='add_comment' label='Nueva conversación'
          onPress={() => { newConversation(); router.navigate('/chat'); }} />
        <Divider />
        <MenuRow icon='history' label='Historial'
          detail={`${conversations.length} guardadas`} onPress={() => router.navigate('/history')} />
        <Divider />
        <MenuRow icon='delete' label='Borrar historial' destructive onPress={confirmClear} />
        <Divider />
      </ScrollView>

      <ProviderPicker
        visible={pickerOpen}
        providers={providers}
        activeId={activeProvider.id}
        exhaustedIds={exhaustedIds}
        quotaWarning={false}
        onSelect={id => { setPickerOpen(false); changeProvider(id); }}
        onClose={() => setPickerOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.screen, paddingBottom: 120 },
  avatar: {
    alignSelf: 'center', width: 140, height: 140, borderRadius: 70, marginTop: spacing.xl,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  title: { textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.xl },
  highlight: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 14, paddingHorizontal: spacing.md, marginBottom: spacing.xl,
    borderRadius: 12,
  },
  highlightText: { flex: 1, gap: 4 },
  highlightTitle: { fontSize: 16, fontWeight: '600', color: colors.textStrong },
  highlightSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
});
