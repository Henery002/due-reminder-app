import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LegalSection } from '../features/legal/legal.content';
import { colors } from '../theme/colors';
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
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hero: {
    backgroundColor: colors.primarySoft,
    borderRadius: 24,
    gap: 8,
    padding: 20,
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
    fontSize: 29,
    fontWeight: '900',
  },
});
