import { parseISO } from 'date-fns';
import type { ReminderItem, ReminderRule } from '../reminders/reminder.types';
import type { NotificationPermissionStatus } from './notification.types';

export const NOTIFICATION_CHANNEL_ID = 'due-reminders';

type NotificationRequest = {
  content: {
    title: string;
    body?: string;
    data?: Record<string, string>;
  };
  trigger: Record<string, unknown>;
};

type NotificationChannel = {
  name: string;
  importance: unknown;
  vibrationPattern?: number[];
  lightColor?: string;
};

type NotificationHandler = {
  handleNotification: () => Promise<{
    shouldShowBanner: boolean;
    shouldShowList: boolean;
    shouldPlaySound: boolean;
    shouldSetBadge: boolean;
  }>;
};

export type NotificationGateway = {
  androidHighImportance: unknown;
  dateTriggerType: unknown;
  timeIntervalTriggerType: unknown;
  setNotificationHandler(handler: NotificationHandler): void;
  setNotificationChannelAsync(channelId: string, channel: NotificationChannel): Promise<unknown>;
  getPermissionsAsync(): Promise<NotificationPermissionStatus>;
  requestPermissionsAsync(): Promise<NotificationPermissionStatus>;
  scheduleNotificationAsync(request: NotificationRequest): Promise<string>;
  cancelScheduledNotificationAsync(notificationId: string): Promise<void>;
};

export async function configureNotifications(
  gateway: NotificationGateway,
): Promise<void> {
  gateway.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  await gateway.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: '到期提醒',
    importance: gateway.androidHighImportance,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#1BAE9F',
  });
}

export async function getNotificationPermissionStatus(
  gateway: NotificationGateway,
): Promise<NotificationPermissionStatus> {
  const status = await gateway.getPermissionsAsync();

  return {
    granted: status.granted,
    canAskAgain: status.canAskAgain,
  };
}

export async function requestNotificationPermission(
  gateway: NotificationGateway,
): Promise<boolean> {
  const current = await gateway.getPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await gateway.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleReminderNotifications(
  item: ReminderItem,
  gateway: NotificationGateway,
  now: Date = new Date(),
): Promise<ReminderRule[]> {
  const scheduledRules: ReminderRule[] = [];

  for (const rule of item.reminderRules) {
    const scheduledAt = parseISO(rule.scheduledAt);
    if (scheduledAt.getTime() <= now.getTime()) {
      scheduledRules.push(rule);
      continue;
    }

    const notificationId = await gateway.scheduleNotificationAsync({
      content: {
        title: `${item.name}快到期了`,
        body: `到期日：${item.dueDate}`,
        data: {
          reminderId: item.id,
          ruleId: rule.id,
        },
      },
      trigger: {
        type: gateway.dateTriggerType,
        date: scheduledAt,
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });

    scheduledRules.push({
      ...rule,
      notificationId,
    });
  }

  return scheduledRules;
}

export async function cancelReminderNotifications(
  item: ReminderItem,
  gateway: NotificationGateway,
): Promise<void> {
  for (const rule of item.reminderRules) {
    if (rule.notificationId) {
      await gateway.cancelScheduledNotificationAsync(rule.notificationId);
    }
  }
}

export async function scheduleTestNotification(
  gateway: NotificationGateway,
  seconds = 5,
): Promise<string> {
  return gateway.scheduleNotificationAsync({
    content: {
      title: '到期提醒测试',
      body: '如果你看到这条通知，说明本地提醒已经可以工作。',
    },
    trigger: {
      type: gateway.timeIntervalTriggerType,
      seconds,
      channelId: NOTIFICATION_CHANNEL_ID,
    },
  });
}
