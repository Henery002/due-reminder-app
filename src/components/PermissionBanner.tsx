import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';

type PermissionBannerProps = {
  onPress?: () => void;
};

export function PermissionBanner({ onPress }: PermissionBannerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    >
      <IconGlyph label="!" size={18} tone="dueSoon" />
      <Text style={styles.text}>打开通知，才不会错过提醒</Text>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    backgroundColor: colors.dueSoonSoft,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  arrow: {
    color: colors.textMuted,
    fontSize: 22,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
  },
  text: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
});
