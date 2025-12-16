import * as DocumentPicker from "expo-document-picker";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { authApi } from "../../../src/config/axiosAuth";
import { BASE_URL } from "../../../src/config/api";
import * as Linking from "expo-linking";

const COLORS = {
  primary: "#C62828",
  lightRed: "#FDECEA",
  text: "#333",
  border: "#E0E0E0",
};

export default function DocumentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load documents
  const loadDocs = async () => {
    if (!id) return;
    const res = await authApi.get(`/patients/${id}/documents`);
    setDocs(res.data);
  };

  // ✅ Upload document
  const uploadFile = async () => {
    if (!id) return;

    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream",
    } as any);

    setLoading(true);

    await authApi.post(
      `/patients/${id}/documents/upload`,
      formData
    );

    setLoading(false);
    loadDocs();
  };

  useEffect(() => {
    loadDocs();
  }, [id]);

  const openDocument = (docId: number) => {
    const url = `${BASE_URL}/patients/${id}/documents/${docId}/view`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Upload Button */}
      <Pressable style={styles.uploadBtn} onPress={uploadFile}>
        <Text style={styles.uploadText}>
          {loading ? "Uploading..." : "⬆ Upload Document"}
        </Text>
      </Pressable>

      {/* Document List */}
      <FlatList
        data={docs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.fileName}>📄 {item.fileName}</Text>

            <Pressable
              onPress={() => openDocument(item.id)}
              style={styles.viewBtn}
            >
              <Text style={styles.viewText}>View / Download</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#777", marginTop: 20 }}>
            No documents uploaded yet
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  uploadBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.lightRed,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  fileName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  viewBtn: {
    marginTop: 8,
  },
  viewText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
