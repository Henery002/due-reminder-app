import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrations';

export const database = SQLite.openDatabaseSync('due-reminder.db');

export function initializeDatabase(): void {
  runMigrations(database);
}
