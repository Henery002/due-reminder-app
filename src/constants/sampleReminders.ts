import type { ReminderItem } from '../features/reminders/reminder.types';

export const sampleReminders: ReminderItem[] = [
  {
    id: 'sample-video',
    type: 'subscription',
    name: '视频会员续费',
    dueDate: '2026-05-05',
    amount: 25,
    status: 'active',
    reminderMode: 'notify',
    reminderRules: [],
    createdAt: '2026-05-03T08:00:00.000Z',
    updatedAt: '2026-05-03T08:00:00.000Z',
  },
  {
    id: 'sample-card',
    type: 'bill',
    name: '信用卡还款',
    dueDate: '2026-05-09',
    amount: 2300,
    status: 'active',
    reminderMode: 'notify',
    reminderRules: [],
    createdAt: '2026-05-03T08:00:00.000Z',
    updatedAt: '2026-05-03T08:00:00.000Z',
  },
  {
    id: 'sample-passport',
    type: 'document',
    name: '护照到期',
    dueDate: '2026-05-01',
    status: 'overdue',
    reminderMode: 'notify',
    reminderRules: [],
    createdAt: '2026-05-03T08:00:00.000Z',
    updatedAt: '2026-05-03T08:00:00.000Z',
  },
];
