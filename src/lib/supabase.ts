import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is actually configured to prevent app hangs
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Handle Supabase errors and provide context for debugging
 */
export async function handleSupabaseError(error: any, context: string) {
  if (error) {
    console.error(`Supabase error [${context}]:`, error.message);
    return error;
  }
  return null;
}
