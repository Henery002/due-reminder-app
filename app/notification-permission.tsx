import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { PermissionBanner } from '../src/components/PermissionBanner';
import { colors } from '../src/theme/colors';

export default function NotificationPermissionScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: '通知权限' }} />
      <Text style={styles.title}>通知权限</Text>
      <PermissionBanner />
      <Text style={styles.copy}>到期提醒依赖系统通知。创建第一个事项后，再开启通知会更自然。</Text>
    </ScrollView>
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
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
});
