import { Stack } from 'expo-router';
import { initializeDatabase } from '../src/storage/database';
import { AppThemeProvider } from '../src/theme/ThemeProvider';

initializeDatabase();

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="item/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="item/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="about" />
        <Stack.Screen name="data-backup" />
        <Stack.Screen name="feedback" />
        <Stack.Screen name="membership" />
        <Stack.Screen name="notification-permission" />
        <Stack.Screen name="permissions" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="terms-of-use" />
      </Stack>
    </AppThemeProvider>
  );
}
