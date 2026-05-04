import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import {
  refreshReminderStatus,
} from '../../src/features/reminders/reminder.service';
import type { ReminderItem } from '../../src/features/reminders/reminder.types';
import { reminderRepository } from '../../src/storage/reminder.store';
import { colors } from '../../src/theme/colors';

export default function ItemsScreen() {
  const [items, setItems] = useState<ReminderItem[]>([]);

  const loadItems = useCallback(() => {
    const refreshedItems = reminderRepository.list().map((item) => {
      const refreshed = refreshReminderStatus(item);
      if (refreshed !== item) {
        reminderRepository.upsert(refreshed);
      }
      return refreshed;
    });

    setItems(refreshedItems);
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

  const handleSnooze = async (item: ReminderItem) => {
    await snoozeReminderWithNotifications(item, 1, {
      getNotificationGateway: getExpoNotificationGateway,
      onNotificationError: (error) => {
        if (!isNotificationRuntimeUnavailableError(error)) {
          console.warn('Failed to reschedule reminder notifications', error);
        }
      },
      upsert: reminderRepository.upsert,
    });
    loadItems();
  };

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
                onSnooze={() => handleSnooze(item)}
              />
            ))}
          </View>
        ) : (
          <EmptyState title="还没有临期事项" description="先添加一个会员、账单或证件到期日。" />
        )}
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
