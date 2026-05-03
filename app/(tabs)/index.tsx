import { differenceInCalendarDays, format, isSameMonth, parseISO } from 'date-fns';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategoryPill } from '../../src/components/CategoryPill';
import { DueItemCard } from '../../src/components/DueItemCard';
import { EmptyState } from '../../src/components/EmptyState';
import { OverviewCard } from '../../src/components/OverviewCard';
import { PermissionBanner } from '../../src/components/PermissionBanner';
import { groupRemindersForHome } from '../../src/features/reminders/reminder.selectors';
import {
  markReminderDone,
  refreshReminderStatus,
  snoozeReminder,
} from '../../src/features/reminders/reminder.service';
import type { ReminderItem } from '../../src/features/reminders/reminder.types';
import { reminderRepository } from '../../src/storage/reminder.store';
import { colors } from '../../src/theme/colors';

export default function HomeScreen() {
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

  const handleDone = (item: ReminderItem) => {
    reminderRepository.upsert(markReminderDone(item));
    loadItems();
  };

  const handleSnooze = (item: ReminderItem) => {
    reminderRepository.upsert(snoozeReminder(item, 1));
    loadItems();
  };

  const now = new Date();
  const groups = groupRemindersForHome(items, now);
  const recentItems = [
    ...groups.overdue,
    ...groups.today,
    ...groups.nextThreeDays,
    ...groups.nextSevenDays,
  ];
  const nextSevenDaysCount =
    groups.today.length + groups.nextThreeDays.length + groups.nextSevenDays.length;
  const thisMonthCount = items.filter(
    (item) => item.status !== 'done' && isSameMonth(parseISO(item.dueDate), now),
  ).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{format(now, 'yyyy 年 M 月 d 日')}</Text>
        <Text style={styles.title}>今天要处理 {groups.today.length} 件事</Text>
        <Text style={styles.subtitle}>订阅续费、账单缴费、证件到期都在这里看。</Text>
      </View>

      <PermissionBanner />
      <OverviewCard
        nextSevenDays={nextSevenDaysCount}
        thisMonth={thisMonthCount}
        overdue={groups.overdue.length}
      />

      <View style={styles.pills}>
        {['全部', '订阅', '账单', '证件'].map((label, index) => (
          <CategoryPill key={label} label={label} selected={index === 0} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>近期要处理</Text>
        {recentItems.length > 0 ? (
          <View style={styles.list}>
            {recentItems.map((item) => (
              <DueItemCard
                key={item.id}
                item={item}
                onDone={() => handleDone(item)}
                onSnooze={() => handleSnooze(item)}
              />
            ))}
          </View>
        ) : (
          <EmptyState title="最近没有压力项" description="先添加一个会员、账单或证件到期日。" />
        )}
      </View>

      <Link href="/item/new" style={styles.primaryAction}>
        添加一件事
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 36,
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    gap: 6,
  },
  list: {
    gap: 12,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryAction: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
    overflow: 'hidden',
    padding: 15,
    textAlign: 'center',
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
});
