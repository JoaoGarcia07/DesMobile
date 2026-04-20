import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, createContext, useContext } from 'react';
import { useColorScheme as useDeviceScheme } from 'react-native';
import 'react-native-reanimated';
import { resolveApiBaseUrl } from '../api';

// Contexto para o Modo Escuro Manual - ESSENCIAL PARA AS OUTRAS TELAS
const ThemeContext = createContext({ isDarkMode: false, toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const SyncContext = createContext({
  refreshVersion: 0,
  isRefreshing: false,
  triggerRefresh: async () => {},
});
export const useAppSync = () => useContext(SyncContext);

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const deviceScheme = useDeviceScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceScheme === 'dark');
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const triggerRefresh = async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    try {
      await resolveApiBaseUrl(true);
    } catch {}
    finally {
      setRefreshVersion((value) => value + 1);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SyncContext.Provider value={{ refreshVersion, isRefreshing, triggerRefresh }}>
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <NavProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Garante que a navegação comece pela index ou pelas abas */}
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          {/* Telas auxiliares que ficam fora do menu de baixo */}
          <Stack.Screen name="ajuda" />
          <Stack.Screen name="recuperar" />
          <Stack.Screen name="sobre" />
          <Stack.Screen name="termos" />
          </Stack>
        </NavProvider>
      </ThemeContext.Provider>
    </SyncContext.Provider>
  );
}
