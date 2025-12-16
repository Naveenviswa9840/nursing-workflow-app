import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { authApi } from "../../src/config/axiosAuth";
import { router, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#C62828",
  background: "#FFFFFF",
  card: "#FAFAFA",
  border: "#E0E0E0",
  dangerBg: "#FDECEA",
  dangerText: "#C62828",
  text: "#212121",
  muted: "#757575",
};

export default function PatientsScreen() {
  const [patients, setPatients] = useState<any[]>([]);

  const loadPatients = async () => {
    try {
      const res = await authApi.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.log("ERROR loading patients:", err);
    }
  };

  const logout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        },
      },
    ]);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <>
      {/* 🔴 HEADER */}
      <Stack.Screen
        options={{
          title: "Patients",
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "600",
          },
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable onPress={() => router.push("/patients/add")}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>+ Add</Text>
              </Pressable>

              <Pressable onPress={logout}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Logout
                </Text>
              </Pressable>
            </View>
          ),
        }}
      />

      {/* 🔴 CONTENT */}
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: COLORS.background,
        }}
      >
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const latestVitals = item.vitals?.[0];
            const isCritical = latestVitals?.isCritical;

            return (
              <Pressable
                onPress={() => {
                  if (isCritical) {
                    Toast.show({
                      type: "error",
                      text1: "Critical Patient",
                      text2: "Immediate medical attention required",
                    });
                  }

                  router.push(`/patients/${item.id}`);
                }}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                  backgroundColor: isCritical
                    ? COLORS.dangerBg
                    : COLORS.card,
                  borderWidth: 1,
                  borderColor: isCritical
                    ? COLORS.dangerText
                    : COLORS.border,
                }}
              >
                {/* HEADER ROW */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: COLORS.text,
                    }}
                  >
                    {item.name}
                  </Text>

                  {isCritical && (
                    <Text
                      style={{
                        color: COLORS.dangerText,
                        fontWeight: "700",
                        fontSize: 12,
                      }}
                    >
                      ⚠ CRITICAL
                    </Text>
                  )}
                </View>

                <Text style={{ color: COLORS.muted }}>
                  Age: {item.age} • Gender: {item.gender}
                </Text>

                <Text style={{ color: COLORS.muted, marginTop: 2 }}>
                  Mobile: {item.mobile || "-"}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: COLORS.muted }}>
              No patients found
            </Text>
          }
        />
      </View>
    </>
  );
}
