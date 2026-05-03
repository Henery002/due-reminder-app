import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { ReminderItem, ReminderType } from './reminder.types';

export type ReminderTypeFilter = ReminderType | 'all';

export function filterRemindersByType(
  items: ReminderItem[],
  selectedType: ReminderTypeFilter,
): ReminderItem[] {
  if (selectedType === 'all') {
    return items;
  }

  return items.filter((item) => item.type === selectedType);
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
