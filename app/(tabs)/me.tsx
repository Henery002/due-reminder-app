import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MembershipCard } from '../../src/components/MembershipCard';
import { PermissionBanner } from '../../src/components/PermissionBanner';
import { colors } from '../../src/theme/colors';

export default function MeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View>
        <Text style={styles.title}>我的</Text>
        <Text style={styles.subtitle}>提醒、会员、反馈和隐私设置。</Text>
      </View>

      <Link href="/membership">
        <MembershipCard />
      </Link>

      <Link href="/notification-permission">
        <PermissionBanner />
      </Link>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>默认提醒</Text>
        <Text style={styles.panelText}>订阅、账单、证件会按推荐策略提醒。</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>反馈</Text>
        <Text style={styles.panelText}>第一版会优先收集通知可靠性和录入体验反馈。</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  panelText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  panelTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
});
