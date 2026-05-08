import { createPreferenceRepository } from './preference.repository';
import { createReminderRepository } from './reminder.repository';
import { createWebMemoryDatabase } from './web-memory-database';
import type { ReminderItem } from '../features/reminders/reminder.types';

const baseItem: ReminderItem = {
  id: 'web-1',
  type: 'subscription',
  name: '视频会员续费',
  dueDate: '2026-05-10',
  amount: 25,
  note: '首月优惠结束',
  status: 'active',
  reminderMode: 'notify',
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

describe('web memory database', () => {
  it('supports reminder repository reads and writes without SQLite', () => {
    const database = createWebMemoryDatabase();
    const repository = createReminderRepository(database);

    repository.upsert({ ...baseItem, id: 'later', dueDate: '2026-05-12' });
    repository.upsert({ ...baseItem, id: 'soon', dueDate: '2026-05-04' });

    expect(repository.getById('soon')?.name).toBe('视频会员续费');
    expect(repository.list().map((item) => item.id)).toEqual(['soon', 'later']);

    repository.remove('soon');

    expect(repository.getById('soon')).toBeUndefined();
  });

  it('supports preference repository json values without SQLite', () => {
    const database = createWebMemoryDatabase();
    const repository = createPreferenceRepository(database);

    repository.setJson('appearance', { accentColor: 'teal', mode: 'dark' });

    expect(repository.getJson('appearance', { accentColor: 'blue', mode: 'system' })).toEqual({
      accentColor: 'teal',
      mode: 'dark',
    });
  });
});
