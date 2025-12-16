import { View, Text, FlatList, Dimensions } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams,useFocusEffect } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../../../src/config/api";
import Toast from "react-native-toast-message";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function VitalsHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patientId = Number(id);

  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!patientId || isNaN(patientId)) {
    return <Text style={{ padding: 16 }}>Invalid patient</Text>;
  }

  const loadVitals = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/patients/${patientId}/vitals`
      );
      setVitals(res.data);
    } catch (err: any) {
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
      
      return () => {
      };
    }, [patientId]) 
 );


  // 🔴🔵🟢 Prepare chart data (last 6 records)
  const recent = vitals.slice(0, 6).reverse();

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
        <Text style={{ color: "red", fontWeight: "bold", marginBottom: 4 }}>
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

      {/* 📈 VITALS CHART */}
      {recent.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>
            Vitals Trend
          </Text>

          <LineChart
            data={{
              labels: recent.map((v) =>
                new Date(v.recordedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              ),
              datasets: [
                {
                  data: recent.map((v) => v.temperature ?? 0),
                  color: () => "#C62828", // 🔴 Temp
                  strokeWidth: 2,
                },
                {
                  data: recent.map((v) => v.spo2 ?? 0),
                  color: () => "#2E7D32", // 🟢 SpO₂
                  strokeWidth: 2,
                },
                {
                  data: recent.map((v) => v.pulseRate ?? 0),
                  color: () => "#1565C0", // 🔵 Pulse
                  strokeWidth: 2,
                },
              ],
              legend: ["Temperature", "SpO₂", "Pulse"],
            }}
            width={screenWidth - 32}
            height={240}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: () => "#333",
              labelColor: () => "#777",
              propsForDots: {
                r: "4",
              },
            }}
            bezier
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#eee",
            }}
          />
        </View>
      )}

      {/* 📋 HISTORY LIST */}
      <FlatList
        data={vitals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No vitals recorded yet</Text>}
      />
    </View>
  );
}
