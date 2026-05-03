import type { ReminderType } from './reminder.types';

export const DEFAULT_REMINDER_OFFSETS: Record<ReminderType, number[]> = {
  subscription: [7, 1, 0],
  bill: [3, 1, 0],
  document: [60, 30, 7],
};
