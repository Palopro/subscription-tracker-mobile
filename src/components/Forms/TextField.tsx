import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { theme } from "../../lib/theme";

export function TextField(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={theme.colors.textMuted}
      style={styles.input}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
});
