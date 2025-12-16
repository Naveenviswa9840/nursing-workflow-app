import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function AppHeader({ name }) {
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <View style={{ position: "relative", marginRight: 10 }}>
      
      {/* USER NAME */}
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {name || "User"} ⌄
        </Text>
      </TouchableOpacity>

      {/* DROPDOWN */}
      {open && (
        <View
          style={{
            position: "absolute",
            top: 28,
            right: 0,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 6,
            minWidth: 140,
            elevation: 5,
            zIndex: 100,
          }}
        >
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              setOpen(false);
              router.push("/profile");
            }}
          >
            <Text>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={logout}
          >
            <Text style={{ color: "red" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
