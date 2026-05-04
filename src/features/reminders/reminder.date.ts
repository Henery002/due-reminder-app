import { addDays, addMonths, addYears, differenceInCalendarDays, endOfMonth, format, parseISO } from 'date-fns';

export type ReminderDateUnit = 'year' | 'month' | 'day';

export type ReminderDateQuickOption = {
  label: string;
  value: string;
};

export function formatReminderDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getReminderDateQuickOptions(baseDate = new Date()): ReminderDateQuickOption[] {
  return [
    { label: '今天', value: formatReminderDate(baseDate) },
    { label: '明天', value: formatReminderDate(addDays(baseDate, 1)) },
    { label: '7 天后', value: formatReminderDate(addDays(baseDate, 7)) },
    { label: '30 天后', value: formatReminderDate(addDays(baseDate, 30)) },
    { label: '本月底', value: formatReminderDate(endOfMonth(baseDate)) },
  ];
}

export function shiftReminderDate(value: string, unit: ReminderDateUnit, amount: number): string {
  const date = parseISO(value);

  if (unit === 'year') {
    return formatReminderDate(addYears(date, amount));
  }

  if (unit === 'month') {
    return formatReminderDate(addMonths(date, amount));
  }

  return formatReminderDate(addDays(date, amount));
}

export function getReminderDateDescription(value: string, baseDate = new Date()): string {
  const days = differenceInCalendarDays(parseISO(value), baseDate);

  if (days === 0) {
    return '今天到期';
  }

  if (days > 0) {
    return `还有 ${days} 天到期`;
  }

  return `已逾期 ${Math.abs(days)} 天`;
}
