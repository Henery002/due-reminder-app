import { StyleSheet, Text, View } from 'react-native';
import {
  buildReminderSchedulePreview,
  type ReminderSchedulePreviewItem,
} from '../features/reminders/reminder.schedule-preview';
import type { ReminderType } from '../features/reminders/reminder.types';
import { colors } from '../theme/colors';

type ReminderSchedulePreviewProps = {
  dueDate: string;
  type: ReminderType;
};

export function ReminderSchedulePreview({ dueDate, type }: ReminderSchedulePreviewProps) {
  const preview = buildReminderSchedulePreview({ dueDate, type });
  const hasItems = preview.items.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>本地通知</Text>
          <Text style={styles.title}>{preview.title}</Text>
        </View>
        <View style={[styles.countBadge, hasItems ? styles.countBadgeActive : null]}>
          <Text style={[styles.countText, hasItems ? styles.countTextActive : null]}>
            {preview.items.length} 次
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{preview.description}</Text>

      {hasItems ? (
        <View style={styles.timeline}>
          {preview.items.map((item) => (
            <SchedulePreviewRow key={`${item.offsetLabel}-${item.dateLabel}`} item={item} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyLine}>
          <Text style={styles.emptyText}>不会安排新的未来提醒</Text>
        </View>
      )}
    </View>
  );
}

function SchedulePreviewRow({ item }: { item: ReminderSchedulePreviewItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.dotWrap}>
        <View style={styles.dot} />
        <View style={styles.line} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.offset}>{item.offsetLabel}</Text>
        <Text style={styles.datetime}>
          {item.dateLabel} · {item.timeLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 13,
    padding: 15,
  },
  countBadge: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  countBadgeActive: {
    backgroundColor: colors.primarySoft,
  },
  countText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  countTextActive: {
    color: colors.primary,
  },
  datetime: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  dot: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  dotWrap: {
    alignItems: 'center',
    paddingTop: 5,
    width: 18,
  },
  emptyLine: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 13,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    backgroundColor: colors.border,
    flex: 1,
    marginTop: 4,
    minHeight: 18,
    width: 2,
  },
  offset: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowBody: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    flex: 1,
    padding: 12,
  },
  timeline: {
    gap: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },
});
