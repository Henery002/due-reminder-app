import { addDays, formatISO, subDays } from 'date-fns';
import { buildReminderRules } from '../reminders/reminder.service';
import type { ReminderItem, ReminderType } from '../reminders/reminder.types';

type DemoReminderSeed = {
  amount?: number;
  daysFromNow: number;
  id: string;
  name: string;
  note?: string;
  type: ReminderType;
};

const demoSeeds: DemoReminderSeed[] = [
  {
    amount: 25,
    daysFromNow: 0,
    id: 'demo-video-membership',
    name: '视频会员',
    note: '自动续费前确认是否继续',
    type: 'subscription',
  },
  {
    amount: 199,
    daysFromNow: 3,
    id: 'demo-credit-card',
    name: '信用卡年费',
    note: '确认是否满足减免条件',
    type: 'bill',
  },
  {
    daysFromNow: 45,
    id: 'demo-driver-license',
    name: '驾驶证换证',
    note: '提前预约体检和换证',
    type: 'document',
  },
  {
    amount: 288,
    daysFromNow: 7,
    id: 'demo-cloud-server',
    name: '云服务器续费',
    note: '检查是否还需要当前配置',
    type: 'subscription',
  },
  {
    amount: 156.8,
    daysFromNow: -1,
    id: 'demo-utilities',
    name: '水电燃气缴费',
    note: '演示逾期状态，不使用真实账单',
    type: 'bill',
  },
];

export function getScreenshotDemoReminders(now = new Date()): ReminderItem[] {
  return demoSeeds.map((seed) => {
    const dueDate = formatISO(addDays(now, seed.daysFromNow), { representation: 'date' });
    const timestamp = subDays(now, 2).toISOString();
    const reminderRules = buildReminderRules(seed.type, dueDate, now);

    return {
      id: seed.id,
      type: seed.type,
      name: seed.name,
      dueDate,
      amount: seed.amount,
      note: seed.note,
      status: seed.daysFromNow < 0 ? 'overdue' : 'active',
      reminderRules:
        reminderRules.length > 0
          ? reminderRules
          : [
              {
                id: `${seed.id}-demo-rule`,
                offsetDays: 0,
                scheduledAt: now.toISOString(),
              },
            ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
}
