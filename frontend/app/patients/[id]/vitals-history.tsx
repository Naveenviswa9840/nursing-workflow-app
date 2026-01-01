import { View, Text, FlatList, useWindowDimensions } from "react-native";
import { useState, useCallback } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { API } from "../../../src/config/api";
import Toast from "react-native-toast-message";
import { LineChart } from "react-native-chart-kit";

export default function VitalsHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patientId = Number(id);

  const { width } = useWindowDimensions();

  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!patientId || isNaN(patientId)) {
    return <Text style={{ padding: 16 }}>Invalid patient</Text>;
  }

  const loadVitals = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/patients/${patientId}/vitals`);
      setVitals(res.data || []);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to load vitals history",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVitals();
    }, [patientId])
  );

  const recent = Array.isArray(vitals)
    ? vitals.slice(0, 6).reverse()
    : [];

  const renderItem = ({ item }: any) => (
    <View
      style={{
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: item.isCritical ? "#ffe5e5" : "#f9f9f9",
        borderColor: item.isCritical ? "red" : "#ddd",
      }}
    >
      {item.isCritical && (
        <Text style={{ color: "red", fontWeight: "bold" }}>
          ⚠ CRITICAL
        </Text>
      )}

      <Text>BP: {item.bloodPressureSys}/{item.bloodPressureDia}</Text>
      <Text>Temp: {item.temperature} °C</Text>
      <Text>SpO₂: {item.spo2}%</Text>
      <Text>Pulse: {item.pulseRate}</Text>
      <Text>Resp: {item.respiratoryRate}</Text>
      <Text>Weight: {item.weight} kg</Text>

      <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
        {new Date(item.recordedAt).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return <Text style={{ padding: 16 }}>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Vitals History
      </Text>

      {recent.length > 0 && (
        <LineChart
          data={{
            labels: recent.map(v =>
              new Date(v.recordedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            ),
            datasets: [
              { data: recent.map(v => v.temperature ?? 0), color: () => "#C62828" },
              { data: recent.map(v => v.spo2 ?? 0), color: () => "#2E7D32" },
              { data: recent.map(v => v.pulseRate ?? 0), color: () => "#1565C0" },
            ],
            legend: ["Temperature", "SpO₂", "Pulse"],
          }}
          width={width - 32}
          height={240}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: () => "#333",
            labelColor: () => "#777",
            propsForDots: { r: "4" },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      )}

      <FlatList
        data={vitals}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No vitals recorded yet</Text>}
      />
    </View>
  );
}
