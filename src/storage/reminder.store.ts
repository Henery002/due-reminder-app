import { database } from './database';
import { createReminderRepository } from './reminder.repository';

export const reminderRepository = createReminderRepository(database);
