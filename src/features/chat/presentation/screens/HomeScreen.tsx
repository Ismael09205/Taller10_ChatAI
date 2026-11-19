import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useChat } from '../hooks/useChat';
import { Icon, IconName } from '../components/ui/Icon';
import { Card, CircleButton, HeaderBar } from '../components/ui/Primitives';
import { ProviderPicker } from '../components/ProviderPicker';
import { colors, spacing, type } from '../theme/tokens';

const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

const SUGGESTIONS: { icon: IconName; title: string; prompt: string }[] = [
  { icon: 'lightbulb', title: 'Explícame un tema', prompt: 'Explícame de forma sencilla qué es la arquitectura limpia.' },
  { icon: 'edit_note', title: 'Ayúdame a redactar', prompt: 'Ayúdame a redactar un correo formal para pedir una reunión.' },
  { icon: 'code', title: 'Revisa mi código', prompt: 'Dame buenas prácticas para escribir código TypeScript limpio.' },
];

const formatDate = (d: Date) =>
  d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' });

/** Inicio del asistente: saludo, modelo activo, última conversación y sugerencias. */
export const HomeScreen: React.FC = () => {
  const {
    activeProvider, providers, exhaustedIds, conversations,
    changeProvider, newConversation, openConversation, startConversation,
  } = useChat();
  const [pickerOpen, setPickerOpen] = useState(false);
  const last = conversations[0];

  const startNew = () => {
    newConversation();
    router.navigate('/chat');
  };

  const startWithPrompt = (prompt: string) => {
    router.navigate('/chat');
    startConversation(prompt);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <HeaderBar
        left={<CircleButton icon='history' accessibilityLabel='Historial'
          onPress={() => router.navigate('/history')} />}
        right={<CircleButton icon='settings' accessibilityLabel='Ajustes'
          onPress={() => router.navigate('/settings')} />}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[type.hero, styles.hero]}>{greeting()}</Text>
        <Text style={[type.section, styles.question]}>¿En qué te ayudo hoy?</Text>

        {/* Esfera central del asistente + botón ">|" para empezar */}
        <View style={styles.orbArea}>
          <View style={styles.orbRing}>
            <View style={styles.orb}>
              <Icon name='auto_awesome' size={44} color={colors.textStrong} />
            </View>
          </View>
          <Text style={styles.orbTitle}>{activeProvider.name}</Text>
          <Text style={type.caption}>Tu asistente de IA</Text>
          <CircleButton icon='keyboard_tab' variant='primary' accessibilityLabel='Nueva conversación'
            onPress={startNew} style={styles.startBtn} />
        </View>

        {/* Tarjeta de modelo activo (como "Good · Your this month average mood") */}
        <Card style={styles.rowCard}>
          <View style={styles.rowIcon}>
            <Icon name='memory' size={26} color={colors.accent} />
          </View>
          <View style={styles.rowText}>
            <Text style={type.cardTitle}>{activeProvider.name}</Text>
            <Text style={type.caption} numberOfLines={1}>Modelo: {activeProvider.model}</Text>
          </View>
          <CircleButton icon='tune' accessibilityLabel='Cambiar modelo'
            onPress={() => setPickerOpen(true)} />
        </Card>

        {last && (
          <Card tone='subtle' style={styles.rowCard}>
            <View style={styles.rowIcon}>
              <Icon name='chat_bubble' size={24} color={colors.text} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.lastTitle} numberOfLines={1}>{last.title}</Text>
              <Text style={type.caption}>Última conversación · {formatDate(last.updatedAt)}</Text>
            </View>
            <CircleButton icon='keyboard_tab' accessibilityLabel='Continuar conversación'
              onPress={() => { openConversation(last); router.navigate('/chat'); }} />
          </Card>
        )}

        <Text style={[type.section, styles.sectionTitle]}>Empieza con una idea</Text>
        {SUGGESTIONS.map(s => (
          <Pressable key={s.title} onPress={() => startWithPrompt(s.prompt)}
            accessibilityRole='button'
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
            <Card tone='primary' style={styles.suggestion}>
              <View style={styles.rowText}>
                <Text style={styles.suggestionTitle}>{s.title}</Text>
                <Text style={type.caption} numberOfLines={2}>{s.prompt}</Text>
              </View>
              <View style={styles.suggestionIcon}>
                <Icon name={s.icon} size={22} color={colors.textStrong} />
              </View>
            </Card>
          </Pressable>
        ))}
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
  hero: { textAlign: 'center', marginTop: spacing.xl, alignSelf: 'center', maxWidth: 300 },
  question: { textAlign: 'center', marginTop: spacing.xl },
  orbArea: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl, gap: 4 },
  orbRing: {
    width: 116, height: 116, borderRadius: 58, borderWidth: 1, borderColor: colors.borderSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  orb: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  orbTitle: { fontSize: 20, fontWeight: '700', color: colors.textStrong },
  startBtn: { marginTop: spacing.lg },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: spacing.md },
  rowIcon: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 2 },
  lastTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  suggestion: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    marginBottom: spacing.md, borderColor: 'transparent',
  },
  suggestionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: 0.4, color: colors.text },
  suggestionIcon: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.text,
    alignItems: 'center', justifyContent: 'center',
  },
});
