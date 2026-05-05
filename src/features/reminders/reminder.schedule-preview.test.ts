import { buildReminderSchedulePreview } from './reminder.schedule-preview';

describe('reminder schedule preview', () => {
  it('shows future reminder times from the selected due date', () => {
    const preview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-20',
        type: 'subscription',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );

    expect(preview.description).toBe('将安排 3 次本地提醒，默认在当天 09:00 提醒。');
    expect(preview.items).toEqual([
      {
        dateLabel: '2026-05-13',
        offsetLabel: '提前 7 天',
        timeLabel: '09:00',
      },
      {
        dateLabel: '2026-05-19',
        offsetLabel: '提前 1 天',
        timeLabel: '09:00',
      },
      {
        dateLabel: '2026-05-20',
        offsetLabel: '到期当天',
        timeLabel: '09:00',
      },
    ]);
  });

  it('hides reminder times that have already passed', () => {
    const preview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-20',
        type: 'bill',
      },
      new Date('2026-05-19T12:00:00.000Z'),
    );

    expect(preview.description).toBe('将安排 1 次本地提醒，默认在当天 09:00 提醒。');
    expect(preview.items.map((item) => item.offsetLabel)).toEqual(['到期当天']);
  });

  it('returns an empty-state copy when no future reminders can be scheduled', () => {
    const preview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-01',
        type: 'document',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );

    expect(preview.description).toBe(
      '这个到期日已经没有可安排的未来提醒，可以保存为记录，但不会自动触发新提醒。',
    );
    expect(preview.items).toEqual([]);
  });
});
