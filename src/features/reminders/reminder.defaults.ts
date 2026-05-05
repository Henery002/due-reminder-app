import type { ReminderType } from './reminder.types';

export const DEFAULT_REMINDER_OFFSETS: Record<ReminderType, number[]> = {
  subscription: [7, 1, 0],
  bill: [3, 1, 0],
  document: [60, 30, 7],
};

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

  const selectedSet = new Set(selectedOffsets);
  return defaultOffsets.filter((offsetDays) => selectedSet.has(offsetDays));
}
