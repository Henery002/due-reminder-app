import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  buildReminderMonthCalendar,
  getReminderDateDescription,
  getReminderDateQuickOptions,
} from '../features/reminders/reminder.date';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

type ReminderDatePickerProps = {
  value: string;
  onChange(value: string): void;
};

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
          {calendar.weeks.map((week) => (
            <View key={week.map((day) => day.value).join('-')} style={styles.weekGridRow}>
              {week.map((day) => (
                <Pressable
                  key={day.value}
                  onPress={() => onChange(day.value)}
                  style={[
                    styles.dayButton,
                    !day.isCurrentMonth ? styles.dayButtonMuted : null,
                    day.isToday && !day.isSelected ? styles.dayButtonToday : null,
                    day.isSelected ? styles.dayButtonSelected : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !day.isCurrentMonth || day.isPast ? styles.dayTextMuted : null,
                      day.isSelected ? styles.dayTextSelected : null,
                    ]}
                  >
                    {day.dayLabel}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
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
      gap: 10,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
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
    dayButton: {
      alignItems: 'center',
      aspectRatio: 1,
      borderRadius: radius.pill,
      flex: 1,
      justifyContent: 'center',
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
      gap: 6,
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
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      gap: spacing.xs,
      padding: spacing.md,
    },
    heroDate: {
      color: colors.textPrimary,
      ...typography.cardTitle,
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
      backgroundColor: colors.primarySoft,
      borderColor: colors.primarySoft,
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
      color: colors.primary,
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
    weekGridRow: {
      flexDirection: 'row',
      gap: 6,
    },
  });
}
