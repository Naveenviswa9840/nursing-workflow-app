import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

const COLORS = {
  primary: "#C62828", // hospital red
  inactive: "#757575",
  background: "#FFFFFF",
};

export default function PatientLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,

        // 🔴 Tab bar styling
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 60,
        },

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 6,
        },

        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
        }}
      />

      <Tabs.Screen
        name="vitals"
        options={{
          title: "Vitals",
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
        }}
      />

      <Tabs.Screen
        name="documents"
        options={{
          title: "Documents",
        }}
      />

      <Tabs.Screen
        name="investigations"
        options={{
          title: "Investigations",
        }}
      />
    </Tabs>
  );
}
