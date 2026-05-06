import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';

type TemplateCardProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function TemplateCard({ label, selected, onPress }: TemplateCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.md,
      borderWidth: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
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
      ...typography.bodyStrong,
    },
  });
}
