import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { ReminderItem } from './reminder.types';

export type HomeReminderGroups = {
  today: ReminderItem[];
  nextThreeDays: ReminderItem[];
  nextSevenDays: ReminderItem[];
  overdue: ReminderItem[];
};

export function groupRemindersForHome(
  items: ReminderItem[],
  now: Date = new Date(),
): HomeReminderGroups {
  const groups: HomeReminderGroups = {
    today: [],
    nextThreeDays: [],
    nextSevenDays: [],
    overdue: [],
  };

  for (const item of items) {
    if (item.status === 'done') {
      continue;
    }

    if (item.status === 'overdue') {
      groups.overdue.push(item);
      continue;
    }

    const daysUntilDue = differenceInCalendarDays(parseISO(item.dueDate), now);
    if (daysUntilDue === 0) {
      groups.today.push(item);
    } else if (daysUntilDue > 0 && daysUntilDue <= 3) {
      groups.nextThreeDays.push(item);
    } else if (daysUntilDue > 3 && daysUntilDue <= 7) {
      groups.nextSevenDays.push(item);
    } else if (daysUntilDue < 0) {
      groups.overdue.push(item);
    }
  }

  return groups;
}
