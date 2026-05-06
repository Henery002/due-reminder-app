import { StyleSheet, Text } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { IconGlyph } from './IconGlyph';
import { PressableScale } from './PressableScale';

type PermissionBannerProps = {
  onPress?: () => void;
};

export function PermissionBanner({ onPress }: PermissionBannerProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <PressableScale
      accessibilityRole="button"
      onPress={onPress}
      scaleTo={0.985}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <IconGlyph label="!" size={18} tone="dueSoon" />
      <Text style={styles.text}>打开通知，才不会错过提醒</Text>
      <Text style={styles.arrow}>›</Text>
    </PressableScale>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    banner: {
      alignItems: 'center',
      backgroundColor: colors.dueSoonSoft,
      borderRadius: radius.lg,
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.md,
    },
    arrow: {
      color: colors.textMuted,
      fontSize: 20,
      fontWeight: '500',
    },
    pressed: {
      opacity: 0.82,
    },
    text: {
      color: colors.textPrimary,
      flex: 1,
      ...typography.bodyStrong,
    },
  });
}
