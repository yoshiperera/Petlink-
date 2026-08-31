import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    // "local" only clears this browser's session. The default "global" scope
    // also asks Supabase to revoke the session server-side, which 403s (and
    // can leave the user stuck logged in) once that session has already
    // expired or been removed - and we don't need the server round-trip anyway.
    await supabase.auth.signOut({ scope: "local" });
  };

  return { user, loading, signOut };
}
