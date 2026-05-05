import { StyleSheet, Text, View } from 'react-native';
import { getMembershipPlans } from '../features/membership/membership.plan';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';

export function MembershipCard() {
  const [freePlan, proPlan] = getMembershipPlans();

  return (
    <View style={styles.card}>
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

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 999,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 10,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  copy: {
    flex: 1,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
});
