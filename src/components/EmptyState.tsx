import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';

type EmptyStateProps = {
  accentLabel?: string;
  actionLabel?: string;
  chips?: string[];
  title: string;
  description: string;
  glyph?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  accentLabel,
  actionLabel,
  chips = [],
  description,
  glyph = '·',
  onActionPress,
  title,
}: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      <View style={styles.visualWrap}>
        <View style={styles.orbBack} />
        <View style={styles.orbFront}>
          <IconGlyph color={colors.primary} label={glyph} size={20} />
        </View>
      </View>

      {accentLabel ? <Text style={styles.accentLabel}>{accentLabel}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {chips.length > 0 ? (
        <View style={styles.chips}>
          {chips.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          style={({ pressed }) => [styles.action, pressed ? styles.actionPressed : null]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  accentLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  action: {
    backgroundColor: colors.textPrimary,
    borderRadius: 999,
    marginTop: 2,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  actionPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  actionText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '900',
  },
  chip: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 2,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 290,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    backgroundColor: '#FBFDFB',
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    overflow: 'hidden',
    padding: 24,
  },
  orbBack: {
    backgroundColor: colors.dueSoonSoft,
    borderRadius: 18,
    height: 36,
    left: 22,
    position: 'absolute',
    top: -2,
    transform: [{ rotate: '10deg' }],
    width: 36,
  },
  orbFront: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.surface,
    borderRadius: 18,
    borderWidth: 2,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },
  visualWrap: {
    height: 56,
    width: 72,
  },
});
