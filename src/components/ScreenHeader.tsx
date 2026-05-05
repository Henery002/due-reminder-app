import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { PressableScale } from './PressableScale';

type ScreenHeaderProps = {
  subtitle?: string;
  title: string;
};

export function ScreenHeader({ subtitle, title }: ScreenHeaderProps) {
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

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    shadowColor: '#1F2A2A',
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    width: 42,
  },
  backIcon: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32,
  },
  backPressed: {
    borderColor: colors.primary,
    opacity: 0.86,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  titleWrap: {
    flex: 1,
  },
});
