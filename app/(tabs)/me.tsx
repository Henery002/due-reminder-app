import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconGlyph } from '../../src/components/IconGlyph';
import { MembershipCard } from '../../src/components/MembershipCard';
import { PermissionBanner } from '../../src/components/PermissionBanner';
import { PressableScale } from '../../src/components/PressableScale';
import { getLegalActions } from '../../src/features/legal/legal.content';
import { getSettingsActions, type SettingsAction } from '../../src/features/settings/settings.content';
import { colors } from '../../src/theme/colors';

export default function MeScreen() {
  const actions = getSettingsActions();
  const legalActions = getLegalActions();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>My Reminder Hub</Text>
          <Text style={styles.title}>我的</Text>
          <Text style={styles.subtitle}>会员、通知、数据和合规说明都收在这里。</Text>
        </View>

        <View style={styles.quickGrid}>
          <PressableScale
            accessibilityRole="button"
            onPress={() => router.push('/membership')}
            style={({ pressed }) => [styles.quickCard, pressed ? styles.pressed : null]}
          >
            <MembershipCard compact />
          </PressableScale>
          <PermissionBanner onPress={() => router.push('/notification-permission')} />
        </View>

        <View style={styles.section}>
          <SectionHeader eyebrow="Tools" title="常用工具" />
          <View style={styles.actionList}>
            {actions.map((action) => (
              <SettingsActionRow key={action.href} action={action} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader eyebrow="Reminder Plan" title="提醒偏好" />
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <IconGlyph color={colors.primary} label="R" size={18} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>默认提醒计划</Text>
              <Text style={styles.infoText}>
                当前按订阅、账单、证件使用推荐提醒规则。自定义多级提醒会作为 Pro 能力预留，避免首版规则编辑过重。
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader eyebrow="Legal" title="合规与说明" />
          <View style={styles.actionList}>
            {legalActions.map((action) => (
              <PressableScale
                key={action.href}
                accessibilityRole="button"
                onPress={() => router.push(action.href)}
                style={({ pressed }) => [styles.actionRow, pressed ? styles.pressed : null]}
              >
                <View style={styles.actionIcon}>
                  <IconGlyph color={colors.primary} label="L" size={15} />
                </View>
                <View style={styles.actionCopy}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </PressableScale>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsActionRow({ action }: { action: SettingsAction }) {
  return (
    <PressableScale
      accessibilityRole="button"
      onPress={() => router.push(action.href)}
      style={({ pressed }) => [styles.actionRow, pressed ? styles.pressed : null]}
    >
      <View style={styles.actionIcon}>
        <IconGlyph color={colors.primary} label={action.icon} size={15} />
      </View>
      <View style={styles.actionCopy}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionDescription}>{action.description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </PressableScale>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View>
      <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionCopy: {
    flex: 1,
  },
  actionDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  actionList: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  actionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '900',
  },
  content: {
    gap: 20,
    padding: 20,
    paddingBottom: 112,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hero: {
    backgroundColor: colors.primarySoft,
    borderRadius: 26,
    gap: 7,
    padding: 20,
  },
  infoCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 15,
  },
  infoCopy: {
    flex: 1,
  },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  infoTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
  },
  quickCard: {
    borderRadius: 18,
  },
  quickGrid: {
    gap: 12,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  section: {
    gap: 10,
  },
  sectionEyebrow: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 3,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '900',
  },
});
