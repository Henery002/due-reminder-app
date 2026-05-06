import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
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
  const theme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;

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

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    accentLabel: {
      color: colors.primary,
      letterSpacing: 0.3,
      ...typography.label,
    },
    action: {
      backgroundColor: colors.textPrimary,
      borderRadius: radius.pill,
      marginTop: 2,
      minHeight: 40,
      paddingHorizontal: spacing.md,
      paddingVertical: 9,
    },
    actionPressed: {
      opacity: 0.82,
      transform: [{ scale: 0.98 }],
    },
    actionText: {
      color: colors.surface,
      ...typography.bodyStrong,
    },
    chip: {
      backgroundColor: colors.primarySoft,
      borderRadius: radius.pill,
      paddingHorizontal: 9,
      paddingVertical: 6,
    },
    chipText: {
      color: colors.primary,
      ...typography.label,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      justifyContent: 'center',
      marginTop: 2,
    },
    description: {
      color: colors.textSecondary,
      maxWidth: 290,
      textAlign: 'center',
      ...typography.body,
    },
    empty: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing.sm,
      overflow: 'hidden',
      padding: spacing.lg,
    },
    orbBack: {
      backgroundColor: colors.dueSoonSoft,
      borderRadius: radius.lg,
      height: 34,
      left: 22,
      position: 'absolute',
      top: -2,
      transform: [{ rotate: '10deg' }],
      width: 34,
    },
    orbFront: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 2,
      height: 50,
      justifyContent: 'center',
      width: 50,
    },
    title: {
      color: colors.textPrimary,
      textAlign: 'center',
      ...typography.cardTitle,
    },
    visualWrap: {
      height: 54,
      width: 70,
    },
  });
}
