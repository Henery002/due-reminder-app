import { z } from 'zod';

export const createReminderSchema = z.object({
  type: z.enum(['subscription', 'bill', 'document']),
  name: z.string().trim().min(1, '请输入名称').max(40, '名称不要超过 40 个字'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '请输入 YYYY-MM-DD 格式的日期'),
  amount: z.number().nonnegative('金额不能为负数').optional(),
  note: z.string().max(120, '备注不要超过 120 个字').optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
