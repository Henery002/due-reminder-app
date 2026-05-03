import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';

export function MembershipCard() {
  return (
    <View style={styles.card}>
      <IconGlyph label="P" size={20} />
      <View style={styles.copy}>
        <Text style={styles.title}>更自由地管理所有到期事项</Text>
        <Text style={styles.description}>无限事项、自定义提醒、去广告，后续支持同步与导出。</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
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
