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
      reminderMode TEXT NOT NULL DEFAULT 'notify',
      reminderRulesJson TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      completedAt TEXT,
      snoozedUntil TEXT
    );

    CREATE TABLE IF NOT EXISTS app_preferences (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  try {
    database.execSync("ALTER TABLE reminders ADD COLUMN reminderMode TEXT NOT NULL DEFAULT 'notify';");
  } catch {
    // Column already exists on databases created by newer versions.
  }
}
