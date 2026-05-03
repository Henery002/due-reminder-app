import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

type CategoryPillProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryPill({ label, selected, onPress }: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, selected && styles.selected]}
      accessibilityRole="button"
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  selected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  selectedText: {
    color: colors.primary,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});
