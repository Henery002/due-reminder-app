import { StyleSheet, Text, View } from 'react-native';
import { getMembershipPlans } from '../features/membership/membership.plan';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { IconGlyph } from './IconGlyph';

type MembershipCardProps = {
  compact?: boolean;
};

export function MembershipCard({ compact }: MembershipCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [freePlan, proPlan] = getMembershipPlans();

  return (
    <View style={[styles.card, compact ? styles.compactCard : null]}>
      <IconGlyph label="P" size={20} />
      <View style={styles.copy}>
        <Text style={styles.title}>更自由地管理所有到期事项</Text>
        <Text style={styles.description}>
          {freePlan.title}可先验证核心体验，{proPlan.title}会在提醒稳定后开放。
        </Text>
        <Text style={styles.badge}>{freePlan.badge}</Text>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderRadius: radius.pill,
      color: colors.primary,
      marginTop: spacing.sm,
      overflow: 'hidden',
      paddingHorizontal: 9,
      paddingVertical: 4,
      ...typography.label,
    },
    card: {
      alignItems: 'flex-start',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: radius.lg,
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.md,
    },
    compactCard: {
      borderRadius: radius.lg,
    },
    copy: {
      flex: 1,
    },
    description: {
      color: colors.textSecondary,
      ...typography.helper,
      marginTop: 3,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
