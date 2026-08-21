# McGrath Tutoring — Web App

The client-facing web app for McGrath Tutoring LLC: guardians sign up their student for tutoring,
browse recommended courses, and submit an intake form. Built with [Expo](https://expo.dev)
(React Native + Expo Router), styled with [NativeWind](https://www.nativewind.dev/) (Tailwind for
React Native), and backed by [Supabase](https://supabase.com). See the Technical Design Document
in Notion for the full architecture.

## Prerequisites

- Node.js 20+
- npm

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` with the values from the
   Supabase project (Project Settings → API). The app throws a clear error on startup if either is
   missing — see `src/lib/env.ts`.

3. Start the dev server:

   ```bash
   npm run start
   ```

   Then press `w` to open the web build, or scan the QR code with Expo Go for a device.

## Available scripts

| Script                 | What it does                           |
| ---------------------- | -------------------------------------- |
| `npm run start`        | Start the Expo dev server              |
| `npm run web`          | Start the dev server, web target       |
| `npm run ios`          | Start the dev server, iOS simulator    |
| `npm run android`      | Start the dev server, Android emulator |
| `npm run lint`         | Lint with ESLint                       |
| `npm run lint:fix`     | Lint and auto-fix                      |
| `npm run format`       | Format all files with Prettier         |
| `npm run format:check` | Check formatting without writing       |

To produce the static web build that ships to Cloudflare Pages:

```bash
npx expo export --platform web
```

Output lands in `dist/`.

## Folder structure

```
src/
  app/          Expo Router routes (file-based routing). app/index.tsx is the home screen.
  components/   Shared, reusable UI components (ThemedText, ThemedView, etc.)
  constants/    Brand tokens: colors, fonts, spacing (theme.ts)
  hooks/        Shared React hooks
  lib/          Non-UI app code: Supabase client, env var validation
  global.css    Tailwind entry point (base/components/utilities + CSS custom properties)
```

Path alias `@/` maps to `src/` (see `tsconfig.json`), e.g. `import { supabase } from '@/lib/supabase'`.

## Styling

Components are styled with NativeWind's `className` prop (Tailwind utility classes that work on
web, iOS, and Android) or, where more precise control is needed, `StyleSheet.create` pulling
colors from `src/constants/theme.ts`. Brand colors/fonts/spacing live in one place — avoid
hardcoding hex values or font names directly in components.

Brand tokens (from the Notion Brand Guidelines doc):

| Token        | Hex       | Usage                                     |
| ------------ | --------- | ----------------------------------------- |
| `navy`       | `#1B2A4A` | Primary — headers, navigation, footers    |
| `gold`       | `#C9A44C` | Accent — CTAs, highlights                 |
| `deep-green` | `#2D4A3E` | Secondary accent — badges, success states |
| `off-white`  | `#F7F5F0` | Background                                |
| `charcoal`   | `#2A2A2A` | Body text                                 |

These are available both as JS constants (`BrandColors` / `Colors` in `src/constants/theme.ts`)
and as Tailwind classes (`bg-navy`, `text-gold`, `bg-deep-green`, etc. — see `tailwind.config.js`).
Headings use Georgia (serif); body/UI text uses Inter (sans).

## Backend

Phase 1 has no custom backend server — the app talks directly to Supabase Postgres via
`src/lib/supabase.ts`, secured by Row Level Security policies that allow anonymous inserts only.
See the Technical Design Document in Notion for the full data flow and schema.

## Deployment

Frontend deploys as a static site to Cloudflare Pages (build command: `npx expo export --platform web`,
output directory: `dist`). Domain: mcgrathtutoring.com.
