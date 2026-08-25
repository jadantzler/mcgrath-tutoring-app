import * as Crypto from 'expo-crypto';

import { supabase } from '@/lib/supabase';
import { AvailabilitySlot, IntakeFormData } from '@/types/intake';

/**
 * Turns a completed intake form into rows in Supabase — as one atomic
 * database transaction, not several independent inserts.
 *
 * This calls a single Postgres function, `submit_intake_form` (see the
 * migration in supabase/migrations), which does all seven table inserts
 * itself inside one function call. Postgres transactions are all-or-nothing:
 * if any insert inside that function fails, every other insert it already
 * made rolls back automatically, so a submission either lands completely or
 * leaves nothing behind — never a half-written student with no guardian or
 * availability attached, which is what could happen with separate
 * client-side `.insert()` calls (a network blip or error between calls
 * would leave whatever had already committed sitting there permanently).
 *
 * Ids are still generated client-side with `Crypto.randomUUID()`, same
 * reasoning as before: `anon` has no SELECT policy, so anything that tries
 * to hand a row back after inserting it — including `.rpc()` returning
 * data — would fail RLS. Generating the ids up front sidesteps that; the
 * function returns nothing (`void`), we already know the ids it used.
 */
export async function submitIntake(formData: IntakeFormData): Promise<void> {
  const studentId = Crypto.randomUUID();
  const guardianId = Crypto.randomUUID();

  const { error } = await supabase.rpc('submit_intake_form', {
    p_student_id: studentId,
    p_student_name: formData.student.name,
    p_student_school: formData.student.school,
    p_student_grade: formData.student.grade,
    p_guardian_id: guardianId,
    p_guardian_name: formData.guardian.name,
    p_guardian_email: formData.guardian.email,
    p_guardian_phone: formData.guardian.phone,
    p_guardian_contact_preference: formData.guardian.contactPreference,
    p_consent_agreed_at: formData.consent.agreed ? new Date().toISOString() : null,
    p_how_heard: formData.consent.howHeard.trim() || null,
    p_additional_info: formData.consent.additionalInfo.trim() || null,
    p_availability: buildAvailabilityPayload(formData.availability),
    p_tutoring_interests: buildTutoringInterestsPayload(formData.interest),
    p_college_interests: buildCollegeInterestsPayload(formData.interest),
    p_tutoring_history: buildTutoringHistoryPayload(formData.interest),
  });

  if (error) throw error;
}

function buildAvailabilityPayload(availability: Set<AvailabilitySlot>) {
  return Array.from(availability).map((slot) => {
    const [dayOfWeek, timeBlock] = slot.split('-');
    return { day_of_week: dayOfWeek, time_block: timeBlock };
  });
}

function buildTutoringInterestsPayload(interest: IntakeFormData['interest']) {
  const interests = [];

  // One entry for ACT/SAT together (not one each) — they share the same
  // `attributes` shape and the table's `type` column only distinguishes
  // "act_sat" from "subject."
  if (interest.act || interest.sat) {
    interests.push({
      type: 'act_sat',
      attributes: {
        act: interest.act,
        actScore: interest.act ? interest.actScore.trim() || null : null,
        sat: interest.sat,
        satScore: interest.sat ? interest.satScore.trim() || null : null,
        sessionPreference: interest.sessionPreference,
      },
    });
  }

  if (interest.subject.trim()) {
    interests.push({
      type: 'subject',
      attributes: {
        subject: interest.subject.trim(),
        sessionPreference: interest.sessionPreference,
      },
    });
  }

  return interests;
}

function buildCollegeInterestsPayload(interest: IntakeFormData['interest']) {
  if (!interest.hasCollegeInterest) return [];
  return interest.collegeInterests.map((college) => college.trim()).filter(Boolean);
}

function buildTutoringHistoryPayload(interest: IntakeFormData['interest']) {
  if (!interest.hasPriorTutoring) return [];
  return interest.priorTutoringProviders.map((provider) => provider.trim()).filter(Boolean);
}
