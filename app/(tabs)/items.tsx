import { router, useFocusEffect } from 'expo-router';
import { useCallback, useDeferredValue, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ReminderStatusFilter>('all');
  const [selectedType, setSelectedType] = useState<ReminderTypeFilter>('all');
  const [snoozeTarget, setSnoozeTarget] = useState<ReminderItem | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);

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
    query: deferredSearchQuery,
    status: selectedStatus,
    type: selectedType,
  });
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>全部事项</Text>
          <Text style={styles.subtitle}>管理所有订阅、账单和证件到期日。</Text>
        </View>

        {items.length > 0 ? (
          <View style={styles.filterPanel}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                onChangeText={setSearchQuery}
                placeholder="搜索名称或备注"
                placeholderTextColor={colors.textMuted}
                returnKeyType="search"
                style={styles.searchInput}
                value={searchQuery}
              />
              {hasSearchQuery ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSearchQuery('')}
                  style={({ pressed }) => [
                    styles.clearSearch,
                    pressed ? styles.clearPressed : null,
                  ]}
                >
                  <Text style={styles.clearSearchText}>清除</Text>
                </Pressable>
              ) : null}
            </View>
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
              当前显示 {visibleItems.length} / {items.length} 件，支持按名称和备注搜索
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
              actionLabel={hasSearchQuery ? '清空搜索' : '添加新到期日'}
              chips={filteredEmptyContent.chips}
              description={
                hasSearchQuery
                  ? '没有找到匹配的事项。可以换个关键词，或者清空搜索后再按分类慢慢找。'
                  : filteredEmptyContent.description
              }
              glyph={filteredEmptyContent.glyph}
              onActionPress={() => {
                if (hasSearchQuery) {
                  setSearchQuery('');
                  return;
                }

                router.push('/item/new');
              }}
              title={hasSearchQuery ? '没有搜到相关到期日' : filteredEmptyContent.title}
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
  clearPressed: {
    opacity: 0.72,
  },
  clearSearch: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  clearSearchText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
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
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  searchIcon: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },
  searchInput: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 42,
    paddingVertical: 8,
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
