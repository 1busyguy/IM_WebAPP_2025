import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Collections
export async function getUserCollections(userId: string) {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      stats:collection_stats(
        scans_count,
        views_count,
        likes_count,
        activations_count
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Activations
export async function getUserActivations(userId: string) {
  const { data, error } = await supabase
    .from('activations')
    .select(`
      *,
      stats:activation_stats(
        scans_count,
        views_count,
        likes_count
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}