import {
  FREE_REMINDER_LIMIT,
  getReminderCreationGate,
} from './membership.entitlement';

describe('membership entitlement helpers', () => {
  it('allows free users to create reminders before the limit', () => {
    expect(getReminderCreationGate(19)).toEqual({
      allowed: true,
      limit: FREE_REMINDER_LIMIT,
      message: '还可以继续添加 1 个到期事项。',
      used: 19,
    });
  });

  it('blocks new reminders at the free plan limit with a useful next step', () => {
    expect(getReminderCreationGate(20)).toEqual({
      actionLabel: '查看 Pro 预留权益',
      allowed: false,
      limit: FREE_REMINDER_LIMIT,
      message: '免费版最多保存 20 个到期事项。可以先删除不再需要的记录，或查看后续开放的 Pro 权益。',
      used: 20,
    });
  });
});
