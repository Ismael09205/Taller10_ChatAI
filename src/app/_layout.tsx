import { DarkTheme, ThemeProvider } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ChatProvider } from '@/features/chat/presentation/hooks/useChat';
import { BottomNav } from '@/features/chat/presentation/components/BottomNav';
import { colors } from '@/features/chat/presentation/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Tema oscuro del diseño (fondo #151B1E) para toda la navegación
const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background, card: colors.background },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <ChatProvider>
          <StatusBar style='light' />
          <AnimatedSplashOverlay />
          <Tabs
            tabBar={props => <BottomNav {...props} />}
            screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
          >
            <Tabs.Screen name='index' />
            <Tabs.Screen name='chat' />
            <Tabs.Screen name='history' />
            <Tabs.Screen name='settings' />
          </Tabs>
        </ChatProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
