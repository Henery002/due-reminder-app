import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getFirstRunGuideCards } from '../features/reminders/reminder.onboarding';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { IconGlyph } from './IconGlyph';

type FirstRunGuideProps = {
  onAddPress: () => void;
};

export function FirstRunGuide({ onAddPress }: FirstRunGuideProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.hero}>
        <View style={styles.eyebrowBadge}>
          <Text style={styles.eyebrow}>第一次使用</Text>
        </View>
        <Text style={styles.title}>先把最容易忘的那件事放进来</Text>
        <Text style={styles.description}>
          一个到期日就够了。后面你再慢慢补金额、备注和更多提醒。
        </Text>
      </View>

      <View style={styles.examples}>
        {getFirstRunGuideCards().map((item) => (
          <View key={item.title} style={styles.exampleCard}>
            <View style={styles.iconWrap}>
              <IconGlyph label={item.glyph} size={17} />
            </View>
            <View style={styles.exampleTextWrap}>
              <Text style={styles.exampleTitle}>{item.title}</Text>
              <Text style={styles.exampleDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable onPress={onAddPress} style={styles.action}>
        <Text style={styles.actionText}>添加第一个到期日</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    action: {
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      minHeight: 44,
      paddingHorizontal: spacing.lg,
      paddingVertical: 12,
    },
    actionText: {
      color: colors.surface,
      textAlign: 'center',
      ...typography.bodyStrong,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing.md,
      padding: spacing.md,
    },
    description: {
      color: colors.textSecondary,
      ...typography.body,
    },
    exampleCard: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.md,
    },
    exampleDescription: {
      color: colors.textSecondary,
      marginTop: 2,
      ...typography.helper,
    },
    exampleTextWrap: {
      flex: 1,
    },
    exampleTitle: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
    examples: {
      gap: spacing.sm,
    },
    eyebrow: {
      color: colors.primary,
      ...typography.label,
    },
    eyebrowBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      borderRadius: radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    hero: {
      gap: spacing.xs,
    },
    iconWrap: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderRadius: radius.md,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
