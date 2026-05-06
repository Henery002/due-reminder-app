import { StyleSheet, Text, View } from 'react-native';
import type { ReminderStatus } from '../features/reminders/reminder.types';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

export function StatusBadge({ label, status }: { label?: string; status: ReminderStatus }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const palette: Record<ReminderStatus, { backgroundColor: string; color: string }> = {
    active: { backgroundColor: colors.primarySoft, color: colors.primary },
    done: { backgroundColor: colors.doneSoft, color: colors.done },
    overdue: { backgroundColor: colors.overdueSoft, color: colors.overdue },
    snoozed: { backgroundColor: colors.dueSoonSoft, color: colors.dueSoon },
  };
  const style = palette[status];

  return (
    <View style={[styles.badge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.text, { color: style.color }]}>{label ?? status}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { radius, typography } = theme;

  return StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      borderRadius: radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    text: {
      ...typography.label,
    },
  });
}
