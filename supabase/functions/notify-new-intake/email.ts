/**
 * Turns one intake submission into the notification email Paul receives.
 *
 * Pure formatting only — no network or database calls — so the layout can
 * be read and changed in one place without touching the request handling in
 * `index.ts`. Every value typed by a family goes through `escapeHtml` before
 * it lands in the HTML version, so text like `<a href=…>` shows up as literal
 * characters in Paul's inbox instead of becoming a link or formatting.
 */

export type Submission = {
  id: string;
  name: string;
  grade: string;
  school: string;
  created_at: string;
  student_guardians: {
    is_primary: boolean;
    guardians: {
      name: string;
      email: string;
      phone: string;
      contact_preference: string | null;
      how_heard: string | null;
      additional_info: string | null;
      consent_agreed_at: string | null;
    } | null;
  }[];
  student_availability: { day_of_week: string; time_block: string }[];
  tutoring_interests: { type: string; attributes: Record<string, unknown> }[];
  college_interests: { college_name: string }[];
  tutoring_history: { provider: string }[];
};

export type Email = {
  subject: string;
  text: string;
  html: string;
  replyTo: string | null;
};

// Same orderings the intake form uses (src/types/intake.ts), so availability
// reads Mon→Sun and Morning→Evening rather than in database order.
const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_ORDER = ['Morning', 'Afternoon', 'Evening'];

type Section = { title: string; lines: [label: string, value: string][] };

export function buildEmail(s: Submission): Email {
  const guardian = primaryGuardian(s);
  const interests = describeInterests(s);
  const availability = describeAvailability(s);
  const colleges = s.college_interests.map((c) => c.college_name).filter(Boolean);
  const history = s.tutoring_history.map((t) => t.provider).filter(Boolean);

  const subjectInterests = interests.summary.length ? ` – ${interests.summary.join(', ')}` : '';
  const subject = oneLine(`New intake: ${shortName(s.name)} (${s.grade} grade)${subjectInterests}`);

  const sections: Section[] = [
    {
      title: 'Student',
      lines: [
        ['Name', s.name],
        ['Grade', s.grade],
        ['School', s.school],
      ],
    },
  ];

  if (guardian) {
    sections.push({
      title: 'Parent / Guardian',
      lines: [
        ['Name', guardian.name],
        ['Email', guardian.email],
        ['Phone', guardian.phone],
        ['Prefers', guardian.contact_preference ?? ''],
      ],
    });
  }

  if (interests.lines.length) {
    sections.push({ title: 'Looking for', lines: interests.lines });
  }

  if (availability.length) {
    sections.push({ title: 'Availability', lines: availability });
  }

  const extras: [string, string][] = [
    ['Colleges of interest', colleges.join(', ')],
    ['Previous tutoring', history.join(', ')],
    ['How they heard', guardian?.how_heard ?? ''],
    ['Additional info', guardian?.additional_info ?? ''],
  ];
  if (extras.some(([, value]) => value.trim())) {
    sections.push({ title: 'More details', lines: extras });
  }

  const intro = `New tutoring inquiry — submitted ${formatEastern(s.created_at)}`;
  const footer: [string, string][] = [
    [
      'Consent agreed',
      guardian?.consent_agreed_at ? formatEastern(guardian.consent_agreed_at) : 'No',
    ],
    ['Submission ID', s.id],
  ];

  return {
    subject,
    text: renderText(intro, sections, footer),
    html: renderHtml(intro, sections, footer, guardian),
    replyTo: guardian?.email || null,
  };
}

function primaryGuardian(s: Submission) {
  const links = s.student_guardians.filter((link) => link.guardians);
  return (links.find((link) => link.is_primary) ?? links[0])?.guardians ?? null;
}

/**
 * `summary` feeds the subject line ("ACT, AP Chemistry"); `lines` feeds the
 * "Looking for" section. Attribute shapes match what src/lib/submit-intake.ts
 * writes into `tutoring_interests.attributes`.
 */
function describeInterests(s: Submission) {
  const summary: string[] = [];
  const lines: [string, string][] = [];
  let sessionPreference = '';

  for (const interest of s.tutoring_interests) {
    const a = interest.attributes ?? {};
    if (!sessionPreference && typeof a.sessionPreference === 'string') {
      sessionPreference = a.sessionPreference;
    }

    if (interest.type === 'act_sat') {
      for (const test of ['ACT', 'SAT'] as const) {
        const key = test.toLowerCase();
        if (a[key]) {
          summary.push(test);
          const score = a[`${key}Score`];
          lines.push([test, score ? `current score ${score}` : 'no current score given']);
        }
      }
    } else if (interest.type === 'subject' && typeof a.subject === 'string') {
      summary.push(a.subject);
      lines.push(['Subject', a.subject]);
    }
  }

  if (sessionPreference) lines.push(['Session preference', sessionPreference]);
  return { summary, lines };
}

function describeAvailability(s: Submission): [string, string][] {
  const byDay = new Map<string, string[]>();
  for (const slot of s.student_availability) {
    byDay.set(slot.day_of_week, [...(byDay.get(slot.day_of_week) ?? []), slot.time_block]);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => rank(DAY_ORDER, a) - rank(DAY_ORDER, b))
    .map(([day, blocks]) => [
      day,
      blocks.sort((a, b) => rank(TIME_ORDER, a) - rank(TIME_ORDER, b)).join(', '),
    ]);
}

function rank(order: string[], value: string) {
  const i = order.indexOf(value);
  return i === -1 ? order.length : i;
}

/** "Jordan Smith" → "Jordan S." — keeps full student names out of inbox lists. */
function shortName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] ?? '';
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

/** e.g. "Sat, Nov 7, 2026, 8:14 PM EST" — always Eastern, where Paul is. */
function formatEastern(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso));
}

// Subject lines must stay on one line; a stray newline from form input
// shouldn't be able to break the header.
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function renderText(intro: string, sections: Section[], footer: [string, string][]) {
  const blocks = [intro];
  for (const section of sections) {
    const lines = section.lines.filter(([, value]) => value.trim());
    if (!lines.length) continue;
    blocks.push(
      [
        section.title.toUpperCase(),
        // Continuation lines of multi-line answers stay indented under their label.
        ...lines.map(([label, value]) => `  ${label}: ${value.replace(/\n/g, '\n    ')}`),
      ].join('\n'),
    );
  }
  blocks.push(footer.map(([label, value]) => `${label}: ${value}`).join('\n'));
  return blocks.join('\n\n');
}

function renderHtml(
  intro: string,
  sections: Section[],
  footer: [string, string][],
  guardian: ReturnType<typeof primaryGuardian>,
) {
  const row = (label: string, valueHtml: string) =>
    `<tr><td style="padding:2px 16px 2px 0;color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:2px 0">${valueHtml}</td></tr>`;

  // Email and phone become tap-to-contact links; everything else is plain
  // escaped text.
  const valueHtml = (label: string, value: string) => {
    const safe = escapeHtml(value);
    if (guardian && label === 'Email' && value === guardian.email) {
      return `<a href="mailto:${escapeHtml(value)}">${safe}</a>`;
    }
    if (guardian && label === 'Phone' && value === guardian.phone) {
      return `<a href="tel:${escapeHtml(value.replace(/[^\d+]/g, ''))}">${safe}</a>`;
    }
    return safe.replace(/\n/g, '<br>');
  };

  const body = sections
    .map((section) => {
      const lines = section.lines.filter(([, value]) => value.trim());
      if (!lines.length) return '';
      return `<h3 style="margin:20px 0 6px;font-size:13px;letter-spacing:.5px;text-transform:uppercase;color:#1f2a44">${escapeHtml(section.title)}</h3><table style="border-collapse:collapse;font-size:14px">${lines.map(([label, value]) => row(label, valueHtml(label, value))).join('')}</table>`;
    })
    .join('');

  const footerHtml = footer
    .map(([label, value]) => `${escapeHtml(label)}: ${escapeHtml(value)}`)
    .join('<br>');

  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#222;max-width:560px"><p style="font-size:15px;margin:0 0 4px"><strong>${escapeHtml(intro)}</strong></p>${body}<p style="margin-top:24px;font-size:12px;color:#888">${footerHtml}</p></div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
