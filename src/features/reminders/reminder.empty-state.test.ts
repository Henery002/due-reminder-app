import { getReminderEmptyStateContent } from './reminder.empty-state';

describe('reminder empty state content', () => {
  it('keeps the filtered home empty state lightweight and action-oriented', () => {
    expect(getReminderEmptyStateContent('home-filtered')).toEqual({
      accentLabel: '近期清爽',
      chips: ['切换分类看看', '添加新到期日'],
      description: '当前分类最近没有需要处理的事项。可以换个分类，或者把刚想到的续费、账单先记下来。',
      glyph: 'Zz',
      title: '这个分类最近很安静',
    });
  });

  it('guides users to create the first item from the all-items page', () => {
    expect(getReminderEmptyStateContent('items-empty')).toEqual({
      accentLabel: '从一件事开始',
      chips: ['会员续费', '账单缴费', '证件到期'],
      description: '先录入一个真实会到期的事项，后面再慢慢补金额、备注和提醒规则。',
      glyph: '+',
      title: '你的到期日清单还是空的',
    });
  });
});
