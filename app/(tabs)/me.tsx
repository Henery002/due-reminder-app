import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconGlyph } from '../../src/components/IconGlyph';
import { MembershipCard } from '../../src/components/MembershipCard';
import { PermissionBanner } from '../../src/components/PermissionBanner';
import { PressableScale } from '../../src/components/PressableScale';
import { buildAppTheme } from '../../src/features/appearance/appearance.theme';
import {
  accentColorOptions,
  appearanceModeOptions,
  type AccentColor,
  type AppearanceMode,
  type AppearanceOption,
} from '../../src/features/appearance/appearance.types';
import { getLegalActions } from '../../src/features/legal/legal.content';
import {
  getExpoNotificationGateway,
  getExpoNotificationRuntimeInfo,
  isNotificationRuntimeUnavailableError,
  type NotificationRuntimeInfo,
} from '../../src/features/notifications/expo-notification.gateway';
import { shouldShowNotificationPermissionBanner } from '../../src/features/notifications/notification.permission-view';
import { getNotificationPermissionStatus } from '../../src/features/notifications/notification.service';
import type { NotificationPermissionStatus } from '../../src/features/notifications/notification.types';
import {
  getReminderPreferenceNotes,
  getSettingsActions,
  type ReminderPreferenceNote,
  type SettingsAction,
} from '../../src/features/settings/settings.content';
import { useAppearanceSettings, useTheme, type AppTheme } from '../../src/theme/ThemeProvider';

export default function MeScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const { settings, updateAppearanceSettings } = useAppearanceSettings();
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionStatus>();
  const [notificationRuntimeInfo, setNotificationRuntimeInfo] = useState<NotificationRuntimeInfo>(
    getExpoNotificationRuntimeInfo(),
  );
  const actions = getSettingsActions();
  const legalActions = getLegalActions();
  const reminderPreferenceNotes = getReminderPreferenceNotes();

  const refreshNotificationPermission = useCallback(() => {
    let active = true;
    const runtimeInfo = getExpoNotificationRuntimeInfo();
    setNotificationRuntimeInfo(runtimeInfo);

    if (!runtimeInfo.available) {
      setNotificationPermission(undefined);
      return () => {
        active = false;
      };
    }

    getExpoNotificationGateway()
      .then(getNotificationPermissionStatus)
      .then((permission) => {
        if (active) {
          setNotificationPermission(permission);
        }
      })
      .catch((error) => {
        if (!isNotificationRuntimeUnavailableError(error)) {
          console.warn('Failed to refresh notification permission', error);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(refreshNotificationPermission);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.eyebrow}>到期提醒助手</Text>
          </View>
          <Text style={styles.title}>个人设置</Text>
          <Text style={styles.subtitle}>外观、通知、数据和合规说明集中管理。</Text>
        </View>

        <View style={styles.quickGrid}>
          <View style={styles.quickItem}>
            <PressableScale
              accessibilityRole="button"
              onPress={() => router.push('/membership')}
              style={({ pressed }) => [styles.quickCard, pressed ? styles.pressed : null]}
            >
              <MembershipCard compact />
            </PressableScale>
          </View>
          {shouldShowNotificationPermissionBanner({
            permission: notificationPermission,
            runtimeInfo: notificationRuntimeInfo,
          }) ? (
            <View style={styles.quickItem}>
              <PermissionBanner onPress={() => router.push('/notification-permission')} />
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <SectionHeader
            helper="切换后即时生效，并保存在本机。"
            title="外观主题"
            styles={styles}
          />
          <View style={styles.preferenceCard}>
            <Text style={styles.preferenceLabel}>显示模式</Text>
            <View style={styles.segmentGrid}>
              {appearanceModeOptions.map((option) => (
                <TextOption
                  key={option.value}
                  option={option}
                  selected={settings.mode === option.value}
                  styles={styles}
                  onSelect={(mode) => updateAppearanceSettings({ mode })}
                />
              ))}
            </View>

            <Text style={styles.preferenceLabel}>主题色</Text>
            <View style={styles.accentGrid}>
              {accentColorOptions.map((option) => (
                <AccentOption
                  key={option.value}
                  option={option}
                  selected={settings.accentColor === option.value}
                  styles={styles}
                  onSelect={(accentColor) => updateAppearanceSettings({ accentColor })}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="常用工具" styles={styles} />
          <View style={styles.actionList}>
            {actions.map((action) => (
              <SettingsActionRow key={action.href} action={action} styles={styles} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            helper="这些是当前版本的本地提醒规则。"
            title="提醒偏好"
            styles={styles}
          />
          <View style={styles.infoList}>
            {reminderPreferenceNotes.map((note) => (
              <ReminderPreferenceNoteRow key={note.title} note={note} styles={styles} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="合规与说明" styles={styles} />
          <View style={styles.actionList}>
            {legalActions.map((action) => (
              <PressableScale
                key={action.href}
                accessibilityRole="button"
                onPress={() => router.push(action.href)}
                style={({ pressed }) => [styles.actionRow, pressed ? styles.pressed : null]}
              >
                <View style={styles.actionIcon}>
                  <IconGlyph color={colors.primary} label="L" size={14} />
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

function TextOption<T extends AppearanceMode>({
  onSelect,
  option,
  selected,
  styles,
}: {
  onSelect(value: T): void;
  option: AppearanceOption<T>;
  selected: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      onPress={() => onSelect(option.value)}
      scaleTo={0.96}
      style={({ pressed }) => [
        styles.segmentOption,
        selected ? styles.segmentOptionSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.segmentLabel, selected ? styles.segmentLabelSelected : null]}>
        {option.label}
      </Text>
      <Text style={styles.segmentDescription}>{option.description}</Text>
    </PressableScale>
  );
}

function AccentOption({
  onSelect,
  option,
  selected,
  styles,
}: {
  onSelect(value: AccentColor): void;
  option: AppearanceOption<AccentColor>;
  selected: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  const swatchColor = buildAppTheme({ accentColor: option.value, mode: 'light' }).colors.primary;

  return (
    <PressableScale
      accessibilityRole="button"
      onPress={() => onSelect(option.value)}
      scaleTo={0.96}
      style={({ pressed }) => [
        styles.accentOption,
        selected ? styles.accentOptionSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={[styles.accentSwatch, { backgroundColor: swatchColor }]} />
      <View style={styles.accentCopy}>
        <Text style={[styles.segmentLabel, selected ? styles.segmentLabelSelected : null]}>
          {option.label}
        </Text>
        <Text style={styles.segmentDescription}>{option.description}</Text>
      </View>
    </PressableScale>
  );
}

function SettingsActionRow({
  action,
  styles,
}: {
  action: SettingsAction;
  styles: ReturnType<typeof createStyles>;
}) {
  const theme = useTheme();

  return (
    <PressableScale
      accessibilityRole="button"
      onPress={() => router.push(action.href)}
      style={({ pressed }) => [styles.actionRow, pressed ? styles.pressed : null]}
    >
      <View style={styles.actionIcon}>
        <IconGlyph color={theme.colors.primary} label={action.icon} size={14} />
      </View>
      <View style={styles.actionCopy}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionDescription}>{action.description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </PressableScale>
  );
}

function ReminderPreferenceNoteRow({
  note,
  styles,
}: {
  note: ReminderPreferenceNote;
  styles: ReturnType<typeof createStyles>;
}) {
  const theme = useTheme();

  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <IconGlyph color={theme.colors.primary} label={note.glyph} size={17} />
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoTitle}>{note.title}</Text>
        <Text style={styles.infoText}>{note.body}</Text>
      </View>
    </View>
  );
}

function SectionHeader({
  helper,
  styles,
  title,
}: {
  helper?: string;
  styles: ReturnType<typeof createStyles>;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {helper ? <Text style={styles.sectionHelper}>{helper}</Text> : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, sizes, spacing, typography } = theme;

  return StyleSheet.create({
    accentCopy: {
      flex: 1,
    },
    accentGrid: {
      gap: spacing.sm,
    },
    accentOption: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
    },
    accentOptionSelected: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
    },
    accentSwatch: {
      borderRadius: radius.pill,
      height: 18,
      width: 18,
    },
    actionCopy: {
      flex: 1,
    },
    actionDescription: {
      color: colors.textSecondary,
      ...typography.helper,
      marginTop: 2,
    },
    actionIcon: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderRadius: radius.md,
      height: sizes.listIconBox,
      justifyContent: 'center',
      width: sizes.listIconBox,
    },
    actionList: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      overflow: 'hidden',
    },
    actionRow: {
      alignItems: 'center',
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
    },
    actionTitle: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
    chevron: {
      color: colors.textMuted,
      fontSize: 20,
      fontWeight: '500',
    },
    content: {
      gap: spacing.lg,
      padding: spacing.lg,
      paddingBottom: 76,
    },
    eyebrow: {
      color: colors.primary,
      ...typography.label,
    },
    hero: {
      gap: spacing.sm,
    },
    heroBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      borderRadius: radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    infoCard: {
      alignItems: 'flex-start',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.md,
    },
    infoCopy: {
      flex: 1,
    },
    infoIcon: {
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      borderRadius: radius.md,
      height: sizes.listIconBox,
      justifyContent: 'center',
      width: sizes.listIconBox,
    },
    infoText: {
      color: colors.textSecondary,
      ...typography.helper,
      marginTop: 3,
    },
    infoTitle: {
      color: colors.textPrimary,
      ...typography.bodyStrong,
    },
    infoList: {
      gap: spacing.sm,
    },
    preferenceCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      gap: spacing.md,
      padding: spacing.md,
    },
    preferenceLabel: {
      color: colors.textPrimary,
      ...typography.label,
    },
    pressed: {
      opacity: 0.82,
    },
    quickCard: {
      borderRadius: radius.lg,
    },
    quickGrid: {
      gap: spacing.sm,
    },
    quickItem: {
      width: '100%',
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
      gap: spacing.sm,
    },
    sectionHeader: {
      gap: 2,
    },
    sectionHelper: {
      color: colors.textMuted,
      ...typography.helper,
    },
    sectionTitle: {
      color: colors.textPrimary,
      ...typography.sectionTitle,
    },
    segmentDescription: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 17,
      marginTop: 2,
    },
    segmentGrid: {
      gap: spacing.sm,
    },
    segmentLabel: {
      color: colors.textPrimary,
      ...typography.label,
    },
    segmentLabelSelected: {
      color: colors.primary,
    },
    segmentOption: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      paddingHorizontal: spacing.sm,
      paddingVertical: 10,
    },
    segmentOptionSelected: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
    },
    subtitle: {
      color: colors.textSecondary,
      ...typography.body,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
  });
}
