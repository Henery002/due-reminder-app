export type ReminderType = 'subscription' | 'bill' | 'document';
export type ReminderStatus = 'active' | 'done' | 'overdue' | 'snoozed';
export type ReminderMode = 'notify' | 'record-only';

export type ReminderRule = {
  id: string;
  offsetDays: number;
  scheduledAt: string;
  notificationId?: string;
};

export type ReminderItem = {
  id: string;
  type: ReminderType;
  name: string;
  dueDate: string;
  amount?: number;
  note?: string;
  status: ReminderStatus;
  reminderMode: ReminderMode;
  reminderRules: ReminderRule[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  snoozedUntil?: string;
};
