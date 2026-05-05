export type MembershipPlan = {
  badge: string;
  description: string;
  features: string[];
  id: 'free' | 'pro';
  title: string;
};

export function getMembershipPlans(): MembershipPlan[] {
  return [
    {
      badge: '当前版本',
      description: '适合先验证通知可靠性和日常录入习惯。',
      features: ['最多 20 个到期事项', '推荐提醒规则', '基础模板', '本地存储'],
      id: 'free',
      title: '免费版',
    },
    {
      badge: '后续开放',
      description: '等核心提醒体验稳定后，再接入真实会员和支付。',
      features: ['无限事项', '自定义多级提醒', '去广告', '导出与云同步预留'],
      id: 'pro',
      title: 'Pro 会员',
    },
  ];
}
