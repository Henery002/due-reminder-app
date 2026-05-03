import { Tabs } from 'expo-router';
import { IconGlyph } from '../../src/components/IconGlyph';
import { colors } from '../../src/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <IconGlyph label="H" color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: '全部',
          tabBarIcon: ({ color }) => <IconGlyph label="L" color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <IconGlyph label="M" color={color} size={18} />,
        }}
      />
    </Tabs>
  );
}
