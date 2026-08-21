import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StepProgressBar } from '@/components/intake/step-progress-bar';
import {
  AvailabilityStep,
  isAvailabilityStepValid,
} from '@/components/intake/steps/availability-step';
import { ConsentStep, isConsentStepValid } from '@/components/intake/steps/consent-step';
import { GuardianStep, isGuardianStepValid } from '@/components/intake/steps/guardian-step';
import { InterestStep, isInterestStepValid } from '@/components/intake/steps/interest-step';
import { isStudentStepValid, StudentStep } from '@/components/intake/steps/student-step';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { submitIntake } from '@/lib/submit-intake';
import { createEmptyIntakeFormData, IntakeFormData } from '@/types/intake';

const STEP_LABELS = ['Student', 'Interest', 'Availability', 'Guardian', 'Consent'] as const;

// TEMP — freshness probe, delete once the browser is confirmed on current code.
const BUILD_STAMP = 'WIRED-SUPABASE-v1';

export default function IntakeScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<IntakeFormData>(createEmptyIntakeFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Each step reports its own validity. Deriving this per render (rather than
  // storing "isValid" in state) means it's always in sync with the fields —
  // there's no separate flag that could drift from the data it's describing.
  const isCurrentStepValid = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return isStudentStepValid(formData.student);
      case 1:
        return isInterestStepValid(formData.interest);
      case 2:
        return isAvailabilityStepValid(formData.availability);
      case 3:
        return isGuardianStepValid(formData.guardian);
      case 4:
        return isConsentStepValid(formData.consent);
      default:
        return false;
    }
  }, [stepIndex, formData]);

  const isLastStep = stepIndex === STEP_LABELS.length - 1;
  const canSubmit = isCurrentStepValid && !isSubmitting;

  async function handleContinue() {
    if (!canSubmit) return;
    if (!isLastStep) {
      setStepIndex((index) => index + 1);
      return;
    }

    // The confirmation screen is only shown after Supabase has actually
    // accepted every row. Flipping `submitted` first would tell the guardian
    // we have their student's info before we do.
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitIntake(formData);
      setSubmitted(true);
    } catch (error) {
      console.error('[intake] submit failed', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Something went wrong submitting the form. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    setStepIndex((index) => Math.max(0, index - 1));
  }

  if (submitted) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="title" style={styles.title}>
            Thanks, {formData.guardian.name.split(' ')[0] || 'there'}!
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
            We&apos;ve received{' '}
            {formData.student.name ? `${formData.student.name}'s` : "your student's"} information
            and will be in touch by {formData.guardian.contactPreference?.toLowerCase() ?? 'email'}{' '}
            soon.
          </ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TEMP — freshness probe, delete with BUILD_STAMP. */}
          <View style={styles.buildStamp}>
            <ThemedText type="smallBold" style={{ color: '#000000' }}>
              BUILD {BUILD_STAMP}
            </ThemedText>
          </View>

          <ThemedText type="title" style={styles.title}>
            Student Sign-Up
          </ThemedText>

          <StepProgressBar stepLabels={STEP_LABELS} currentStepIndex={stepIndex} />

          <View style={styles.stepBody}>
            {stepIndex === 0 && (
              <StudentStep
                value={formData.student}
                onChange={(student) => setFormData((f) => ({ ...f, student }))}
              />
            )}
            {stepIndex === 1 && (
              <InterestStep
                value={formData.interest}
                onChange={(interest) => setFormData((f) => ({ ...f, interest }))}
              />
            )}
            {stepIndex === 2 && (
              <AvailabilityStep
                value={formData.availability}
                onChange={(availability) => setFormData((f) => ({ ...f, availability }))}
              />
            )}
            {stepIndex === 3 && (
              <GuardianStep
                value={formData.guardian}
                onChange={(guardian) => setFormData((f) => ({ ...f, guardian }))}
              />
            )}
            {stepIndex === 4 && (
              <ConsentStep
                value={formData.consent}
                onChange={(consent) => setFormData((f) => ({ ...f, consent }))}
              />
            )}
          </View>

          {submitError ? (
            <ThemedText type="small" style={styles.errorText}>
              {submitError}
            </ThemedText>
          ) : null}

          <View style={styles.navRow}>
            <Pressable
              onPress={handleBack}
              disabled={stepIndex === 0 || isSubmitting}
              className={`rounded-lg px-5 py-3 ${stepIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
            >
              <ThemedText type="default">Back</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleContinue}
              disabled={!canSubmit}
              className={`rounded-lg px-6 py-3 ${canSubmit ? 'bg-gold' : 'bg-charcoal/20'}`}
            >
              <ThemedText type="default" style={{ color: '#FFFFFF' }}>
                {isLastStep ? (isSubmitting ? 'Submitting…' : 'Submit') : 'Continue'}
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 28,
    lineHeight: 34,
  },
  stepBody: {
    marginTop: Spacing.two,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  centerText: {
    textAlign: 'center',
  },
  errorText: {
    color: '#B3261E',
  },
  buildStamp: {
    backgroundColor: '#FF00AA',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
});
