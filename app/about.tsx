import { Link, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { getLegalActions } from '../src/features/legal/legal.content';
import { getAboutSections } from '../src/features/settings/settings.content';
import { useTheme, type AppTheme } from '../src/theme/ThemeProvider';

export default function AboutScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const sections = getAboutSections();
  const legalActions = getLegalActions();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '关于应用' }} />
        <ScreenHeader subtitle="我的 / 关于" title="关于应用" />
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>产品定位</Text>
          <Text style={styles.title}>到期提醒助手</Text>
          <Text style={styles.subtitle}>把容易忘的小事，变成一个轻松可处理的清单。</Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardText}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.legalGroup}>
          <Text style={styles.groupTitle}>合规说明</Text>
          {legalActions.map((action) => (
            <Link key={action.href} href={action.href} style={styles.card}>
              <Text style={styles.cardTitle}>{action.title}</Text>
              <Text style={styles.cardText}>{action.description}</Text>
            </Link>
          ))}
        </View>

        <Text style={styles.version}>原型版本 v0.1 · Android-first</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      gap: spacing.sm,
      padding: spacing.lg,
    },
    cardText: {
      color: colors.textSecondary,
      ...typography.body,
    },
    cardTitle: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    content: {
      gap: spacing.lg,
      padding: spacing.lg,
      paddingBottom: 32,
    },
    groupTitle: {
      color: colors.textPrimary,
      ...typography.sectionTitle,
    },
    hero: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      gap: spacing.sm,
      padding: spacing.md,
    },
    heroKicker: {
      color: colors.primary,
      ...typography.label,
    },
    legalGroup: {
      gap: spacing.sm,
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
      ...typography.body,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    version: {
      color: colors.textMuted,
      textAlign: 'center',
      ...typography.label,
    },
  });
}
