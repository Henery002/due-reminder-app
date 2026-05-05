import type { NotificationGateway } from '../notifications/notification.service';
import type { ReminderItem } from './reminder.types';
import {
  completeReminderWithNotifications,
  deleteReminderWithNotifications,
  snoozeReminderWithNotifications,
  updateReminderWithNotifications,
} from './reminder.actions';

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
        notificationId: 'notification-old',
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
    getPermissionsAsync: jest.fn(async () => ({ granted: true, canAskAgain: true })),
    requestPermissionsAsync: jest.fn(async () => ({ granted: true, canAskAgain: true })),
    scheduleNotificationAsync: jest.fn(async () => 'notification-new'),
    cancelScheduledNotificationAsync: jest.fn(async () => undefined),
    ...overrides,
  };
}

describe('reminder notification actions', () => {
  it('cancels scheduled notifications and clears notification ids when completing reminder', async () => {
    const gateway = createGateway();
    const upsert = jest.fn();

    await completeReminderWithNotifications(item(), {
      getNotificationGateway: async () => gateway,
      now: baseDate,
      upsert,
    });

    expect(gateway.cancelScheduledNotificationAsync).toHaveBeenCalledWith('notification-old');
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'done',
        completedAt: baseDate.toISOString(),
        reminderRules: [
          {
            id: 'bill-2026-05-10-1',
            offsetDays: 1,
            scheduledAt: '2026-05-09T01:00:00.000Z',
          },
        ],
      }),
    );
  });

  it('still completes reminder when notification runtime is unavailable', async () => {
    const upsert = jest.fn();

    await completeReminderWithNotifications(item(), {
      getNotificationGateway: async () => {
        throw new Error('notification unavailable');
      },
      now: baseDate,
      upsert,
    });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'done',
        reminderRules: [
          {
            id: 'bill-2026-05-10-1',
            offsetDays: 1,
            scheduledAt: '2026-05-09T01:00:00.000Z',
          },
        ],
      }),
    );
  });

  it('cancels old notifications and schedules a snooze reminder when snoozing reminder', async () => {
    const gateway = createGateway();
    const upsert = jest.fn();

    await snoozeReminderWithNotifications(item(), 1, {
      getNotificationGateway: async () => gateway,
      now: baseDate,
      upsert,
    });

    expect(gateway.cancelScheduledNotificationAsync).toHaveBeenCalledWith('notification-old');
    expect(gateway.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({
          date: new Date('2026-05-04T08:00:00.000Z'),
          type: 'date',
        }),
      }),
    );
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'snoozed',
        snoozedUntil: '2026-05-04T08:00:00.000Z',
        reminderRules: expect.arrayContaining([
          expect.objectContaining({
            id: 'snooze-reminder-1-2026-05-04T08:00:00.000Z',
            notificationId: 'notification-new',
            scheduledAt: '2026-05-04T08:00:00.000Z',
          }),
        ]),
      }),
    );
  });

  it('still snoozes reminder when notification runtime is unavailable', async () => {
    const upsert = jest.fn();

    await snoozeReminderWithNotifications(item(), 1, {
      getNotificationGateway: async () => {
        throw new Error('notification unavailable');
      },
      now: baseDate,
      upsert,
    });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'snoozed',
        snoozedUntil: '2026-05-04T08:00:00.000Z',
        reminderRules: expect.arrayContaining([
          {
            id: 'snooze-reminder-1-2026-05-04T08:00:00.000Z',
            offsetDays: 0,
            scheduledAt: '2026-05-04T08:00:00.000Z',
          },
        ]),
      }),
    );
  });

  it('cancels old notifications and schedules new rules when updating reminder date', async () => {
    const gateway = createGateway();
    const upsert = jest.fn();

    await updateReminderWithNotifications(
      item(),
      {
        type: 'bill',
        name: '信用卡年费',
        dueDate: '2026-05-12',
        amount: 199,
        note: '确认是否继续使用',
      },
      {
        getNotificationGateway: async () => gateway,
        now: baseDate,
        upsert,
      },
    );

    expect(gateway.cancelScheduledNotificationAsync).toHaveBeenCalledWith('notification-old');
    expect(gateway.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: '信用卡年费快到期了',
          body: '到期日：2026-05-12',
        }),
        trigger: expect.objectContaining({
          date: new Date('2026-05-09T01:00:00.000Z'),
          type: 'date',
        }),
      }),
    );
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '信用卡年费',
        dueDate: '2026-05-12',
        amount: 199,
        note: '确认是否继续使用',
        status: 'active',
        snoozedUntil: undefined,
        reminderRules: expect.arrayContaining([
          expect.objectContaining({
            id: 'bill-2026-05-12-3',
            notificationId: 'notification-new',
            scheduledAt: '2026-05-09T01:00:00.000Z',
          }),
        ]),
      }),
    );
  });

  it('updates reminder using enabled reminder offsets only', async () => {
    const gateway = createGateway();
    const upsert = jest.fn();

    await updateReminderWithNotifications(
      item(),
      {
        type: 'bill',
        name: '信用卡年费',
        dueDate: '2026-05-12',
        selectedReminderOffsets: [1, 0],
      },
      {
        getNotificationGateway: async () => gateway,
        now: baseDate,
        upsert,
      },
    );

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        reminderRules: expect.arrayContaining([
          expect.objectContaining({
            id: 'bill-2026-05-12-1',
            offsetDays: 1,
          }),
          expect.objectContaining({
            id: 'bill-2026-05-12-0',
            offsetDays: 0,
          }),
        ]),
      }),
    );
    const updated = upsert.mock.calls[0][0] as ReminderItem;
    expect(updated.reminderRules.map((rule) => rule.offsetDays)).toEqual([1, 0]);
  });

  it('still updates reminder when notification runtime is unavailable', async () => {
    const upsert = jest.fn();

    await updateReminderWithNotifications(
      item(),
      {
        type: 'bill',
        name: '信用卡年费',
        dueDate: '2026-05-12',
      },
      {
        getNotificationGateway: async () => {
          throw new Error('notification unavailable');
        },
        now: baseDate,
        upsert,
      },
    );

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '信用卡年费',
        dueDate: '2026-05-12',
        reminderRules: expect.arrayContaining([
          {
            id: 'bill-2026-05-12-3',
            offsetDays: 3,
            scheduledAt: '2026-05-09T01:00:00.000Z',
          },
        ]),
      }),
    );
  });

  it('cancels scheduled notifications and removes reminder when deleting', async () => {
    const gateway = createGateway();
    const remove = jest.fn();

    await deleteReminderWithNotifications(item(), {
      getNotificationGateway: async () => gateway,
      now: baseDate,
      remove,
    });

    expect(gateway.cancelScheduledNotificationAsync).toHaveBeenCalledWith('notification-old');
    expect(remove).toHaveBeenCalledWith('reminder-1');
  });

  it('still removes reminder when notification runtime is unavailable', async () => {
    const remove = jest.fn();

    await deleteReminderWithNotifications(item(), {
      getNotificationGateway: async () => {
        throw new Error('notification unavailable');
      },
      now: baseDate,
      remove,
    });

    expect(remove).toHaveBeenCalledWith('reminder-1');
  });
});
