import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomActionSheet } from '../../src/components/BottomActionSheet';
import { DueItemCard } from '../../src/components/DueItemCard';
import { EmptyState } from '../../src/components/EmptyState';
import {
  getExpoNotificationGateway,
  isNotificationRuntimeUnavailableError,
} from '../../src/features/notifications/expo-notification.gateway';
import {
  completeReminderWithNotifications,
  snoozeReminderWithNotifications,
} from '../../src/features/reminders/reminder.actions';
import { getReminderEmptyStateContent } from '../../src/features/reminders/reminder.empty-state';
import { refreshReminderList } from '../../src/features/reminders/reminder.lifecycle';
import { getSnoozeOptions } from '../../src/features/reminders/reminder.snooze';
import type { ReminderItem } from '../../src/features/reminders/reminder.types';
import { reminderRepository } from '../../src/storage/reminder.store';
import { colors } from '../../src/theme/colors';

export default function ItemsScreen() {
  const [items, setItems] = useState<ReminderItem[]>([]);
  const [snoozeTarget, setSnoozeTarget] = useState<ReminderItem | null>(null);

  const loadItems = useCallback(() => {
    setItems(
      refreshReminderList(reminderRepository.list(), {
        upsert: reminderRepository.upsert,
      }),
    );
  }, []);

  useFocusEffect(loadItems);

  const handleDone = async (item: ReminderItem) => {
    await completeReminderWithNotifications(item, {
      getNotificationGateway: getExpoNotificationGateway,
      onNotificationError: (error) => {
        if (!isNotificationRuntimeUnavailableError(error)) {
          console.warn('Failed to cancel reminder notifications', error);
        }
      },
      upsert: reminderRepository.upsert,
    });
    loadItems();
  };

  const handleSnooze = async (item: ReminderItem, days: number) => {
    await snoozeReminderWithNotifications(item, days, {
      getNotificationGateway: getExpoNotificationGateway,
      onNotificationError: (error) => {
        if (!isNotificationRuntimeUnavailableError(error)) {
          console.warn('Failed to reschedule reminder notifications', error);
        }
      },
      upsert: reminderRepository.upsert,
    });
    setSnoozeTarget(null);
    loadItems();
  };

  const emptyContent = getReminderEmptyStateContent('items-empty');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>全部事项</Text>
          <Text style={styles.subtitle}>管理所有订阅、账单和证件到期日。</Text>
        </View>

        {items.length > 0 ? (
          <View style={styles.list}>
            {items.map((item) => (
              <DueItemCard
                key={item.id}
                item={item}
                onDone={() => handleDone(item)}
                onPress={() => router.push(`/item/${item.id}`)}
                onSnooze={() => setSnoozeTarget(item)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            accentLabel={emptyContent.accentLabel}
            actionLabel="添加第一件事"
            chips={emptyContent.chips}
            description={emptyContent.description}
            glyph={emptyContent.glyph}
            onActionPress={() => router.push('/item/new')}
            title={emptyContent.title}
          />
        )}
        {snoozeTarget ? (
          <BottomActionSheet
            actions={getSnoozeOptions().map((option) => ({
              description: option.description,
              label: option.label,
              onPress: () => handleSnooze(snoozeTarget, option.days),
            }))}
            onCancel={() => setSnoozeTarget(null)}
            title={`延后「${snoozeTarget.name}」`}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 36,
  },
  list: {
    gap: 12,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
});
