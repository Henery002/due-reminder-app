import { StyleSheet, Text } from 'react-native';
import { getSubmitActionState } from '../features/reminders/reminder.submit';
import { colors } from '../theme/colors';
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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 15,
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
