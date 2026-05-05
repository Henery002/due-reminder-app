export type LegalRoute = '/permissions' | '/privacy-policy' | '/terms-of-use';

export type LegalAction = {
  description: string;
  href: LegalRoute;
  title: string;
};

export type LegalSection = {
  body: string;
  title: string;
};

export function getLegalActions(): LegalAction[] {
  return [
    {
      description: '说明当前版本如何处理本地数据、通知权限和反馈信息。',
      href: '/privacy-policy',
      title: '隐私政策',
    },
    {
      description: '说明原型阶段的使用边界、数据责任和服务限制。',
      href: '/terms-of-use',
      title: '用户协议',
    },
    {
      description: '说明为什么需要通知权限，以及当前不申请哪些敏感权限。',
      href: '/permissions',
      title: '权限说明',
    },
  ];
}

export function getPrivacyPolicySections(): LegalSection[] {
  return [
    {
      body: '当前版本不提供账号注册、登录、云同步、广告投放或真实支付能力。到期事项数据优先保存在你的设备本地 SQLite 数据库中。',
      title: '当前版本的数据处理方式',
    },
    {
      body: '你主动创建的事项可能包含事项名称、类型、到期日期、金额、备注和提醒规则。这些内容用于展示清单、计算到期状态和安排本地提醒。',
      title: '我们处理哪些信息',
    },
    {
      body: '通知权限仅用于到期提醒。反馈入口会调用系统邮件应用，邮件内容由你自行填写，发送前可以检查和修改。',
      title: '权限与反馈',
    },
    {
      body: '当前版本不会主动读取通讯录、相册、位置、麦克风、摄像头或短信，也不会向第三方广告、统计或支付 SDK 发送数据。',
      title: '当前不做的事',
    },
    {
      body: '你可以在应用内删除事项，也可以通过系统设置清除应用数据。使用数据备份功能时，请自行保存好导出的备份文本。',
      title: '你的控制方式',
    },
  ];
}

export function getTermsOfUseSections(): LegalSection[] {
  return [
    {
      body: '本应用仍处于 Android-first 原型验证阶段，提醒触达可能受到系统通知权限、省电策略、后台限制和设备厂商策略影响。',
      title: '服务阶段',
    },
    {
      body: '你应自行确认录入的到期日期、金额和备注准确性。本应用用于辅助提醒，不替代账单、合同、证件或服务提供方的正式通知。',
      title: '用户责任',
    },
    {
      body: '当前免费版最多保存 20 个到期事项。Pro 会员、广告、支付、云同步等能力仍为预留或规划，不代表已经开放收费服务。',
      title: '功能边界',
    },
    {
      body: '如果你导出备份文本，请妥善保存。备份文本可能包含你填写的事项名称、金额和备注，泄露后可能暴露个人生活信息。',
      title: '数据备份',
    },
  ];
}

export function getPermissionGuideSections(): LegalSection[] {
  return [
    {
      body: '通知权限用于在到期前展示本地提醒。拒绝授权不会影响你创建、编辑、删除或查看到期事项，只会导致系统通知无法触达。',
      title: '通知权限',
    },
    {
      body: '当前版本不申请位置、通讯录、相机、麦克风、相册、短信或电话权限。后续如果引入 OCR、截图识别或云同步，会先更新说明再接入。',
      title: '当前不申请的权限',
    },
    {
      body: 'Android 设备可能会因为省电策略或后台限制影响提醒触达。正式发布前需要继续做锁屏、后台和跨日提醒验证。',
      title: '系统限制',
    },
  ];
}
