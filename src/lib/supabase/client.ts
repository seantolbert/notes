import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Minimal Supabase client used by repositories.
 * TODO: wire auth/session management; for now relies on public anon key.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables are not set. Offline-only mode will be used until configured.');
    return null;
  }

  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return supabase;
}

export { supabase };
