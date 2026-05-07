import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme, type AppTheme } from '../theme/ThemeProvider';
import { PressableScale } from './PressableScale';

type ScreenHeaderProps = {
  subtitle?: string;
  title: string;
};

export function ScreenHeader({ subtitle, title }: ScreenHeaderProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  return (
    <View style={styles.header}>
      <PressableScale
        accessibilityLabel="返回上一页"
        accessibilityRole="button"
        onPress={handleBack}
        scaleTo={0.94}
        style={({ pressed }) => [styles.backButton, pressed ? styles.backPressed : null]}
      >
        <Text style={styles.backIcon}>‹</Text>
      </PressableScale>
      <View style={styles.titleWrap}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius, spacing, typography } = theme;

  return StyleSheet.create({
    backButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.pill,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    backIcon: {
      color: colors.textPrimary,
      fontSize: 23,
      fontWeight: '600',
      lineHeight: 24,
    },
    backPressed: {
      opacity: 0.86,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
    },
    subtitle: {
      color: colors.textMuted,
      ...typography.label,
      marginTop: 2,
    },
    title: {
      color: colors.textPrimary,
      ...typography.cardTitle,
    },
    titleWrap: {
      flex: 1,
    },
  });
}
