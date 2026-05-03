import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionBanner } from '../src/components/PermissionBanner';
import { colors } from '../src/theme/colors';

export default function NotificationPermissionScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '通知权限' }} />
        <Text style={styles.title}>通知权限</Text>
        <PermissionBanner />
        <Text style={styles.copy}>到期提醒依赖系统通知。创建第一个事项后，再开启通知会更自然。</Text>
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
