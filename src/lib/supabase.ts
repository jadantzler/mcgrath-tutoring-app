import { createClient } from '@supabase/supabase-js';

import { env } from '@/lib/env';

/**
 * Shared Supabase client for the McGrath Tutoring app.
 *
 * Phase 1 talks directly to Supabase from the client, secured by Row Level
 * Security policies (public inserts only — see the Technical Design
 * Document). No service-role key should ever be used here or shipped to
 * the client.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
