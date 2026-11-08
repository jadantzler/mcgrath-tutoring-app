const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    // supabase/functions is Deno code (Edge Functions), not part of the Expo app.
    ignores: ['dist/*', 'supabase/functions/**'],
  },
]);
