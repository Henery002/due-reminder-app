import type { SQLiteDatabase } from 'expo-sqlite';

export function runMigrations(database: SQLiteDatabase): void {
  database.execSync(`
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      amount REAL,
      note TEXT,
      status TEXT NOT NULL,
      reminderRulesJson TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      completedAt TEXT,
      snoozedUntil TEXT
    );
  `);
}
