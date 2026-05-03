import {
  configureNotifications,
  requestNotificationPermission,
  scheduleReminderNotifications,
  scheduleTestNotification,
  type NotificationGateway,
} from './notification.service';
import type { ReminderItem } from '../reminders/reminder.types';

const baseDate = new Date('2026-05-03T08:00:00.000Z');

function item(overrides: Partial<ReminderItem> = {}): ReminderItem {
  return {
    id: 'reminder-1',
    type: 'bill',
    name: '信用卡',
    dueDate: '2026-05-10',
    status: 'active',
    reminderRules: [
      {
        id: 'bill-2026-05-10-1',
        offsetDays: 1,
        scheduledAt: '2026-05-09T01:00:00.000Z',
      },
    ],
    createdAt: baseDate.toISOString(),
    updatedAt: baseDate.toISOString(),
    ...overrides,
  };
}

function createGateway(overrides: Partial<NotificationGateway> = {}): NotificationGateway {
  return {
    androidHighImportance: 'high',
    dateTriggerType: 'date',
    timeIntervalTriggerType: 'timeInterval',
    setNotificationHandler: jest.fn(),
    setNotificationChannelAsync: jest.fn(async () => undefined),
    getPermissionsAsync: jest.fn(async () => ({ granted: false, canAskAgain: true })),
    requestPermissionsAsync: jest.fn(async () => ({ granted: true, canAskAgain: true })),
    scheduleNotificationAsync: jest.fn(async () => 'notification-1'),
    cancelScheduledNotificationAsync: jest.fn(async () => undefined),
    ...overrides,
  };
}

describe('notification service', () => {
  it('configures foreground handling and Android channel', async () => {
    const gateway = createGateway();

    await configureNotifications(gateway);

    expect(gateway.setNotificationHandler).toHaveBeenCalledTimes(1);
    expect(gateway.setNotificationChannelAsync).toHaveBeenCalledWith(
      'due-reminders',
      expect.objectContaining({
        name: '到期提醒',
        importance: 'high',
      }),
    );
  });

  it('does not request permission when already granted', async () => {
    const gateway = createGateway({
      getPermissionsAsync: jest.fn(async () => ({ granted: true, canAskAgain: true })),
    });

    await expect(requestNotificationPermission(gateway)).resolves.toBe(true);

    expect(gateway.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('requests permission when not granted', async () => {
    const gateway = createGateway();

    await expect(requestNotificationPermission(gateway)).resolves.toBe(true);

    expect(gateway.requestPermissionsAsync).toHaveBeenCalledTimes(1);
  });

  it('schedules future reminder rules and writes notification ids back', async () => {
    const gateway = createGateway();

    const rules = await scheduleReminderNotifications(item(), gateway, baseDate);

    expect(gateway.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: '信用卡快到期了',
          body: '到期日：2026-05-10',
          data: {
            reminderId: 'reminder-1',
            ruleId: 'bill-2026-05-10-1',
          },
        }),
        trigger: expect.objectContaining({
          type: 'date',
          channelId: 'due-reminders',
        }),
      }),
    );
    expect(rules[0].notificationId).toBe('notification-1');
  });

  it('skips reminder rules scheduled in the past', async () => {
    const gateway = createGateway();

    const rules = await scheduleReminderNotifications(
      item({
        reminderRules: [
          {
            id: 'past',
            offsetDays: 0,
            scheduledAt: '2026-05-01T01:00:00.000Z',
          },
        ],
      }),
      gateway,
      baseDate,
    );

    expect(gateway.scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(rules[0].notificationId).toBeUndefined();
  });

  it('schedules a short test notification for real-device verification', async () => {
    const gateway = createGateway();

    await scheduleTestNotification(gateway, 5);

    expect(gateway.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: {
          type: 'timeInterval',
          seconds: 5,
          channelId: 'due-reminders',
        },
      }),
    );
  });
});
