import { addDays, differenceInCalendarDays, parseISO, set } from 'date-fns';
import { DEFAULT_REMINDER_OFFSETS } from './reminder.defaults';
import type { ReminderItem, ReminderRule, ReminderType } from './reminder.types';

export function buildReminderRules(
  type: ReminderType,
  dueDate: string,
  now: Date = new Date(),
): ReminderRule[] {
  const due = parseISO(dueDate);

  return DEFAULT_REMINDER_OFFSETS[type]
    .map((offsetDays) => {
      const scheduledDate = addDays(due, -offsetDays);
      const scheduledAt = set(scheduledDate, {
        hours: 9,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      return {
        id: `${type}-${dueDate}-${offsetDays}`,
        offsetDays,
        scheduledAt: scheduledAt.toISOString(),
      };
    })
    .filter((rule) => parseISO(rule.scheduledAt).getTime() >= now.getTime());
}

export function refreshReminderStatus(item: ReminderItem, now: Date = new Date()): ReminderItem {
  if (item.status === 'done') {
    return item;
  }

  if (item.status === 'snoozed' && item.snoozedUntil) {
    const snoozedUntil = parseISO(item.snoozedUntil);
    if (snoozedUntil.getTime() > now.getTime()) {
      return item;
    }
  }

  const daysUntilDue = differenceInCalendarDays(parseISO(item.dueDate), now);
  if (daysUntilDue < 0) {
    return {
      ...item,
      status: 'overdue',
      updatedAt: now.toISOString(),
    };
  }

  if (item.status === 'snoozed') {
    return {
      ...item,
      status: 'active',
      snoozedUntil: undefined,
      updatedAt: now.toISOString(),
    };
  }

  return item;
}

export function markReminderDone(item: ReminderItem, now: Date = new Date()): ReminderItem {
  const timestamp = now.toISOString();

  return {
    ...item,
    status: 'done',
    completedAt: timestamp,
    snoozedUntil: undefined,
    updatedAt: timestamp,
  };
}

export function snoozeReminder(
  item: ReminderItem,
  days: number,
  now: Date = new Date(),
): ReminderItem {
  const snoozedUntil = addDays(now, days).toISOString();
  const snoozeRule: ReminderRule = {
    id: `snooze-${item.id}-${snoozedUntil}`,
    offsetDays: 0,
    scheduledAt: snoozedUntil,
  };

  return {
    ...item,
    status: 'snoozed',
    snoozedUntil,
    reminderRules: [
      ...item.reminderRules.filter((rule) => !rule.id.startsWith(`snooze-${item.id}-`)),
      snoozeRule,
    ],
    updatedAt: now.toISOString(),
  };
}
