import { StyleSheet, Text } from 'react-native';
import { getSubmitActionState } from '../features/reminders/reminder.submit';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { PressableScale } from './PressableScale';

type SubmitActionButtonProps = {
  disabled?: boolean;
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  onPress?: () => void;
  variant?: 'primary' | 'danger' | 'secondary';
};

export function SubmitActionButton({
  disabled,
  label,
  loading,
  loadingLabel,
  onPress,
  variant = 'primary',
}: SubmitActionButtonProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const state = getSubmitActionState({ disabled, label, loading, loadingLabel });

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ busy: Boolean(loading), disabled: state.disabled }}
      disabled={state.disabled}
      onPress={onPress}
      scaleTo={0.985}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !state.disabled ? styles.pressed : null,
        state.disabled ? styles.disabled : null,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'danger' ? styles.dangerText : null,
          variant === 'secondary' ? styles.secondaryText : null,
        ]}
      >
        {state.label}
      </Text>
    </PressableScale>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, sizes, spacing, typography } = theme;

  return StyleSheet.create({
    button: {
      alignItems: 'center',
      borderRadius: radius.lg,
      justifyContent: 'center',
      minHeight: sizes.buttonHeight,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
    },
    danger: {
      backgroundColor: colors.surface,
      borderColor: colors.overdue,
      borderWidth: 1,
    },
    dangerText: {
      color: colors.overdue,
    },
    disabled: {
      opacity: 0.58,
    },
    pressed: {
      opacity: 0.86,
      transform: [{ scale: 0.985 }],
    },
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.surfaceMuted,
    },
    secondaryText: {
      color: colors.textPrimary,
    },
    text: {
      color: colors.surface,
      ...typography.bodyStrong,
      textAlign: 'center',
    },
  });
}
