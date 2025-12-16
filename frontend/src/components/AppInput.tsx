import { TextInput } from "react-native";
import { Colors, Radius, Spacing } from "../theme";

export default function AppInput(props) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={Colors.muted}
      style={{
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        padding: Spacing.md,
        backgroundColor: "#fff",
        fontSize: 15,
        marginBottom: Spacing.md,
      }}
    />
  );
}
