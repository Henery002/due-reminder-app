export type AppearanceMode = 'system' | 'light' | 'dark';
export type AccentColor = 'teal' | 'blue' | 'yellow' | 'mint';

export type AppearanceSettings = {
  accentColor: AccentColor;
  mode: AppearanceMode;
};

export type AppearanceOption<T extends string> = {
  description: string;
  label: string;
  value: T;
};

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  accentColor: 'teal',
  mode: 'system',
};

export const appearanceModeOptions: Array<AppearanceOption<AppearanceMode>> = [
  {
    description: '跟随手机系统深浅色。',
    label: '跟随系统',
    value: 'system',
  },
  {
    description: '清爽浅色界面。',
    label: '浅色',
    value: 'light',
  },
  {
    description: '低亮度深色界面。',
    label: '深色',
    value: 'dark',
  },
];

export const accentColorOptions: Array<AppearanceOption<AccentColor>> = [
  {
    description: '默认清爽生活感。',
    label: '青绿色',
    value: 'teal',
  },
  {
    description: '效率工具常用色。',
    label: '蓝色',
    value: 'blue',
  },
  {
    description: '轻快但不过度警告。',
    label: '柔黄色',
    value: 'yellow',
  },
  {
    description: '更柔和的日常感。',
    label: '浅绿色',
    value: 'mint',
  },
];

const appearanceModes = new Set<AppearanceMode>(appearanceModeOptions.map((option) => option.value));
const accentColors = new Set<AccentColor>(accentColorOptions.map((option) => option.value));

export function normalizeAppearanceSettings(
  settings?: Partial<AppearanceSettings> | null,
): AppearanceSettings {
  return {
    accentColor:
      settings?.accentColor && accentColors.has(settings.accentColor)
        ? settings.accentColor
        : DEFAULT_APPEARANCE_SETTINGS.accentColor,
    mode:
      settings?.mode && appearanceModes.has(settings.mode)
        ? settings.mode
        : DEFAULT_APPEARANCE_SETTINGS.mode,
  };
}
