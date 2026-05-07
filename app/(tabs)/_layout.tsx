import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { useTheme, type AppTheme } from '../../src/theme/ThemeProvider';

export default function TabsLayout() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarButton: (props) => <AnimatedTabButton {...props} styles={styles} />,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0,
          bottom: 4,
          elevation: 4,
          height: 48,
          left: 24,
          paddingBottom: 0,
          paddingTop: 0,
          position: 'absolute',
          right: 24,
          borderRadius: 18,
          shadowColor: colors.cardShadow,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: theme.colorScheme === 'dark' ? 0.14 : 0.06,
          shadowRadius: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? 'home-variant' : 'home-variant-outline'}
              size={focused ? 25 : 23}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: '全部',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? 'clipboard-list' : 'clipboard-list-outline'}
              size={focused ? 25 : 23}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '我的',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={focused ? 25 : 23}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function AnimatedTabButton({
  accessibilityState,
  children,
  onPressIn,
  onPressOut,
  styles,
  style,
  ...rest
}: PressableProps & { children?: ReactNode; styles: ReturnType<typeof createStyles> }) {
  const selected = Boolean(accessibilityState?.selected);
  const selectedValue = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const pressValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(selectedValue, {
      damping: 12,
      mass: 0.55,
      stiffness: 260,
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [selected, selectedValue]);

  const selectedScale = selectedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  return (
    <Animated.View
      style={[
        styles.tabButtonMotion,
        {
          transform: [{ scale: Animated.multiply(selectedScale, pressValue) }],
        },
      ]}
    >
      <Pressable
        {...rest}
        accessibilityState={accessibilityState}
        onPressIn={(event) => {
          Animated.spring(pressValue, {
            damping: 10,
            mass: 0.45,
            stiffness: 320,
            toValue: 0.92,
            useNativeDriver: true,
          }).start();
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          Animated.spring(pressValue, {
            damping: 9,
            mass: 0.5,
            stiffness: 300,
            toValue: 1,
            useNativeDriver: true,
          }).start();
          onPressOut?.(event);
        }}
        style={(state) => [
          styles.tabButton,
          selected ? styles.tabButtonSelected : null,
          typeof style === 'function' ? style(state) : style,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, radius } = theme;

  return StyleSheet.create({
    tabButton: {
      alignItems: 'center',
      borderRadius: radius.pill,
      height: 38,
      justifyContent: 'center',
      width: 46,
    },
    tabButtonMotion: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    tabButtonSelected: {
      backgroundColor: colors.primarySoft,
    },
  });
}
