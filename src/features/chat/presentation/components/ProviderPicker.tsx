import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { AIProvider } from '../../domain/entities/AIProvider';
import { Icon } from './ui/Icon';
import { colors, radius, spacing, type } from '../theme/tokens';

interface Props {
  visible: boolean;
  providers: AIProvider[];
  activeId: string;
  exhaustedIds: string[];
  quotaWarning: boolean; // true si se abrió porque el modelo se quedó sin tokens
  onSelect: (providerId: string) => void;
  onClose: () => void;
}

export const ProviderPicker: React.FC<Props> = ({
  visible, providers, activeId, exhaustedIds, quotaWarning, onSelect, onClose,
}) => {
  const available = providers.filter(p => !exhaustedIds.includes(p.id));
  const noneLeft = quotaWarning && available.length === 0;

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <View style={styles.titleRow}>
            <Icon name={quotaWarning ? 'warning' : 'tune'} size={24}
              color={quotaWarning ? colors.danger : colors.accent} />
            <Text style={type.cardTitle}>
              {quotaWarning ? 'Modelo sin tokens' : 'Elegir modelo de IA'}
            </Text>
          </View>
          {quotaWarning && (
            <Text style={styles.subtitle}>
              {noneLeft
                ? 'Todos los modelos configurados se quedaron sin cuota. Agrega otra API key en .env o espera a que se renueve.'
                : 'Elige otro modelo para continuar. Tu último mensaje se reenviará.'}
            </Text>
          )}

          {providers.map(p => {
            const exhausted = exhaustedIds.includes(p.id);
            const active = p.id === activeId;
            return (
              <Pressable
                key={p.id}
                style={[styles.option, active && styles.optionActive,
                  exhausted && styles.optionDisabled]}
                disabled={exhausted}
                onPress={() => onSelect(p.id)}
                accessibilityRole='button'
                accessibilityState={{ selected: active, disabled: exhausted }}
              >
                <View style={styles.optionText}>
                  <Text style={styles.optionName}>{p.name}</Text>
                  <Text style={styles.optionModel}>
                    {p.model}{exhausted ? ' · sin cuota' : ''}
                  </Text>
                </View>
                {active && <Icon name='check_circle' size={22} color={colors.accent} />}
              </Pressable>
            );
          })}

          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityRole='button'>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: spacing.screen,
  },
  card: {
    backgroundColor: colors.background, borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.borderSoft, padding: 20, gap: spacing.md,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  subtitle: { fontSize: 14, lineHeight: 19, color: colors.textMuted },
  option: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.lg, padding: 14,
  },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionDisabled: { opacity: 0.4 },
  optionText: { flex: 1 },
  optionName: { fontSize: 16, fontWeight: '600', color: colors.text },
  optionModel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  closeBtn: { alignSelf: 'flex-end', paddingVertical: 6, paddingHorizontal: spacing.md },
  closeText: { color: colors.accent, fontSize: 14 },
});
