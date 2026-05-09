import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { WORLD_LIST, type ArtistCategory } from "@/lib/worlds";
import { toast } from "sonner";
import { Sparkles, Bot, Layers } from "lucide-react";

interface Profile {
  id: string;
  display_name: string;
  category: ArtistCategory | null;
  bio: string | null;
  avatar_url: string | null;
  authorship_mode?: string;
  portfolio_url?: string | null;
  website_url?: string | null;
  social_links?: any;
  professional_name?: string | null;
}

const AUTHORSHIP = [
  { v: "human", l: "Human-Created", icon: Sparkles },
  { v: "ai_assisted", l: "AI-Assisted", icon: Bot },
  { v: "hybrid", l: "Hybrid", icon: Layers },
];

export function ProfileModule({ profile, onUpdate }: { profile: Profile; onUpdate: (p: Profile) => void }) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [professionalName, setProfessionalName] = useState(profile.professional_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [category, setCategory] = useState<ArtistCategory>(profile.category as ArtistCategory);
  const [authorship, setAuthorship] = useState(profile.authorship_mode ?? "human");
  const [portfolio, setPortfolio] = useState(profile.portfolio_url ?? "");
  const [website, setWebsite] = useState(profile.website_url ?? "");
  const [social, setSocial] = useState(
    typeof profile.social_links === "object" && profile.social_links?.raw ? profile.social_links.raw : ""
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        const path = `${profile.id}/avatar-${Date.now()}-${avatarFile.name}`;
        const { error: upErr } = await supabase.storage.from("creative-uploads").upload(path, avatarFile, { upsert: true });
        if (upErr) throw upErr;
        avatarUrl = supabase.storage.from("creative-uploads").getPublicUrl(path).data.publicUrl;
      }
      const { data, error } = await supabase.from("profiles").update({
        display_name: displayName,
        professional_name: professionalName,
        bio,
        category,
        authorship_mode: authorship,
        portfolio_url: portfolio,
        website_url: website,
        social_links: social ? { raw: social } : {},
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      }).eq("id", profile.id).select().single();
      if (error) throw error;
      onUpdate(data as Profile);
      toast.success("Profile updated.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm">
      <CardContent className="p-6 space-y-5">
        <h2 className="font-heading text-2xl">Profile</h2>

        <div>
          <Label>Authorship badge</Label>
          <p className="text-xs text-primary-foreground/50 font-body mb-2">How your work is created. This appears on your listings.</p>
          <div className="flex gap-2 flex-wrap">
            {AUTHORSHIP.map((a) => {
              const Icon = a.icon;
              const active = authorship === a.v;
              return (
                <button key={a.v} type="button" onClick={() => setAuthorship(a.v)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${active
                    ? "bg-secondary/15 border-secondary text-secondary"
                    : "border-astragard-charcoal/40 text-primary-foreground/60 hover:text-primary-foreground"}`}>
                  <Icon className="h-3.5 w-3.5" /> {a.l}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Display name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-background/40" />
          </div>
          <div>
            <Label>Professional name</Label>
            <Input value={professionalName} onChange={(e) => setProfessionalName(e.target.value)} className="bg-background/40" />
          </div>
        </div>

        <div>
          <Label>Creative world</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as ArtistCategory)}>
            <SelectTrigger className="bg-background/40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {WORLD_LIST.map((w) => <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Bio</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="bg-background/40" />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Portfolio link</Label><Input type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className="bg-background/40" /></div>
          <div><Label>Website</Label><Input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="bg-background/40" /></div>
        </div>

        <div><Label>Social links</Label><Input value={social} onChange={(e) => setSocial(e.target.value)} className="bg-background/40" placeholder="@instagram, @x, linkedin/in/…" /></div>

        <div><Label>Profile photo</Label><Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} className="bg-background/40" /></div>

        <Button onClick={save} disabled={saving} className="gradient-bg text-primary-foreground">
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
