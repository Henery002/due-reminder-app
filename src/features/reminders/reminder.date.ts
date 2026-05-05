import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export type ReminderDateUnit = 'year' | 'month' | 'day';

export type ReminderDateQuickOption = {
  label: string;
  value: string;
};

export type ReminderCalendarDay = {
  dayLabel: string;
  isCurrentMonth: boolean;
  isPast: boolean;
  isSelected: boolean;
  isToday: boolean;
  value: string;
};

export type ReminderMonthCalendar = {
  days: ReminderCalendarDay[];
  title: string;
  weekdays: string[];
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

export function buildReminderMonthCalendar(
  value: string,
  baseDate = new Date(),
): ReminderMonthCalendar {
  const selectedDate = parseISO(value);
  const today = formatReminderDate(baseDate);
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days: ReminderCalendarDay[] = [];

  let cursor = gridStart;
  while (cursor.getTime() <= gridEnd.getTime()) {
    const dateValue = formatReminderDate(cursor);
    days.push({
      dayLabel: format(cursor, 'd'),
      isCurrentMonth: cursor.getMonth() === selectedDate.getMonth(),
      isPast: differenceInCalendarDays(cursor, baseDate) < 0,
      isSelected: dateValue === value,
      isToday: dateValue === today,
      value: dateValue,
    });
    cursor = addDays(cursor, 1);
  }

  return {
    days,
    title: format(selectedDate, 'yyyy 年 M 月'),
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
  };
}
