import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { authApi } from "../../../src/config/axiosAuth";

const COLORS = {
  primary: "#C62828",
  lightRed: "#FDECEA",
  text: "#333",
  muted: "#777",
  border: "#E0E0E0",
};

export default function PatientOverview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      const res = await authApi.get(`/patients/${id}`);
      setPatient(res.data);
    } catch (err) {
      console.log("ERROR loading patient:", err);
    }
  };

  if (!patient) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.subText}>
          {patient.age} yrs • {patient.gender}
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Patient Information</Text>

        <InfoRow label="Mobile" value={patient.mobile || "-"} />
        <InfoRow label="Address" value={patient.address || "-"} />
        <InfoRow
          label="Admitted On"
          value={new Date(patient.admittedAt).toLocaleDateString()}
        />
        <InfoRow
          label="Status"
          value={patient.isActive ? "Active" : "Inactive"}
          highlight
        />
      </View>
    </View>
  );
}

/* Reusable Row */
function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.value,
          highlight && { color: COLORS.primary, fontWeight: "600" },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  headerCard: {
    backgroundColor: COLORS.lightRed,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  subText: {
    marginTop: 4,
    color: COLORS.muted,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    color: COLORS.muted,
  },
  value: {
    color: COLORS.text,
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
});
