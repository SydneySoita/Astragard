import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";

interface N { id: string; title: string; body: string | null; read: boolean; created_at: string; }

export function NotificationsModule() {
  const { user } = useAuth();
  const [items, setItems] = useState<N[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as N[]) ?? []));
  }, [user]);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl">Notifications</h2>
      {items.length === 0 ? (
        <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center text-primary-foreground/60">
            You're all caught up.
          </CardContent>
        </Card>
      ) : items.map((n) => (
        <Card key={n.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="font-heading text-sm">{n.title}</div>
            {n.body && <div className="text-sm text-primary-foreground/70 mt-1 font-body">{n.body}</div>}
            <div className="text-xs text-primary-foreground/40 mt-2">{new Date(n.created_at).toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
