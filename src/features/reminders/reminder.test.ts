import { addDays, formatISO, subDays } from 'date-fns';
import { groupRemindersForHome } from './reminder.selectors';
import {
  buildReminderRules,
  markReminderDone,
  refreshReminderStatus,
  snoozeReminder,
} from './reminder.service';
import type { ReminderItem } from './reminder.types';

const baseDate = new Date('2026-05-03T08:00:00.000Z');

function item(overrides: Partial<ReminderItem>): ReminderItem {
  return {
    id: 'item-1',
    type: 'subscription',
    name: '视频会员',
    dueDate: formatISO(addDays(baseDate, 2), { representation: 'date' }),
    status: 'active',
    reminderRules: [],
    createdAt: baseDate.toISOString(),
    updatedAt: baseDate.toISOString(),
    ...overrides,
  };
}

describe('reminder service', () => {
  it('builds default reminder rules from due date and offsets', () => {
    const rules = buildReminderRules('bill', '2026-05-10', baseDate);

    expect(rules.map((rule) => rule.offsetDays)).toEqual([3, 1, 0]);
    expect(rules.map((rule) => rule.scheduledAt)).toEqual([
      '2026-05-07T01:00:00.000Z',
      '2026-05-09T01:00:00.000Z',
      '2026-05-10T01:00:00.000Z',
    ]);
  });

  it('marks active reminders overdue when due date has passed', () => {
    const result = refreshReminderStatus(
      item({
        dueDate: formatISO(subDays(baseDate, 1), { representation: 'date' }),
      }),
      baseDate,
    );

    expect(result.status).toBe('overdue');
  });

  it('keeps done reminders done', () => {
    const result = refreshReminderStatus(
      item({
        status: 'done',
        dueDate: formatISO(subDays(baseDate, 1), { representation: 'date' }),
      }),
      baseDate,
    );

    expect(result.status).toBe('done');
  });

  it('marks reminders done with completion metadata', () => {
    const result = markReminderDone(item({ id: 'todo' }), baseDate);

    expect(result.status).toBe('done');
    expect(result.completedAt).toBe(baseDate.toISOString());
    expect(result.updatedAt).toBe(baseDate.toISOString());
  });

  it('snoozes reminders for a future day', () => {
    const result = snoozeReminder(item({ id: 'later' }), 2, baseDate);

    expect(result.status).toBe('snoozed');
    expect(result.snoozedUntil).toBe('2026-05-05T08:00:00.000Z');
    expect(result.updatedAt).toBe(baseDate.toISOString());
  });
});

describe('home grouping', () => {
  it('groups reminders by urgency', () => {
    const groups = groupRemindersForHome(
      [
        item({ id: 'today', dueDate: '2026-05-03' }),
        item({ id: 'three-days', dueDate: '2026-05-05' }),
        item({ id: 'seven-days', dueDate: '2026-05-09' }),
        item({ id: 'overdue', status: 'overdue', dueDate: '2026-05-01' }),
      ],
      baseDate,
    );

    expect(groups.today.map((entry) => entry.id)).toEqual(['today']);
    expect(groups.nextThreeDays.map((entry) => entry.id)).toEqual(['three-days']);
    expect(groups.nextSevenDays.map((entry) => entry.id)).toEqual(['seven-days']);
    expect(groups.overdue.map((entry) => entry.id)).toEqual(['overdue']);
  });
});
