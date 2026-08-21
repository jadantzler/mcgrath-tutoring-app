import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { SelectedIndicator } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type PillSelectProps<T extends string> = {
  label: string;
  required?: boolean;
  options: readonly T[];
  value: T | null;
  onChange: (value: T) => void;
};

/**
 * Single-choice control rendered as a row of tappable pills.
 *
 * Native `<select>`/Picker components render very differently across web,
 * iOS, and Android, which makes them hard to keep on-brand everywhere. For
 * a short, known list of options a row of pills looks and behaves the same
 * on every platform, so we use this instead of a platform picker for
 * small enums like grade, session preference, and contact preference.
 */
export function PillSelect<T extends string>({
  label,
  required,
  options,
  value,
  onChange,
}: PillSelectProps<T>) {
  const theme = useTheme();

  return (
    <View className="gap-1.5">
      <ThemedText type="smallBold">
        {label}
        {required ? " *" : ""}
      </ThemedText>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={{
                borderRadius: 999,
                borderWidth: 1,
                paddingHorizontal: 14,
                paddingVertical: 8,
                backgroundColor: selected
                  ? SelectedIndicator.background
                  : "transparent",
                borderColor: selected
                  ? SelectedIndicator.background
                  : theme.border,
              }}
            >
              <ThemedText
                type="small"
                style={{
                  color: selected ? SelectedIndicator.foreground : theme.text,
                }}
              >
                {option}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
