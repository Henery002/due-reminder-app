import type { SQLiteBindParams } from 'expo-sqlite';
import { createReminderRepository, type ReminderDatabase } from './reminder.repository';
import type { ReminderItem } from '../features/reminders/reminder.types';

const baseItem: ReminderItem = {
  id: 'renewal-1',
  type: 'subscription',
  name: '视频会员续费',
  dueDate: '2026-05-10',
  amount: 25,
  note: '首月优惠结束',
  status: 'active',
  reminderRules: [
    {
      id: 'subscription-2026-05-10-1',
      offsetDays: 1,
      scheduledAt: '2026-05-09T01:00:00.000Z',
    },
  ],
  createdAt: '2026-05-03T08:00:00.000Z',
  updatedAt: '2026-05-03T08:00:00.000Z',
};

function createFakeDatabase() {
  const rows: Record<string, unknown>[] = [];
  const database: ReminderDatabase = {
    getAllSync<T>() {
      return rows as T[];
    },
    getFirstSync<T>(_sql: string, params: SQLiteBindParams) {
      const id = Array.isArray(params) ? params[0] : undefined;
      return rows.find((row) => row.id === id) as T | undefined;
    },
    runSync(_sql: string, params: SQLiteBindParams) {
      if (!Array.isArray(params)) {
        return;
      }

      rows.push({
        id: params[0],
        type: params[1],
        name: params[2],
        dueDate: params[3],
        amount: params[4],
        note: params[5],
        status: params[6],
        reminderRulesJson: params[7],
        createdAt: params[8],
        updatedAt: params[9],
        completedAt: params[10],
        snoozedUntil: params[11],
      });
    },
  };

  return { database, rows };
}

describe('reminder repository', () => {
  it('persists reminders with serialized reminder rules and reads them back', () => {
    const { database } = createFakeDatabase();
    const repository = createReminderRepository(database);

    repository.upsert(baseItem);

    expect(repository.getById('renewal-1')).toEqual(baseItem);
  });

  it('lists reminders ordered by the database result', () => {
    const { database } = createFakeDatabase();
    const repository = createReminderRepository(database);

    repository.upsert({ ...baseItem, id: 'later', dueDate: '2026-05-12' });
    repository.upsert({ ...baseItem, id: 'soon', dueDate: '2026-05-04' });

    expect(repository.list().map((entry) => entry.id)).toEqual(['later', 'soon']);
  });
});
