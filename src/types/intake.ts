/**
 * Shared shape of the intake form's in-progress data, plus the small enums
 * the form steps agree on. Centralizing these means every step and the
 * eventual Supabase insert (Feature 2) read from one definition instead of
 * each file inventing its own strings.
 */

export const GRADES = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'] as const;
export type Grade = (typeof GRADES)[number];

export const SESSION_PREFERENCES = ['In-Person', 'Virtual', 'No Preference'] as const;
export type SessionPreference = (typeof SESSION_PREFERENCES)[number];

export const CONTACT_PREFERENCES = ['Email', 'Phone', 'Text'] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const TIME_BLOCKS = ['Morning', 'Afternoon', 'Evening'] as const;
export type TimeBlock = (typeof TIME_BLOCKS)[number];

/** `"Mon-Morning"` style key used as a Set entry for the availability grid. */
export type AvailabilitySlot = `${DayOfWeek}-${TimeBlock}`;

export type IntakeFormData = {
  student: {
    name: string;
    school: string;
    grade: Grade | null;
  };
  interest: {
    act: boolean;
    sat: boolean;
    subject: string;
    actScore: string;
    satScore: string;
    sessionPreference: SessionPreference | null;
    // Both pairs follow the same shape as `act`/`actScore` above: a toggle
    // that gates a follow-up. Here the follow-up is a growable list instead
    // of a single score field, since a student can be looking at more than
    // one college or have had more than one prior tutor.
    hasCollegeInterest: boolean;
    collegeInterests: string[];
    hasPriorTutoring: boolean;
    priorTutoringProviders: string[];
  };
  availability: Set<AvailabilitySlot>;
  guardian: {
    name: string;
    email: string;
    phone: string;
    contactPreference: ContactPreference | null;
  };
  // `howHeard`/`additionalInfo` are about the guardian filling out the form,
  // not the student, so they map onto the guardians table (see
  // src/lib/submit-intake.ts) rather than students or a separate table.
  consent: {
    agreed: boolean;
    howHeard: string;
    additionalInfo: string;
  };
};

export function createEmptyIntakeFormData(): IntakeFormData {
  return {
    student: { name: '', school: '', grade: null },
    interest: {
      act: false,
      sat: false,
      subject: '',
      actScore: '',
      satScore: '',
      sessionPreference: null,
      hasCollegeInterest: false,
      collegeInterests: [],
      hasPriorTutoring: false,
      priorTutoringProviders: [],
    },
    availability: new Set(),
    guardian: { name: '', email: '', phone: '', contactPreference: null },
    consent: { agreed: false, howHeard: '', additionalInfo: '' },
  };
}
