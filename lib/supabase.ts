import { createClient } from '@supabase/supabase-js'

// Lazy client — only instantiated at call time so build succeeds without env vars
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

export const supabase = {
  storage: {
    from: (bucket: string) => getSupabaseClient().storage.from(bucket),
  },
  from: (table: string) => getSupabaseClient().from(table),
}

export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}
