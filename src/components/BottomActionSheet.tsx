import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type BottomActionSheetProps = {
  title: string;
  actions: string[];
};

export function BottomActionSheet({ title, actions }: BottomActionSheetProps) {
  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>{title}</Text>
      {actions.map((action) => (
        <Pressable key={action} style={styles.action}>
          <Text style={styles.actionText}>{action}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 13,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
});
