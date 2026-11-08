/**
 * notify-new-intake — emails Paul whenever a family submits the intake form.
 *
 * Called by a Supabase Database Webhook on INSERT into `students`. The
 * webhook's request is queued inside the same transaction as
 * `submit_intake_form` and only goes out once that transaction commits, so
 * by the time this runs, all seven tables for the submission are saved —
 * and a submission that rolls back never triggers an email. Nothing here can
 * affect whether a family's submission succeeds; the worst case is a missed
 * email, which is logged.
 *
 * Secrets (set with `supabase secrets set`, never in code):
 *   WEBHOOK_SECRET   shared password the webhook sends in `x-webhook-secret`
 *   RESEND_API_KEY   Resend key with sending access only
 *   NOTIFY_TO_EMAIL  who receives the notification
 * SUPABASE_URL and the secret (admin) key are provided by Supabase.
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

import { buildEmail, type Submission } from './email.ts';

const FROM = 'McGrath Tutoring Website <notifications@mcgrathtutoring.com>';

// One query pulls the student plus every related table, via the foreign keys
// on student_id (and student_guardians → guardians).
const SUBMISSION_QUERY = `
  id, name, grade, school, created_at,
  student_guardians ( is_primary, guardians ( name, email, phone, contact_preference, how_heard, additional_info, consent_agreed_at ) ),
  student_availability ( day_of_week, time_block ),
  tutoring_interests ( type, attributes ),
  college_interests ( college_name ),
  tutoring_history ( provider )
`;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
  const providedSecret = req.headers.get('x-webhook-secret') ?? '';
  if (!expectedSecret || !(await secretsMatch(providedSecret, expectedSecret))) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: { type?: string; table?: string; record?: { id?: string } };
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const studentId = payload.record?.id;
  if (payload.type !== 'INSERT' || payload.table !== 'students' || !studentId) {
    return new Response('Ignored', { status: 200 });
  }

  // Logs reference the submission id only — never names, emails or phone
  // numbers — so function logs don't become a second copy of family data.
  try {
    const submission = await loadSubmission(studentId);
    const email = buildEmail(submission);
    await sendEmail(studentId, email);
    console.log(`Notification sent for submission ${studentId}`);
    return new Response('Sent', { status: 200 });
  } catch (error) {
    console.error(`Notification FAILED for submission ${studentId}:`, errorMessage(error));
    return new Response('Notification failed', { status: 500 });
  }
});

async function loadSubmission(studentId: string): Promise<Submission> {
  const supabase = createClient(requireEnv('SUPABASE_URL'), adminKey(), {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from('students')
    .select(SUBMISSION_QUERY)
    .eq('id', studentId)
    .single();

  if (error) throw new Error(`Database lookup failed: ${error.message}`);
  return data as unknown as Submission;
}

async function sendEmail(studentId: string, email: ReturnType<typeof buildEmail>) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
      // Same key for the same submission: if the webhook ever fires twice,
      // Resend sends only one email.
      'Idempotency-Key': `intake-${studentId}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [requireEnv('NOTIFY_TO_EMAIL')],
      subject: email.subject,
      text: email.text,
      html: email.html,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend returned ${response.status}: ${await response.text()}`);
  }
}

/**
 * Supabase now provides admin keys as a JSON dictionary in
 * SUPABASE_SECRET_KEYS; SUPABASE_SERVICE_ROLE_KEY is the legacy name. Either
 * bypasses row-level security, which is why this only ever runs server-side.
 */
function adminKey() {
  const dictionary = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (dictionary) {
    try {
      const keys = JSON.parse(dictionary) as Record<string, string>;
      const key = keys.default ?? Object.values(keys)[0];
      if (key) return key;
    } catch {
      // fall through to the legacy variable
    }
  }
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY');
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

/**
 * Compares SHA-256 hashes byte by byte without stopping early, so response
 * timing can't reveal how much of a guessed secret was right.
 */
async function secretsMatch(provided: string, expected: string) {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all(
    [provided, expected].map((value) => crypto.subtle.digest('SHA-256', encoder.encode(value))),
  );
  const bytesA = new Uint8Array(a);
  const bytesB = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < bytesA.length; i++) difference |= bytesA[i] ^ bytesB[i];
  return difference === 0;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
