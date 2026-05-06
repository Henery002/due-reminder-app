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
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

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
  const theme = useTheme();
  const styles = createStyles(theme);
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
            <SchedulePreviewRow
              key={`${item.offsetLabel}-${item.dateLabel}`}
              item={item}
              styles={styles}
            />
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

function SchedulePreviewRow({
  item,
  styles,
}: {
  item: ReminderSchedulePreviewItem;
  styles: ReturnType<typeof createStyles>;
}) {
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

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      gap: spacing.md,
      padding: 14,
    },
    countBadge: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    countBadgeActive: {
      backgroundColor: colors.primarySoft,
    },
    countText: {
      color: colors.textMuted,
      ...typography.label,
    },
    countTextActive: {
      color: colors.primary,
    },
    datetime: {
      color: colors.textSecondary,
      ...typography.helper,
      marginTop: 2,
    },
    description: {
      color: colors.textSecondary,
      ...typography.body,
    },
    dot: {
      backgroundColor: colors.primary,
      borderRadius: 4,
      height: 8,
      width: 8,
    },
    dotWrap: {
      alignItems: 'center',
      paddingTop: 6,
      width: 16,
    },
    emptyLine: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    emptyText: {
      color: colors.textMuted,
      textAlign: 'center',
      ...typography.helper,
    },
    eyebrow: {
      color: colors.primary,
      ...typography.label,
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
      minHeight: 16,
      width: 2,
    },
    offset: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    rowBody: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      flex: 1,
      padding: spacing.md,
    },
    timeline: {
      gap: 2,
    },
    title: {
      color: colors.textPrimary,
      marginTop: 2,
      ...typography.cardTitle,
    },
    toggleChip: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: radius.pill,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 7,
      minHeight: 34,
      paddingHorizontal: 10,
      paddingVertical: 7,
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
      gap: spacing.sm,
    },
    toggleHint: {
      color: colors.textMuted,
      ...typography.label,
    },
    toggleLabel: {
      color: colors.textSecondary,
      ...typography.label,
    },
    toggleLabelActive: {
      color: colors.primary,
    },
    togglePanel: {
      gap: spacing.sm,
    },
    toggleState: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '500',
      lineHeight: 15,
    },
    toggleStateActive: {
      color: colors.primary,
    },
  });
}
