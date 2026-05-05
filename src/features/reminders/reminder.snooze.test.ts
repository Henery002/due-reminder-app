import { getSnoozeOptions } from './reminder.snooze';

describe('reminder snooze options', () => {
  it('offers fast choices for common postponing moments', () => {
    expect(getSnoozeOptions()).toEqual([
      {
        days: 1,
        description: '明天这个时候再提醒',
        label: '明天提醒',
      },
      {
        days: 3,
        description: '先放一放，三天后再处理',
        label: '3 天后',
      },
      {
        days: 7,
        description: '适合不紧急但不能忘的事项',
        label: '下周提醒',
      },
    ]);
  });
});
