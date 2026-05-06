import type { SQLiteBindParams } from 'expo-sqlite';

export type PreferenceDatabase = {
  getFirstSync<T>(source: string, params: SQLiteBindParams): T | null | undefined;
  runSync(source: string, params: SQLiteBindParams): unknown;
};

type PreferenceRow = {
  value: string;
};

export function createPreferenceRepository(database: PreferenceDatabase) {
  return {
    getJson<T>(key: string, fallback: T): T {
      const row = database.getFirstSync<PreferenceRow>(
        'SELECT value FROM app_preferences WHERE key = ?',
        [key],
      );

      if (!row) {
        return fallback;
      }

      try {
        return JSON.parse(row.value) as T;
      } catch {
        return fallback;
      }
    },

    setJson(key: string, value: unknown): void {
      database.runSync('INSERT OR REPLACE INTO app_preferences (key, value) VALUES (?, ?)', [
        key,
        JSON.stringify(value),
      ]);
    },
  };
}

export type PreferenceRepository = ReturnType<typeof createPreferenceRepository>;
