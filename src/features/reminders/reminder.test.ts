import { addDays, formatISO, subDays } from 'date-fns';
import { getHomeReminderSections, groupRemindersForHome } from './reminder.selectors';
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

  it('builds reminder rules only from enabled default offsets', () => {
    const rules = buildReminderRules('subscription', '2026-05-20', baseDate, [7, 0]);

    expect(rules.map((rule) => rule.offsetDays)).toEqual([7, 0]);
    expect(rules.map((rule) => rule.scheduledAt)).toEqual([
      '2026-05-13T01:00:00.000Z',
      '2026-05-20T01:00:00.000Z',
    ]);
  });

  it('builds reminder rules from custom offsets in schedule order', () => {
    const rules = buildReminderRules('bill', '2026-05-20', baseDate, [9, 1, 1, 0]);

    expect(rules.map((rule) => rule.offsetDays)).toEqual([9, 1, 0]);
    expect(rules.map((rule) => rule.id)).toEqual([
      'bill-2026-05-20-9',
      'bill-2026-05-20-1',
      'bill-2026-05-20-0',
    ]);
  });

  it('drops invalid custom offsets before building reminder rules', () => {
    const rules = buildReminderRules('subscription', '2026-05-20', baseDate, [
      366,
      7,
      2.5,
      -1,
      0,
    ]);

    expect(rules.map((rule) => rule.offsetDays)).toEqual([7, 0]);
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
    const result = snoozeReminder(
      item({
        id: 'later',
        reminderRules: [
          {
            id: 'later-existing',
            offsetDays: 1,
            scheduledAt: '2026-05-04T01:00:00.000Z',
            notificationId: 'notification-existing',
          },
        ],
      }),
      2,
      baseDate,
    );

    expect(result.status).toBe('snoozed');
    expect(result.snoozedUntil).toBe('2026-05-05T08:00:00.000Z');
    expect(result.updatedAt).toBe(baseDate.toISOString());
    expect(result.reminderRules).toEqual([
      {
        id: 'later-existing',
        offsetDays: 1,
        scheduledAt: '2026-05-04T01:00:00.000Z',
        notificationId: 'notification-existing',
      },
      {
        id: 'snooze-later-2026-05-05T08:00:00.000Z',
        offsetDays: 0,
        scheduledAt: '2026-05-05T08:00:00.000Z',
      },
    ]);
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

  it('builds visible home sections in urgency order', () => {
    const groups = groupRemindersForHome(
      [
        item({ id: 'seven-days', dueDate: '2026-05-09' }),
        item({ id: 'today', dueDate: '2026-05-03' }),
        item({ id: 'overdue', status: 'overdue', dueDate: '2026-05-01' }),
      ],
      baseDate,
    );

    const sections = getHomeReminderSections(groups);

    expect(sections.map((section) => section.key)).toEqual(['overdue', 'today', 'nextSevenDays']);
    expect(sections.map((section) => section.title)).toEqual([
      '已经逾期',
      '今天到期',
      '未来 7 天',
    ]);
    expect(sections.map((section) => section.items.map((entry) => entry.id))).toEqual([
      ['overdue'],
      ['today'],
      ['seven-days'],
    ]);
  });
});
