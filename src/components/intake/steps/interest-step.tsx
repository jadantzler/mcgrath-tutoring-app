import { Pressable, View } from 'react-native';

import { FormField } from '@/components/intake/form-field';
import { MultiEntryList } from '@/components/intake/multi-entry-list';
import { PillSelect } from '@/components/intake/pill-select';
import { ThemedText } from '@/components/themed-text';
import { SelectedIndicator } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { IntakeFormData, SESSION_PREFERENCES } from '@/types/intake';

type InterestStepProps = {
  value: IntakeFormData['interest'];
  onChange: (value: IntakeFormData['interest']) => void;
};

function InterestToggle({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderColor: selected ? SelectedIndicator.background : theme.border,
      }}
    >
      <View
        style={{
          height: 16,
          width: 16,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: selected ? SelectedIndicator.background : theme.border,
          backgroundColor: selected ? SelectedIndicator.background : 'transparent',
        }}
      >
        {selected ? (
          <ThemedText
            type="small"
            style={{ color: SelectedIndicator.foreground, lineHeight: 14, fontSize: 11 }}
          >
            ✓
          </ThemedText>
        ) : null}
      </View>
      <ThemedText type="default">{label}</ThemedText>
    </Pressable>
  );
}

export function InterestStep({ value, onChange }: InterestStepProps) {
  return (
    <View className="gap-5">
      {/* ACT and SAT are independent toggles rather than a single-select — the
          requirements call out that a student can be interested in both at once. */}
      <View className="gap-2">
        <ThemedText type="smallBold">Tutoring interest *</ThemedText>
        <InterestToggle
          label="ACT prep"
          selected={value.act}
          onPress={() => onChange({ ...value, act: !value.act })}
        />
        {value.act ? (
          <FormField
            label="Most recent ACT score (optional)"
            value={value.actScore}
            onChangeText={(actScore) => onChange({ ...value, actScore })}
            keyboardType="number-pad"
          />
        ) : null}
        <InterestToggle
          label="SAT prep"
          selected={value.sat}
          onPress={() => onChange({ ...value, sat: !value.sat })}
        />
        {value.sat ? (
          <FormField
            label="Most recent SAT score (optional)"
            value={value.satScore}
            onChangeText={(satScore) => onChange({ ...value, satScore })}
            keyboardType="number-pad"
          />
        ) : null}
      </View>

      <FormField
        label="Specific subject (e.g. AP Biology, AP Anatomy) — optional"
        value={value.subject}
        onChangeText={(subject) => onChange({ ...value, subject })}
      />

      <PillSelect
        label="Session preference"
        required
        options={SESSION_PREFERENCES}
        value={value.sessionPreference}
        onChange={(sessionPreference) => onChange({ ...value, sessionPreference })}
      />

      {/* Collapsed-until-yes, same pattern as the ACT/SAT score fields above:
          most guardians will answer No to both of these, so the list field
          only costs them anything once they've said Yes. */}
      <View className="gap-2">
        <InterestToggle
          label="Has your student started looking at colleges?"
          selected={value.hasCollegeInterest}
          onPress={() => onChange({ ...value, hasCollegeInterest: !value.hasCollegeInterest })}
        />
        {value.hasCollegeInterest ? (
          <MultiEntryList
            label="Which colleges?"
            placeholder="e.g. UNC Chapel Hill"
            addLabel="+ Add another school"
            values={value.collegeInterests}
            onChange={(collegeInterests) => onChange({ ...value, collegeInterests })}
          />
        ) : null}
      </View>

      <View className="gap-2">
        <InterestToggle
          label="Has your student been tutored before?"
          selected={value.hasPriorTutoring}
          onPress={() => onChange({ ...value, hasPriorTutoring: !value.hasPriorTutoring })}
        />
        {value.hasPriorTutoring ? (
          <MultiEntryList
            label="Where have they been tutored?"
            placeholder="e.g. Sylvan Learning, or a tutor's name"
            addLabel="+ Add another"
            values={value.priorTutoringProviders}
            onChange={(priorTutoringProviders) => onChange({ ...value, priorTutoringProviders })}
          />
        ) : null}
      </View>
    </View>
  );
}

export function isInterestStepValid(value: IntakeFormData['interest']): boolean {
  const hasInterest = value.act || value.sat || value.subject.trim().length > 0;
  const hasSessionPreference = value.sessionPreference !== null;

  // Both follow-up lists are only required to have real content once their
  // toggle is on — untouched (toggle off), they don't block Continue at all.
  const collegeInterestValid =
    !value.hasCollegeInterest ||
    value.collegeInterests.some((college) => college.trim().length > 0);
  const priorTutoringValid =
    !value.hasPriorTutoring ||
    value.priorTutoringProviders.some((provider) => provider.trim().length > 0);

  return hasInterest && hasSessionPreference && collegeInterestValid && priorTutoringValid;
}
