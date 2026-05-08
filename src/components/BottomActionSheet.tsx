import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { getBottomActionSheetBottomPadding } from './bottom-action-sheet.layout';
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
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const bottomPadding = getBottomActionSheetBottomPadding(insets.bottom);

  return (
    <Modal animationType="fade" onRequestClose={onCancel} transparent visible>
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="关闭操作面板"
          onPress={onCancel}
          style={styles.backdrop}
        />
        <View style={[styles.sheetWrap, { paddingBottom: bottomPadding }]}>
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
        </View>
      </View>
    </Modal>
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
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(15, 23, 23, 0.22)',
    },
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing.sm,
      padding: spacing.md,
    },
    sheetWrap: {
      paddingHorizontal: spacing.md,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
