import { refreshReminderList } from './reminder.lifecycle';
import type { ReminderItem } from './reminder.types';

const now = new Date('2026-05-05T08:00:00.000Z');

function item(overrides: Partial<ReminderItem>): ReminderItem {
  return {
    id: 'item-1',
    type: 'subscription',
    name: '视频会员',
    dueDate: '2026-05-10',
    status: 'active',
    reminderMode: 'notify',
    reminderRules: [],
    createdAt: '2026-05-03T08:00:00.000Z',
    updatedAt: '2026-05-03T08:00:00.000Z',
    ...overrides,
  };
}

describe('reminder lifecycle helpers', () => {
  it('refreshes overdue reminders and persists only changed items', () => {
    const upsert = jest.fn();

    const result = refreshReminderList(
      [
        item({ id: 'past', dueDate: '2026-05-04' }),
        item({ id: 'future', dueDate: '2026-05-06' }),
        item({ id: 'done', dueDate: '2026-05-01', status: 'done' }),
      ],
      {
        now,
        upsert,
      },
    );

    expect(result.map((entry) => [entry.id, entry.status])).toEqual([
      ['past', 'overdue'],
      ['future', 'active'],
      ['done', 'done'],
    ]);
    expect(upsert).toHaveBeenCalledTimes(1);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'past',
        status: 'overdue',
        updatedAt: now.toISOString(),
      }),
    );
  });
});
