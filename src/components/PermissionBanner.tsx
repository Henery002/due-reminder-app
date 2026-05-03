import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';

export function PermissionBanner() {
  return (
    <View style={styles.banner}>
      <IconGlyph label="!" size={18} tone="dueSoon" />
      <Text style={styles.text}>打开通知，才不会错过提醒</Text>
    </View>
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
  text: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
});
