import { StyleSheet, Text } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { PressableScale } from './PressableScale';

type TemplateCardProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function TemplateCard({ label, selected, onPress }: TemplateCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.96}
      style={({ pressed }) => [styles.card, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </PressableScale>
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
      paddingVertical: 7,
    },
    pressed: {
      opacity: 0.84,
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
