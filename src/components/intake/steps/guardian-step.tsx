import { useState } from 'react';
import { View } from 'react-native';

import { FormField } from '@/components/intake/form-field';
import { PillSelect } from '@/components/intake/pill-select';
import { isValidEmail, isValidPhone } from '@/lib/validation';
import { CONTACT_PREFERENCES, IntakeFormData } from '@/types/intake';

type GuardianStepProps = {
  value: IntakeFormData['guardian'];
  onChange: (value: IntakeFormData['guardian']) => void;
};

/**
 * This step is what "Build guardian email/phone validation" (Feature 1,
 * story 1) was about: catch a malformed email or phone before it ever
 * reaches Supabase, with the error shown right on the field instead of a
 * generic banner after submit. Validity is only checked — and only shown —
 * once a field has been blurred, so the guardian isn't shown an error while
 * they're still mid-keystroke on the first character.
 */
export function GuardianStep({ value, onChange }: GuardianStepProps) {
  const [touched, setTouched] = useState<{ email: boolean; phone: boolean }>({
    email: false,
    phone: false,
  });

  const emailError =
    touched.email && value.email.length > 0 && !isValidEmail(value.email)
      ? 'Enter a valid email address (e.g. name@example.com).'
      : null;

  const phoneError =
    touched.phone && value.phone.length > 0 && !isValidPhone(value.phone)
      ? 'Enter a valid 10-digit phone number.'
      : null;

  return (
    <View className="gap-5">
      <FormField
        label="Guardian's name"
        required
        value={value.name}
        onChangeText={(name) => onChange({ ...value, name })}
        autoCapitalize="words"
      />
      <FormField
        label="Guardian's email"
        required
        value={value.email}
        onChangeText={(email) => onChange({ ...value, email })}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormField
        label="Guardian's phone"
        required
        value={value.phone}
        onChangeText={(phone) => onChange({ ...value, phone })}
        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
        error={phoneError}
        keyboardType="phone-pad"
      />
      <PillSelect
        label="Preferred contact method"
        required
        options={CONTACT_PREFERENCES}
        value={value.contactPreference}
        onChange={(contactPreference) => onChange({ ...value, contactPreference })}
      />
    </View>
  );
}

export function isGuardianStepValid(value: IntakeFormData['guardian']): boolean {
  return (
    value.name.trim().length > 0 &&
    isValidEmail(value.email) &&
    isValidPhone(value.phone) &&
    value.contactPreference !== null
  );
}
