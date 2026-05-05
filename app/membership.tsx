import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MembershipCard } from '../src/components/MembershipCard';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { getMembershipPlans } from '../src/features/membership/membership.plan';
import { colors } from '../src/theme/colors';

export default function MembershipScreen() {
  const plans = getMembershipPlans();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '会员权益' }} />
        <ScreenHeader subtitle="我的 / 会员" title="会员权益" />
        <View>
          <Text style={styles.title}>会员权益</Text>
          <Text style={styles.subtitle}>先把免费版体验做扎实，再开放真实会员支付。</Text>
        </View>
        <MembershipCard />
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={[styles.badge, plan.id === 'pro' ? styles.proBadge : null]}>
                {plan.badge}
              </Text>
            </View>
            <Text style={styles.planDescription}>{plan.description}</Text>
            <View style={styles.featureList}>
              {plan.features.map((feature) => (
                <Text key={feature} style={styles.feature}>
                  {feature}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  feature: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  featureList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  planDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  planHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  planTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  proBadge: {
    backgroundColor: colors.dueSoonSoft,
    color: colors.dueSoon,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
});
