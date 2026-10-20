import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Supabase client dùng service role key. CHỈ gọi từ code server (Server Action).
 * Trả null khi thiếu env (demo mode).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (typeof window !== 'undefined') throw new Error('getSupabaseAdmin must only run on the server')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return client
}
