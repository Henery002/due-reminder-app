import { buildReminderSchedulePreview, getReminderSaveSummary } from './reminder.schedule-preview';

describe('reminder schedule preview', () => {
  it('shows future reminder times from the selected due date', () => {
    const preview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-20',
        type: 'subscription',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );

    expect(preview.status).toBe('scheduled');
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

    expect(preview.status).toBe('scheduled');
    expect(preview.description).toBe('将安排 1 次本地提醒，默认在当天 09:00 提醒。');
    expect(preview.items.map((item) => item.offsetLabel)).toEqual(['到期当天']);
  });

  it('previews only enabled default reminder points', () => {
    const preview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-20',
        selectedOffsets: [7, 0],
        type: 'subscription',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );

    expect(preview.status).toBe('scheduled');
    expect(preview.description).toBe('将安排 2 次本地提醒，默认在当天 09:00 提醒。');
    expect(preview.items.map((item) => item.offsetLabel)).toEqual(['提前 7 天', '到期当天']);
  });

  it('previews custom reminder points together with defaults', () => {
    const preview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-20',
        selectedOffsets: [10, 7, 1, 0],
        type: 'subscription',
      },
      new Date('2026-05-05T08:00:00.000Z'),
    );

    expect(preview.status).toBe('scheduled');
    expect(preview.description).toBe('将安排 4 次本地提醒，默认在当天 09:00 提醒。');
    expect(preview.items.map((item) => item.offsetLabel)).toEqual([
      '提前 10 天',
      '提前 7 天',
      '提前 1 天',
      '到期当天',
    ]);
  });

  it('returns an empty-state copy when no future reminders can be scheduled', () => {
    const preview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-01',
        type: 'document',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );

    expect(preview.status).toBe('record-only');
    expect(preview.description).toBe(
      '这个到期日已经没有可安排的未来提醒，可以保存为记录，但不会自动触发新提醒。',
    );
    expect(preview.items).toEqual([]);
  });

  it('marks invalid date input as waiting for a valid schedule', () => {
    const preview = buildReminderSchedulePreview(
      {
        dueDate: '',
        type: 'document',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );

    expect(preview.status).toBe('invalid-date');
    expect(preview.description).toBe('先选择一个有效到期日，再查看实际提醒计划。');
    expect(preview.items).toEqual([]);
  });

  it('summarizes save behavior from reminder mode and preview status', () => {
    const scheduledPreview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-20',
        type: 'subscription',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );
    const recordOnlyPreview = buildReminderSchedulePreview(
      {
        dueDate: '2026-05-01',
        type: 'subscription',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );
    const invalidPreview = buildReminderSchedulePreview(
      {
        dueDate: '',
        type: 'subscription',
      },
      new Date('2026-05-10T08:00:00.000Z'),
    );

    expect(getReminderSaveSummary(scheduledPreview, 'notify')).toBe(
      '保存后将安排 3 次本地提醒。',
    );
    expect(getReminderSaveSummary(recordOnlyPreview, 'notify')).toBe(
      '当前没有可安排的未来提醒，会保存为记录。',
    );
    expect(getReminderSaveSummary(scheduledPreview, 'record-only')).toBe(
      '将保存为仅记录，不发送本地通知。',
    );
    expect(getReminderSaveSummary(invalidPreview, 'notify')).toBe(
      '选择有效到期日后再生成提醒计划。',
    );
  });
});
