import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { FormField } from "@/components/intake/form-field";
import { ThemedText } from "@/components/themed-text";
import { SelectedIndicator } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { IntakeFormData } from "@/types/intake";

type ConsentStepProps = {
  value: IntakeFormData["consent"];
  onChange: (value: IntakeFormData["consent"]) => void;
};

export function ConsentStep({ value, onChange }: ConsentStepProps) {
  const theme = useTheme();

  return (
    <View className="gap-5">
      <Pressable
        onPress={() => onChange({ ...value, agreed: !value.agreed })}
        className="flex-row items-start gap-3"
      >
        <View
          style={{
            marginTop: 2,
            height: 20,
            width: 20,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            borderWidth: 1,
            borderColor: value.agreed
              ? SelectedIndicator.background
              : theme.border,
            backgroundColor: value.agreed
              ? SelectedIndicator.background
              : "transparent",
          }}
        >
          {value.agreed ? (
            <ThemedText
              type="small"
              style={{
                color: SelectedIndicator.foreground,
                lineHeight: 14,
                fontSize: 12,
              }}
            >
              ✓
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="default" style={{ flex: 1 }}>
          I have read and agree to the{" "}
          <Link href="/privacy" asChild>
            <ThemedText type="linkPrimary">Privacy Policy</ThemedText>
          </Link>
          , and I consent to McGrath Tutoring collecting and storing the
          information above about my student. *
        </ThemedText>
      </Pressable>

      <FormField
        label="How did you hear about us? (optional)"
        value={value.howHeard}
        onChangeText={(howHeard) => onChange({ ...value, howHeard })}
      />
      <FormField
        label="Anything else we should know? (optional)"
        value={value.additionalInfo}
        onChangeText={(additionalInfo) =>
          onChange({ ...value, additionalInfo })
        }
        multiline
        numberOfLines={3}
      />
    </View>
  );
}

export function isConsentStepValid(value: IntakeFormData["consent"]): boolean {
  return value.agreed;
}
