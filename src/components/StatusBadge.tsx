import { StyleSheet, Text, View } from 'react-native';
import type { ReminderStatus } from '../features/reminders/reminder.types';
import { colors } from '../theme/colors';

const labels: Record<ReminderStatus, string> = {
  active: '进行中',
  done: '已处理',
  overdue: '已逾期',
  snoozed: '已延后',
};

const palette: Record<ReminderStatus, { backgroundColor: string; color: string }> = {
  active: { backgroundColor: colors.primarySoft, color: colors.primary },
  done: { backgroundColor: colors.doneSoft, color: colors.done },
  overdue: { backgroundColor: colors.overdueSoft, color: colors.overdue },
  snoozed: { backgroundColor: colors.dueSoonSoft, color: colors.dueSoon },
};

export function StatusBadge({ status }: { status: ReminderStatus }) {
  const style = palette[status];

  return (
    <View style={[styles.badge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.text, { color: style.color }]}>{labels[status]}</Text>
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
