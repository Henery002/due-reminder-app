import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  buildReminderMonthCalendar,
  getReminderDateDescription,
  getReminderDateQuickOptions,
  shiftReminderDate,
  type ReminderDateUnit,
} from '../features/reminders/reminder.date';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

type ReminderDatePickerProps = {
  value: string;
  onChange(value: string): void;
};

const controls: Array<{ label: string; unit: ReminderDateUnit }> = [
  { label: '年', unit: 'year' },
  { label: '月', unit: 'month' },
  { label: '日', unit: 'day' },
];

export function ReminderDatePicker({ value, onChange }: ReminderDatePickerProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const quickOptions = getReminderDateQuickOptions();
  const calendar = buildReminderMonthCalendar(value);

  return (
    <View style={styles.card}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>到期日期</Text>
        <Text style={styles.heroDate}>{value}</Text>
        <Text style={styles.heroMeta}>{getReminderDateDescription(value)}</Text>
      </View>

      <View style={styles.quickGrid}>
        {quickOptions.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.label}
              onPress={() => onChange(option.value)}
              style={[styles.quickButton, selected ? styles.quickButtonSelected : null]}
            >
              <Text style={[styles.quickText, selected ? styles.quickTextSelected : null]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.calendar}>
        <Text style={styles.calendarTitle}>{calendar.title}</Text>
        <View style={styles.weekRow}>
          {calendar.weekdays.map((weekday) => (
            <Text key={weekday} style={styles.weekday}>
              {weekday}
            </Text>
          ))}
        </View>
        <View style={styles.dayGrid}>
          {calendar.days.map((day) => {
            return (
              <Pressable
                key={day.value}
                onPress={() => onChange(day.value)}
                style={[
                  styles.dayButton,
                  day.isSelected ? styles.dayButtonSelected : null,
                  day.isToday && !day.isSelected ? styles.dayButtonToday : null,
                  !day.isCurrentMonth ? styles.dayButtonMuted : null,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    day.isSelected ? styles.dayTextSelected : null,
                    !day.isCurrentMonth || day.isPast ? styles.dayTextMuted : null,
                  ]}
                >
                  {day.dayLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.controls}>
        {controls.map((control) => (
          <View key={control.unit} style={styles.controlRow}>
            <Text style={styles.controlLabel}>{control.label}</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => onChange(shiftReminderDate(value, control.unit, -1))}
                style={styles.stepButton}
              >
                <Text style={styles.stepText}>-</Text>
              </Pressable>
              <Pressable
                onPress={() => onChange(shiftReminderDate(value, control.unit, 1))}
                style={styles.stepButton}
              >
                <Text style={styles.stepText}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    calendar: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      gap: spacing.sm,
      padding: spacing.md,
    },
    calendarTitle: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing.md,
      overflow: 'hidden',
      padding: 14,
    },
    controlLabel: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
    controlRow: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      flex: 1,
      gap: spacing.sm,
      padding: 10,
    },
    controls: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    dayButton: {
      alignItems: 'center',
      aspectRatio: 1,
      borderRadius: radius.md,
      justifyContent: 'center',
      width: '13.2%',
    },
    dayButtonMuted: {
      opacity: 0.5,
    },
    dayButtonSelected: {
      backgroundColor: colors.primary,
    },
    dayButtonToday: {
      backgroundColor: colors.primarySoft,
    },
    dayGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    dayText: {
      color: colors.textPrimary,
      ...typography.label,
    },
    dayTextMuted: {
      color: colors.textMuted,
    },
    dayTextSelected: {
      color: colors.surface,
    },
    hero: {
      backgroundColor: colors.primarySoft,
      borderRadius: radius.lg,
      gap: spacing.xs,
      padding: spacing.lg,
    },
    heroDate: {
      color: colors.textPrimary,
      fontSize: 24,
      fontWeight: '700',
      letterSpacing: -0.3,
      lineHeight: 31,
    },
    heroLabel: {
      color: colors.primary,
      ...typography.label,
    },
    heroMeta: {
      color: colors.textSecondary,
      ...typography.body,
    },
    quickButton: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: radius.pill,
      borderWidth: 1,
      minHeight: 32,
      paddingHorizontal: spacing.md,
      paddingVertical: 7,
    },
    quickButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    quickText: {
      color: colors.textSecondary,
      ...typography.label,
    },
    quickTextSelected: {
      color: colors.surface,
    },
    stepButton: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 7,
    },
    stepper: {
      flexDirection: 'row',
      gap: 6,
      width: '100%',
    },
    stepText: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
    },
    weekday: {
      color: colors.textMuted,
      flex: 1,
      textAlign: 'center',
      ...typography.label,
    },
    weekRow: {
      flexDirection: 'row',
    },
  });
}
