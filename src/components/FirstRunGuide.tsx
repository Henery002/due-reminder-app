import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getFirstRunGuideCards } from '../features/reminders/reminder.onboarding';
import { colors } from '../theme/colors';
import { IconGlyph } from './IconGlyph';

type FirstRunGuideProps = {
  onAddPress: () => void;
};

export function FirstRunGuide({ onAddPress }: FirstRunGuideProps) {
  return (
    <View style={styles.card}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>第一次使用</Text>
        <Text style={styles.title}>先把最容易忘的那件事放进来</Text>
        <Text style={styles.description}>
          一个到期日就够了。后面你再慢慢补金额、备注和更多提醒。
        </Text>
      </View>

      <View style={styles.examples}>
        {getFirstRunGuideCards().map((item) => (
          <View key={item.title} style={styles.exampleCard}>
            <View style={styles.iconWrap}>
              <IconGlyph label={item.glyph} size={17} />
            </View>
            <View style={styles.exampleTextWrap}>
              <Text style={styles.exampleTitle}>{item.title}</Text>
              <Text style={styles.exampleDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable onPress={onAddPress} style={styles.action}>
        <Text style={styles.actionText}>添加第一个到期日</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
  },
  actionText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  exampleCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  exampleDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  exampleTextWrap: {
    flex: 1,
  },
  exampleTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  examples: {
    gap: 10,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  hero: {
    gap: 7,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 29,
  },
});
