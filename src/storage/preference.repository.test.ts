import type { SQLiteBindParams } from 'expo-sqlite';
import { createPreferenceRepository, type PreferenceDatabase } from './preference.repository';

function createFakeDatabase() {
  const rows = new Map<string, string>();
  const database: PreferenceDatabase = {
    getFirstSync<T>(_sql: string, params: SQLiteBindParams) {
      const key = Array.isArray(params) ? String(params[0]) : '';
      const value = rows.get(key);
      return value ? ({ value } as T) : undefined;
    },
    runSync(_sql: string, params: SQLiteBindParams) {
      if (Array.isArray(params)) {
        rows.set(String(params[0]), String(params[1]));
      }
    },
  };

  return { database, rows };
}

describe('preference repository', () => {
  it('stores and reads json preferences', () => {
    const { database } = createFakeDatabase();
    const repository = createPreferenceRepository(database);

    repository.setJson('appearance', { accentColor: 'blue', mode: 'dark' });

    expect(repository.getJson('appearance', { accentColor: 'teal', mode: 'system' })).toEqual({
      accentColor: 'blue',
      mode: 'dark',
    });
  });

  it('falls back when stored json is invalid', () => {
    const { database, rows } = createFakeDatabase();
    const repository = createPreferenceRepository(database);

    rows.set('appearance', '{broken');

    expect(repository.getJson('appearance', { accentColor: 'teal', mode: 'system' })).toEqual({
      accentColor: 'teal',
      mode: 'system',
    });
  });
});
