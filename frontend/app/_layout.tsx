import { Stack } from "expo-router";
import Toast from "react-native-toast-message"; // 👈 Import it

export default function RootLayout() {
  return (
    <>
    <Stack
      screenOptions={{
        headerShown: false, // 🔥 IMPORTANT
      }}
    />
    <Toast />
    </>
  );
}
