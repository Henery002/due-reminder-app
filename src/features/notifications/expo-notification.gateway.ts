import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { NotificationGateway } from './notification.service';

type ExpoNotificationsModule = typeof import('expo-notifications');

export type NotificationRuntimeInfo = {
  available: boolean;
  reason?: 'expo-go-android';
  message?: string;
};

export class NotificationRuntimeUnavailableError extends Error {
  constructor(public readonly runtimeInfo: NotificationRuntimeInfo) {
    super(runtimeInfo.message ?? '当前运行环境暂不可用通知能力');
    this.name = 'NotificationRuntimeUnavailableError';
  }
}

let cachedGateway: NotificationGateway | null = null;

export function getExpoNotificationRuntimeInfo(): NotificationRuntimeInfo {
  const isExpoGo =
    Constants.executionEnvironment === 'storeClient' || Constants.appOwnership === 'expo';

  if (Platform.OS === 'android' && isExpoGo) {
    return {
      available: false,
      reason: 'expo-go-android',
      message:
        'Expo Go Android 从 SDK 53 起不再支持远程推送能力，直接加载原生通知模块会出现官方红色警告；本地通知完整验证建议使用 development build。',
    };
  }

  return {
    available: true,
  };
}

export function isNotificationRuntimeUnavailableError(
  error: unknown,
): error is NotificationRuntimeUnavailableError {
  return error instanceof NotificationRuntimeUnavailableError;
}

export async function getExpoNotificationGateway(): Promise<NotificationGateway> {
  const runtimeInfo = getExpoNotificationRuntimeInfo();

  if (!runtimeInfo.available) {
    throw new NotificationRuntimeUnavailableError(runtimeInfo);
  }

  if (cachedGateway) {
    return cachedGateway;
  }

  const Notifications = await import('expo-notifications');
  cachedGateway = createExpoNotificationGateway(Notifications);

  return cachedGateway;
}

function createExpoNotificationGateway(
  Notifications: ExpoNotificationsModule,
): NotificationGateway {
  return {
    androidHighImportance: Notifications.AndroidImportance.HIGH,
    dateTriggerType: Notifications.SchedulableTriggerInputTypes.DATE,
    timeIntervalTriggerType: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    setNotificationHandler: Notifications.setNotificationHandler,
    setNotificationChannelAsync: (channelId, channel) =>
      Notifications.setNotificationChannelAsync(
        channelId,
        channel as Parameters<typeof Notifications.setNotificationChannelAsync>[1],
      ),
    getPermissionsAsync: Notifications.getPermissionsAsync,
    requestPermissionsAsync: Notifications.requestPermissionsAsync,
    scheduleNotificationAsync: (request) =>
      Notifications.scheduleNotificationAsync(
        request as Parameters<typeof Notifications.scheduleNotificationAsync>[0],
      ),
    cancelScheduledNotificationAsync: Notifications.cancelScheduledNotificationAsync,
  };
}
