import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials missing. Please check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your env."
  );
}

// Public client to run queries and insert data under public/anon authorization
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Admin client (server-side only) to run administrative tasks using the service role key
export const getSupabaseAdmin = () => {
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!adminKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined. This admin operation is only available server-side.");
  }
  return createClient(supabaseUrl || "", adminKey);
};
