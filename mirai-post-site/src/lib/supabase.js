import { createClient } from "@supabase/supabase-js";

// 共有 Supabase プロジェクト (mirainote / xopt と同一)
// anon key は公開値であり、RLS によって保護される。
const SUPABASE_URL = "https://abhrgewzglubansbyitm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaHJnZXd6Z2x1YmFuc2J5aXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTIyMzUsImV4cCI6MjA4MDQyODIzNX0.HiD3TT_D16Q0_y9NemGDr7LwRn72GZmq6zEuafo-waY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    detectSessionInUrl: false, // PKCE コード交換を手動で制御する
    flowType: "pkce",
    persistSession: true,
    autoRefreshToken: true,
  },
});
