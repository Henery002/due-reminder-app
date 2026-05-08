import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';
import { runMigrations } from './migrations';
import type { PreferenceDatabase } from './preference.repository';
import type { ReminderDatabase } from './reminder.repository';
import { createWebMemoryDatabase } from './web-memory-database';

type AppDatabase = PreferenceDatabase & ReminderDatabase;

function createNativeDatabase(): AppDatabase {
  const SQLite = require('expo-sqlite') as typeof import('expo-sqlite');
  return SQLite.openDatabaseSync('due-reminder.db') as AppDatabase;
}

export const database: AppDatabase =
  Platform.OS === 'web' ? createWebMemoryDatabase() : createNativeDatabase();

export function initializeDatabase(): void {
  if (Platform.OS !== 'web') {
    runMigrations(database as unknown as SQLiteDatabase);
  }
}
