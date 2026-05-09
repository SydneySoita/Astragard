import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  visibility: string;
  outcome: string | null;
  submitted_to_incubator: boolean;
  created_at: string;
}

const STATUSES = [
  { v: "in_progress", l: "In Progress" },
  { v: "under_review", l: "Under Review" },
  { v: "completed", l: "Completed" },
];

export function ProjectsModule() {
  const { user } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setItems((data as Project[]) ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const create = async () => {
    if (!user || !title.trim()) return;
    setCreating(true);
    const { error } = await supabase.from("projects").insert({
      user_id: user.id, title: title.trim(), description: description.trim(), status: "in_progress",
    });
    setCreating(false);
    if (error) return toast.error(error.message);
    setTitle(""); setDescription("");
    toast.success("Project created.");
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("projects").update({ status }).eq("id", id);
    load();
  };
  const submitToIncubator = async (id: string) => {
    await supabase.from("projects").update({ submitted_to_incubator: true }).eq("id", id);
    toast.success("Submitted to the Incubator.");
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    load();
  };

  const active = items.filter((p) => p.status !== "completed" && !p.submitted_to_incubator);
  const completed = items.filter((p) => p.status === "completed");
  const submitted = items.filter((p) => p.submitted_to_incubator);

  const card = (p: Project, opts?: { showSubmit?: boolean }) => (
    <Card key={p.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-heading text-base">{p.title}</div>
            {p.description && <div className="text-sm text-primary-foreground/60 mt-1 font-body">{p.description}</div>}
            {p.outcome && <div className="text-xs text-secondary mt-2 italic font-body">Outcome: {p.outcome}</div>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
            <Trash2 className="h-4 w-4 text-primary-foreground/40" />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
            <SelectTrigger className="bg-background/40 h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}
            </SelectContent>
          </Select>
          {opts?.showSubmit && !p.submitted_to_incubator && (
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => submitToIncubator(p.id)}>
              <Send className="h-3 w-3 mr-1" /> Submit to Incubator
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
            <Plus className="h-4 w-4 mr-1" /> Create project
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-card/40 border border-astragard-charcoal/30">
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submitted.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4 space-y-3">
          {active.length === 0
            ? <p className="text-sm text-primary-foreground/50">No active projects.</p>
            : active.map((p) => card(p, { showSubmit: true }))}
        </TabsContent>
        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.length === 0
            ? <p className="text-sm text-primary-foreground/50">No completed projects yet.</p>
            : completed.map((p) => card(p))}
        </TabsContent>
        <TabsContent value="submitted" className="mt-4 space-y-3">
          {submitted.length === 0
            ? <p className="text-sm text-primary-foreground/50">No work submitted to the Incubator yet.</p>
            : submitted.map((p) => card(p))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
