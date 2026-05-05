export type LaunchListingDraft = {
  appName: string;
  keywords: string[];
  shortDescription: string;
  subtitle: string;
};

export type LaunchScreenshotItem = {
  caption: string;
  screen: string;
  title: string;
};

export type VisualAssetDirection = {
  avoid: string[];
  iconConcept: string;
  palette: string[];
  splashConcept: string;
};

export function getLaunchListingDraft(): LaunchListingDraft {
  return {
    appName: '到期提醒助手',
    keywords: ['到期提醒', '续费提醒', '账单提醒', '证件到期', '会员续费'],
    shortDescription: '订阅续费、账单缴费、证件到期，一起提前提醒。',
    subtitle: '会员续费、账单缴费、证件到期都不再临时想起',
  };
}

export function getLaunchScreenshotPlan(): LaunchScreenshotItem[] {
  return [
    {
      caption: '首页把今日、近 7 天和逾期事项放在最前面，打开就知道先处理什么。',
      screen: '首页',
      title: '首页看清最近要处理什么',
    },
    {
      caption: '选择类型和常用模板，再确认日期、金额和备注，不从空白表单开始。',
      screen: '新建事项',
      title: '30 秒添加一个到期事项',
    },
    {
      caption: '通知权限只用于本地到期提醒，拒绝授权也能继续管理清单。',
      screen: '通知权限',
      title: '本地通知提前提醒',
    },
    {
      caption: '临期事项可以直接标记已处理，或延后到明天、3 天后、下周。',
      screen: '首页 / 全部事项',
      title: '延后、已处理、编辑都很快',
    },
    {
      caption: '首版不急着做云同步，先用本地 JSON 备份文本降低换机和误删焦虑。',
      screen: '数据备份',
      title: '本地备份更安心',
    },
  ];
}

export function getVisualAssetDirection(): VisualAssetDirection {
  return {
    avoid: ['传统闹钟拟物图标', '大面积警告红', '老式日历翻页风', '廉价金币会员感'],
    iconConcept: '用轻盈日历卡片叠加提醒光点，表达“快到期但不慌”。',
    palette: ['清透青绿 #1BAE9F', '柔和橙 #F5A24A', '石墨灰 #1F2A2A', '浅雾绿 #F7FAF9'],
    splashConcept: '浅雾绿背景，中间是一张圆角到期卡片和一颗轻提示光点，文案保持克制。',
  };
}
