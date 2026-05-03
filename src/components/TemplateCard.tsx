import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

type TemplateCardProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function TemplateCard({ label, selected, onPress }: TemplateCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  selectedText: {
    color: colors.primary,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
