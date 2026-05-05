import { getAboutSections, getFeedbackChannels, getSettingsActions } from './settings.content';

describe('settings content', () => {
  it('lists practical settings actions for the me tab', () => {
    expect(getSettingsActions()).toEqual([
      {
        description: '导出备份文本，或从备份文本恢复到期事项。',
        href: '/data-backup',
        icon: 'B',
        title: '数据备份',
      },
      {
        description: '告诉我哪里卡、哪里丑、哪里不够顺手。',
        href: '/feedback',
        icon: 'F',
        title: '反馈建议',
      },
      {
        description: '版本、隐私和当前能力边界。',
        href: '/about',
        icon: 'i',
        title: '关于应用',
      },
    ]);
  });

  it('keeps feedback channels lightweight before account systems exist', () => {
    expect(getFeedbackChannels()[0]).toEqual({
      description: '适合反馈通知不准、页面异常或使用建议。',
      label: '发送邮件',
      url: 'mailto:henery002@outlook.com?subject=%E5%88%B0%E6%9C%9F%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B%E5%8F%8D%E9%A6%88',
    });
  });

  it('explains the local-first boundary clearly', () => {
    expect(getAboutSections()).toContainEqual({
      body: '当前版本优先验证本地记录与本地通知可靠性，暂未接入账号、云同步、广告或真实支付。',
      title: '当前阶段',
    });
  });
});
