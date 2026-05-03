import { createReminderSchema } from './reminder.schema';

describe('create reminder schema', () => {
  it('accepts a valid reminder draft', () => {
    const result = createReminderSchema.safeParse({
      type: 'subscription',
      name: '视频会员',
      dueDate: '2026-05-10',
      amount: 25,
      note: '自动续费前确认',
    });

    expect(result.success).toBe(true);
  });

  it('rejects blank names', () => {
    const result = createReminderSchema.safeParse({
      type: 'bill',
      name: '   ',
      dueDate: '2026-05-10',
    });

    expect(result.success).toBe(false);
  });
});
