import { Stack, router } from "expo-router";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const COLORS = {
  primary: "#C62828",
  white: "#FFFFFF",
  text: "#212121",
  border: "#E0E0E0",
};

export default function PatientsLayout() {
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpen(false)}>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,

            /* ✅ CLICKABLE TITLE */
            headerTitle: () => (
              <Pressable
                onPress={() => router.replace("/patients")}
              >
                <Text style={styles.headerTitle}>Patients</Text>
              </Pressable>
            ),

            headerRight: () => (
              <View style={{ marginRight: 10 }}>
                {/* PROFILE BUTTON */}
                <Pressable
                  onPress={() => setOpen((prev) => !prev)}
                  style={styles.profileBtn}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>N</Text>
                  </View>
                  <Text style={styles.profileName}>Naveen</Text>
                  <Text style={styles.chevron}>⌄</Text>
                </Pressable>

                {/* DROPDOWN */}
                {open && (
                  <View style={styles.dropdown}>
                    <Pressable
                      onPress={logout}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ),
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF33",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
  profileName: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 4,
  },
  chevron: {
    color: "#fff",
    fontSize: 14,
  },
  dropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 120,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
