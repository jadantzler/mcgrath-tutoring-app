import * as Crypto from 'expo-crypto';

import { supabase } from '@/lib/supabase';
import { AvailabilitySlot, IntakeFormData } from '@/types/intake';

/**
 * Turns a completed intake form into rows in Supabase.
 *
 * Every id here is generated client-side with `Crypto.randomUUID()` rather
 * than left to Postgres's `gen_random_uuid()` default. That's not a style
 * choice — it's required by the RLS setup: `anon` only has an INSERT policy
 * on these tables, no SELECT policy, and Postgres needs a SELECT policy to
 * satisfy `.insert().select()` (it has to check you're allowed to see the
 * row you're asking back). Generating ids up front means every insert below
 * can go out as a plain `.insert()` — no round trip needed to learn a
 * student's id before inserting their availability/interests/etc.
 *
 * All of the child-table inserts run in parallel (`Promise.all`) once the
 * student and guardian rows exist, since none of them depend on each
 * other's results — they only depend on `studentId`/`guardianId`, which are
 * already known.
 */
export async function submitIntake(formData: IntakeFormData): Promise<void> {
  const studentId = Crypto.randomUUID();
  const guardianId = Crypto.randomUUID();

  const { error: studentError } = await supabase.from('students').insert({
    id: studentId,
    name: formData.student.name,
    school: formData.student.school,
    grade: formData.student.grade,
  });
  if (studentError) throw studentError;

  const { error: guardianError } = await supabase.from('guardians').insert({
    id: guardianId,
    name: formData.guardian.name,
    email: formData.guardian.email,
    phone: formData.guardian.phone,
    contact_preference: formData.guardian.contactPreference,
    consent_agreed_at: formData.consent.agreed ? new Date().toISOString() : null,
    how_heard: formData.consent.howHeard.trim() || null,
    additional_info: formData.consent.additionalInfo.trim() || null,
  });
  if (guardianError) throw guardianError;

  const inserts = [
    supabase.from('student_guardians').insert({
      student_id: studentId,
      guardian_id: guardianId,
      is_primary: true,
    }),
    ...buildAvailabilityInserts(studentId, formData.availability),
    ...buildTutoringInterestInserts(studentId, formData.interest),
    ...buildCollegeInterestInserts(studentId, formData.interest),
    ...buildTutoringHistoryInserts(studentId, formData.interest),
  ];

  const results = await Promise.all(inserts);
  const firstError = results.find((result) => result.error)?.error;
  if (firstError) throw firstError;
}

function buildAvailabilityInserts(studentId: string, availability: Set<AvailabilitySlot>) {
  return Array.from(availability).map((slot) => {
    const [dayOfWeek, timeBlock] = slot.split('-');
    return supabase.from('student_availability').insert({
      student_id: studentId,
      day_of_week: dayOfWeek,
      time_block: timeBlock,
    });
  });
}

function buildTutoringInterestInserts(studentId: string, interest: IntakeFormData['interest']) {
  const inserts = [];

  // One row for ACT/SAT together (not one each) — they share the same
  // `attributes` shape and the type check only distinguishes "act_sat" from
  // "subject," matching the TDD's `type in ('act_sat', 'subject')` column.
  if (interest.act || interest.sat) {
    inserts.push(
      supabase.from('tutoring_interests').insert({
        student_id: studentId,
        type: 'act_sat',
        attributes: {
          act: interest.act,
          actScore: interest.act ? interest.actScore.trim() || null : null,
          sat: interest.sat,
          satScore: interest.sat ? interest.satScore.trim() || null : null,
          sessionPreference: interest.sessionPreference,
        },
      }),
    );
  }

  if (interest.subject.trim()) {
    inserts.push(
      supabase.from('tutoring_interests').insert({
        student_id: studentId,
        type: 'subject',
        attributes: {
          subject: interest.subject.trim(),
          sessionPreference: interest.sessionPreference,
        },
      }),
    );
  }

  return inserts;
}

function buildCollegeInterestInserts(studentId: string, interest: IntakeFormData['interest']) {
  if (!interest.hasCollegeInterest) return [];
  return interest.collegeInterests
    .map((college) => college.trim())
    .filter((college) => college.length > 0)
    .map((college) =>
      supabase.from('college_interests').insert({ student_id: studentId, college_name: college }),
    );
}

function buildTutoringHistoryInserts(studentId: string, interest: IntakeFormData['interest']) {
  if (!interest.hasPriorTutoring) return [];
  return interest.priorTutoringProviders
    .map((provider) => provider.trim())
    .filter((provider) => provider.length > 0)
    .map((provider) =>
      supabase.from('tutoring_history').insert({ student_id: studentId, provider }),
    );
}
