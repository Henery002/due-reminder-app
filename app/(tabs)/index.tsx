import { format, isSameMonth, parseISO } from 'date-fns';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomActionSheet } from '../../src/components/BottomActionSheet';
import { CategoryPill } from '../../src/components/CategoryPill';
import { DueItemCard } from '../../src/components/DueItemCard';
import { EmptyState } from '../../src/components/EmptyState';
import { FirstRunGuide } from '../../src/components/FirstRunGuide';
import { OverviewCard } from '../../src/components/OverviewCard';
import { PermissionBanner } from '../../src/components/PermissionBanner';
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
import { getHomeEmptyMode } from '../../src/features/reminders/reminder.onboarding';
import {
  getHomeReminderSections,
  groupRemindersForHome,
  type HomeReminderSection,
} from '../../src/features/reminders/reminder.selectors';
import { getSnoozeOptions } from '../../src/features/reminders/reminder.snooze';
import type { ReminderItem } from '../../src/features/reminders/reminder.types';
import {
  filterRemindersByType,
  type ReminderTypeFilter,
} from '../../src/features/reminders/reminder.view';
import { reminderRepository } from '../../src/storage/reminder.store';
import { useTheme, type AppTheme } from '../../src/theme/ThemeProvider';

const categoryOptions: Array<{ label: string; value: ReminderTypeFilter }> = [
  { label: '全部', value: 'all' },
  { label: '订阅', value: 'subscription' },
  { label: '账单', value: 'bill' },
  { label: '证件', value: 'document' },
];

export default function HomeScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const [items, setItems] = useState<ReminderItem[]>([]);
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

  const now = new Date();
  const visibleItems = filterRemindersByType(items, selectedType);
  const groups = groupRemindersForHome(visibleItems, now);
  const homeSections = getHomeReminderSections(groups);
  const recentItemCount = homeSections.reduce((total, section) => total + section.items.length, 0);
  const nextSevenDaysCount =
    groups.today.length + groups.nextThreeDays.length + groups.nextSevenDays.length;
  const thisMonthCount = items.filter(
    (item) => item.status !== 'done' && isSameMonth(parseISO(item.dueDate), now),
  ).length;
  const emptyMode = getHomeEmptyMode({
    totalCount: items.length,
    visibleCount: recentItemCount,
  });
  const filteredEmptyContent = getReminderEmptyStateContent('home-filtered');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.eyebrowBadge}>
            <Text style={styles.eyebrow}>{format(now, 'yyyy 年 M 月 d 日')}</Text>
          </View>
          <Text style={styles.title}>今天待处理 {groups.today.length} 件</Text>
          <Text style={styles.subtitle}>订阅续费、账单缴费、证件到期都在这里看。</Text>
        </View>

        <PermissionBanner onPress={() => router.push('/notification-permission')} />
        <OverviewCard
          nextSevenDays={nextSevenDaysCount}
          thisMonth={thisMonthCount}
          overdue={groups.overdue.length}
        />

        <View style={styles.pills}>
          {categoryOptions.map((option) => (
            <CategoryPill
              key={option.value}
              label={option.label}
              selected={selectedType === option.value}
              onPress={() => setSelectedType(option.value)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>近期要处理</Text>
          {homeSections.length > 0 ? (
            <View style={styles.sectionList}>
              {homeSections.map((section) => (
                <HomeReminderSectionView
                  key={section.key}
                  onDone={handleDone}
                  onOpen={(item) => router.push(`/item/${item.id}`)}
                  onSnooze={(item) => setSnoozeTarget(item)}
                  section={section}
                  styles={styles}
                />
              ))}
            </View>
          ) : emptyMode === 'first-run' ? (
            <FirstRunGuide onAddPress={() => router.push('/item/new')} />
          ) : (
            <EmptyState
              accentLabel={filteredEmptyContent.accentLabel}
              chips={filteredEmptyContent.chips}
              description={filteredEmptyContent.description}
              glyph={filteredEmptyContent.glyph}
              title={filteredEmptyContent.title}
            />
          )}
        </View>

        <Link href="/item/new" style={styles.primaryAction}>
          添加一件事
        </Link>
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

function HomeReminderSectionView({
  onDone,
  onOpen,
  onSnooze,
  section,
  styles,
}: {
  onDone: (item: ReminderItem) => void;
  onOpen: (item: ReminderItem) => void;
  onSnooze: (item: ReminderItem) => void;
  section: HomeReminderSection;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <View style={styles.groupTitleWrap}>
          <Text style={styles.groupTitle}>{section.title}</Text>
          <Text style={styles.groupDescription}>{section.description}</Text>
        </View>
        <View style={[styles.groupBadge, styles[`${section.tone}Badge`]]}>
          <Text style={[styles.groupBadgeText, styles[`${section.tone}BadgeText`]]}>
            {section.items.length} 件
          </Text>
        </View>
      </View>
      <View style={styles.list}>
        {section.items.map((item) => (
          <DueItemCard
            key={item.id}
            item={item}
            onDone={() => onDone(item)}
            onPress={() => onOpen(item)}
            onSnooze={() => onSnooze(item)}
          />
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    calmBadge: {
      backgroundColor: colors.doneSoft,
    },
    calmBadgeText: {
      color: colors.done,
    },
    content: {
      gap: spacing.lg,
      padding: spacing.lg,
      paddingBottom: 104,
    },
    dangerBadge: {
      backgroundColor: colors.overdueSoft,
    },
    dangerBadgeText: {
      color: colors.overdue,
    },
    eyebrow: {
      color: colors.primary,
      ...typography.label,
    },
    eyebrowBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      borderRadius: radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    group: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing.md,
      padding: spacing.md,
    },
    groupBadge: {
      borderRadius: radius.pill,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },
    groupBadgeText: {
      ...typography.label,
    },
    groupDescription: {
      color: colors.textSecondary,
      ...typography.helper,
      marginTop: 2,
    },
    groupHeader: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'space-between',
    },
    groupTitle: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    groupTitleWrap: {
      flex: 1,
    },
    header: {
      gap: spacing.sm,
    },
    list: {
      gap: spacing.md,
    },
    pills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    primaryAction: {
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      color: colors.surface,
      minHeight: 44,
      overflow: 'hidden',
      paddingHorizontal: spacing.md,
      paddingVertical: 11,
      textAlign: 'center',
      ...typography.bodyStrong,
    },
    primaryBadge: {
      backgroundColor: colors.primarySoft,
    },
    primaryBadgeText: {
      color: colors.primary,
    },
    safeArea: {
      backgroundColor: colors.background,
      flex: 1,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    section: {
      gap: spacing.md,
    },
    sectionList: {
      gap: spacing.md,
    },
    sectionTitle: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
    subtitle: {
      color: colors.textSecondary,
      ...typography.body,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 24,
      fontWeight: '800',
      lineHeight: 31,
    },
    warmBadge: {
      backgroundColor: colors.dueSoonSoft,
    },
    warmBadgeText: {
      color: colors.dueSoon,
    },
  });
}
