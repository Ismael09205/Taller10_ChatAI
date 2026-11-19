import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Message } from '../../domain/entities/Message';
import { Icon } from './ui/Icon';
import { colors, radius, spacing, type } from '../theme/tokens';

interface Props {
  message: Message;
  assistantName: string;
}

const formatTime = (d: Date) =>
  d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

/** Mensaje con el layout de "Share & care": avatar 48, nombre + hora y burbuja. */
export const MessageBubble: React.FC<Props> = ({ message, assistantName }) => {
  const isUser = message.role === 'user';

  const avatar = (
    <View style={[styles.avatar, isUser ? styles.avatarUser : styles.avatarAI]}>
      <Icon name={isUser ? 'person' : 'auto_awesome'} size={24}
        color={isUser ? colors.text : colors.textStrong} />
    </View>
  );

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}>
      {!isUser && avatar}
      <View style={styles.body}>
        <View style={[styles.meta, isUser && styles.metaUser]}>
          <Text style={type.name}>{isUser ? 'Tú' : assistantName}</Text>
          <Text style={type.time}>{formatTime(message.timestamp)}</Text>
        </View>

        {message.attachments?.map(a => (
          <View key={a.id} style={styles.attachment}>
            {a.kind === 'image'
              ? <Image source={{ uri: a.uri }} style={styles.thumb} contentFit='cover' />
              : <Icon name='description' size={20} color={colors.accent} />}
            <Text style={styles.attachmentName} numberOfLines={1}>{a.name}</Text>
          </View>
        ))}

        {message.content ? (
          <View style={styles.bubble}>
            <Text style={type.body} selectable>{message.content}</Text>
          </View>
        ) : null}
      </View>
      {isUser && avatar}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg, marginBottom: 20 },
  rowAI: { paddingRight: 30 },
  rowUser: { paddingLeft: 30 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarAI: { backgroundColor: colors.primary },
  avatarUser: {
    backgroundColor: colors.glass,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
  },
  body: { flex: 1, gap: 9 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaUser: { flexDirection: 'row-reverse' },
  bubble: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  attachment: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSubtle, borderRadius: radius.md, padding: spacing.sm,
  },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  attachmentName: { flex: 1, fontSize: 13, color: colors.textSecondary },
});
