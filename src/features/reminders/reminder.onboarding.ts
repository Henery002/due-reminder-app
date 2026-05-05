export type HomeEmptyMode = 'first-run' | 'filtered-empty' | 'none';

export type FirstRunGuideCard = {
  description: string;
  glyph: string;
  title: string;
};

export function getHomeEmptyMode(input: { totalCount: number; visibleCount: number }): HomeEmptyMode {
  if (input.visibleCount > 0) {
    return 'none';
  }

  return input.totalCount === 0 ? 'first-run' : 'filtered-empty';
}

export function getFirstRunGuideCards(): FirstRunGuideCard[] {
  return [
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
  ];
}
