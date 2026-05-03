import {
  cancelReminderNotifications,
  configureNotifications,
  scheduleReminderNotifications,
  type NotificationGateway,
} from '../notifications/notification.service';
import { markReminderDone, snoozeReminder } from './reminder.service';
import type { ReminderItem } from './reminder.types';

type ReminderNotificationActionDeps = {
  getNotificationGateway: () => Promise<NotificationGateway>;
  now?: Date;
  onNotificationError?(error: unknown): void;
  upsert(item: ReminderItem): void;
};

function clearNotificationIds(item: ReminderItem): ReminderItem {
  return {
    ...item,
    reminderRules: item.reminderRules.map(({ notificationId: _notificationId, ...rule }) => rule),
  };
}

async function getConfiguredGateway(
  getNotificationGateway: () => Promise<NotificationGateway>,
): Promise<NotificationGateway> {
  const gateway = await getNotificationGateway();
  await configureNotifications(gateway);

  return gateway;
}

export async function completeReminderWithNotifications(
  item: ReminderItem,
  deps: ReminderNotificationActionDeps,
): Promise<void> {
  const completed = clearNotificationIds(markReminderDone(item, deps.now));

  try {
    const gateway = await getConfiguredGateway(deps.getNotificationGateway);
    await cancelReminderNotifications(item, gateway);
  } catch (error) {
    deps.onNotificationError?.(error);
  }

  deps.upsert(completed);
}

export async function snoozeReminderWithNotifications(
  item: ReminderItem,
  days: number,
  deps: ReminderNotificationActionDeps,
): Promise<void> {
  let snoozed = clearNotificationIds(snoozeReminder(item, days, deps.now));

  try {
    const gateway = await getConfiguredGateway(deps.getNotificationGateway);
    await cancelReminderNotifications(item, gateway);
    const rescheduledRules = await scheduleReminderNotifications(snoozed, gateway, deps.now);

    snoozed = {
      ...snoozed,
      reminderRules: rescheduledRules,
    };
  } catch (error) {
    deps.onNotificationError?.(error);
  }

  deps.upsert(snoozed);
}
