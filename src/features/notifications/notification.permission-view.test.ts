import { shouldShowNotificationPermissionBanner } from './notification.permission-view';

describe('notification permission view state', () => {
  it('hides the banner when notification permission is already granted', () => {
    expect(
      shouldShowNotificationPermissionBanner({
        permission: { granted: true, canAskAgain: true },
        runtimeInfo: { available: true },
      }),
    ).toBe(false);
  });

  it('shows the banner when runtime is available and permission is not granted', () => {
    expect(
      shouldShowNotificationPermissionBanner({
        permission: { granted: false, canAskAgain: true },
        runtimeInfo: { available: true },
      }),
    ).toBe(true);
  });

  it('keeps the banner visible before permission status has loaded', () => {
    expect(
      shouldShowNotificationPermissionBanner({
        permission: undefined,
        runtimeInfo: { available: true },
      }),
    ).toBe(true);
  });

  it('shows the banner when the notification runtime needs a development build', () => {
    expect(
      shouldShowNotificationPermissionBanner({
        permission: { granted: false, canAskAgain: false },
        runtimeInfo: { available: false, reason: 'expo-go-android' },
      }),
    ).toBe(true);
  });
});
