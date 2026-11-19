import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useChat } from '../hooks/useChat';
import { Conversation } from '../../domain/entities/Conversation';
import { CircleButton, HeaderBar } from '../components/ui/Primitives';
import { Icon } from '../components/ui/Icon';
import { colors, radius, spacing, type } from '../theme/tokens';

const formatDate = (d: Date) =>
  d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' }) + ' · ' +
  d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

const lastPreview = (c: Conversation) => {
  const last = c.messages[c.messages.length - 1];
  return last?.content || last?.attachments?.[0]?.name || '';
};

/** Historial de conversaciones guardadas en el dispositivo. */
export const HistoryScreen: React.FC = () => {
  const { conversations, openConversation, deleteConversation, newConversation, current } = useChat();

  const open = (c: Conversation) => {
    openConversation(c);
    router.navigate('/chat');
  };

  const confirmDelete = (c: Conversation) => {
    Alert.alert('Eliminar conversación', `¿Eliminar "${c.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteConversation(c.id) },
    ]);
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const active = item.id === current?.id;
    return (
      <Pressable
        onPress={() => open(item)}
        onLongPress={() => confirmDelete(item)}
        accessibilityRole='button'
        accessibilityHint='Mantén presionado para eliminar'
        style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && { opacity: 0.7 }]}
      >
        <View style={styles.avatar}>
          <Icon name='chat_bubble' size={22} color={colors.textStrong} />
        </View>
        <View style={styles.itemBody}>
          <View style={styles.itemMeta}>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          </View>
          <Text style={type.time}>{formatDate(item.updatedAt)}</Text>
          <Text style={styles.preview} numberOfLines={2}>{lastPreview(item)}</Text>
        </View>
        <Pressable onPress={() => confirmDelete(item)} hitSlop={10}
          accessibilityLabel={`Eliminar ${item.title}`}>
          <Icon name='delete' size={22} color={colors.textMuted} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <HeaderBar
        left={<CircleButton icon='arrow_back' accessibilityLabel='Volver'
          onPress={() => router.navigate('/')} />}
        right={<CircleButton icon='add' accessibilityLabel='Nueva conversación'
          onPress={() => { newConversation(); router.navigate('/chat'); }} />}
      />
      <Text style={[type.hero, styles.title]}>Historial</Text>
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          {conversations.length === 1 ? '1 conversación' : `${conversations.length} conversaciones`}
        </Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={c => c.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name='forum' size={48} color={colors.textFaint} />
            <Text style={type.caption}>Aún no tienes conversaciones.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  title: { textAlign: 'center', marginTop: spacing.xl },
  infoBar: {
    marginHorizontal: spacing.screen, marginTop: spacing.xl, padding: 10,
    borderRadius: radius.sm, backgroundColor: colors.cardSubtle, alignItems: 'center',
  },
  infoText: { fontSize: 14, color: colors.accent },
  list: { padding: spacing.screen, paddingBottom: 120, gap: spacing.md },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg,
    padding: spacing.lg, borderRadius: radius.xl,
    backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderSoft,
  },
  itemActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  itemBody: { flex: 1, gap: 4 },
  itemMeta: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  preview: { fontSize: 14, lineHeight: 18, color: colors.textMuted },
  empty: { alignItems: 'center', gap: spacing.md, marginTop: 60 },
});
