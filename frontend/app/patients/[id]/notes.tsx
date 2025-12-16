import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getNotes, addNote } from "../../../src/api/notes";
import Toast from "react-native-toast-message";

const COLORS = {
  primary: "#C62828",
  lightRed: "#FDECEA",
  border: "#E0E0E0",
  text: "#333",
  muted: "#777",
};

export default function NotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patientId = Number(id);

  const [notes, setNotes] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const loadNotes = async () => {
    try {
      const res = await getNotes(patientId);
      setNotes(res.data);
    } catch {
      Toast.show({ type: "error", text1: "Failed to load notes" });
    }
  };

  const submitNote = async () => {
    if (!patientId || isNaN(patientId)) {
      Toast.show({ type: "error", text1: "Invalid patient" });
      return;
    }

    if (!content.trim()) {
      Toast.show({ type: "error", text1: "Note cannot be empty" });
      return;
    }

    try {
      setLoading(true);
      await addNote(patientId, content.trim());
      setContent("");
      loadNotes();

      Toast.show({ type: "success", text1: "Note added successfully" });
    } catch (err) {
      console.log(err);
      Toast.show({ type: "error", text1: "Failed to add note" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clinical Notes</Text>

      {/* Add Note */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add Note</Text>

        <TextInput
          placeholder="Write clinical notes here..."
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.input}
        />

        <Pressable
          onPress={submitNote}
          disabled={loading}
          style={[
            styles.primaryButton,
            loading && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Saving..." : "Add Note"}
          </Text>
        </Pressable>
      </View>

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>No notes added yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>{item.content}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                By {item.staff?.name || item.staff?.mobile}
              </Text>
              <Text style={styles.metaText}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
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
    marginBottom: 16,
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
    minHeight: 80,
    marginBottom: 10,
    textAlignVertical: "top",
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
  noteCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  noteText: {
    fontSize: 15,
    color: COLORS.text,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 20,
  },
});
