import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MembershipCard } from '../src/components/MembershipCard';
import { colors } from '../src/theme/colors';

const benefits = ['去广告', '无限事项', '自定义多级提醒', '更多模板', '后续云同步'];

export default function MembershipScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: '会员权益' }} />
      <Text style={styles.title}>会员权益</Text>
      <MembershipCard />
      <View style={styles.list}>
        {benefits.map((benefit) => (
          <Text key={benefit} style={styles.item}>
            {benefit}
          </Text>
        ))}
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
  item: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    padding: 14,
  },
  list: {
    gap: 10,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
});
