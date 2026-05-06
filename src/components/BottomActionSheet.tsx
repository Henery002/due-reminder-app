import { StyleSheet, Text, View } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { PressableScale } from './PressableScale';

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
        <PressableScale key={action.label} onPress={action.onPress} scaleTo={0.98}>
          <View style={styles.action}>
            <Text style={styles.actionText}>{action.label}</Text>
            {action.description ? (
              <Text style={styles.actionDescription}>{action.description}</Text>
            ) : null}
          </View>
        </PressableScale>
      ))}
      {onCancel ? (
        <PressableScale onPress={onCancel} scaleTo={0.98}>
          <View style={styles.cancelAction}>
            <Text style={styles.cancelText}>先不延后</Text>
          </View>
        </PressableScale>
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
      paddingHorizontal: spacing.md,
      paddingVertical: 11,
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
      padding: 8,
    },
    cancelText: {
      color: colors.textSecondary,
      ...typography.bodyStrong,
    },
    sheet: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing.sm,
      padding: spacing.md,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
