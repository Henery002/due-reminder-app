import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPill } from '../../src/components/CategoryPill';
import { EmptyState } from '../../src/components/EmptyState';
import { FeedbackBanner } from '../../src/components/FeedbackBanner';
import { ReminderDatePicker } from '../../src/components/ReminderDatePicker';
import { ReminderSchedulePreview } from '../../src/components/ReminderSchedulePreview';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { SubmitActionButton } from '../../src/components/SubmitActionButton';
import {
  getExpoNotificationGateway,
  isNotificationRuntimeUnavailableError,
} from '../../src/features/notifications/expo-notification.gateway';
import {
  deleteReminderWithNotifications,
  updateReminderWithNotifications,
} from '../../src/features/reminders/reminder.actions';
import {
  getReminderFeedback,
  type ReminderFeedback,
} from '../../src/features/reminders/reminder.feedback';
import { parseOptionalReminderAmount } from '../../src/features/reminders/reminder.form';
import { createReminderSchema } from '../../src/features/reminders/reminder.schema';
import type { ReminderItem, ReminderType } from '../../src/features/reminders/reminder.types';
import { reminderRepository } from '../../src/storage/reminder.store';
import { colors } from '../../src/theme/colors';

const typeOptions: Array<{ label: string; value: ReminderType }> = [
  { label: '订阅', value: 'subscription' },
  { label: '账单', value: 'bill' },
  { label: '证件', value: 'document' },
];

function readRouteId(param: string | string[] | undefined): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

function waitForFeedbackTransition(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 450);
  });
}

export default function EditItemScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const reminderId = readRouteId(params.id);
  const [item, setItem] = useState<ReminderItem | undefined>();
  const [type, setType] = useState<ReminderType>('subscription');
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [feedback, setFeedback] = useState<ReminderFeedback | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadItem = useCallback(() => {
    if (!reminderId) {
      setLoaded(true);
      return;
    }

    const nextItem = reminderRepository.getById(reminderId);
    setItem(nextItem);
    setLoaded(true);

    if (nextItem) {
      setType(nextItem.type);
      setName(nextItem.name);
      setDueDate(nextItem.dueDate);
      setAmount(typeof nextItem.amount === 'number' ? String(nextItem.amount) : '');
      setNote(nextItem.note ?? '');
    }
  }, [reminderId]);

  useFocusEffect(loadItem);

  const handleSave = async () => {
    if (!item || isSaving || isDeleting) {
      return;
    }

    let parsedAmount: number | undefined;
    try {
      parsedAmount = parseOptionalReminderAmount(amount);
    } catch (error) {
      setFeedback({
        description: error instanceof Error ? error.message : '金额格式不太对，换成数字试试。',
        title: '金额格式不太对',
        tone: 'warning',
      });
      return;
    }

    const parsed = createReminderSchema.safeParse({
      type,
      name,
      dueDate,
      amount: parsedAmount,
      note: note.trim().length > 0 ? note.trim() : undefined,
    });

    if (!parsed.success) {
      setFeedback({
        description: parsed.error.issues[0]?.message ?? '请补全事项信息',
        title: '再检查一下',
        tone: 'warning',
      });
      return;
    }

    setIsSaving(true);

    await updateReminderWithNotifications(item, parsed.data, {
      getNotificationGateway: getExpoNotificationGateway,
      onNotificationError: (error) => {
        if (!isNotificationRuntimeUnavailableError(error)) {
          console.warn('Failed to reschedule reminder notifications', error);
        }
      },
      upsert: reminderRepository.upsert,
    });

    setFeedback(getReminderFeedback('updated'));
    await waitForFeedbackTransition();
    router.back();
  };

  const handleDelete = () => {
    if (!item || isSaving || isDeleting) {
      return;
    }

    Alert.alert('删除这个事项？', '删除后会同时取消它已安排的本地提醒。', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          await deleteReminderWithNotifications(item, {
            getNotificationGateway: getExpoNotificationGateway,
            onNotificationError: (error) => {
              if (!isNotificationRuntimeUnavailableError(error)) {
                console.warn('Failed to cancel reminder notifications', error);
              }
            },
            remove: reminderRepository.remove,
          });
          setFeedback(getReminderFeedback('deleted'));
          await waitForFeedbackTransition();
          router.back();
        },
      },
    ]);
  };

  if (!loaded) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.notFound}>
          <Stack.Screen options={{ title: '编辑事项' }} />
          <ScreenHeader subtitle="返回上一页" title="编辑事项" />
          <EmptyState title="正在打开事项" description="正在读取本地事项数据，请稍等。" />
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.notFound}>
          <Stack.Screen options={{ title: '编辑事项' }} />
          <ScreenHeader subtitle="返回上一页" title="编辑事项" />
          <EmptyState title="没有找到这个事项" description="它可能已经被删除或本地数据已刷新。" />
          <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>返回</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '编辑事项' }} />
        <ScreenHeader subtitle="返回上一页" title="编辑事项" />
        <View>
          <Text style={styles.title}>编辑到期事项</Text>
          <Text style={styles.subtitle}>修改后会取消旧提醒，并按新的到期日重新安排。</Text>
        </View>
        <FeedbackBanner feedback={feedback} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>事项类型</Text>
          <View style={styles.pills}>
            {typeOptions.map((option) => (
              <CategoryPill
                key={option.value}
                label={option.label}
                selected={type === option.value}
                onPress={() => setType(option.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>事项名称</Text>
          <TextInput
            placeholder="例如：视频会员续费"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <ReminderDatePicker value={dueDate} onChange={setDueDate} />
        </View>

        <ReminderSchedulePreview dueDate={dueDate} type={type} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>金额和备注</Text>
          <TextInput
            keyboardType="decimal-pad"
            placeholder="金额，可选"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            multiline
            placeholder="备注，可选，例如自动续费前确认"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
          />
        </View>

        <SubmitActionButton
          disabled={isDeleting}
          label="保存修改并重排提醒"
          loading={isSaving}
          loadingLabel="正在重排提醒..."
          onPress={handleSave}
        />
        <SubmitActionButton
          disabled={isSaving}
          label="删除事项"
          loading={isDeleting}
          loadingLabel="正在删除..."
          onPress={handleDelete}
          variant="danger"
        />
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
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 16,
    padding: 14,
  },
  notFound: {
    flex: 1,
    gap: 18,
    justifyContent: 'center',
    padding: 20,
  },
  noteInput: {
    minHeight: 82,
    textAlignVertical: 'top',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
  },
  secondaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
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
