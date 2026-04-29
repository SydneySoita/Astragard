import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Item { id: string; title: string; media_url: string | null; description: string | null; }

export function PortfolioModule() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("portfolio_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setItems((data as Item[]) ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const add = async () => {
    if (!user || !title.trim()) return;
    const { error } = await supabase.from("portfolio_items").insert({
      user_id: user.id, title: title.trim(), media_url: mediaUrl.trim() || null,
    });
    if (error) return toast.error(error.message);
    setTitle(""); setMediaUrl("");
    toast.success("Added to portfolio.");
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-heading text-2xl">Add portfolio piece</h2>
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background/40" /></div>
          <div><Label>Media URL (image, audio, link)</Label><Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://…" className="bg-background/40" /></div>
          <Button onClick={add} disabled={!title.trim()} className="gradient-bg text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add piece</Button>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm overflow-hidden group">
            {it.media_url ? (
              <div className="aspect-video bg-astragard-charcoal/20 overflow-hidden">
                <img src={it.media_url} alt={it.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.currentTarget.style.display = "none"); }} />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-astragard-charcoal/20 to-astragard-dark" />
            )}
            <CardContent className="p-4 flex items-start justify-between gap-2">
              <div className="font-heading text-sm">{it.title}</div>
              <Button variant="ghost" size="icon" onClick={async () => { await supabase.from("portfolio_items").delete().eq("id", it.id); load(); }}>
                <Trash2 className="h-4 w-4 text-primary-foreground/50" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-primary-foreground/50 text-sm">No portfolio pieces yet.</p>}
      </div>
    </div>
  );
}
