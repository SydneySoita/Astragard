import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  visibility: string;
  created_at: string;
}

export function ProjectsModule() {
  const { user } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setItems((data as Project[]) ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const create = async () => {
    if (!user || !title.trim()) return;
    setCreating(true);
    const { error } = await supabase.from("projects").insert({
      user_id: user.id, title: title.trim(), description: description.trim(),
    });
    setCreating(false);
    if (error) return toast.error(error.message);
    setTitle(""); setDescription("");
    toast.success("Project created.");
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-heading text-2xl">New project</h2>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background/40" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="bg-background/40" />
          </div>
          <Button onClick={create} disabled={creating || !title.trim()} className="gradient-bg text-primary-foreground">
            <Plus className="h-4 w-4 mr-1" /> Submit project
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-heading text-xl mb-4">Your projects</h2>
        {items.length === 0 ? (
          <p className="text-primary-foreground/50 text-sm">No projects yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <Card key={p.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-heading text-base">{p.title}</div>
                    {p.description && <div className="text-sm text-primary-foreground/60 mt-1 font-body">{p.description}</div>}
                    <div className="text-xs text-primary-foreground/40 mt-2 uppercase tracking-wider">{p.status} · {p.visibility}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                    <Trash2 className="h-4 w-4 text-primary-foreground/50" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
