import { AlertTriangle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Shown until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set. Without them
 * every sign-in, report and listing fails with an opaque network error, so say
 * plainly what is missing instead.
 */
export function SetupNotice() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
      <p className="inline-flex flex-wrap items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <span>
          <strong>Setup needed:</strong> copy <code>.env.example</code> to <code>.env</code>, add
          your Supabase URL and anon key, and run <code>supabase/schema.sql</code>. Accounts and pet
          reports won't work until then.
        </span>
      </p>
    </div>
  );
}
