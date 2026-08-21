import { TextInput, TextInputProps, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

type FormFieldProps = TextInputProps & {
  label: string;
  required?: boolean;
  error?: string | null;
};

/**
 * Labeled text input with an inline error slot. Every intake step reuses
 * this instead of hand-rolling label/input/error markup each time.
 */
export function FormField({
  label,
  required,
  error,
  style,
  ...inputProps
}: FormFieldProps) {
  const theme = useTheme();

  return (
    <View className="gap-1.5">
      <ThemedText type="smallBold">
        {label}
        {required ? " *" : ""}
      </ThemedText>
      <TextInput
        style={[
          {
            borderRadius: 8,
            borderWidth: 1,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: error ? "#B3261E" : theme.border,
          },
          style,
        ]}
        placeholderTextColor={theme.textSecondary}
        {...inputProps}
      />
      {error ? (
        <ThemedText type="small" style={{ color: "#B3261E" }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}
