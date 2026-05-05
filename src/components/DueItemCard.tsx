import { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import type { ReminderItem } from '../features/reminders/reminder.types';
import { getReminderStatusLabel, getReminderTypeMeta } from '../features/reminders/reminder.view';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';
import { PressableScale } from './PressableScale';
import { StatusBadge } from './StatusBadge';

type DueItemCardProps = {
  item: ReminderItem;
  onDone?: () => void;
  onPress?: () => void;
  onSnooze?: () => void;
};

export function DueItemCard({ item, onDone, onPress, onSnooze }: DueItemCardProps) {
  const typeMeta = getReminderTypeMeta(item.type);
  const pressScale = useRef(new Animated.Value(1)).current;

  const handleActionPress = (event: GestureResponderEvent, action?: () => void) => {
    event.stopPropagation();
    action?.();
  };

  const animatePress = (toValue: number) => {
    Animated.spring(pressScale, {
      damping: 16,
      mass: 0.6,
      stiffness: 260,
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardMotion, { transform: [{ scale: pressScale }] }]}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={() => animatePress(0.985)}
        onPressOut={() => animatePress(1)}
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
          <PressableScale
            onPress={(event) => handleActionPress(event, onDone)}
            scaleTo={0.94}
            style={({ pressed }) => [
              styles.actionButton,
              styles.doneAction,
              pressed ? styles.actionPressed : null,
            ]}
          >
            <View style={styles.doneIconPuck}>
              <IconGlyph color={colors.done} label="✓" size={15} />
            </View>
            <Text style={[styles.actionText, styles.doneActionText]}>已处理</Text>
          </PressableScale>
          <PressableScale
            onPress={(event) => handleActionPress(event, onSnooze)}
            scaleTo={0.94}
            style={({ pressed }) => [
              styles.actionButton,
              styles.snoozeAction,
              pressed ? styles.actionPressed : null,
            ]}
          >
            <View style={styles.snoozeIconPuck}>
              <IconGlyph color={colors.dueSoon} label="+" size={15} />
            </View>
            <Text style={[styles.actionText, styles.snoozeActionText]}>延后</Text>
          </PressableScale>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  actionPressed: {
    opacity: 0.84,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '900',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  doneAction: {
    backgroundColor: colors.doneSoft,
    borderColor: colors.doneSoft,
  },
  doneActionText: {
    color: colors.done,
  },
  doneIconPuck: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  amount: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
  },
  cardMotion: {
    elevation: 2,
    shadowColor: '#1F2A2A',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
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
    borderRadius: 13,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  pressed: {
    borderColor: colors.primarySoft,
    opacity: 0.94,
  },
  snoozeAction: {
    backgroundColor: colors.dueSoonSoft,
    borderColor: colors.dueSoonSoft,
  },
  snoozeActionText: {
    color: colors.dueSoon,
  },
  snoozeIconPuck: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    width: 24,
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
