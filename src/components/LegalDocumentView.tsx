import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LegalSection } from '../features/legal/legal.content';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { ScreenHeader } from './ScreenHeader';

type LegalDocumentViewProps = {
  description: string;
  eyebrow: string;
  sections: LegalSection[];
  title: string;
};

export function LegalDocumentView({
  description,
  eyebrow,
  sections,
  title,
}: LegalDocumentViewProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader subtitle="合规说明" title={title} />
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardText}>{section.body}</Text>
          </View>
        ))}
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
    description: {
      color: colors.textSecondary,
      ...typography.body,
    },
    eyebrow: {
      color: colors.primary,
      letterSpacing: 0.6,
      ...typography.label,
    },
    hero: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      gap: spacing.sm,
      padding: spacing.md,
    },
    safeArea: {
      backgroundColor: colors.background,
      flex: 1,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
