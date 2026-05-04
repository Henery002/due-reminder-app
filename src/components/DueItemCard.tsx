import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import type { ReminderItem } from '../features/reminders/reminder.types';
import { getReminderStatusLabel, getReminderTypeMeta } from '../features/reminders/reminder.view';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';
import { StatusBadge } from './StatusBadge';

type DueItemCardProps = {
  item: ReminderItem;
  onDone?: () => void;
  onPress?: () => void;
  onSnooze?: () => void;
};

export function DueItemCard({ item, onDone, onPress, onSnooze }: DueItemCardProps) {
  const typeMeta = getReminderTypeMeta(item.type);

  const handleActionPress = (event: GestureResponderEvent, action?: () => void) => {
    event.stopPropagation();
    action?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.pressed : null]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: typeMeta.backgroundColor }]}>
          <IconGlyph color={typeMeta.color} label={typeMeta.glyph} size={18} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={[styles.typeLabel, { color: typeMeta.color }]}>{typeMeta.label}</Text>
          <Text numberOfLines={1} style={styles.title}>
            {item.name}
          </Text>
          <Text style={styles.date}>到期日 {item.dueDate}</Text>
        </View>
        <StatusBadge label={getReminderStatusLabel(item)} status={item.status} />
      </View>

      {typeof item.amount === 'number' ? (
        <Text style={styles.amount}>金额 ¥{item.amount.toFixed(2)}</Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable onPress={(event) => handleActionPress(event, onDone)} style={styles.actionButton}>
          <IconGlyph label="✓" size={16} tone="done" />
          <Text style={styles.actionText}>已处理</Text>
        </Pressable>
        <Pressable
          onPress={(event) => handleActionPress(event, onSnooze)}
          style={styles.actionButton}
        >
          <IconGlyph label="+" size={16} tone="dueSoon" />
          <Text style={styles.actionText}>延后</Text>
        </Pressable>
      </View>
    </Pressable>
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
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  pressed: {
    opacity: 0.86,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  titleWrap: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 2,
  },
});
