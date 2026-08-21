/**
 * Homepage copy, pulled out of `index.tsx` and into data — this mirrors how
 * the wireframe itself is structured (arrays like `PILLARS`/`STORIES`/`STATS`
 * mapped over in JSX, rather than each card hand-written). Keeping the
 * content here means editing a testimonial or a stat later is a data change,
 * not a JSX change, and the section components stay focused on layout.
 */

import { BookOpen, Target, Users, type LucideIcon } from 'lucide-react-native';

export type Pillar = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const PILLARS: Pillar[] = [
  {
    icon: Target,
    title: 'ACT / SAT Test Strategy',
    body: 'Score improvement built on real test mechanics, practice, and pacing — not generic tips.',
  },
  {
    icon: BookOpen,
    title: 'Individual Subject Tutoring',
    body: 'One-on-one coursework support tailored to exactly where your student needs help — from foundational skills to advanced coursework.',
  },
  {
    icon: Users,
    title: 'One Student, One Plan',
    body: 'Every session is one-on-one and built around how your student actually learns.',
  },
];

export type Story = {
  quote: string;
  name: string;
  detail: string;
};

export const STORIES: Story[] = [
  {
    quote:
      'Our son went from struggling to keep up in AP Biology to earning a 4 on the exam. Paul knew exactly where the gaps were and was able to help!',
    name: 'Parent of an 11th grade student',
    detail: 'AP Biology — exam score 2 → 4',
  },
  {
    quote:
      'The SAT prep was structured and calm — no stress, just steady progress every week. We saw the score move before we saw it on paper.',
    name: 'Parent of a 12th grade student',
    detail: 'SAT — 1120 → 1310',
  },
  {
    quote:
      'What stood out was how much they communicated with us. We always knew how our daughter was doing, session to session.',
    name: 'Parent of a 10th grade student',
    detail: 'AP Anatomy — C → A−',
  },
  {
    quote:
      'My child was struggling with their ACT.. After working with Paul, their score shot up from a 19 to a 30.',
    name: 'Parent with a junior in high school',
    detail: 'ACT — 19 → 30',
  },
];

export type Stat = {
  value: string;
  label: string;
};

export const STATS: Stat[] = [
  { value: '10+', label: 'Years Tutoring' },
  { value: '94%', label: 'Grade Improvement' },
  { value: '180+', label: 'Point Avg. SAT Gain' },
  { value: '1:1', label: 'Every Session' },
];

export const NAV_LINKS = [
  { label: 'Why Us', id: 'why-us' },
  { label: 'Success Stories', id: 'success-stories' },
  { label: 'Contact', id: 'contact' },
] as const;
