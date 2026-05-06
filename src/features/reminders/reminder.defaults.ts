import type { ReminderType } from './reminder.types';

export const DEFAULT_REMINDER_OFFSETS: Record<ReminderType, number[]> = {
  subscription: [7, 1, 0],
  bill: [3, 1, 0],
  document: [60, 30, 7],
};

export const MAX_CUSTOM_REMINDER_OFFSET_DAYS = 365;
export const MAX_REMINDER_POINT_COUNT = 5;

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

export function canAddCustomReminderOffset(
  type: ReminderType,
  selectedOffsets?: readonly number[],
): boolean {
  return normalizeSelectedReminderOffsets(type, selectedOffsets).length < MAX_REMINDER_POINT_COUNT;
}

export function getCustomReminderOffsetInputError(
  input: string,
  type: ReminderType,
  selectedOffsets?: readonly number[],
): string | null {
  const normalizedInput = input.trim();
  if (!normalizedInput) {
    return '先输入提前天数，例如 14。';
  }

  if (!/^\d+$/.test(normalizedInput)) {
    return `请输入 0-${MAX_CUSTOM_REMINDER_OFFSET_DAYS} 之间的整数天数。`;
  }

  const offsetDays = Number(normalizedInput);
  if (offsetDays > MAX_CUSTOM_REMINDER_OFFSET_DAYS) {
    return `请输入 0-${MAX_CUSTOM_REMINDER_OFFSET_DAYS} 之间的整数天数。`;
  }

  if (normalizeSelectedReminderOffsets(type, selectedOffsets).includes(offsetDays)) {
    return '这个提醒点已经在计划里了，可以直接开启或关闭。';
  }

  if (!canAddCustomReminderOffset(type, selectedOffsets)) {
    return `已达到 ${MAX_REMINDER_POINT_COUNT} 个提醒点上限。`;
  }

  return null;
}
