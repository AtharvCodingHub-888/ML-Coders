import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Browser-side Supabase client (singleton).
 * Safe to use in "use client" components.
 */
export const supabase: SupabaseClient | null = supabaseUrl
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Returns true when Supabase env vars are configured.
 * Used for graceful fallback to hardcoded data.
 */
export function isSupabaseConfigured(): boolean {
    return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Server-side Supabase client factory.
 * Call this inside API routes / server actions.
 */
export function createServerClient(): SupabaseClient | null {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    return createClient(supabaseUrl, supabaseAnonKey);
}
