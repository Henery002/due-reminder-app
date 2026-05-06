import { addDays, format } from 'date-fns';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPill } from '../../src/components/CategoryPill';
import { FeedbackBanner } from '../../src/components/FeedbackBanner';
import { ReminderDatePicker } from '../../src/components/ReminderDatePicker';
import { ReminderModeSwitch } from '../../src/components/ReminderModeSwitch';
import { ReminderSaveSummary } from '../../src/components/ReminderSaveSummary';
import { ReminderSchedulePreview } from '../../src/components/ReminderSchedulePreview';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { SubmitActionButton } from '../../src/components/SubmitActionButton';
import { TemplateCard } from '../../src/components/TemplateCard';
import { reminderTemplates } from '../../src/constants/templates';
import { getReminderCreationGate } from '../../src/features/membership/membership.entitlement';
import {
  getExpoNotificationGateway,
  isNotificationRuntimeUnavailableError,
} from '../../src/features/notifications/expo-notification.gateway';
import {
  configureNotifications,
  requestNotificationPermission,
  scheduleReminderNotifications,
} from '../../src/features/notifications/notification.service';
import {
  canAddCustomReminderOffset,
  getDefaultReminderOffsets,
  MAX_REMINDER_POINT_COUNT,
  normalizeSelectedReminderOffsets,
} from '../../src/features/reminders/reminder.defaults';
import {
  getReminderFeedback,
  type ReminderFeedback,
} from '../../src/features/reminders/reminder.feedback';
import { parseOptionalReminderAmount } from '../../src/features/reminders/reminder.form';
import { getReminderSubmitLabels } from '../../src/features/reminders/reminder.mode';
import { createReminderSchema } from '../../src/features/reminders/reminder.schema';
import { buildReminderSchedulePreview } from '../../src/features/reminders/reminder.schedule-preview';
import { buildReminderRules } from '../../src/features/reminders/reminder.service';
import type {
  ReminderItem,
  ReminderMode,
  ReminderType,
} from '../../src/features/reminders/reminder.types';
import { reminderRepository } from '../../src/storage/reminder.store';
import { useTheme, type AppTheme } from '../../src/theme/ThemeProvider';

const typeOptions: Array<{ label: string; value: ReminderType }> = [
  { label: '订阅', value: 'subscription' },
  { label: '账单', value: 'bill' },
  { label: '证件', value: 'document' },
];

function createId(): string {
  return `reminder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function waitForFeedbackTransition(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 450);
  });
}

export default function NewItemScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const [type, setType] = useState<ReminderType>('subscription');
  const [name, setName] = useState('视频会员');
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [reminderMode, setReminderMode] = useState<ReminderMode>('notify');
  const [selectedReminderOffsets, setSelectedReminderOffsets] = useState<number[]>(() =>
    getDefaultReminderOffsets('subscription'),
  );
  const [feedback, setFeedback] = useState<ReminderFeedback | null>(null);
  const [reminderCount, setReminderCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const creationGate = getReminderCreationGate(reminderCount);
  const selectedTypeLabel = typeOptions.find((option) => option.value === type)?.label ?? '事项';
  const reminderModeLabel = reminderMode === 'notify' ? '本地提醒' : '仅记录';
  const reminderPreview = buildReminderSchedulePreview({
    dueDate,
    selectedOffsets: reminderMode === 'notify' ? selectedReminderOffsets : [],
    type,
  });
  const submitLabels = getReminderSubmitLabels('create', reminderMode);

  const refreshCreationGate = useCallback(() => {
    const gate = getReminderCreationGate(reminderRepository.list().length);
    setReminderCount(gate.used);
    setFeedback(gate.allowed ? null : getReminderFeedback('free-limit'));
  }, []);

  useFocusEffect(refreshCreationGate);

  const handleTemplatePress = (template: (typeof reminderTemplates)[number]) => {
    handleTypeChange(template.type);
    setName(template.name);
  };

  const handleTypeChange = (nextType: ReminderType) => {
    setType(nextType);
    setSelectedReminderOffsets(getDefaultReminderOffsets(nextType));
  };

  const handleToggleReminderOffset = (offsetDays: number) => {
    const isSelected = selectedReminderOffsets.includes(offsetDays);
    if (isSelected && selectedReminderOffsets.length <= 1) {
      setFeedback({
        description: '如果暂时不想收到通知，可以保留最晚一次提醒，后续再关闭通知权限。',
        title: '至少保留一个提醒点',
        tone: 'warning',
      });
      return;
    }

    const nextOffsets = isSelected
      ? selectedReminderOffsets.filter((selectedOffset) => selectedOffset !== offsetDays)
      : [...selectedReminderOffsets, offsetDays];

    setSelectedReminderOffsets(normalizeSelectedReminderOffsets(type, nextOffsets));
  };

  const handleAddCustomReminderOffset = (offsetDays: number) => {
    if (selectedReminderOffsets.includes(offsetDays)) {
      setFeedback({
        description: '这个提醒点已经在计划里了，可以直接开启或关闭。',
        title: '提醒点已存在',
        tone: 'warning',
      });
      return;
    }

    if (!canAddCustomReminderOffset(type, selectedReminderOffsets)) {
      setFeedback({
        description: `单个事项最多保留 ${MAX_REMINDER_POINT_COUNT} 个提醒点，避免通知过多。请先关闭一个提醒点再继续添加。`,
        title: '提醒点已到上限',
        tone: 'warning',
      });
      return;
    }

    setSelectedReminderOffsets(
      normalizeSelectedReminderOffsets(type, [...selectedReminderOffsets, offsetDays]),
    );
    setFeedback({
      description: `已加入“提前 ${offsetDays} 天”提醒，保存后会一起安排。`,
      title: '已添加自定义提醒',
      tone: 'success',
    });
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const latestGate = getReminderCreationGate(reminderRepository.list().length);
    setReminderCount(latestGate.used);

    if (!latestGate.allowed) {
      setFeedback(getReminderFeedback('free-limit'));
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

    const now = new Date();
    let reminder: ReminderItem = {
      id: createId(),
      ...parsed.data,
      status: 'active',
      reminderMode,
      reminderRules:
        reminderMode === 'notify'
          ? buildReminderRules(parsed.data.type, parsed.data.dueDate, now, selectedReminderOffsets)
          : [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    if (reminderMode === 'notify') {
      try {
        const notificationGateway = await getExpoNotificationGateway();
        await configureNotifications(notificationGateway);

        const permissionGranted = await requestNotificationPermission(notificationGateway);
        if (permissionGranted) {
          const scheduledRules = await scheduleReminderNotifications(reminder, notificationGateway);
          reminder = {
            ...reminder,
            reminderRules: scheduledRules,
          };
        }
      } catch (error) {
        if (!isNotificationRuntimeUnavailableError(error)) {
          console.warn('Failed to schedule reminder notifications', error);
        }
      }
    }

    reminderRepository.upsert(reminder);
    setFeedback(getReminderFeedback('created'));
    await waitForFeedbackTransition();
    router.replace('/');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '添加事项' }} />
        <ScreenHeader subtitle="返回上一页" title="添加事项" />
        <View>
          <Text style={styles.title}>添加一件快到期的事</Text>
          <Text style={styles.subtitle}>先选模板，再确认到期日和提醒策略。</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryChip}>
              <Text style={styles.summaryValue}>{selectedTypeLabel}</Text>
              <Text style={styles.summaryLabel}>当前类型</Text>
            </View>
            <View style={styles.summaryChip}>
              <Text style={styles.summaryValue}>
                {reminderMode === 'notify' ? `${selectedReminderOffsets.length} 个` : '关闭'}
              </Text>
              <Text style={styles.summaryLabel}>{reminderModeLabel}</Text>
            </View>
          </View>
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
                onPress={() => handleTypeChange(option.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常用模板</Text>
          <View style={styles.templates}>
            {reminderTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                label={template.name}
                selected={name === template.name && type === template.type}
                onPress={() => handleTemplatePress(template)}
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

        <ReminderModeSwitch
          mode={reminderMode}
          onToggle={() => setReminderMode(reminderMode === 'notify' ? 'record-only' : 'notify')}
          variant="create"
        />

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

        <ReminderSchedulePreview
          dueDate={dueDate}
          onAddCustomOffset={reminderMode === 'notify' ? handleAddCustomReminderOffset : undefined}
          onToggleOffset={reminderMode === 'notify' ? handleToggleReminderOffset : undefined}
          selectedOffsets={reminderMode === 'notify' ? selectedReminderOffsets : []}
          type={type}
        />

        <ReminderSaveSummary mode={reminderMode} preview={reminderPreview} />

        <SubmitActionButton
          disabled={!creationGate.allowed}
          label={submitLabels.label}
          loading={isSaving}
          loadingLabel={submitLabels.loadingLabel}
          onPress={handleSave}
        />
        {!creationGate.allowed ? (
          <SubmitActionButton
            label={creationGate.actionLabel ?? '查看会员权益'}
            onPress={() => router.push('/membership')}
            variant="secondary"
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    content: {
      gap: spacing.lg,
      padding: spacing.lg,
      paddingBottom: 32,
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.md,
      borderWidth: 1,
      color: colors.textPrimary,
      minHeight: 44,
      paddingHorizontal: spacing.md,
      paddingVertical: 11,
      ...typography.body,
    },
    noteInput: {
      minHeight: 78,
      textAlignVertical: 'top',
    },
    pills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
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
      gap: spacing.sm,
    },
    sectionTitle: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
    subtitle: {
      color: colors.textSecondary,
      marginTop: spacing.xs,
      ...typography.body,
    },
    summaryChip: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.pill,
      borderWidth: 1,
      flex: 1,
      gap: 1,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    summaryLabel: {
      color: colors.textMuted,
      ...typography.helper,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    summaryValue: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
    templates: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
