import { createContext, useContext, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import {
  buildAppTheme,
  type AppTheme,
} from '../features/appearance/appearance.theme';
import {
  DEFAULT_APPEARANCE_SETTINGS,
  normalizeAppearanceSettings,
  type AppearanceSettings,
} from '../features/appearance/appearance.types';
import { preferenceRepository } from '../storage/preference.store';

export type { AppTheme } from '../features/appearance/appearance.theme';

const APPEARANCE_PREFERENCE_KEY = 'appearance';

type AppearanceContextValue = {
  settings: AppearanceSettings;
  setAppearanceSettings(nextSettings: AppearanceSettings): void;
  updateAppearanceSettings(patch: Partial<AppearanceSettings>): void;
};

const fallbackTheme = buildAppTheme(DEFAULT_APPEARANCE_SETTINGS, 'light');
const ThemeContext = createContext<AppTheme>(fallbackTheme);
const AppearanceContext = createContext<AppearanceContextValue>({
  settings: DEFAULT_APPEARANCE_SETTINGS,
  setAppearanceSettings: () => undefined,
  updateAppearanceSettings: () => undefined,
});

function readStoredAppearanceSettings(): AppearanceSettings {
  return normalizeAppearanceSettings(
    preferenceRepository.getJson(APPEARANCE_PREFERENCE_KEY, DEFAULT_APPEARANCE_SETTINGS),
  );
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState(readStoredAppearanceSettings);
  const theme = buildAppTheme(settings, systemColorScheme);

  const setAppearanceSettings = (nextSettings: AppearanceSettings) => {
    const normalized = normalizeAppearanceSettings(nextSettings);
    preferenceRepository.setJson(APPEARANCE_PREFERENCE_KEY, normalized);
    setSettings(normalized);
  };

  const updateAppearanceSettings = (patch: Partial<AppearanceSettings>) => {
    setAppearanceSettings({
      ...settings,
      ...patch,
    });
  };

  return (
    <AppearanceContext.Provider
      value={{
        settings,
        setAppearanceSettings,
        updateAppearanceSettings,
      }}
    >
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </AppearanceContext.Provider>
  );
}

export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}

export function useAppearanceSettings(): AppearanceContextValue {
  return useContext(AppearanceContext);
}
