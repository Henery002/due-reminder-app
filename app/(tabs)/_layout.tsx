import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { colors } from '../../src/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarButton: (props) => <AnimatedTabButton {...props} />,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '900',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0,
          bottom: 12,
          elevation: 8,
          height: 70,
          left: 16,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'absolute',
          right: 16,
          borderRadius: 26,
          shadowColor: '#1F2A2A',
          shadowOffset: { height: 8, width: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? 'home-variant' : 'home-variant-outline'}
              size={focused ? size + 2 : size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: '全部',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? 'clipboard-list' : 'clipboard-list-outline'}
              size={focused ? size + 2 : size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '我的',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              color={color}
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={focused ? size + 2 : size}
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
  style,
  ...rest
}: PressableProps & { children?: ReactNode }) {
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
    outputRange: [1, 1.08],
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

const styles = StyleSheet.create({
  tabButton: {
    alignItems: 'center',
    borderRadius: 22,
    flex: 1,
    justifyContent: 'center',
  },
  tabButtonMotion: {
    flex: 1,
    marginHorizontal: 4,
  },
  tabButtonSelected: {
    backgroundColor: colors.primarySoft,
  },
});
