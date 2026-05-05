export type SettingsAction = {
  description: string;
  href: '/about' | '/data-backup' | '/feedback';
  title: string;
};

export type FeedbackChannel = {
  description: string;
  label: string;
  url: string;
};

export type AboutSection = {
  body: string;
  title: string;
};

export function getSettingsActions(): SettingsAction[] {
  return [
    {
      description: '导出备份文本，或从备份文本恢复到期事项。',
      href: '/data-backup',
      title: '数据备份',
    },
    {
      description: '告诉我哪里卡、哪里丑、哪里不够顺手。',
      href: '/feedback',
      title: '反馈建议',
    },
    {
      description: '版本、隐私和当前能力边界。',
      href: '/about',
      title: '关于应用',
    },
  ];
}

export function getFeedbackChannels(): FeedbackChannel[] {
  return [
    {
      description: '适合反馈通知不准、页面异常或使用建议。',
      label: '发送邮件',
      url: 'mailto:henery002@outlook.com?subject=%E5%88%B0%E6%9C%9F%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B%E5%8F%8D%E9%A6%88',
    },
  ];
}

export function getAboutSections(): AboutSection[] {
  return [
    {
      body: '当前版本优先验证本地记录与本地通知可靠性，暂未接入账号、云同步、广告或真实支付。',
      title: '当前阶段',
    },
    {
      body: '到期提醒助手会把订阅续费、账单缴费和证件到期放在一个轻量清单里，帮你提前处理容易忘的小事。',
      title: '产品定位',
    },
    {
      body: '数据优先保存在本机 SQLite。导出备份文本后，请自行保存到安全位置。',
      title: '数据说明',
    },
  ];
}
