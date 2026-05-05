import { StyleSheet, Text, View } from 'react-native';
import type { ReminderFeedback } from '../features/reminders/reminder.feedback';
import { colors } from '../theme/colors';

type FeedbackBannerProps = {
  feedback: ReminderFeedback | null;
};

export function FeedbackBanner({ feedback }: FeedbackBannerProps) {
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

const styles = StyleSheet.create({
  banner: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  success: {
    backgroundColor: colors.doneSoft,
    borderColor: '#CFEED8',
  },
  successTitle: {
    color: colors.done,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
  },
  warning: {
    backgroundColor: colors.dueSoonSoft,
    borderColor: '#FFE1B8',
  },
  warningTitle: {
    color: colors.dueSoon,
  },
});
