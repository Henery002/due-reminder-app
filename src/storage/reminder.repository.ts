import type { SQLiteBindParams } from 'expo-sqlite';
import type { ReminderItem } from '../features/reminders/reminder.types';

export type ReminderDatabase = {
  getAllSync<T>(source: string): T[];
  getAllSync<T>(source: string, params: SQLiteBindParams): T[];
  getFirstSync<T>(source: string, params: SQLiteBindParams): T | null | undefined;
  runSync(source: string, params: SQLiteBindParams): unknown;
};

type ReminderRow = Omit<ReminderItem, 'reminderRules'> & {
  amount: number | null;
  note: string | null;
  completedAt: string | null;
  snoozedUntil: string | null;
  reminderRulesJson: string;
};

function fromRow(row: ReminderRow): ReminderItem {
  const item: ReminderItem = {
    id: row.id,
    type: row.type,
    name: row.name,
    dueDate: row.dueDate,
    status: row.status,
    reminderRules: JSON.parse(row.reminderRulesJson),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  if (row.amount !== null) {
    item.amount = row.amount;
  }

  if (row.note !== null) {
    item.note = row.note;
  }

  if (row.completedAt !== null) {
    item.completedAt = row.completedAt;
  }

  if (row.snoozedUntil !== null) {
    item.snoozedUntil = row.snoozedUntil;
  }

  return item;
}

function toParams(item: ReminderItem) {
  return {
    ...item,
    amount: item.amount ?? null,
    note: item.note ?? null,
    completedAt: item.completedAt ?? null,
    snoozedUntil: item.snoozedUntil ?? null,
    reminderRulesJson: JSON.stringify(item.reminderRules),
  };
}

export function createReminderRepository(database: ReminderDatabase) {
  return {
    list(): ReminderItem[] {
      const rows = database.getAllSync<ReminderRow>('SELECT * FROM reminders ORDER BY dueDate ASC');
      return rows.map(fromRow);
    },

    getById(id: string): ReminderItem | undefined {
      const row = database.getFirstSync<ReminderRow>('SELECT * FROM reminders WHERE id = ?', [id]);
      return row ? fromRow(row) : undefined;
    },

    upsert(item: ReminderItem): void {
      const params = toParams(item);

      database.runSync(
        `INSERT OR REPLACE INTO reminders (
          id, type, name, dueDate, amount, note, status, reminderRulesJson,
          createdAt, updatedAt, completedAt, snoozedUntil
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          params.id,
          params.type,
          params.name,
          params.dueDate,
          params.amount,
          params.note,
          params.status,
          params.reminderRulesJson,
          params.createdAt,
          params.updatedAt,
          params.completedAt,
          params.snoozedUntil,
        ],
      );
    },

    remove(id: string): void {
      database.runSync('DELETE FROM reminders WHERE id = ?', [id]);
    },
  };
}

export type ReminderRepository = ReturnType<typeof createReminderRepository>;
