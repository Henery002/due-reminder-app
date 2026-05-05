import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAboutSections } from '../src/features/settings/settings.content';
import { colors } from '../src/theme/colors';

export default function AboutScreen() {
  const sections = getAboutSections();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '关于应用' }} />
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>Due Reminder</Text>
          <Text style={styles.title}>到期提醒助手</Text>
          <Text style={styles.subtitle}>把容易忘的小事，变成一个轻松可处理的清单。</Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardText}>{section.body}</Text>
          </View>
        ))}

        <Text style={styles.version}>原型版本 v0.1 · Android-first</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  cardText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  hero: {
    backgroundColor: colors.primarySoft,
    borderRadius: 24,
    gap: 8,
    padding: 20,
  },
  heroKicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  },
  title: {
    color: colors.textPrimary,
    fontSize: 29,
    fontWeight: '900',
  },
  version: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
