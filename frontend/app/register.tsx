import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import axios from "axios";
import { BASE_URL } from "../src/config/api";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";

const COLORS = {
  primary: "#C62828",
  background: "#FFFFFF",
  border: "#E0E0E0",
  text: "#212121",
  muted: "#757575",
};

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("NURSE");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name.trim() || !/^[6-9]\d{9}$/.test(mobile)) {
      Toast.show({
        type: "error",
        text1: "Invalid Details",
        text2: "Enter valid name and mobile number",
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/auth/register`, {
        name,
        mobile,
        role,
      });

      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Please login to continue",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 500);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: err?.response?.data?.message || "Try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: COLORS.background,
        justifyContent: "center",
      }}
    >
      {/* HEADER */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          color: COLORS.primary,
          marginBottom: 6,
        }}
      >
        Create Account
      </Text>

      <Text
        style={{
          color: COLORS.muted,
          marginBottom: 30,
        }}
      >
        Register to access nursing workflow
      </Text>

      {/* NAME */}
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={COLORS.muted}
        style={{
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 10,
          padding: 14,
          fontSize: 16,
          marginBottom: 16,
        }}
      />

      {/* MOBILE */}
      <TextInput
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
        maxLength={10}
        placeholderTextColor={COLORS.muted}
        style={{
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 10,
          padding: 14,
          fontSize: 16,
          marginBottom: 16,
        }}
      />

      {/* ROLE */}
      <View
        style={{
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 10,
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        <Picker
          selectedValue={role}
          onValueChange={(value) => setRole(value)}
        >
          <Picker.Item label="NURSE" value="NURSE" />
          <Picker.Item label="DOCTOR" value="DOCTOR" />
        </Picker>
      </View>

      {/* REGISTER BUTTON */}
      <Pressable
        onPress={register}
        disabled={loading}
        style={{
          backgroundColor: COLORS.primary,
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </Pressable>

      {/* LOGIN LINK */}
      <Pressable onPress={() => router.replace("/login")}>
        <Text
          style={{
            textAlign: "center",
            color: COLORS.primary,
            fontWeight: "600",
          }}
        >
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
}
