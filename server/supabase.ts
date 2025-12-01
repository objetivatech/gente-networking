import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://wawnsuwrnsdfaowfhqjz.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDI0MDYsImV4cCI6MjA4MDAxODQwNn0.StzgKU08CV7dPwtHBCfSRsemc_G0aKum4wK9TBev1LA';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing environment variables!');
  console.error('[Supabase] SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('[Supabase] SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
}

console.log('[Supabase] Initializing client with URL:', supabaseUrl);

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For admin operations (bypassing RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;
