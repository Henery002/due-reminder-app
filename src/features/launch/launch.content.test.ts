import {
  getLaunchListingDraft,
  getLaunchScreenshotPlan,
  getVisualAssetDirection,
} from './launch.content';

describe('launch content', () => {
  it('keeps the app listing searchable without promising unavailable paid features', () => {
    expect(getLaunchListingDraft()).toEqual({
      appName: '到期提醒助手',
      keywords: ['到期提醒', '续费提醒', '账单提醒', '证件到期', '会员续费'],
      shortDescription: '订阅、账单、证件到期，能提醒，也能仅记录。',
      subtitle: '会员续费、账单缴费、证件到期都不再临时想起',
    });
    expect(getLaunchListingDraft().shortDescription).not.toContain('云同步');
    expect(getLaunchListingDraft().shortDescription).not.toContain('会员支付');
  });

  it('orders screenshots around the MVP user journey', () => {
    expect(getLaunchScreenshotPlan().map((item) => item.title)).toEqual([
      '首页看清最近要处理什么',
      '30 秒添加一个到期事项',
      '提醒方式自己决定',
      '延后、已处理、编辑都很快',
      '本地备份更安心',
    ]);
    expect(getLaunchScreenshotPlan()[2]).toEqual({
      caption: '本地提醒适合需要提前处理的事项，仅记录适合补录和留档。',
      screen: '新建事项 / 全部事项',
      title: '提醒方式自己决定',
    });
  });

  it('sets a young but not childish visual direction for icon and splash', () => {
    expect(getVisualAssetDirection()).toEqual({
      avoid: ['传统闹钟拟物图标', '大面积警告红', '老式日历翻页风', '廉价金币会员感'],
      iconConcept: '用轻盈日历卡片叠加提醒光点，表达“快到期但不慌”。',
      palette: ['清透青绿 #1BAE9F', '柔和橙 #F5A24A', '石墨灰 #1F2A2A', '浅雾绿 #F7FAF9'],
      splashConcept: '浅雾绿背景，中间是一张圆角到期卡片和一颗轻提示光点，文案保持克制。',
    });
  });
});
