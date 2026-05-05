import { getScreenshotDemoReminders } from './demo-data';

describe('screenshot demo data', () => {
  it('builds safe sample reminders for app store screenshots', () => {
    const reminders = getScreenshotDemoReminders(new Date('2026-05-05T08:00:00.000Z'));

    expect(reminders.map((item) => [item.name, item.type, item.dueDate, item.status])).toEqual([
      ['视频会员', 'subscription', '2026-05-05', 'active'],
      ['信用卡年费', 'bill', '2026-05-08', 'active'],
      ['驾驶证换证', 'document', '2026-06-19', 'active'],
      ['云服务器续费', 'subscription', '2026-05-12', 'active'],
      ['水电燃气缴费', 'bill', '2026-05-04', 'overdue'],
    ]);
    expect(reminders.every((item) => item.id.startsWith('demo-'))).toBe(true);
    expect(reminders.every((item) => item.reminderRules.length > 0)).toBe(true);
  });
});
