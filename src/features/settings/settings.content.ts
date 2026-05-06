export type SettingsAction = {
  description: string;
  href: '/about' | '/data-backup' | '/feedback';
  icon: string;
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

export type ReminderPreferenceNote = {
  body: string;
  glyph: string;
  title: string;
};

export function getSettingsActions(): SettingsAction[] {
  return [
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
  ];
}

export function getVisualSystemSummary(): string[] {
  return [
    '页面标题默认 24 号、700 字重，不再使用大字全粗模式。',
    '普通卡片、按钮和列表行使用更克制的内边距与圆角。',
    '外观支持跟随系统、浅色、深色和多主题色配置。',
  ];
}

export function getReminderPreferenceNotes(): ReminderPreferenceNote[] {
  return [
    {
      body: '新建事项默认使用本地提醒；如果只想留一条到期记录，可以在表单里关闭“安排本地提醒”。',
      glyph: 'N',
      title: '默认使用本地提醒',
    },
    {
      body: '适合补录已过期事项、线下已处理但想留档的记录，或暂时不想收到系统通知的事项。',
      glyph: 'R',
      title: '仅记录适用场景',
    },
    {
      body: '本地提醒可关闭默认提醒点，也能添加 0-365 天内的自定义提醒；单个事项最多保留 5 个提醒点。',
      glyph: '5',
      title: '提醒点上限',
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
