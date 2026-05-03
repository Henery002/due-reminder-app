import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function ReminderRuleSelector({ offsets }: { offsets: number[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>推荐提醒</Text>
      <Text style={styles.description}>
        {offsets.map((offset) => (offset === 0 ? '当天' : `提前 ${offset} 天`)).join(' / ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
});
