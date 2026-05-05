import { getFirstRunGuideCards, getHomeEmptyMode } from './reminder.onboarding';

describe('reminder onboarding helpers', () => {
  it('shows first-run guidance only when there are no reminders at all', () => {
    expect(getHomeEmptyMode({ totalCount: 0, visibleCount: 0 })).toBe('first-run');
    expect(getHomeEmptyMode({ totalCount: 3, visibleCount: 0 })).toBe('filtered-empty');
    expect(getHomeEmptyMode({ totalCount: 3, visibleCount: 2 })).toBe('none');
  });

  it('recommends concrete starter scenarios for new users', () => {
    expect(getFirstRunGuideCards()).toEqual([
      {
        description: '视频会员、网盘、软件订阅，先录一个最容易忘的。',
        glyph: 'S',
        title: '订阅续费',
      },
      {
        description: '房租、水电、信用卡年费，避免临期才想起来。',
        glyph: '¥',
        title: '账单缴费',
      },
      {
        description: '驾驶证、护照、资格证，适合提前很久提醒。',
        glyph: 'ID',
        title: '证件到期',
      },
    ]);
  });
});
