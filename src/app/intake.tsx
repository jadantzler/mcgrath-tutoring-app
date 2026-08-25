import { CircleCheck } from 'lucide-react-native';
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
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { submitIntake } from '@/lib/submit-intake';
import { createEmptyIntakeFormData, IntakeFormData } from '@/types/intake';

const CARD_BORDER = '#E9E4D8';
const BADGE_BACKGROUND = '#EAF2EC';

const NEXT_STEPS = [
  'Our team reviews the information you submitted.',
  "We'll reach out using your preferred contact method.",
  "Together, we'll schedule an introductory session.",
];

const STEP_LABELS = ['Student', 'Interest', 'Availability', 'Guardian', 'Consent'] as const;

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

  async function handleContinue() {
    if (!isCurrentStepValid) return;
    if (isLastStep) {
      setSubmitError(null);
      setIsSubmitting(true);
      try {
        await submitIntake(formData);
        setSubmitted(true);
      } catch (error) {
        // Stay on the Consent step and surface the failure rather than
        // silently losing the guardian's answers — a network blip or a
        // transient Supabase error shouldn't force them to redo the form.
        console.error('Failed to submit intake form:', error);
        setSubmitError('Something went wrong submitting your info. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setStepIndex((index) => index + 1);
  }

  function handleBack() {
    setStepIndex((index) => Math.max(0, index - 1));
  }

  if (submitted) {
    const guardianFirstName = formData.guardian.name.split(' ')[0] || 'there';
    const studentPossessive = formData.student.name
      ? `${formData.student.name}'s`
      : "your student's";
    const contactMethod = formData.guardian.contactPreference?.toLowerCase() ?? 'email';

    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.confirmationSafeArea}>
          <View style={styles.confirmationCard}>
            <View style={styles.badge}>
              <CircleCheck size={32} color={BrandColors.deepGreen} strokeWidth={1.75} />
            </View>

            <ThemedText type="title" style={styles.confirmationTitle}>
              Thank You, {guardianFirstName}
            </ThemedText>
            <ThemedText
              type="default"
              themeColor="textSecondary"
              style={styles.confirmationSubtitle}
            >
              We&apos;ve received {studentPossessive} information and will follow up by{' '}
              {contactMethod} soon.
            </ThemedText>

            <View style={styles.divider} />

            <ThemedText type="smallBold" style={styles.nextStepsHeading}>
              What happens next
            </ThemedText>
            <View style={styles.nextSteps}>
              {NEXT_STEPS.map((step, i) => (
                <View key={step} style={styles.nextStepRow}>
                  <View style={styles.nextStepNumberBadge}>
                    <ThemedText type="small" style={styles.nextStepNumberText}>
                      {i + 1}
                    </ThemedText>
                  </View>
                  <ThemedText type="default" style={styles.nextStepText}>
                    {step}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
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
            <ThemedText type="small" style={{ color: '#B3261E' }}>
              {submitError}
            </ThemedText>
          ) : null}

          <View style={styles.navRow}>
            <Pressable
              onPress={handleBack}
              disabled={stepIndex === 0}
              className={`rounded-lg px-5 py-3 ${stepIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
            >
              <ThemedText type="default">Back</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleContinue}
              disabled={!isCurrentStepValid || isSubmitting}
              className={`rounded-lg px-6 py-3 ${
                isCurrentStepValid && !isSubmitting ? 'bg-gold' : 'bg-charcoal/20'
              }`}
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
  confirmationSafeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  confirmationCard: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: Spacing.four,
    padding: Spacing.five,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BADGE_BACKGROUND,
    marginBottom: Spacing.three,
  },
  confirmationTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
  },
  confirmationSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.two,
  },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: CARD_BORDER,
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
  },
  nextStepsHeading: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.two,
  },
  nextSteps: {
    alignSelf: 'stretch',
    gap: Spacing.two,
  },
  nextStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  nextStepNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BADGE_BACKGROUND,
    marginTop: 1,
  },
  nextStepNumberText: {
    color: BrandColors.deepGreen,
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 14,
  },
  nextStepText: {
    flex: 1,
    lineHeight: 21,
  },
});
