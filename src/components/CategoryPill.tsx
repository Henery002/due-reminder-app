import { StyleSheet, Text } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { PressableScale } from './PressableScale';

type CategoryPillProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryPill({ label, selected, onPress }: CategoryPillProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

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

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    pill: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.pill,
      borderWidth: 1,
      minHeight: theme.sizes.chipHeight,
      paddingHorizontal: 11,
      paddingVertical: 6,
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
      ...typography.label,
    },
  });
}
