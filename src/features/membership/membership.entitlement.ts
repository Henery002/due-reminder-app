export const FREE_REMINDER_LIMIT = 20;

export type ReminderCreationGate = {
  actionLabel?: string;
  allowed: boolean;
  limit: number;
  message: string;
  used: number;
};

export function getReminderCreationGate(
  reminderCount: number,
  limit = FREE_REMINDER_LIMIT,
): ReminderCreationGate {
  const used = Math.max(0, reminderCount);

  if (used >= limit) {
    return {
      actionLabel: '查看 Pro 预留权益',
      allowed: false,
      limit,
      message: `免费版最多保存 ${limit} 个到期事项。可以先删除不再需要的记录，或查看后续开放的 Pro 权益。`,
      used,
    };
  }

  return {
    allowed: true,
    limit,
    message: `还可以继续添加 ${limit - used} 个到期事项。`,
    used,
  };
}
