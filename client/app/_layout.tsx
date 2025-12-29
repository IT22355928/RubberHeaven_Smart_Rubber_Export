import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { ToastProvider } from 'react-native-toast-notifications'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="routes/welcome-intro/index" />
          <Stack.Screen name="routes/login/index" />
          <Stack.Screen name="routes/sign-up/index" />
          <Stack.Screen name="routes/forget-password/index" />
          <Stack.Screen name="routes/verify-account/index" />
          <Stack.Screen name="routes/home/index" />
          <Stack.Screen name="routes/IT22355928/qclab/index" />
          <Stack.Screen name="routes/IT22355928/newtest/index" />
          <Stack.Screen name="routes/IT22355928/testreports/index" />
          <Stack.Screen name="routes/IT22355928/logbook/index" />
          <Stack.Screen name="routes/IT22355928/latex/index" />
          <Stack.Screen name="routes/IT22355928/inventory/index" />
          <Stack.Screen name="routes/IT22355928/performance/index" />
        </Stack>
    </ToastProvider>
  );
}
