import { getReminderFeedback } from './reminder.feedback';

describe('reminder feedback copy', () => {
  it('keeps success feedback light and action-oriented', () => {
    expect(getReminderFeedback('created')).toEqual({
      tone: 'success',
      title: '已安排好提醒',
      description: '这件事已经放进你的到期清单，快到期时会提醒你。',
    });
  });

  it('uses a soft warning when the free limit is reached', () => {
    expect(getReminderFeedback('free-limit')).toEqual({
      tone: 'warning',
      title: '免费版空间已满',
      description: '先删除不再需要的事项，或查看后续开放的 Pro 权益。',
    });
  });
});
