import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import {
  getInvestigations,
  addInvestigation,
  updateInvestigationStatus,
} from "../../../src/api/investigations";

const COLORS = {
  primary: "#C62828",
  lightRed: "#FDECEA",
  success: "#2E7D32",
  successBg: "#E8F5E9",
  border: "#E0E0E0",
  text: "#333",
  muted: "#777",
};

export default function InvestigationsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patientId = Number(id);

  const [list, setList] = useState<any[]>([]);
  const [testName, setTestName] = useState("");
  const [comments, setComments] = useState("");

  if (!patientId || isNaN(patientId)) {
    return <Text style={{ padding: 20 }}>Invalid patient</Text>;
  }

  const loadInvestigations = async () => {
    try {
      const res = await getInvestigations(patientId);
      setList(res.data);
    } catch {
      Toast.show({ type: "error", text1: "Failed to load investigations" });
    }
  };

  const submit = async () => {
    if (!testName.trim()) {
      Toast.show({ type: "error", text1: "Test name is required" });
      return;
    }

    try {
      await addInvestigation(patientId, { testName, comments });
      setTestName("");
      setComments("");
      loadInvestigations();

      Toast.show({ type: "success", text1: "Investigation added" });
    } catch {
      Toast.show({ type: "error", text1: "Failed to add investigation" });
    }
  };

  const markCompleted = async (invId: number) => {
    await updateInvestigationStatus(patientId, invId, "COMPLETED");
    loadInvestigations();
  };

  useEffect(() => {
    loadInvestigations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investigations</Text>

      {/* Add Investigation Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add Investigation</Text>

        <TextInput
          placeholder="Test name *"
          value={testName}
          onChangeText={setTestName}
          style={styles.input}
        />

        <TextInput
          placeholder="Comments (optional)"
          value={comments}
          onChangeText={setComments}
          style={[styles.input, { minHeight: 60 }]}
          multiline
        />

        <Pressable style={styles.primaryButton} onPress={submit}>
          <Text style={styles.primaryButtonText}>Add Investigation</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        style={{ marginTop: 16 }}
        data={list}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: COLORS.muted }}>
            No investigations yet
          </Text>
        }
        renderItem={({ item }) => {
          const completed = item.status === "COMPLETED";

          return (
            <View
              style={[
                styles.card,
                completed && { backgroundColor: COLORS.successBg },
              ]}
            >
              <View style={styles.row}>
                <Text style={styles.testName}>{item.testName}</Text>

                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: completed
                        ? COLORS.success
                        : COLORS.lightRed,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: completed ? "#fff" : COLORS.primary },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {item.comments && (
                <Text style={styles.comment}>📝 {item.comments}</Text>
              )}

              {!completed && (
                <Pressable
                  onPress={() => markCompleted(item.id)}
                  style={styles.successButton}
                >
                  <Text style={styles.successButtonText}>
                    Mark as Completed
                  </Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  testName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  comment: {
    marginTop: 6,
    color: COLORS.muted,
  },
  successButton: {
    marginTop: 10,
    backgroundColor: COLORS.success,
    padding: 10,
    borderRadius: 8,
  },
  successButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
