import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomActionSheet } from '../../src/components/BottomActionSheet';
import { CategoryPill } from '../../src/components/CategoryPill';
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
import {
  getVisibleAllReminders,
  type ReminderStatusFilter,
  type ReminderTypeFilter,
} from '../../src/features/reminders/reminder.view';
import { reminderRepository } from '../../src/storage/reminder.store';
import { colors } from '../../src/theme/colors';

const typeFilterOptions: Array<{ label: string; value: ReminderTypeFilter }> = [
  { label: '全部', value: 'all' },
  { label: '订阅', value: 'subscription' },
  { label: '账单', value: 'bill' },
  { label: '证件', value: 'document' },
];

const statusFilterOptions: Array<{ label: string; value: ReminderStatusFilter }> = [
  { label: '全部状态', value: 'all' },
  { label: '未处理', value: 'pending' },
  { label: '已逾期', value: 'overdue' },
  { label: '已延后', value: 'snoozed' },
  { label: '已处理', value: 'done' },
];

export default function ItemsScreen() {
  const [items, setItems] = useState<ReminderItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ReminderStatusFilter>('all');
  const [selectedType, setSelectedType] = useState<ReminderTypeFilter>('all');
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
  const filteredEmptyContent = getReminderEmptyStateContent('home-filtered');
  const visibleItems = getVisibleAllReminders(items, {
    status: selectedStatus,
    type: selectedType,
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>全部事项</Text>
          <Text style={styles.subtitle}>管理所有订阅、账单和证件到期日。</Text>
        </View>

        {items.length > 0 ? (
          <View style={styles.filterPanel}>
            <View style={styles.filterRow}>
              {typeFilterOptions.map((option) => (
                <CategoryPill
                  key={option.value}
                  label={option.label}
                  onPress={() => setSelectedType(option.value)}
                  selected={selectedType === option.value}
                />
              ))}
            </View>
            <View style={styles.filterRow}>
              {statusFilterOptions.map((option) => (
                <CategoryPill
                  key={option.value}
                  label={option.label}
                  onPress={() => setSelectedStatus(option.value)}
                  selected={selectedStatus === option.value}
                />
              ))}
            </View>
            <Text style={styles.resultMeta}>
              当前显示 {visibleItems.length} / {items.length} 件，未处理事项优先按到期日排序
            </Text>
          </View>
        ) : null}

        {items.length > 0 ? (
          visibleItems.length > 0 ? (
            <View style={styles.list}>
              {visibleItems.map((item) => (
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
              accentLabel={filteredEmptyContent.accentLabel}
              actionLabel="添加新到期日"
              chips={filteredEmptyContent.chips}
              description={filteredEmptyContent.description}
              glyph={filteredEmptyContent.glyph}
              onActionPress={() => router.push('/item/new')}
              title={filteredEmptyContent.title}
            />
          )
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
  filterPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  list: {
    gap: 12,
  },
  resultMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
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
