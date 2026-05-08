import type { SQLiteBindParams } from 'expo-sqlite';
import type { PreferenceDatabase } from './preference.repository';
import type { ReminderDatabase } from './reminder.repository';

type ReminderRow = Record<string, unknown> & {
  dueDate: string;
  id: string;
};

type PreferenceRow = {
  value: string;
};

export type WebMemoryDatabase = ReminderDatabase &
  PreferenceDatabase & {
    execSync(source: string): void;
  };

export function createWebMemoryDatabase(): WebMemoryDatabase {
  const reminders = new Map<string, ReminderRow>();
  const preferences = new Map<string, string>();

  return {
    execSync() {
      // Web development builds use an in-memory store; schema migration is handled by shape mapping below.
    },

    getAllSync<T>(source: string): T[] {
      if (source.includes('FROM reminders')) {
        return Array.from(reminders.values()).sort((left, right) =>
          left.dueDate.localeCompare(right.dueDate),
        ) as T[];
      }

      return [];
    },

    getFirstSync<T>(source: string, params: SQLiteBindParams): T | null | undefined {
      if (!Array.isArray(params)) {
        return undefined;
      }

      if (source.includes('FROM reminders')) {
        return reminders.get(String(params[0])) as T | undefined;
      }

      if (source.includes('FROM app_preferences')) {
        const value = preferences.get(String(params[0]));
        return value ? ({ value } satisfies PreferenceRow as T) : undefined;
      }

      return undefined;
    },

    runSync(source: string, params: SQLiteBindParams): unknown {
      if (!Array.isArray(params)) {
        return undefined;
      }

      if (source.startsWith('DELETE FROM reminders')) {
        reminders.delete(String(params[0]));
        return undefined;
      }

      if (source.startsWith('INSERT OR REPLACE INTO app_preferences')) {
        preferences.set(String(params[0]), String(params[1]));
        return undefined;
      }

      if (source.startsWith('INSERT OR REPLACE INTO reminders')) {
        reminders.set(String(params[0]), {
          id: String(params[0]),
          type: params[1],
          name: params[2],
          dueDate: String(params[3]),
          amount: params[4],
          note: params[5],
          status: params[6],
          reminderMode: params[7],
          reminderRulesJson: params[8],
          createdAt: params[9],
          updatedAt: params[10],
          completedAt: params[11],
          snoozedUntil: params[12],
        });
      }

      return undefined;
    },
  };
}
