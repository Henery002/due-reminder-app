import { StyleSheet, Text, View } from 'react-native';
import {
  getReminderModeSwitchCopy,
  type ReminderFormVariant,
} from '../features/reminders/reminder.mode';
import type { ReminderMode } from '../features/reminders/reminder.types';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { PressableScale } from './PressableScale';

type ReminderModeSwitchProps = {
  mode: ReminderMode;
  onToggle(): void;
  variant: ReminderFormVariant;
};

export function ReminderModeSwitch({ mode, onToggle, variant }: ReminderModeSwitchProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const copy = getReminderModeSwitchCopy(variant, mode);
  const enabled = mode === 'notify';

  return (
    <PressableScale
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      onPress={onToggle}
    >
      <View style={[styles.card, enabled ? styles.cardActive : null]}>
        <View style={styles.copy}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.description}>{copy.description}</Text>
        </View>
        <View style={[styles.switchTrack, enabled ? styles.switchTrackActive : null]}>
          <View style={[styles.switchThumb, enabled ? styles.switchThumbActive : null]} />
        </View>
      </View>
    </PressableScale>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    card: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing.md,
      justifyContent: 'space-between',
      padding: 14,
    },
    cardActive: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primarySoft,
    },
    copy: {
      flex: 1,
      gap: 3,
    },
    description: {
      color: colors.textSecondary,
      ...typography.helper,
    },
    switchThumb: {
      backgroundColor: colors.textMuted,
      borderRadius: radius.pill,
      height: 22,
      width: 22,
    },
    switchThumbActive: {
      alignSelf: 'flex-end',
      backgroundColor: colors.primary,
    },
    switchTrack: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.pill,
      height: 28,
      justifyContent: 'center',
      paddingHorizontal: 3,
      width: 50,
    },
    switchTrackActive: {
      backgroundColor: colors.primarySoft,
    },
    title: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
  });
}
