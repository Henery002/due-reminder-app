import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type OverviewCardProps = {
  nextSevenDays: number;
  thisMonth: number;
  overdue: number;
};

export function OverviewCard({ nextSevenDays, thisMonth, overdue }: OverviewCardProps) {
  return (
    <View style={styles.card}>
      <Metric label="最近 7 天" value={nextSevenDays} />
      <View style={styles.divider} />
      <Metric label="本月将到期" value={thisMonth} />
      <View style={styles.divider} />
      <Metric label="已逾期" value={overdue} danger={overdue > 0} />
    </View>
  );
}

function Metric({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.value, danger && styles.danger]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 16,
  },
  danger: {
    color: colors.overdue,
  },
  divider: {
    backgroundColor: colors.border,
    height: 32,
    width: 1,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
});
