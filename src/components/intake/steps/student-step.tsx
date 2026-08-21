import { View } from 'react-native';

import { FormField } from '@/components/intake/form-field';
import { PillSelect } from '@/components/intake/pill-select';
import { GRADES, IntakeFormData } from '@/types/intake';

type StudentStepProps = {
  value: IntakeFormData['student'];
  onChange: (value: IntakeFormData['student']) => void;
};

export function StudentStep({ value, onChange }: StudentStepProps) {
  return (
    <View className="gap-5">
      <FormField
        label="Student's name"
        required
        value={value.name}
        onChangeText={(name) => onChange({ ...value, name })}
        autoCapitalize="words"
      />
      <FormField
        label="School"
        required
        value={value.school}
        onChangeText={(school) => onChange({ ...value, school })}
        autoCapitalize="words"
      />
      <PillSelect
        label="Grade"
        required
        options={GRADES}
        value={value.grade}
        onChange={(grade) => onChange({ ...value, grade })}
      />
    </View>
  );
}

export function isStudentStepValid(value: IntakeFormData['student']): boolean {
  return value.name.trim().length > 0 && value.school.trim().length > 0 && value.grade !== null;
}
