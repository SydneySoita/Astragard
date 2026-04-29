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

interface Profile {
  id: string;
  display_name: string;
  category: ArtistCategory | null;
  bio: string | null;
  avatar_url: string | null;
}

export function ProfileModule({ profile, onUpdate }: { profile: Profile; onUpdate: (p: Profile) => void }) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [category, setCategory] = useState<ArtistCategory>(profile.category as ArtistCategory);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio, category })
      .eq("id", profile.id)
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    onUpdate(data as Profile);
    toast.success("Profile updated.");
  };

  return (
    <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm">
      <CardContent className="p-6 space-y-5">
        <h2 className="font-heading text-2xl">Profile</h2>
        <div>
          <Label>Display name</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-background/40" />
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
        <Button onClick={save} disabled={saving} className="gradient-bg text-primary-foreground">
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
