import { database } from './database';
import { createPreferenceRepository } from './preference.repository';

export const preferenceRepository = createPreferenceRepository(database);
