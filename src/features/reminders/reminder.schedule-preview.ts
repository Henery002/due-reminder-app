import { format, isValid, parseISO } from 'date-fns';
import { getReminderOffsetLabel } from './reminder.defaults';
import { buildReminderRules } from './reminder.service';
import type { ReminderType } from './reminder.types';

export type ReminderSchedulePreviewInput = {
  dueDate: string;
  selectedOffsets?: readonly number[];
  type: ReminderType;
};

export type ReminderSchedulePreviewItem = {
  dateLabel: string;
  offsetLabel: string;
  timeLabel: string;
};

export type ReminderSchedulePreview = {
  description: string;
  items: ReminderSchedulePreviewItem[];
  status: 'invalid-date' | 'record-only' | 'scheduled';
  title: string;
};

export function buildReminderSchedulePreview(
  input: ReminderSchedulePreviewInput,
  now: Date = new Date(),
): ReminderSchedulePreview {
  const dueDate = parseISO(input.dueDate);
  if (!input.dueDate.trim() || !isValid(dueDate)) {
    return {
      description: '先选择一个有效到期日，再查看实际提醒计划。',
      items: [],
      status: 'invalid-date',
      title: '提醒计划',
    };
  }

  const items = buildReminderRules(input.type, input.dueDate, now, input.selectedOffsets).map(
    (rule) => {
      const scheduledAt = parseISO(rule.scheduledAt);

      return {
        dateLabel: format(scheduledAt, 'yyyy-MM-dd'),
        offsetLabel: getReminderOffsetLabel(rule.offsetDays),
        timeLabel: format(scheduledAt, 'HH:mm'),
      };
    },
  );

  return {
    description:
      items.length > 0
        ? `将安排 ${items.length} 次本地提醒，默认在当天 09:00 提醒。`
        : '这个到期日已经没有可安排的未来提醒，可以保存为记录，但不会自动触发新提醒。',
    items,
    status: items.length > 0 ? 'scheduled' : 'record-only',
    title: '提醒计划',
  };
}
