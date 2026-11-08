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
  // Attribution is a role or first name only — never a student's full name,
  // since most are minors.
  name: string;
  // Optional result line (e.g. a score change). Only set it when the
  // testimonial itself states the result — never fill one in.
  detail?: string;
};

export const STORIES: Story[] = [
  {
    quote:
      'Working with Paul was an incredibly positive experience. I genuinely enjoyed our sessions, as he was easy to talk to and made asking questions and working through mistakes feel comfortable. As someone with test anxiety, Paul made the ACT feel much more manageable and easy, and I went into every test feeling nothing less than prepared and confident. My score went up much higher just within the first month of working with him. I am so grateful to have had him and couldn’t have asked for a better tutor!',
    name: 'Prospective college student',
  },
  {
    quote:
      'Working with Paul was one of the best decisions I made during my ACT prep. He’s incredibly personable and very easy to connect with, which made every session feel productive. He took the time to understand all my weaknesses and found a way to explain concepts that stuck. Thanks to his help, I was able to improve my score by 7 points, which helped me get into the school I’ve always wanted to attend. I’d recommend him to anyone who is looking to improve their score and gain confidence going into test day.',
    name: 'ACT/SAT student',
    detail: 'ACT — +7 points',
  },
  {
    quote:
      'Working with Paul absolutely changed the trajectory of my high school success and college admission process. Not only is he incredibly smart and skilled at what he does; he is also so patient, kind, and truly cares about his students. He gave me confidence to succeed with both his resources and also his constant support, reassurance, and belief in me. I am so grateful and couldn’t do it without him!',
    name: 'ACT/SAT student',
  },
];

export type Stat = {
  value: string;
  label: string;
};

export const STATS: Stat[] = [
  { value: '10+', label: 'Years Tutoring' },
  { value: '94%', label: 'Grade Improvement' },
  { value: '+7', label: 'Point Avg. ACT Gain' },
  { value: '1:1', label: 'Every Session' },
];

export const NAV_LINKS = [
  { label: 'Why Us', id: 'why-us' },
  { label: 'Success Stories', id: 'success-stories' },
  { label: 'Contact', id: 'contact' },
] as const;
