import { Stack } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableScale } from '../src/components/PressableScale';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { getFeedbackChannels } from '../src/features/settings/settings.content';
import { useTheme, type AppTheme } from '../src/theme/ThemeProvider';

export default function FeedbackScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const channels = getFeedbackChannels();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '反馈建议' }} />
        <ScreenHeader subtitle="我的 / 支持" title="反馈建议" />
        <View>
          <Text style={styles.title}>反馈建议</Text>
          <Text style={styles.subtitle}>
            这里先保持轻量：不用登录，不建工单，直接说哪里不顺手。
          </Text>
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptTitle}>最想听到这些反馈</Text>
          <Text style={styles.promptText}>1. 通知有没有准时出现</Text>
          <Text style={styles.promptText}>2. 添加事项是否够快</Text>
          <Text style={styles.promptText}>3. 哪个页面看起来还不够年轻</Text>
        </View>

        {channels.map((channel) => (
          <PressableScale
            key={channel.url}
            onPress={() => Linking.openURL(channel.url)}
            scaleTo={0.985}
            style={({ pressed }) => [styles.channelCard, pressed ? styles.pressed : null]}
          >
            <Text style={styles.channelTitle}>{channel.label}</Text>
            <Text style={styles.channelText}>{channel.description}</Text>
          </PressableScale>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    channelCard: {
      backgroundColor: colors.primary,
      borderRadius: radius.xl,
      gap: spacing.xs,
      padding: spacing.lg,
    },
    channelText: {
      color: colors.primarySoft,
      ...typography.body,
    },
    channelTitle: {
      color: colors.surface,
      ...typography.cardTitle,
    },
    content: {
      gap: spacing.lg,
      padding: spacing.lg,
      paddingBottom: 32,
    },
    pressed: {
      opacity: 0.86,
      transform: [{ scale: 0.99 }],
    },
    promptCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      gap: spacing.sm,
      padding: spacing.lg,
    },
    promptText: {
      color: colors.textSecondary,
      ...typography.body,
    },
    promptTitle: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    safeArea: {
      backgroundColor: colors.background,
      flex: 1,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    subtitle: {
      color: colors.textSecondary,
      marginTop: spacing.xs,
      ...typography.body,
    },
    title: {
      color: colors.textPrimary,
      ...typography.pageTitle,
    },
  });
}
