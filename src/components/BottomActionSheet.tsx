import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

type BottomActionSheetProps = {
  actions: Array<{
    description?: string;
    label: string;
    onPress: () => void;
  }>;
  onCancel?: () => void;
  title: string;
};

export function BottomActionSheet({ title, actions, onCancel }: BottomActionSheetProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>{title}</Text>
      {actions.map((action) => (
        <Pressable key={action.label} onPress={action.onPress} style={styles.action}>
          <Text style={styles.actionText}>{action.label}</Text>
          {action.description ? (
            <Text style={styles.actionDescription}>{action.description}</Text>
          ) : null}
        </Pressable>
      ))}
      {onCancel ? (
        <Pressable onPress={onCancel} style={styles.cancelAction}>
          <Text style={styles.cancelText}>先不延后</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    action: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      gap: spacing.xs,
      padding: spacing.md,
    },
    actionDescription: {
      color: colors.textSecondary,
      ...typography.helper,
    },
    actionText: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    cancelAction: {
      alignItems: 'center',
      padding: 10,
    },
    cancelText: {
      color: colors.textSecondary,
      ...typography.bodyStrong,
    },
    sheet: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      gap: spacing.sm,
      padding: spacing.lg,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
