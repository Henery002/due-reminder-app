import type { ReminderType } from '../features/reminders/reminder.types';

export type ReminderTemplate = {
  id: string;
  type: ReminderType;
  name: string;
  icon: string;
};
