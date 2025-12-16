import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../../../src/config/api";
import Toast from "react-native-toast-message";

export default function VitalsScreen() {
  const { id } = useLocalSearchParams();
  const pid = Number(id);

  const [bpSys, setBpSys] = useState("");
  const [bpDia, setBpDia] = useState("");
  const [temp, setTemp] = useState("");
  const [spo2, setSpo2] = useState("");
  const [pulse, setPulse] = useState("");
  const [resp, setResp] = useState("");
  const [weight, setWeight] = useState("");

  const submit = async () => {
    if (!pid || isNaN(pid)) {
      Toast.show({ type: "error", text1: "Invalid patient ID" });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/patients/${pid}/vitals`, {
        bloodPressureSys: bpSys ? Number(bpSys) : undefined,
        bloodPressureDia: bpDia ? Number(bpDia) : undefined,
        temperature: temp ? Number(temp) : undefined,
        spo2: spo2 ? Number(spo2) : undefined,
        pulseRate: pulse ? Number(pulse) : undefined,
        respiratoryRate: resp ? Number(resp) : undefined,
        weight: weight ? Number(weight) : undefined,
      });

      Toast.show({ type: "success", text1: "Vitals saved" });
      router.back();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: "Error saving vitals",
      });
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: "#d32f2f",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 16 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#d32f2f",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Add Vitals
      </Text>

      <TextInput placeholder="BP Systolic" value={bpSys} onChangeText={setBpSys} keyboardType="numeric" style={inputStyle} />
      <TextInput placeholder="BP Diastolic" value={bpDia} onChangeText={setBpDia} keyboardType="numeric" style={inputStyle} />
      <TextInput placeholder="Temperature (°C)" value={temp} onChangeText={setTemp} keyboardType="numeric" style={inputStyle} />
      <TextInput placeholder="SpO₂ (%)" value={spo2} onChangeText={setSpo2} keyboardType="numeric" style={inputStyle} />
      <TextInput placeholder="Pulse Rate" value={pulse} onChangeText={setPulse} keyboardType="numeric" style={inputStyle} />
      <TextInput placeholder="Respiratory Rate" value={resp} onChangeText={setResp} keyboardType="numeric" style={inputStyle} />
      <TextInput placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" style={inputStyle} />

      {/* RED BUTTON */}
      <TouchableOpacity
        onPress={submit}
        style={{
          backgroundColor: "#d32f2f",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          Save Vitals
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
