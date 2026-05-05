import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from './PressableScale';
import {
  buildReminderSchedulePreview,
  type ReminderSchedulePreviewItem,
} from '../features/reminders/reminder.schedule-preview';
import {
  getDefaultReminderOffsets,
  getReminderOffsetLabel,
  normalizeSelectedReminderOffsets,
} from '../features/reminders/reminder.defaults';
import type { ReminderType } from '../features/reminders/reminder.types';
import { colors } from '../theme/colors';

type ReminderSchedulePreviewProps = {
  dueDate: string;
  selectedOffsets?: readonly number[];
  onToggleOffset?(offsetDays: number): void;
  type: ReminderType;
};

export function ReminderSchedulePreview({
  dueDate,
  onToggleOffset,
  selectedOffsets,
  type,
}: ReminderSchedulePreviewProps) {
  const preview = buildReminderSchedulePreview({ dueDate, selectedOffsets, type });
  const hasItems = preview.items.length > 0;
  const isEditable = Boolean(onToggleOffset);
  const selectedOffsetSet = new Set(normalizeSelectedReminderOffsets(type, selectedOffsets));

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

      {isEditable ? (
        <View style={styles.togglePanel}>
          <View style={styles.toggleGrid}>
            {getDefaultReminderOffsets(type).map((offsetDays) => {
              const selected = selectedOffsetSet.has(offsetDays);

              return (
                <PressableScale
                  key={offsetDays}
                  accessibilityLabel={`切换${getReminderOffsetLabel(offsetDays)}提醒`}
                  containerStyle={styles.toggleChipContainer}
                  onPress={() => onToggleOffset?.(offsetDays)}
                  scaleTo={0.95}
                >
                  <View style={[styles.toggleChip, selected ? styles.toggleChipActive : null]}>
                    <View style={[styles.toggleDot, selected ? styles.toggleDotActive : null]} />
                    <Text style={[styles.toggleLabel, selected ? styles.toggleLabelActive : null]}>
                      {getReminderOffsetLabel(offsetDays)}
                    </Text>
                    <Text style={[styles.toggleState, selected ? styles.toggleStateActive : null]}>
                      {selected ? '开启' : '关闭'}
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
          <Text style={styles.toggleHint}>可关闭不需要的默认提醒点，保存后会按开启项重排。</Text>
        </View>
      ) : null}

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
  toggleChip: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  toggleChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  toggleChipContainer: {
    flexGrow: 1,
  },
  toggleDot: {
    backgroundColor: colors.textMuted,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  toggleDotActive: {
    backgroundColor: colors.primary,
  },
  toggleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  toggleHint: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  toggleLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '900',
  },
  toggleLabelActive: {
    color: colors.primary,
  },
  togglePanel: {
    gap: 9,
  },
  toggleState: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
  },
  toggleStateActive: {
    color: colors.primary,
  },
});
