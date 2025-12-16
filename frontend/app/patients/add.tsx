import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { addPatient } from "../../src/api/patients";
import { router, Stack } from "expo-router";
import Toast from "react-native-toast-message";

const COLORS = {
  primary: "#C62828",
  background: "#FFFFFF",
  card: "#FAFAFA",
  border: "#E0E0E0",
  text: "#212121",
  muted: "#757575",
};

export default function AddPatientScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Patient name is required",
      });
      return;
    }

    if (mobile && mobile.length !== 10) {
      Toast.show({
        type: "error",
        text1: "Invalid Mobile Number",
        text2: "Mobile number must be 10 digits",
      });
      return;
    }

    try {
      setLoading(true);

      await addPatient({
        name: name.trim(),
        age: age ? Number(age) : undefined,
        gender,
        mobile: mobile || undefined,
        address: address || undefined,
      });

      Toast.show({
        type: "success",
        text1: "Patient Added",
        text2: "Patient successfully created",
      });

      setTimeout(() => {
        router.replace("/patients");
      }, 500);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: err?.response?.data?.message || "Could not add patient",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔴 HEADER */}
      <Stack.Screen
        options={{
          title: "Add Patient",
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "600" },
        }}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          backgroundColor: COLORS.background,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          {/* NAME */}
          <Text style={{ color: COLORS.muted, marginBottom: 4 }}>
            Patient Name *
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              color: COLORS.text,
            }}
          />

          {/* AGE */}
          <Text style={{ color: COLORS.muted, marginBottom: 4 }}>Age</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="Age"
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />

          {/* GENDER */}
          <Text style={{ color: COLORS.muted, marginBottom: 8 }}>
            Gender *
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {["MALE", "FEMALE", "OTHER"].map((g) => {
              const active = gender === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => setGender(g as any)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    marginRight: 10,
                    backgroundColor: active
                      ? COLORS.primary
                      : "#fff",
                    borderWidth: 1,
                    borderColor: active
                      ? COLORS.primary
                      : COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      color: active ? "#fff" : COLORS.text,
                      fontWeight: "500",
                    }}
                  >
                    {g}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* MOBILE */}
          <Text style={{ color: COLORS.muted, marginBottom: 4 }}>Mobile</Text>
          <TextInput
            value={mobile}
            onChangeText={setMobile}
            keyboardType="numeric"
            placeholder="10 digit mobile number"
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />

          {/* ADDRESS */}
          <Text style={{ color: COLORS.muted, marginBottom: 4 }}>Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            multiline
            style={{
              borderWidth: 1,
              borderColor: COLORS.border,
              borderRadius: 8,
              padding: 12,
              minHeight: 80,
              textAlignVertical: "top",
              marginBottom: 24,
            }}
          />

          {/* SAVE BUTTON */}
          <Pressable
            onPress={submit}
            disabled={loading}
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {loading ? "Saving..." : "Save Patient"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
