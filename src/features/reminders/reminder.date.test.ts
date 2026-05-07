import {
  buildReminderMonthCalendar,
  formatReminderDate,
  getReminderDateDescription,
  getReminderDateQuickOptions,
  shiftReminderDate,
} from './reminder.date';

describe('reminder date helpers', () => {
  const baseDate = new Date('2026-05-04T08:00:00.000Z');

  it('builds quick date options from the current day', () => {
    expect(getReminderDateQuickOptions(baseDate)).toEqual([
      { label: '今天', value: '2026-05-04' },
      { label: '明天', value: '2026-05-05' },
      { label: '7 天后', value: '2026-05-11' },
      { label: '30 天后', value: '2026-06-03' },
      { label: '本月底', value: '2026-05-31' },
    ]);
  });

  it('shifts a reminder date by year, month, or day', () => {
    expect(shiftReminderDate('2026-01-31', 'month', 1)).toBe('2026-02-28');
    expect(shiftReminderDate('2026-05-04', 'day', 7)).toBe('2026-05-11');
    expect(shiftReminderDate('2026-05-04', 'year', -1)).toBe('2025-05-04');
  });

  it('formats and describes selected dates for form display', () => {
    expect(formatReminderDate(new Date('2026-05-04T08:00:00.000Z'))).toBe('2026-05-04');
    expect(getReminderDateDescription('2026-05-04', baseDate)).toBe('今天到期');
    expect(getReminderDateDescription('2026-05-05', baseDate)).toBe('还有 1 天到期');
    expect(getReminderDateDescription('2026-05-03', baseDate)).toBe('已逾期 1 天');
  });

  it('falls back safely when the selected date is not loaded yet', () => {
    expect(getReminderDateDescription('', baseDate)).toBe('先选择到期日期');

    const calendar = buildReminderMonthCalendar('', baseDate);

    expect(calendar.title).toBe('2026 年 5 月');
    expect(calendar.days.find((day) => day.value === '2026-05-04')).toEqual(
      expect.objectContaining({
        isSelected: true,
        isToday: true,
      }),
    );
    expect(shiftReminderDate('', 'day', 1, baseDate)).toBe('2026-05-05');
  });

  it('builds a compact month calendar grid around the selected date', () => {
    const calendar = buildReminderMonthCalendar('2026-05-04', baseDate);

    expect(calendar.title).toBe('2026 年 5 月');
    expect(calendar.weekdays).toEqual(['一', '二', '三', '四', '五', '六', '日']);
    expect(calendar.days).toHaveLength(35);
    expect(calendar.weeks).toHaveLength(5);
    expect(calendar.weeks.every((week) => week.length === 7)).toBe(true);
    expect(calendar.weeks.map((week) => week[6].dayLabel)).toEqual(['3', '10', '17', '24', '31']);
    expect(calendar.days[0]).toEqual({
      dayLabel: '27',
      isCurrentMonth: false,
      isPast: true,
      isSelected: false,
      isToday: false,
      value: '2026-04-27',
    });
    expect(calendar.days.find((day) => day.value === '2026-05-04')).toEqual({
      dayLabel: '4',
      isCurrentMonth: true,
      isPast: false,
      isSelected: true,
      isToday: true,
      value: '2026-05-04',
    });
  });
});
