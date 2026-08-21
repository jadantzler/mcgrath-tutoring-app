/**
 * Centralized, validated access to environment variables.
 *
 * Only variables prefixed with `EXPO_PUBLIC_` are inlined into the client
 * bundle by Expo (https://docs.expo.dev/guides/environment-variables/), so
 * every variable read here must use that prefix.
 *
 * Importing this module fails loudly (throws) if a required variable is
 * missing, instead of letting the app silently run with an undefined value.
 */

function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        'Copy .env.example to .env and fill in real values, then restart the dev server.',
    );
  }
  return value;
}

export const env = {
  supabaseUrl: requireEnv('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: requireEnv(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  ),
};
