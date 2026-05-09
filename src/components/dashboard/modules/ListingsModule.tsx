import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Listing {
  id: string;
  title: string;
  one_liner: string;
  intent: string;
  media_url: string | null;
  use_cases: string[];
  engagement_options: string[];
  pricing_style: string;
  pricing_display: string;
  status: string;
}

const USE_CASES = ["Brand Campaign", "Film/Media", "Product", "Digital", "Cultural"];
const ENGAGEMENT = ["Request Collaboration", "Commission Work", "License This Work", "Submit to Incubator"];
const PRICING_STYLES = [
  { v: "commission", l: "Commission-Based" },
  { v: "license", l: "License-Based" },
  { v: "fixed", l: "Fixed Scope" },
  { v: "custom", l: "Custom" },
];

export function ListingsModule() {
  const { user } = useAuth();
  const [items, setItems] = useState<Listing[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [intent, setIntent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [engagement, setEngagement] = useState<string[]>([]);
  const [pricingStyle, setPricingStyle] = useState("commission");
  const [pricingDisplay, setPricingDisplay] = useState("");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("listings").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setItems((data as Listing[]) ?? []);
  };
  useEffect(() => { load(); }, [user]);

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const save = async () => {
    if (!user || !title.trim()) return toast.error("A title is required.");
    setSaving(true);
    try {
      let mediaUrl = "";
      if (mediaFile) {
        const path = `${user.id}/listing-${Date.now()}-${mediaFile.name}`;
        const { error: upErr } = await supabase.storage.from("creative-uploads").upload(path, mediaFile, { upsert: true });
        if (upErr) throw upErr;
        mediaUrl = supabase.storage.from("creative-uploads").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from("listings").insert({
        user_id: user.id, title: title.trim(), one_liner: oneLiner.trim(), intent: intent.trim(),
        media_url: mediaUrl, use_cases: useCases, engagement_options: engagement,
        pricing_style: pricingStyle, pricing_display: pricingDisplay.trim(),
      });
      if (error) throw error;
      toast.success("Listing published.");
      setTitle(""); setOneLiner(""); setIntent(""); setMediaFile(null);
      setUseCases([]); setEngagement([]); setPricingStyle("commission"); setPricingDisplay("");
      setOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await supabase.from("listings").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading text-2xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" /> Creative Value Layer
          </h2>
          <p className="text-sm text-primary-foreground/60 font-body mt-1 max-w-xl">
            List your work for brand discovery. Context comes before price. Each listing carries your protection terms.
          </p>
        </div>
        <Button onClick={() => setOpen((o) => !o)} className="gradient-bg text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" /> {open ? "Cancel" : "New listing"}
        </Button>
      </div>

      {open && (
        <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background/40" />
            </div>
            <div>
              <Label>One-line creator statement</Label>
              <Input value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} className="bg-background/40" placeholder="A single sentence about who you are as a creator." />
            </div>
            <div>
              <Label>Intent & context</Label>
              <Textarea value={intent} onChange={(e) => setIntent(e.target.value)} rows={3} className="bg-background/40" placeholder="Why was this work created? What does it solve? Where does it fit?" />
            </div>
            <div>
              <Label>Work display (image / audio / video)</Label>
              <Input type="file" onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)} className="bg-background/40" />
            </div>

            <div>
              <Label>Use cases</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {USE_CASES.map((u) => (
                  <button key={u} type="button" onClick={() => toggle(useCases, u, setUseCases)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${useCases.includes(u)
                      ? "bg-secondary/20 border-secondary text-secondary"
                      : "border-astragard-charcoal/40 text-primary-foreground/60 hover:text-primary-foreground"}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Engagement options</Label>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                {ENGAGEMENT.map((e) => (
                  <label key={e} className="flex items-center gap-2 text-sm text-primary-foreground/70 cursor-pointer">
                    <Checkbox checked={engagement.includes(e)} onCheckedChange={() => toggle(engagement, e, setEngagement)} />
                    {e}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Pricing style</Label>
                <Select value={pricingStyle} onValueChange={setPricingStyle}>
                  <SelectTrigger className="bg-background/40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRICING_STYLES.map((p) => <SelectItem key={p.v} value={p.v}>{p.l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pricing display</Label>
                <Input value={pricingDisplay} onChange={(e) => setPricingDisplay(e.target.value)} className="bg-background/40" placeholder="e.g. Starting from $500 — or — Pricing by scope" />
              </div>
            </div>

            <Button onClick={save} disabled={saving} className="gradient-bg text-primary-foreground">
              {saving ? "Publishing…" : "Publish listing"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        {items.length === 0 ? (
          <p className="text-primary-foreground/50 text-sm font-body">No listings yet. Publish your first piece for brand discovery.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((l) => (
              <Card key={l.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm overflow-hidden">
                {l.media_url && (
                  <div className="aspect-video bg-astragard-dark/60">
                    <img src={l.media_url} alt={l.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-lg leading-tight">{l.title}</h3>
                      {l.one_liner && <p className="text-xs text-primary-foreground/50 italic mt-0.5 font-body">{l.one_liner}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => remove(l.id)}>
                      <Trash2 className="h-4 w-4 text-primary-foreground/40" />
                    </Button>
                  </div>
                  {l.intent && <p className="text-sm text-primary-foreground/70 font-body line-clamp-3">{l.intent}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {l.use_cases.map((u) => (
                      <Badge key={u} variant="outline" className="text-[10px] border-astragard-charcoal/50 text-primary-foreground/60">{u}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary border-t border-astragard-charcoal/30 pt-3">
                    <ShieldCheck className="h-3 w-3" />
                    <span className="font-body italic">Protected under your Astragard terms</span>
                  </div>
                  {l.pricing_display && (
                    <div className="text-xs text-primary-foreground/50 font-ui">{l.pricing_display}</div>
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
