import { filterRemindersByType, getReminderStatusLabel } from './reminder.view';
import type { ReminderItem } from './reminder.types';

const now = new Date('2026-05-03T08:00:00.000Z');

function item(overrides: Partial<ReminderItem>): ReminderItem {
  return {
    id: 'item-1',
    type: 'subscription',
    name: '视频会员',
    dueDate: '2026-05-10',
    status: 'active',
    reminderRules: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...overrides,
  };
}

describe('reminder view helpers', () => {
  it('filters reminders by selected type', () => {
    const items = [
      item({ id: 'subscription', type: 'subscription' }),
      item({ id: 'bill', type: 'bill' }),
      item({ id: 'document', type: 'document' }),
    ];

    expect(filterRemindersByType(items, 'all').map((entry) => entry.id)).toEqual([
      'subscription',
      'bill',
      'document',
    ]);
    expect(filterRemindersByType(items, 'bill').map((entry) => entry.id)).toEqual(['bill']);
  });

  it('shows today-specific copy for active reminders due today', () => {
    expect(getReminderStatusLabel(item({ dueDate: '2026-05-03' }), now)).toBe('今日到期');
  });

  it('keeps terminal status copy stable', () => {
    expect(getReminderStatusLabel(item({ status: 'done' }), now)).toBe('已处理');
    expect(getReminderStatusLabel(item({ status: 'overdue' }), now)).toBe('已逾期');
    expect(getReminderStatusLabel(item({ status: 'snoozed' }), now)).toBe('已延后');
  });
});
