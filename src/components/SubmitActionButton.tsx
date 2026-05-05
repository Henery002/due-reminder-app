import { Pressable, StyleSheet, Text } from 'react-native';
import { getSubmitActionState } from '../features/reminders/reminder.submit';
import { colors } from '../theme/colors';

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
  const state = getSubmitActionState({ disabled, label, loading, loadingLabel });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: Boolean(loading), disabled: state.disabled }}
      disabled={state.disabled}
      onPress={onPress}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 15,
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
    transform: [{ scale: 0.99 }],
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
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
});
