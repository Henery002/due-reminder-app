export type ScheduledNotification = {
  ruleId: string;
  notificationId: string;
};

export type NotificationPermissionStatus = {
  granted: boolean;
  canAskAgain: boolean;
};
