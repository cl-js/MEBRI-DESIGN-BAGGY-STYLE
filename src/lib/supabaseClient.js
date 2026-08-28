import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.host);
  } catch {
    return false;
  }
};

const isValidKey = typeof supabaseKey === "string" && supabaseKey.trim().length > 0;
const hasValidConfig = isValidUrl(supabaseUrl) && isValidKey;

if (!hasValidConfig) {
  console.warn(
    "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in the Vite environment."
  );
}

export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null;
