import { StyleSheet, Text } from 'react-native';
import {
  getReminderSaveSummary,
  type ReminderSchedulePreview,
} from '../features/reminders/reminder.schedule-preview';
import type { ReminderMode } from '../features/reminders/reminder.types';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

type ReminderSaveSummaryProps = {
  mode: ReminderMode;
  preview: ReminderSchedulePreview;
};

export function ReminderSaveSummary({ mode, preview }: ReminderSaveSummaryProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return <Text style={styles.summary}>{getReminderSaveSummary(preview, mode)}</Text>;
}

function createStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;

  return StyleSheet.create({
    summary: {
      color: colors.textSecondary,
      marginTop: -spacing.sm,
      textAlign: 'center',
      ...typography.helper,
    },
  });
}
