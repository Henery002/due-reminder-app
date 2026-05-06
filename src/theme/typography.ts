import { themeTypography } from '../features/appearance/appearance.theme';

export const typography = {
  ...themeTypography,
  caption: themeTypography.label,
  title: themeTypography.pageTitle,
} as const;
