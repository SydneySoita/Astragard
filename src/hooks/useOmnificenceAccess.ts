import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";

export function useOmnificenceAccess() {
  const { user, loading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setHasAccess(false);
      setChecking(false);
      return;
    }
    (async () => {
      setChecking(true);
      const [{ data: sub }, { data: role }] = await Promise.all([
        supabase
          .from("omnificence_subscriptions")
          .select("status,current_period_end")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle(),
      ]);
      const subActive =
        !!sub &&
        sub.status === "active" &&
        (!sub.current_period_end || new Date(sub.current_period_end) > new Date());
      setHasAccess(!!role || subActive);
      setChecking(false);
    })();
  }, [user, loading]);

  return { hasAccess, checking, user };
}
