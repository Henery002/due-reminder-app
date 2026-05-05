import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type BottomActionSheetProps = {
  actions: Array<{
    description?: string;
    label: string;
    onPress: () => void;
  }>;
  onCancel?: () => void;
  title: string;
};

export function BottomActionSheet({ title, actions, onCancel }: BottomActionSheetProps) {
  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>{title}</Text>
      {actions.map((action) => (
        <Pressable key={action.label} onPress={action.onPress} style={styles.action}>
          <Text style={styles.actionText}>{action.label}</Text>
          {action.description ? (
            <Text style={styles.actionDescription}>{action.description}</Text>
          ) : null}
        </Pressable>
      ))}
      {onCancel ? (
        <Pressable onPress={onCancel} style={styles.cancelAction}>
          <Text style={styles.cancelText}>先不延后</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    gap: 4,
    padding: 13,
  },
  actionDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  cancelAction: {
    alignItems: 'center',
    padding: 10,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '900',
  },
});
