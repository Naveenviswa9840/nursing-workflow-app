import * as DocumentPicker from "expo-document-picker";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { useState, useCallback } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
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
  const patientId = id ? Number(id) : NaN;
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load documents
  const loadDocs = async () => {
    if (isNaN(patientId) || patientId <= 0) return;
    const res = await authApi.get(`/patients/${patientId}/documents`);
    setDocs(res.data);
  };

  // ✅ Upload document
  const uploadFile = async () => {
  if (isNaN(patientId) || patientId <= 0) return;

  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  });

  if (result.canceled) return;

  const picked = result.assets[0];
  const formData = new FormData();

  // 🔥 WEB FIX: convert URI → Blob
  if (Platform.OS === "web") {
    const response = await fetch(picked.uri);
    const blob = await response.blob();

    formData.append("file", new File([blob], picked.name!, {
      type: picked.mimeType || blob.type,
    }));
  } else {
    // ✅ Mobile (Android/iOS)
    formData.append("file", {
      uri: picked.uri,
      name: picked.name,
      type: picked.mimeType || "application/octet-stream",
    } as any);
  }

  try {
    setLoading(true);

    await authApi.post(
      `/patients/${patientId}/documents/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    loadDocs();
  } catch (err) {
    console.error("Upload error:", err);
  } finally {
    setLoading(false);
  }
};


  useFocusEffect(
    useCallback(() => {
      loadDocs();

      return () => {
        // cleanup if needed
      };
    }, [patientId])
  );

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
