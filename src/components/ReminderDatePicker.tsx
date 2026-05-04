import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  getReminderDateDescription,
  getReminderDateQuickOptions,
  shiftReminderDate,
  type ReminderDateUnit,
} from '../features/reminders/reminder.date';
import { colors } from '../theme/colors';

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
  const quickOptions = getReminderDateQuickOptions();

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    overflow: 'hidden',
    padding: 14,
  },
  controlLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  controlRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    flex: 1,
    gap: 10,
    padding: 10,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
  },
  hero: {
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    gap: 5,
    padding: 16,
  },
  heroDate: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroLabel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  heroMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  quickButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  quickButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  quickText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  quickTextSelected: {
    color: colors.surface,
  },
  stepButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  stepper: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  stepText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
});
