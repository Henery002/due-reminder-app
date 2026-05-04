import { addDays, format } from 'date-fns';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPill } from '../../src/components/CategoryPill';
import { ReminderDatePicker } from '../../src/components/ReminderDatePicker';
import { ReminderRuleSelector } from '../../src/components/ReminderRuleSelector';
import { SubmitActionButton } from '../../src/components/SubmitActionButton';
import { TemplateCard } from '../../src/components/TemplateCard';
import { reminderTemplates } from '../../src/constants/templates';
import {
  getExpoNotificationGateway,
  isNotificationRuntimeUnavailableError,
} from '../../src/features/notifications/expo-notification.gateway';
import {
  configureNotifications,
  requestNotificationPermission,
  scheduleReminderNotifications,
} from '../../src/features/notifications/notification.service';
import { DEFAULT_REMINDER_OFFSETS } from '../../src/features/reminders/reminder.defaults';
import { createReminderSchema } from '../../src/features/reminders/reminder.schema';
import { buildReminderRules } from '../../src/features/reminders/reminder.service';
import type { ReminderItem, ReminderType } from '../../src/features/reminders/reminder.types';
import { reminderRepository } from '../../src/storage/reminder.store';
import { colors } from '../../src/theme/colors';

const typeOptions: Array<{ label: string; value: ReminderType }> = [
  { label: '订阅', value: 'subscription' },
  { label: '账单', value: 'bill' },
  { label: '证件', value: 'document' },
];

function createId(): string {
  return `reminder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function NewItemScreen() {
  const [type, setType] = useState<ReminderType>('subscription');
  const [name, setName] = useState('视频会员');
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleTemplatePress = (template: (typeof reminderTemplates)[number]) => {
    setType(template.type);
    setName(template.name);
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const parsed = createReminderSchema.safeParse({
      type,
      name,
      dueDate,
      amount: amount.trim().length > 0 ? Number(amount) : undefined,
      note: note.trim().length > 0 ? note.trim() : undefined,
    });

    if (!parsed.success) {
      Alert.alert('再检查一下', parsed.error.issues[0]?.message ?? '请补全事项信息');
      return;
    }

    setIsSaving(true);

    const now = new Date();
    let reminder: ReminderItem = {
      id: createId(),
      ...parsed.data,
      status: 'active',
      reminderRules: buildReminderRules(parsed.data.type, parsed.data.dueDate, now),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

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

    reminderRepository.upsert(reminder);
    router.replace('/');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '添加事项' }} />
        <View>
          <Text style={styles.title}>添加一件快到期的事</Text>
          <Text style={styles.subtitle}>先选模板，再确认到期日和提醒策略。</Text>
        </View>

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

        <ReminderRuleSelector offsets={DEFAULT_REMINDER_OFFSETS[type]} />

        <SubmitActionButton
          label="保存并安排提醒"
          loading={isSaving}
          loadingLabel="正在安排提醒..."
          onPress={handleSave}
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
  noteInput: {
    minHeight: 82,
    textAlignVertical: 'top',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
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
  templates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
});
