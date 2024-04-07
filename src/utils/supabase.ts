import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

export const supabase = createClient(
	supabaseUrl,
	supabaseAnonKey
)