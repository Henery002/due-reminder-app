import { z } from 'zod';
import type { ReminderItem } from '../reminders/reminder.types';

const reminderRuleSchema = z.object({
  id: z.string(),
  offsetDays: z.number(),
  scheduledAt: z.string(),
  notificationId: z.string().optional(),
});

const reminderItemSchema = z.object({
  id: z.string(),
  type: z.enum(['subscription', 'bill', 'document']),
  name: z.string(),
  dueDate: z.string(),
  amount: z.number().optional(),
  note: z.string().optional(),
  status: z.enum(['active', 'done', 'overdue', 'snoozed']),
  reminderRules: z.array(reminderRuleSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
  snoozedUntil: z.string().optional(),
});

const remindersBackupSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  reminders: z.array(reminderItemSchema),
});

export type ParsedRemindersBackup = {
  reminders: ReminderItem[];
  schemaVersion: 1;
};

export function exportRemindersBackup(items: ReminderItem[], now = new Date()): string {
  return JSON.stringify(
    {
      schemaVersion: 1,
      exportedAt: now.toISOString(),
      reminders: items,
    },
    null,
    2,
  );
}

export function parseRemindersBackup(value: string): ParsedRemindersBackup {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(value);
  } catch {
    throw new Error('备份文本格式不对，请确认复制的是完整 JSON。');
  }

  const parsed = remindersBackupSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error('备份内容不完整，请确认没有漏复制或改动字段。');
  }

  return {
    reminders: parsed.data.reminders,
    schemaVersion: parsed.data.schemaVersion,
  };
}
