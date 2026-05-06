import { StyleSheet, Text, View } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

type OverviewCardProps = {
  nextSevenDays: number;
  thisMonth: number;
  overdue: number;
};

export function OverviewCard({ nextSevenDays, thisMonth, overdue }: OverviewCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <Metric label="最近 7 天" styles={styles} value={nextSevenDays} />
      <View style={styles.divider} />
      <Metric label="本月将到期" styles={styles} value={thisMonth} />
      <View style={styles.divider} />
      <Metric danger={overdue > 0} label="已逾期" styles={styles} value={overdue} />
    </View>
  );
}

function Metric({
  danger,
  label,
  styles,
  value,
}: {
  danger?: boolean;
  label: string;
  styles: ReturnType<typeof createStyles>;
  value: number;
}) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.value, danger && styles.danger]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    card: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      padding: spacing.lg,
    },
    danger: {
      color: colors.overdue,
    },
    divider: {
      backgroundColor: colors.border,
      height: 30,
      width: 1,
    },
    label: {
      color: colors.textSecondary,
      marginTop: 1,
      ...typography.label,
    },
    metric: {
      alignItems: 'center',
      flex: 1,
    },
    value: {
      color: colors.textPrimary,
      ...typography.metric,
    },
  });
}
