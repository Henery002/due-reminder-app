import type { NotificationRuntimeInfo } from './expo-notification.gateway';
import type { NotificationPermissionStatus } from './notification.types';

type NotificationPermissionBannerInput = {
  permission?: NotificationPermissionStatus;
  runtimeInfo: NotificationRuntimeInfo;
};

export function shouldShowNotificationPermissionBanner({
  permission,
  runtimeInfo,
}: NotificationPermissionBannerInput): boolean {
  if (!runtimeInfo.available) {
    return true;
  }

  return permission?.granted !== true;
}
