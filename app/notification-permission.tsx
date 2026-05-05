import { Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionBanner } from '../src/components/PermissionBanner';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { SubmitActionButton } from '../src/components/SubmitActionButton';
import {
  getExpoNotificationGateway,
  getExpoNotificationRuntimeInfo,
  type NotificationRuntimeInfo,
} from '../src/features/notifications/expo-notification.gateway';
import {
  configureNotifications,
  getNotificationPermissionStatus,
  requestNotificationPermission,
  scheduleTestNotification,
} from '../src/features/notifications/notification.service';
import type { NotificationPermissionStatus } from '../src/features/notifications/notification.types';
import { colors } from '../src/theme/colors';

export default function NotificationPermissionScreen() {
  const [permission, setPermission] = useState<NotificationPermissionStatus | undefined>();
  const [runtimeInfo, setRuntimeInfo] = useState<NotificationRuntimeInfo>(
    getExpoNotificationRuntimeInfo(),
  );

  const refreshPermission = useCallback(async () => {
    const nextRuntimeInfo = getExpoNotificationRuntimeInfo();
    setRuntimeInfo(nextRuntimeInfo);

    if (!nextRuntimeInfo.available) {
      setPermission({
        granted: false,
        canAskAgain: false,
      });
      return;
    }

    const notificationGateway = await getExpoNotificationGateway();
    await configureNotifications(notificationGateway);

    const nextPermission = await getNotificationPermissionStatus(notificationGateway);
    setPermission(nextPermission);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshPermission();
    }, [refreshPermission]),
  );

  const handleRequestPermission = async () => {
    if (!runtimeInfo.available) {
      Alert.alert('需要开发构建验证', runtimeInfo.message);
      return;
    }

    const notificationGateway = await getExpoNotificationGateway();
    await configureNotifications(notificationGateway);

    const granted = await requestNotificationPermission(notificationGateway);
    await refreshPermission();

    if (!granted) {
      Alert.alert('通知还没有开启', '你可以稍后在系统设置中为 Expo Go 打开通知权限。');
    }
  };

  const handleTestNotification = async () => {
    if (!runtimeInfo.available) {
      Alert.alert('需要开发构建验证', runtimeInfo.message);
      return;
    }

    const notificationGateway = await getExpoNotificationGateway();
    await configureNotifications(notificationGateway);

    const granted = await requestNotificationPermission(notificationGateway);
    await refreshPermission();

    if (!granted) {
      Alert.alert('需要通知权限', '开启通知后，才能发送测试提醒。');
      return;
    }

    await scheduleTestNotification(notificationGateway, 5);
    Alert.alert('测试通知已安排', '如果权限正常，大约 5 秒后会收到一条本地通知。');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '通知权限' }} />
        <ScreenHeader subtitle="我的 / 通知" title="通知权限" />
        <Text style={styles.title}>通知权限</Text>
        <PermissionBanner onPress={handleRequestPermission} />
        <Text style={styles.copy}>到期提醒依赖系统通知。创建第一个事项后，再开启通知会更自然。</Text>

        <View style={styles.panel}>
          <Text style={styles.panelLabel}>当前状态</Text>
          <Text style={styles.panelValue}>
            {runtimeInfo.available ? (permission?.granted ? '已开启' : '未开启') : '需开发构建'}
          </Text>
          {!runtimeInfo.available ? (
            <Text style={styles.panelHint}>{runtimeInfo.message}</Text>
          ) : null}
          {runtimeInfo.available && !permission?.granted && permission?.canAskAgain === false ? (
            <Text style={styles.panelHint}>系统已不再弹出授权框，需要到系统设置中手动开启。</Text>
          ) : null}
        </View>

        <SubmitActionButton label="开启通知权限" onPress={handleRequestPermission} />
        <SubmitActionButton
          label="发送 5 秒测试通知"
          onPress={handleTestNotification}
          variant="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  copy: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  panelHint: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  panelLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  panelValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
});
