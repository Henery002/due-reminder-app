import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { ReminderItem, ReminderType } from './reminder.types';

export type ReminderTypeFilter = ReminderType | 'all';

export type ReminderTypeMeta = {
  glyph: string;
  label: string;
  color: string;
  backgroundColor: string;
};

const reminderTypeMeta: Record<ReminderType, ReminderTypeMeta> = {
  subscription: {
    backgroundColor: '#DFF7F3',
    color: '#1BAE9F',
    glyph: 'S',
    label: '订阅',
  },
  bill: {
    backgroundColor: '#FFF2DF',
    color: '#F5A24A',
    glyph: '¥',
    label: '账单',
  },
  document: {
    backgroundColor: '#E6F6EB',
    color: '#4CA66A',
    glyph: 'ID',
    label: '证件',
  },
};

export function filterRemindersByType(
  items: ReminderItem[],
  selectedType: ReminderTypeFilter,
): ReminderItem[] {
  if (selectedType === 'all') {
    return items;
  }

  return items.filter((item) => item.type === selectedType);
}

export function getReminderTypeMeta(type: ReminderType): ReminderTypeMeta {
  return reminderTypeMeta[type];
}

export function getReminderStatusLabel(item: ReminderItem, now: Date = new Date()): string {
  if (item.status === 'done') {
    return '已处理';
  }

  if (item.status === 'overdue') {
    return '已逾期';
  }

  if (item.status === 'snoozed') {
    return '已延后';
  }

  const daysUntilDue = differenceInCalendarDays(parseISO(item.dueDate), now);
  if (daysUntilDue === 0) {
    return '今日到期';
  }

  if (daysUntilDue > 0 && daysUntilDue <= 3) {
    return '即将到期';
  }

  return '进行中';
}
