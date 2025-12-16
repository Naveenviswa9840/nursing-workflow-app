import { Pressable, Text } from "react-native";
import { Colors, Radius, Spacing } from "../theme";

export default function AppButton({ title, onPress, danger = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: danger ? Colors.danger : Colors.primary,
        padding: Spacing.md,
        borderRadius: Radius.md,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
        {title}
      </Text>
    </Pressable>
  );
}
