import {
  cancelReminderNotifications,
  configureNotifications,
  scheduleReminderNotifications,
  type NotificationGateway,
} from '../notifications/notification.service';
import { buildReminderRules, markReminderDone, snoozeReminder } from './reminder.service';
import type { ReminderItem, ReminderType } from './reminder.types';

type ReminderNotificationActionDeps = {
  getNotificationGateway: () => Promise<NotificationGateway>;
  now?: Date;
  onNotificationError?(error: unknown): void;
  upsert(item: ReminderItem): void;
};

type ReminderDeleteActionDeps = {
  getNotificationGateway: () => Promise<NotificationGateway>;
  now?: Date;
  onNotificationError?(error: unknown): void;
  remove(id: string): void;
};

type EditableReminderInput = {
  type: ReminderType;
  name: string;
  dueDate: string;
  amount?: number;
  note?: string;
  selectedReminderOffsets?: readonly number[];
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

export async function updateReminderWithNotifications(
  item: ReminderItem,
  input: EditableReminderInput,
  deps: ReminderNotificationActionDeps,
): Promise<void> {
  const now = deps.now ?? new Date();
  let updated: ReminderItem = {
    ...item,
    type: input.type,
    name: input.name,
    dueDate: input.dueDate,
    amount: input.amount,
    note: input.note,
    status: item.status === 'done' ? 'done' : 'active',
    reminderRules: buildReminderRules(
      input.type,
      input.dueDate,
      now,
      input.selectedReminderOffsets,
    ),
    snoozedUntil: undefined,
    updatedAt: now.toISOString(),
  };

  if (updated.status !== 'done') {
    updated.completedAt = undefined;
  }

  try {
    const gateway = await getConfiguredGateway(deps.getNotificationGateway);
    await cancelReminderNotifications(item, gateway);

    if (updated.status !== 'done') {
      updated = {
        ...updated,
        reminderRules: await scheduleReminderNotifications(updated, gateway, now),
      };
    }
  } catch (error) {
    deps.onNotificationError?.(error);
  }

  deps.upsert(updated);
}

export async function deleteReminderWithNotifications(
  item: ReminderItem,
  deps: ReminderDeleteActionDeps,
): Promise<void> {
  try {
    const gateway = await getConfiguredGateway(deps.getNotificationGateway);
    await cancelReminderNotifications(item, gateway);
  } catch (error) {
    deps.onNotificationError?.(error);
  }

  deps.remove(item.id);
}
