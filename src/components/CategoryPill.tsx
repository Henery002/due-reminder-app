import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { PressableScale } from './PressableScale';

type CategoryPillProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryPill({ label, selected, onPress }: CategoryPillProps) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      style={({ pressed }) => [styles.pill, selected && styles.selected, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  pressed: {
    opacity: 0.82,
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
