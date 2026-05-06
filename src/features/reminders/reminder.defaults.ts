import type { ReminderType } from './reminder.types';

export const DEFAULT_REMINDER_OFFSETS: Record<ReminderType, number[]> = {
  subscription: [7, 1, 0],
  bill: [3, 1, 0],
  document: [60, 30, 7],
};

export const MAX_CUSTOM_REMINDER_OFFSET_DAYS = 365;

export function getDefaultReminderOffsets(type: ReminderType): number[] {
  return [...DEFAULT_REMINDER_OFFSETS[type]];
}

export function getReminderOffsetLabel(offsetDays: number): string {
  if (offsetDays === 0) {
    return '到期当天';
  }

  return `提前 ${offsetDays} 天`;
}

export function normalizeSelectedReminderOffsets(
  type: ReminderType,
  selectedOffsets?: readonly number[],
): number[] {
  const defaultOffsets = getDefaultReminderOffsets(type);
  if (!selectedOffsets) {
    return defaultOffsets;
  }

  return Array.from(
    new Set(
      selectedOffsets.filter(
        (offsetDays) =>
          Number.isInteger(offsetDays) &&
          offsetDays >= 0 &&
          offsetDays <= MAX_CUSTOM_REMINDER_OFFSET_DAYS,
      ),
    ),
  ).sort((left, right) => right - left);
}
