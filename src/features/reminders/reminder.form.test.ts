import { createReminderSchema } from './reminder.schema';
import { parseOptionalReminderAmount } from './reminder.form';

describe('reminder form helpers', () => {
  it('parses blank amount as optional', () => {
    expect(parseOptionalReminderAmount('  ')).toBeUndefined();
  });

  it('parses decimal amount input', () => {
    expect(parseOptionalReminderAmount(' 19.90 ')).toBe(19.9);
  });

  it('rejects non-numeric amount input before schema validation', () => {
    expect(() => parseOptionalReminderAmount('19 元')).toThrow('金额请输入数字，例如 19.9');
  });

  it('rejects impossible calendar dates', () => {
    const result = createReminderSchema.safeParse({
      type: 'document',
      name: '护照',
      dueDate: '2026-02-31',
    });

    expect(result.success).toBe(false);
  });
});
