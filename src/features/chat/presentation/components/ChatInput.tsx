import React, { useState } from 'react';
import {
  View, TextInput, Pressable, Text, StyleSheet, ScrollView,
} from 'react-native';
import { Attachment, AttachmentKind } from '../../domain/entities/Attachment';
import { Icon } from './ui/Icon';
import { colors, radius, spacing } from '../theme/tokens';

interface Props {
  disabled: boolean;
  attachments: Attachment[];
  onSend: (text: string) => void;
  onPickAttachment: (kind: AttachmentKind) => void;
  onRemoveAttachment: (id: string) => void;
}

/** Campo de mensaje tipo "pill" (#0E1113, borde 0.4) con adjuntar y enviar. */
export const ChatInput: React.FC<Props> = ({
  disabled, attachments, onSend, onPickAttachment, onRemoveAttachment,
}) => {
  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const canSend = !disabled && (text.trim().length > 0 || attachments.length > 0);

  const handleSend = () => {
    if (!canSend) return;
    onSend(text);
    setText('');
  };

  const pick = (kind: AttachmentKind) => {
    setMenuOpen(false);
    onPickAttachment(kind);
  };

  return (
    <View style={styles.wrapper}>
      {attachments.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          {attachments.map(a => (
            <View key={a.id} style={styles.chip}>
              <Icon name={a.kind === 'image' ? 'image' : 'description'} size={18}
                color={colors.accent} />
              <Text style={styles.chipText} numberOfLines={1}>{a.name}</Text>
              <Pressable onPress={() => onRemoveAttachment(a.id)} hitSlop={8}
                accessibilityLabel={`Quitar ${a.name}`}>
                <Icon name='close' size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {menuOpen && (
        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={() => pick('image')}>
            <Icon name='image' size={22} color={colors.accent} />
            <Text style={styles.menuText}>Imagen</Text>
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable style={styles.menuItem} onPress={() => pick('document')}>
            <Icon name='description' size={22} color={colors.accent} />
            <Text style={styles.menuText}>Documento (PDF o texto)</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.bar}>
        <Pressable
          onPress={() => setMenuOpen(o => !o)}
          disabled={disabled}
          hitSlop={8}
          accessibilityLabel='Adjuntar archivo'
          style={[styles.iconBtn, disabled && styles.disabled]}
        >
          <Icon name={menuOpen ? 'close' : 'attach_file'} size={22} color={colors.textMuted} />
        </Pressable>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder='Escribe un mensaje...'
          placeholderTextColor={colors.textFaint}
          multiline
          editable={!disabled}
        />
        <Pressable
          onPress={handleSend}
          disabled={!canSend}
          accessibilityLabel='Enviar mensaje'
          style={[styles.send, !canSend && styles.disabled]}
        >
          <Icon name='send' size={16} color={colors.textStrong} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: spacing.screen, paddingBottom: spacing.md, gap: spacing.sm },
  chips: { gap: spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: 220,
    backgroundColor: colors.card, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: 6,
  },
  chipText: { fontSize: 13, color: colors.textSecondary, flexShrink: 1 },
  menu: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.borderSoft, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg, paddingVertical: 14,
  },
  menuText: { fontSize: 15, color: colors.text },
  menuDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
  bar: {
    flexDirection: 'row', alignItems: 'center',
    minHeight: 64, borderRadius: 32,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
    paddingLeft: spacing.md, paddingRight: spacing.md, gap: spacing.sm,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1, maxHeight: 120, fontSize: 14, color: colors.textStrong,
    paddingVertical: 12,
  },
  send: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
});
