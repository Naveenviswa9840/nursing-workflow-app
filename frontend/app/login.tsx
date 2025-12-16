import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../src/config/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Toast.show({
        type: "error",
        text1: "Invalid Mobile Number",
        text2: "Enter a valid 10-digit Indian number",
      });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/auth/send-otp`, { mobile });

      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "Valid for 5 minutes",
      });

      setOtp("");
      setOtpSent(true);
      startTimer();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed to send OTP",
        text2: err?.response?.data?.message || "Try again",
      });
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async (code?: string) => {
    const finalOtp = code ?? otp;

    if (finalOtp.length !== 6) return;

    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        mobile,
        code: finalOtp,
      });

      await AsyncStorage.setItem("token", res.data.token);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome 👋",
      });

      stopTimer();
      router.replace("/patients");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed";

      Toast.show({
        type: "error",
        text1: "OTP Error",
        text2: message,
      });
    }
  };

  /* ---------------- TIMER LOGIC ---------------- */
  const startTimer = () => {
    setTimer(60);
    stopTimer();

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  /* ---------------- AUTO SUBMIT OTP ---------------- */
  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp(otp);
    }
  }, [otp]);

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login with your mobile number</Text>

      {/* Mobile */}
      <TextInput
        placeholder="Mobile Number"
        keyboardType="numeric"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
      />

      {!otpSent && (
        <Pressable style={styles.primaryBtn} onPress={sendOtp}>
          <Text style={styles.btnText}>Send OTP</Text>
        </Pressable>
      )}

      {otpSent && (
        <>
          {/* OTP */}
          <TextInput
            placeholder="Enter 6-digit OTP"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
          />

          {/* Timer / Resend */}
          {timer > 0 ? (
            <Text style={styles.timer}>
              Resend OTP in {timer}s
            </Text>
          ) : (
            <Pressable onPress={sendOtp}>
              <Text style={styles.resend}>Resend OTP</Text>
            </Pressable>
          )}
        </>
      )}

      {/* Register */}
      <Pressable onPress={() => router.push("/register")}>
        <Text style={styles.register}>
          New user? Create account
        </Text>
      </Pressable>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#C62828",
    marginBottom: 6,
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: "#C62828",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  timer: {
    textAlign: "center",
    color: "#999",
    marginTop: 8,
  },
  resend: {
    textAlign: "center",
    color: "#C62828",
    fontWeight: "700",
    marginTop: 8,
  },
  register: {
    textAlign: "center",
    marginTop: 24,
    color: "#C62828",
    fontWeight: "600",
  },
});
