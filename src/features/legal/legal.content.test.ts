import {
  getLegalActions,
  getPermissionGuideSections,
  getPrivacyPolicySections,
  getTermsOfUseSections,
} from './legal.content';

describe('legal content', () => {
  it('exposes legal document entries for in-app navigation', () => {
    expect(getLegalActions()).toEqual([
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
    ]);
  });

  it('keeps privacy policy honest about local-first storage and no account system', () => {
    expect(getPrivacyPolicySections()).toContainEqual({
      body: '当前版本不提供账号注册、登录、云同步、广告投放或真实支付能力。到期事项数据优先保存在你的设备本地 SQLite 数据库中。',
      title: '当前版本的数据处理方式',
    });
  });

  it('states notification permission is optional and only used for reminders', () => {
    expect(getPermissionGuideSections()).toContainEqual({
      body: '通知权限用于在到期前展示本地提醒。拒绝授权不会影响你创建、编辑、删除或查看到期事项，只会导致系统通知无法触达。',
      title: '通知权限',
    });
  });

  it('sets clear prototype-stage service boundaries in terms', () => {
    expect(getTermsOfUseSections()).toContainEqual({
      body: '本应用仍处于 Android-first 原型验证阶段，提醒触达可能受到系统通知权限、省电策略、后台限制和设备厂商策略影响。',
      title: '服务阶段',
    });
  });
});
