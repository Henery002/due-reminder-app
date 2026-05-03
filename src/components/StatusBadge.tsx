import { StyleSheet, Text, View } from 'react-native';
import type { ReminderStatus } from '../features/reminders/reminder.types';
import { colors } from '../theme/colors';

const palette: Record<ReminderStatus, { backgroundColor: string; color: string }> = {
  active: { backgroundColor: colors.primarySoft, color: colors.primary },
  done: { backgroundColor: colors.doneSoft, color: colors.done },
  overdue: { backgroundColor: colors.overdueSoft, color: colors.overdue },
  snoozed: { backgroundColor: colors.dueSoonSoft, color: colors.dueSoon },
};

export function StatusBadge({ label, status }: { label?: string; status: ReminderStatus }) {
  const style = palette[status];

  return (
    <View style={[styles.badge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.text, { color: style.color }]}>{label ?? status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
