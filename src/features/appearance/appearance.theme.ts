import {
  DEFAULT_APPEARANCE_SETTINGS,
  normalizeAppearanceSettings,
  type AccentColor,
  type AppearanceSettings,
} from './appearance.types';

export type ResolvedColorScheme = 'light' | 'dark';

type AccentPalette = {
  primary: string;
  primaryPressed: string;
  primarySoftDark: string;
  primarySoftLight: string;
};

const accentPalettes: Record<AccentColor, AccentPalette> = {
  teal: {
    primary: '#159F92',
    primaryPressed: '#0E7F75',
    primarySoftDark: '#173B38',
    primarySoftLight: '#DFF6F2',
  },
  blue: {
    primary: '#3478F6',
    primaryPressed: '#245FC8',
    primarySoftDark: '#1C315C',
    primarySoftLight: '#E6EEFF',
  },
  yellow: {
    primary: '#C98713',
    primaryPressed: '#9E690D',
    primarySoftDark: '#433418',
    primarySoftLight: '#FFF3D6',
  },
  mint: {
    primary: '#5FAF74',
    primaryPressed: '#43895A',
    primarySoftDark: '#1F3E2A',
    primarySoftLight: '#E6F6EA',
  },
};

const semanticColors = {
  done: '#4CA66A',
  doneSoftDark: '#203A29',
  doneSoftLight: '#E6F6EB',
  dueSoon: '#E39835',
  dueSoonSoftDark: '#442F18',
  dueSoonSoftLight: '#FFF0D9',
  overdue: '#E45D5D',
  overdueSoftDark: '#4A2528',
  overdueSoftLight: '#FFE9E9',
};

export const themeTypography = {
  pageTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 31,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    lineHeight: 21,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  bodyStrong: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 21,
  },
  helper: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 19,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
  metric: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
  },
} as const;

export const themeSpacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const themeRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const themeSizes = {
  buttonHeight: 44,
  buttonHeightSmall: 38,
  chipHeight: 32,
  iconBox: 36,
  listIconBox: 38,
} as const;

export type AppTheme = ReturnType<typeof buildAppTheme>;
export type AppColors = AppTheme['colors'];

export function resolveColorScheme(
  settings: AppearanceSettings,
  systemColorScheme?: 'light' | 'dark' | null,
): ResolvedColorScheme {
  if (settings.mode === 'light' || settings.mode === 'dark') {
    return settings.mode;
  }

  return systemColorScheme === 'dark' ? 'dark' : 'light';
}

export function buildAppTheme(
  rawSettings: Partial<AppearanceSettings> | null | undefined = DEFAULT_APPEARANCE_SETTINGS,
  systemColorScheme?: 'light' | 'dark' | null,
) {
  const settings = normalizeAppearanceSettings(rawSettings);
  const colorScheme = resolveColorScheme(settings, systemColorScheme);
  const accent = accentPalettes[settings.accentColor];
  const dark = colorScheme === 'dark';

  return {
    colorScheme,
    colors: {
      background: dark ? '#101615' : '#F7FAF9',
      border: dark ? '#2B3936' : '#E4ECEA',
      cardShadow: dark ? '#000000' : '#1F2A2A',
      done: semanticColors.done,
      doneSoft: dark ? semanticColors.doneSoftDark : semanticColors.doneSoftLight,
      dueSoon: semanticColors.dueSoon,
      dueSoonSoft: dark ? semanticColors.dueSoonSoftDark : semanticColors.dueSoonSoftLight,
      overlay: dark ? 'rgba(0, 0, 0, 0.52)' : 'rgba(31, 42, 42, 0.18)',
      overdue: semanticColors.overdue,
      overdueSoft: dark ? semanticColors.overdueSoftDark : semanticColors.overdueSoftLight,
      primary: accent.primary,
      primaryPressed: accent.primaryPressed,
      primarySoft: dark ? accent.primarySoftDark : accent.primarySoftLight,
      surface: dark ? '#17211F' : '#FFFFFF',
      surfaceElevated: dark ? '#1C2926' : '#FFFFFF',
      surfaceMuted: dark ? '#202C29' : '#EEF5F3',
      textMuted: dark ? '#7F928D' : '#9AA6A6',
      textPrimary: dark ? '#EEF6F3' : '#1F2A2A',
      textSecondary: dark ? '#A7B8B4' : '#667272',
    },
    preferences: settings,
    radius: themeRadii,
    sizes: themeSizes,
    spacing: themeSpacing,
    typography: themeTypography,
  };
}
