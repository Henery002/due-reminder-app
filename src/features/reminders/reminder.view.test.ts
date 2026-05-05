import {
  filterRemindersByStatus,
  filterRemindersByType,
  getReminderStatusLabel,
  getReminderTypeMeta,
  getVisibleAllReminders,
} from './reminder.view';
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

  it('filters reminders by selected status', () => {
    const items = [
      item({ id: 'active', status: 'active' }),
      item({ id: 'overdue', status: 'overdue' }),
      item({ id: 'snoozed', status: 'snoozed' }),
      item({ id: 'done', status: 'done' }),
    ];

    expect(filterRemindersByStatus(items, 'pending').map((entry) => entry.id)).toEqual([
      'active',
      'overdue',
      'snoozed',
    ]);
    expect(filterRemindersByStatus(items, 'done').map((entry) => entry.id)).toEqual(['done']);
  });

  it('combines all-items filters and keeps pending reminders before completed reminders', () => {
    const items = [
      item({ id: 'done-old', dueDate: '2026-05-01', status: 'done', type: 'bill' }),
      item({ id: 'subscription-later', dueDate: '2026-05-12', type: 'subscription' }),
      item({ id: 'bill-soon', dueDate: '2026-05-05', type: 'bill' }),
      item({ id: 'bill-overdue', dueDate: '2026-05-02', status: 'overdue', type: 'bill' }),
    ];

    expect(
      getVisibleAllReminders(items, {
        status: 'all',
        type: 'all',
      }).map((entry) => entry.id),
    ).toEqual(['bill-overdue', 'bill-soon', 'subscription-later', 'done-old']);
    expect(
      getVisibleAllReminders(items, {
        status: 'pending',
        type: 'bill',
      }).map((entry) => entry.id),
    ).toEqual(['bill-overdue', 'bill-soon']);
  });

  it('searches all-items reminders by name and note while preserving filters', () => {
    const items = [
      item({ id: 'netflix', name: '视频会员', note: '家庭共享订阅', type: 'subscription' }),
      item({ id: 'water-bill', name: '水电燃气缴费', note: '厨房表读数', type: 'bill' }),
      item({ id: 'driver-license', name: '驾驶证换证', note: '体检和照片', type: 'document' }),
    ];

    expect(
      getVisibleAllReminders(items, {
        query: '共享',
        status: 'all',
        type: 'subscription',
      }).map((entry) => entry.id),
    ).toEqual(['netflix']);
    expect(
      getVisibleAllReminders(items, {
        query: '缴费',
        status: 'all',
        type: 'all',
      }).map((entry) => entry.id),
    ).toEqual(['water-bill']);
    expect(
      getVisibleAllReminders(items, {
        query: '   ',
        status: 'all',
        type: 'document',
      }).map((entry) => entry.id),
    ).toEqual(['driver-license']);
  });

  it('shows today-specific copy for active reminders due today', () => {
    expect(getReminderStatusLabel(item({ dueDate: '2026-05-03' }), now)).toBe('今日到期');
  });

  it('keeps terminal status copy stable', () => {
    expect(getReminderStatusLabel(item({ status: 'done' }), now)).toBe('已处理');
    expect(getReminderStatusLabel(item({ status: 'overdue' }), now)).toBe('已逾期');
    expect(getReminderStatusLabel(item({ status: 'snoozed' }), now)).toBe('已延后');
  });

  it('returns visual metadata for reminder types', () => {
    expect(getReminderTypeMeta('subscription')).toEqual(
      expect.objectContaining({
        glyph: 'S',
        label: '订阅',
      }),
    );
    expect(getReminderTypeMeta('bill')).toEqual(
      expect.objectContaining({
        glyph: '¥',
        label: '账单',
      }),
    );
    expect(getReminderTypeMeta('document')).toEqual(
      expect.objectContaining({
        glyph: 'ID',
        label: '证件',
      }),
    );
  });
});
