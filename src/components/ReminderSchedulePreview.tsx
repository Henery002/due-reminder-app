import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PressableScale } from './PressableScale';
import {
  buildReminderSchedulePreview,
  type ReminderSchedulePreviewItem,
} from '../features/reminders/reminder.schedule-preview';
import {
  MAX_CUSTOM_REMINDER_OFFSET_DAYS,
  getDefaultReminderOffsets,
  getReminderOffsetLabel,
  normalizeSelectedReminderOffsets,
} from '../features/reminders/reminder.defaults';
import type { ReminderType } from '../features/reminders/reminder.types';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

type ReminderSchedulePreviewProps = {
  dueDate: string;
  selectedOffsets?: readonly number[];
  onAddCustomOffset?(offsetDays: number): void;
  onToggleOffset?(offsetDays: number): void;
  type: ReminderType;
};

export function ReminderSchedulePreview({
  dueDate,
  onAddCustomOffset,
  onToggleOffset,
  selectedOffsets,
  type,
}: ReminderSchedulePreviewProps) {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const [customOffsetText, setCustomOffsetText] = useState('');
  const preview = buildReminderSchedulePreview({ dueDate, selectedOffsets, type });
  const hasItems = preview.items.length > 0;
  const isEditable = Boolean(onToggleOffset);
  const selectedOffsetSet = new Set(normalizeSelectedReminderOffsets(type, selectedOffsets));
  const defaultOffsetSet = new Set(getDefaultReminderOffsets(type));
  const visibleOffsets = normalizeSelectedReminderOffsets(type, [
    ...getDefaultReminderOffsets(type),
    ...(selectedOffsets ?? []),
  ]);

  const handleAddCustomOffset = () => {
    const offsetDays = Number(customOffsetText.trim());
    if (
      !Number.isInteger(offsetDays) ||
      offsetDays < 0 ||
      offsetDays > MAX_CUSTOM_REMINDER_OFFSET_DAYS
    ) {
      return;
    }

    onAddCustomOffset?.(offsetDays);
    setCustomOffsetText('');
  };

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
            {visibleOffsets.map((offsetDays) => {
              const selected = selectedOffsetSet.has(offsetDays);
              const custom = !defaultOffsetSet.has(offsetDays);

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
                      {custom ? '自定义' : selected ? '开启' : '关闭'}
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
          <View style={styles.customRow}>
            <TextInput
              keyboardType="number-pad"
              maxLength={3}
              onChangeText={setCustomOffsetText}
              placeholder="自定义天数"
              placeholderTextColor={colors.textMuted}
              style={styles.customInput}
              value={customOffsetText}
            />
            <PressableScale containerStyle={styles.customButtonWrap} onPress={handleAddCustomOffset}>
              <View style={styles.customButton}>
                <Text style={styles.customButtonText}>添加</Text>
              </View>
            </PressableScale>
          </View>
          <Text style={styles.toggleHint}>
            可关闭默认提醒点，也可添加 0-{MAX_CUSTOM_REMINDER_OFFSET_DAYS} 天内的自定义提醒。
          </Text>
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
    customButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      justifyContent: 'center',
      minHeight: 36,
      paddingHorizontal: spacing.md,
    },
    customButtonText: {
      color: colors.surface,
      ...typography.label,
    },
    customButtonWrap: {
      alignSelf: 'stretch',
    },
    customInput: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: radius.pill,
      borderWidth: 1,
      color: colors.textPrimary,
      flex: 1,
      minHeight: 36,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
      ...typography.label,
    },
    customRow: {
      flexDirection: 'row',
      gap: spacing.sm,
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
