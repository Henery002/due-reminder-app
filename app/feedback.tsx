import { Stack } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFeedbackChannels } from '../src/features/settings/settings.content';
import { colors } from '../src/theme/colors';

export default function FeedbackScreen() {
  const channels = getFeedbackChannels();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '反馈建议' }} />
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
          <Pressable
            key={channel.url}
            onPress={() => Linking.openURL(channel.url)}
            style={({ pressed }) => [styles.channelCard, pressed ? styles.pressed : null]}
          >
            <Text style={styles.channelTitle}>{channel.label}</Text>
            <Text style={styles.channelText}>{channel.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  channelCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    gap: 6,
    padding: 16,
  },
  channelText: {
    color: colors.primarySoft,
    fontSize: 14,
    lineHeight: 21,
  },
  channelTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '900',
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  promptCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  promptText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  promptTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
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
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
  },
});
