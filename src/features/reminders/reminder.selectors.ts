import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { ReminderItem } from './reminder.types';

export type HomeReminderGroups = {
  today: ReminderItem[];
  nextThreeDays: ReminderItem[];
  nextSevenDays: ReminderItem[];
  overdue: ReminderItem[];
};

export type HomeReminderSectionKey = keyof HomeReminderGroups;

export type HomeReminderSection = {
  description: string;
  items: ReminderItem[];
  key: HomeReminderSectionKey;
  tone: 'danger' | 'primary' | 'warm' | 'calm';
  title: string;
};

export function groupRemindersForHome(
  items: ReminderItem[],
  now: Date = new Date(),
): HomeReminderGroups {
  const groups: HomeReminderGroups = {
    today: [],
    nextThreeDays: [],
    nextSevenDays: [],
    overdue: [],
  };

  for (const item of items) {
    if (item.status === 'done') {
      continue;
    }

    if (item.status === 'overdue') {
      groups.overdue.push(item);
      continue;
    }

    const daysUntilDue = differenceInCalendarDays(parseISO(item.dueDate), now);
    if (daysUntilDue === 0) {
      groups.today.push(item);
    } else if (daysUntilDue > 0 && daysUntilDue <= 3) {
      groups.nextThreeDays.push(item);
    } else if (daysUntilDue > 3 && daysUntilDue <= 7) {
      groups.nextSevenDays.push(item);
    } else if (daysUntilDue < 0) {
      groups.overdue.push(item);
    }
  }

  return groups;
}

const homeSectionMeta: Record<
  HomeReminderSectionKey,
  Omit<HomeReminderSection, 'items' | 'key'>
> = {
  overdue: {
    description: '这些已经超过到期日，建议先处理。',
    title: '已经逾期',
    tone: 'danger',
  },
  today: {
    description: '今天就要处理，适合现在顺手解决。',
    title: '今天到期',
    tone: 'primary',
  },
  nextThreeDays: {
    description: '这几天快到了，提前一点会更从容。',
    title: '未来 3 天',
    tone: 'warm',
  },
  nextSevenDays: {
    description: '一周内会到期，适合提前安排。',
    title: '未来 7 天',
    tone: 'calm',
  },
};

export function getHomeReminderSections(groups: HomeReminderGroups): HomeReminderSection[] {
  return (['overdue', 'today', 'nextThreeDays', 'nextSevenDays'] as const).flatMap((key) => {
    const items = groups[key];
    if (items.length === 0) {
      return [];
    }

    return [
      {
        ...homeSectionMeta[key],
        items,
        key,
      },
    ];
  });
}
