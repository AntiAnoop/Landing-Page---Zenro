import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Handle Supabase errors and provide context for debugging
 */
export async function handleSupabaseError(error: any, context: string) {
  if (error) {
    console.error(`Supabase error [${context}]:`, error.message);
    // In a real app, you might want to report this to an error tracking service
    return error;
  }
  return null;
}
