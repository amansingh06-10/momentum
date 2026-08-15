import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith("http")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const MOMENTUM_DOC_ID = "aman_momentum_main";

/**
 * Fetch state from Supabase
 */
export async function fetchStateFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("momentum_state")
      .select("data, updated_at")
      .eq("id", MOMENTUM_DOC_ID)
      .single();

    if (error) {
      // If table or record doesn't exist yet, we will create on first write
      console.warn("Supabase fetch notice:", error.message);
      return null;
    }
    return data?.data || null;
  } catch (err) {
    console.error("Supabase fetch error:", err);
    return null;
  }
}

/**
 * Persist state to Supabase with upsert
 */
export async function saveStateToSupabase(stateData: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("momentum_state")
      .upsert({
        id: MOMENTUM_DOC_ID,
        data: stateData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Supabase upsert error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase save exception:", err);
    return false;
  }
}
