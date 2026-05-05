import { exportRemindersBackup, parseRemindersBackup } from './backup';
import type { ReminderItem } from '../reminders/reminder.types';

const now = new Date('2026-05-05T08:00:00.000Z');

const reminder: ReminderItem = {
  id: 'renewal-1',
  type: 'subscription',
  name: '视频会员',
  dueDate: '2026-05-10',
  amount: 25,
  note: '自动续费前确认',
  status: 'active',
  reminderRules: [
    {
      id: 'subscription-2026-05-10-1',
      offsetDays: 1,
      scheduledAt: '2026-05-09T01:00:00.000Z',
      notificationId: 'notification-1',
    },
  ],
  createdAt: '2026-05-03T08:00:00.000Z',
  updatedAt: '2026-05-03T08:00:00.000Z',
};

describe('reminder backup helpers', () => {
  it('exports reminders as a readable versioned backup text', () => {
    expect(exportRemindersBackup([reminder], now)).toBe(
      JSON.stringify(
        {
          schemaVersion: 1,
          exportedAt: '2026-05-05T08:00:00.000Z',
          reminders: [reminder],
        },
        null,
        2,
      ),
    );
  });

  it('parses valid backup text back into reminders', () => {
    const backupText = exportRemindersBackup([reminder], now);

    expect(parseRemindersBackup(backupText)).toEqual({
      reminders: [reminder],
      schemaVersion: 1,
    });
  });

  it('rejects invalid backup text with friendly copy', () => {
    expect(() => parseRemindersBackup('{ nope')).toThrow(
      '备份文本格式不对，请确认复制的是完整 JSON。',
    );
  });
});
