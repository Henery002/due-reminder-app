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
import {
  getReminderModeLabel,
  getReminderStatusLabel,
  getReminderTypeMeta,
} from '../features/reminders/reminder.view';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
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
  const theme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const typeMeta = getReminderTypeMeta(item.type);
  const modeLabel = getReminderModeLabel(item);
  const pressScale = useRef(new Animated.Value(1)).current;
  const canSnooze = item.reminderMode === 'notify' && Boolean(onSnooze);

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
        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Text style={[styles.typeLabel, { color: typeMeta.color }]}>{typeMeta.label}</Text>
            {modeLabel ? (
              <View style={styles.modeBadge}>
                <Text style={styles.modeBadgeText}>{modeLabel}</Text>
              </View>
            ) : null}
          </View>
          <StatusBadge label={getReminderStatusLabel(item)} status={item.status} />
        </View>
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: typeMeta.backgroundColor }]}>
            <IconGlyph color={typeMeta.color} label={typeMeta.glyph} size={18} />
          </View>
          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.title}>
              {item.name}
            </Text>
            <Text style={styles.date}>到期日 {item.dueDate}</Text>
          </View>
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
          {canSnooze ? (
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
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    actionButton: {
      alignItems: 'center',
      borderRadius: radius.pill,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 6,
      minHeight: 34,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    actionPressed: {
      opacity: 0.84,
    },
    actionText: {
      ...typography.label,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    amount: {
      color: colors.textSecondary,
      ...typography.helper,
      marginTop: spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.md,
    },
    cardMotion: {
      elevation: 2,
      shadowColor: colors.cardShadow,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: theme.colorScheme === 'dark' ? 0.14 : 0.05,
      shadowRadius: 10,
    },
    date: {
      color: colors.textSecondary,
      ...typography.helper,
      marginTop: 2,
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
      borderRadius: radius.pill,
      height: 20,
      justifyContent: 'center',
      width: 20,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
    },
    iconWrap: {
      alignItems: 'center',
      borderRadius: radius.md,
      height: 34,
      justifyContent: 'center',
      width: 34,
    },
    metaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    metaLeft: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    modeBadge: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: radius.pill,
      borderWidth: 1,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    modeBadgeText: {
      color: colors.textSecondary,
      ...typography.label,
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
      borderRadius: radius.pill,
      height: 20,
      justifyContent: 'center',
      width: 20,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    titleWrap: {
      flex: 1,
    },
    typeLabel: {
      ...typography.label,
    },
  });
}
