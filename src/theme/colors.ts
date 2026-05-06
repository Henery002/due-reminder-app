import { buildAppTheme } from '../features/appearance/appearance.theme';

export const colors = buildAppTheme({ accentColor: 'teal', mode: 'light' }).colors;
export type AppColors = typeof colors;
