import React, { useMemo, useRef, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet, KeyboardAvoidingView, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useChat } from '../hooks/useChat';
import { Message } from '../../domain/entities/Message';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { GeneratingIndicator } from '../components/GeneratingIndicator';
import { ProviderPicker } from '../components/ProviderPicker';
import { CircleButton, HeaderBar, PillButton } from '../components/ui/Primitives';
import { Icon } from '../components/ui/Icon';
import { colors, radius, spacing, type } from '../theme/tokens';

/** Conversación con la IA (diseño "Share & care" -> pestaña Chat). */
export const ChatScreen: React.FC = () => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);
  const {
    messages, pendingMessage, isLoading, error, attachments, current,
    sendMessage, pickAttachment, removeAttachment, dismissError, newConversation,
    providers, activeProvider, exhaustedIds,
    needsProviderChange, changeProvider, dismissProviderChange,
    isSpeaking, voiceEnabled, stopSpeaking, toggleVoice,
  } = useChat();

  const data = useMemo(
    () => (pendingMessage ? [...messages, pendingMessage] : messages),
    [messages, pendingMessage],
  );

  const scrollToEnd = () => listRef.current?.scrollToEnd({ animated: true });

  const handleSelectProvider = async (providerId: string) => {
    setPickerOpen(false);
    await changeProvider(providerId);
  };

  const handleClosePicker = () => {
    setPickerOpen(false);
    dismissProviderChange();
  };

  const handleVoicePress = () => (isSpeaking ? stopSpeaking() : toggleVoice());

  const emptyState = (
    <View style={styles.empty}>
      <View style={styles.emptyRing}>
        <View style={styles.emptyOrb}>
          <Text style={[type.title, styles.emptyTitle]}>¿En qué puedo ayudarte?</Text>
        </View>
      </View>
      <Text style={[type.caption, styles.emptyHint]}>
        Escribe un mensaje o adjunta una imagen o documento.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <HeaderBar
        left={<CircleButton icon='arrow_back' accessibilityLabel='Volver al inicio'
          onPress={() => router.navigate('/')} />}
        center={<PillButton icon='auto_awesome' label={activeProvider.name}
          trailingIcon='expand_more' onPress={() => setPickerOpen(true)} />}
        right={<CircleButton
          icon={isSpeaking ? 'stop' : voiceEnabled ? 'volume_up' : 'volume_off'}
          accessibilityLabel={isSpeaking ? 'Detener voz' : voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
          onPress={handleVoicePress} />}
      />

      <KeyboardAvoidingView style={styles.flex} behavior='height'>
        <View style={styles.infoBar}>
          <Text style={styles.infoText} numberOfLines={1}>
            {current ? current.title : 'Nueva conversación'} · {activeProvider.model}
          </Text>
          {messages.length > 0 && (
            <Pressable onPress={newConversation} hitSlop={8} accessibilityLabel='Nueva conversación'>
              <Icon name='add' size={20} color={colors.accent} />
            </Pressable>
          )}
        </View>

        <FlatList
          ref={listRef}
          style={styles.flex}
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} assistantName={activeProvider.name} />
          )}
          contentContainerStyle={[styles.list, data.length === 0 && styles.listEmpty]}
          ListEmptyComponent={emptyState}
          ListFooterComponent={isLoading
            ? <GeneratingIndicator label={`${activeProvider.name} está pensando...`} />
            : null}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps='handled'
        />

        {error && (
          <Pressable onPress={dismissError} style={styles.error} accessibilityRole='alert'>
            <Icon name='error' size={20} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
            <Icon name='close' size={18} color={colors.textMuted} />
          </Pressable>
        )}

        <ChatInput
          disabled={isLoading}
          attachments={attachments}
          onSend={text => sendMessage(text)}
          onPickAttachment={pickAttachment}
          onRemoveAttachment={removeAttachment}
        />
      </KeyboardAvoidingView>

      <ProviderPicker
        visible={pickerOpen || needsProviderChange}
        providers={providers}
        activeId={activeProvider.id}
        exhaustedIds={exhaustedIds}
        quotaWarning={needsProviderChange}
        onSelect={handleSelectProvider}
        onClose={handleClosePicker}
      />
    </SafeAreaView>
  );
};

const ORB = 220;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  infoBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    marginHorizontal: spacing.screen, marginTop: spacing.lg, marginBottom: spacing.sm,
    padding: 10, borderRadius: radius.sm, backgroundColor: colors.cardSubtle,
  },
  infoText: { fontSize: 14, color: colors.accent, flexShrink: 1 },
  list: { paddingHorizontal: spacing.screen, paddingTop: spacing.lg },
  listEmpty: { flexGrow: 1, justifyContent: 'center' },
  empty: { alignItems: 'center', gap: spacing.xl },
  emptyRing: {
    width: ORB + 40, height: ORB + 40, borderRadius: (ORB + 40) / 2,
    borderWidth: 1, borderColor: 'rgba(62,235,180,0.25)', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyOrb: {
    width: ORB, height: ORB, borderRadius: ORB / 2, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', padding: spacing.xl,
  },
  emptyTitle: { textAlign: 'center', fontSize: 25, lineHeight: 28, color: colors.textStrong },
  emptyHint: { textAlign: 'center', maxWidth: 260 },
  error: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginHorizontal: spacing.screen, marginBottom: spacing.sm,
    padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.dangerSoft,
  },
  errorText: { flex: 1, fontSize: 14, color: colors.text },
});
