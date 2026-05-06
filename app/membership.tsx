import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MembershipCard } from '../src/components/MembershipCard';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { getMembershipPlans } from '../src/features/membership/membership.plan';
import { useTheme, type AppTheme } from '../src/theme/ThemeProvider';

export default function MembershipScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
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

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    badge: {
      backgroundColor: colors.primarySoft,
      borderRadius: radius.pill,
      color: colors.primary,
      overflow: 'hidden',
      paddingHorizontal: 9,
      paddingVertical: 4,
      ...typography.label,
    },
    content: {
      gap: spacing.lg,
      padding: spacing.lg,
      paddingBottom: 32,
    },
    feature: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      color: colors.textPrimary,
      paddingHorizontal: spacing.md,
      paddingVertical: 7,
      ...typography.label,
    },
    featureList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    planCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.lg,
    },
    planDescription: {
      color: colors.textSecondary,
      marginTop: spacing.sm,
      ...typography.body,
    },
    planHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'space-between',
    },
    planTitle: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    proBadge: {
      backgroundColor: colors.dueSoonSoft,
      color: colors.dueSoon,
    },
    safeArea: {
      backgroundColor: colors.background,
      flex: 1,
    },
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    subtitle: {
      color: colors.textSecondary,
      marginTop: spacing.xs,
      ...typography.body,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
