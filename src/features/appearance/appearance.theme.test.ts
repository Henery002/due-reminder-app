import { buildAppTheme, resolveColorScheme } from './appearance.theme';
import { normalizeAppearanceSettings } from './appearance.types';

describe('appearance theme', () => {
  it('falls back to safe defaults for invalid persisted settings', () => {
    const settings = normalizeAppearanceSettings({
      accentColor: 'purple' as never,
      mode: 'midnight' as never,
    });

    expect(settings).toEqual({
      accentColor: 'teal',
      mode: 'system',
    });
  });

  it('resolves system mode from the device color scheme', () => {
    expect(resolveColorScheme({ accentColor: 'blue', mode: 'system' }, 'dark')).toBe('dark');
    expect(resolveColorScheme({ accentColor: 'blue', mode: 'system' }, 'light')).toBe('light');
  });

  it('builds a dark theme with the selected accent color', () => {
    const theme = buildAppTheme({ accentColor: 'yellow', mode: 'dark' }, 'light');

    expect(theme.colorScheme).toBe('dark');
    expect(theme.colors.primary).toBe('#C98713');
    expect(theme.colors.background).toBe('#101615');
  });
});
