import { refreshReminderStatus } from './reminder.service';
import type { ReminderItem } from './reminder.types';

type RefreshReminderListDeps = {
  now?: Date;
  upsert(item: ReminderItem): void;
};

export function refreshReminderList(
  items: ReminderItem[],
  deps: RefreshReminderListDeps,
): ReminderItem[] {
  const now = deps.now ?? new Date();

  return items.map((item) => {
    const refreshed = refreshReminderStatus(item, now);

    if (refreshed !== item) {
      deps.upsert(refreshed);
    }

    return refreshed;
  });
}
