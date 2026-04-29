import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";

interface Msg { id: string; sender_id: string; recipient_id: string; body: string; created_at: string; }

export function MessagesModule() {
  const { user } = useAuth();
  const [items, setItems] = useState<Msg[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("messages").select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setItems((data as Msg[]) ?? []));
  }, [user]);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl">Messages</h2>
      {items.length === 0 ? (
        <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center text-primary-foreground/60">
            No conversations yet. Reach out through a collaboration invitation to start a thread.
          </CardContent>
        </Card>
      ) : items.map((m) => (
        <Card key={m.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-xs text-primary-foreground/50 mb-1">
              {m.sender_id === user?.id ? "You" : "From collaborator"} · {new Date(m.created_at).toLocaleString()}
            </div>
            <div className="text-sm font-body">{m.body}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
