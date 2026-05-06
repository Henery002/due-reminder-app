import { StyleSheet, Text, View } from 'react-native';
import type { ReminderFeedback } from '../features/reminders/reminder.feedback';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

type FeedbackBannerProps = {
  feedback: ReminderFeedback | null;
};

export function FeedbackBanner({ feedback }: FeedbackBannerProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!feedback) {
    return null;
  }

  const isWarning = feedback.tone === 'warning';

  return (
    <View style={[styles.banner, isWarning ? styles.warning : styles.success]}>
      <Text style={[styles.title, isWarning ? styles.warningTitle : styles.successTitle]}>
        {feedback.title}
      </Text>
      <Text style={styles.description}>{feedback.description}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    banner: {
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
    },
    description: {
      color: colors.textSecondary,
      ...typography.helper,
    },
    success: {
      backgroundColor: colors.doneSoft,
      borderColor: colors.doneSoft,
    },
    successTitle: {
      color: colors.done,
    },
    title: {
      ...typography.bodyStrong,
    },
    warning: {
      backgroundColor: colors.dueSoonSoft,
      borderColor: colors.dueSoonSoft,
    },
    warningTitle: {
      color: colors.dueSoon,
    },
  });
}
