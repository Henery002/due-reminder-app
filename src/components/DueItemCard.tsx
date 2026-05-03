import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReminderItem } from '../features/reminders/reminder.types';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';
import { StatusBadge } from './StatusBadge';

type DueItemCardProps = {
  item: ReminderItem;
  onDone?: () => void;
  onSnooze?: () => void;
};

export function DueItemCard({ item, onDone, onSnooze }: DueItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <IconGlyph label="D" size={18} />
        </View>
        <View style={styles.titleWrap}>
          <Text numberOfLines={1} style={styles.title}>
            {item.name}
          </Text>
          <Text style={styles.date}>到期日 {item.dueDate}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {typeof item.amount === 'number' ? (
        <Text style={styles.amount}>金额 ¥{item.amount.toFixed(2)}</Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable onPress={onDone} style={styles.actionButton}>
          <IconGlyph label="✓" size={16} tone="done" />
          <Text style={styles.actionText}>已处理</Text>
        </Pressable>
        <Pressable onPress={onSnooze} style={styles.actionButton}>
          <IconGlyph label="+" size={16} tone="dueSoon" />
          <Text style={styles.actionText}>延后</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  amount: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  titleWrap: {
    flex: 1,
  },
});
