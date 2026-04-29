import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Collab { id: string; project_title: string; status: string; inviter_id: string; invitee_id: string; message: string | null; }

export function CollaborationsModule() {
  const { user } = useAuth();
  const [items, setItems] = useState<Collab[]>([]);
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("collaborations")
      .select("*")
      .or(`inviter_id.eq.${user.id},invitee_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    setItems((data as Collab[]) ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const invite = async () => {
    if (!user) return;
    // Look up invitee by email via profiles (simplified: requires profile created)
    const { data: prof } = await supabase.from("profiles").select("id").ilike("display_name", inviteeEmail).maybeSingle();
    if (!prof) return toast.error("Could not find that creator (search by display name).");
    const { error } = await supabase.from("collaborations").insert({
      inviter_id: user.id, invitee_id: prof.id, project_title: projectTitle, message,
    });
    if (error) return toast.error(error.message);
    toast.success("Invitation sent.");
    setInviteeEmail(""); setProjectTitle(""); setMessage("");
    load();
  };

  const respond = async (id: string, status: "accepted" | "declined") => {
    await supabase.from("collaborations").update({ status }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-heading text-2xl">Invite a collaborator</h2>
          <div><Label>Invitee display name</Label><Input value={inviteeEmail} onChange={(e) => setInviteeEmail(e.target.value)} className="bg-background/40" /></div>
          <div><Label>Project title</Label><Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="bg-background/40" /></div>
          <div><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="bg-background/40" /></div>
          <Button onClick={invite} disabled={!inviteeEmail || !projectTitle} className="gradient-bg text-primary-foreground">Send invitation</Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-heading text-xl mb-4">Your collaborations</h2>
        {items.length === 0 ? <p className="text-primary-foreground/50 text-sm">No collaborations yet.</p> : (
          <div className="space-y-3">
            {items.map((c) => (
              <Card key={c.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-heading text-base">{c.project_title}</div>
                    <div className="text-xs uppercase tracking-wider text-primary-foreground/50 mt-1">
                      {c.inviter_id === user?.id ? "You invited" : "Invited you"} · {c.status}
                    </div>
                  </div>
                  {c.invitee_id === user?.id && c.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => respond(c.id, "accepted")} className="gradient-bg">Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => respond(c.id, "declined")}>Decline</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
