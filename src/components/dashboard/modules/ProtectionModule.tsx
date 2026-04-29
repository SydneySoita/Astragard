import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  watermark_enabled: boolean;
  authorship_lock: boolean;
  allow_ai_training: boolean;
  visibility_default: string;
}

export function ProtectionModule() {
  const { user } = useAuth();
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("protection_settings").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setS((data as Settings) ?? { watermark_enabled: true, authorship_lock: true, allow_ai_training: false, visibility_default: "private" }));
  }, [user]);

  const update = async (patch: Partial<Settings>) => {
    if (!user || !s) return;
    const next = { ...s, ...patch };
    setS(next);
    const { error } = await supabase.from("protection_settings").upsert({ user_id: user.id, ...next });
    if (error) toast.error(error.message);
  };

  if (!s) return null;

  return (
    <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-secondary mt-1" />
          <div>
            <h2 className="font-heading text-2xl">Creative protection</h2>
            <p className="text-sm text-primary-foreground/60 font-body">Control how your work is identified and shared.</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-astragard-charcoal/30 pt-4">
          <div><Label>Watermarking</Label><p className="text-xs text-primary-foreground/50">Apply visible authorship marks on shared work.</p></div>
          <Switch checked={s.watermark_enabled} onCheckedChange={(v) => update({ watermark_enabled: v })} />
        </div>
        <div className="flex items-center justify-between border-t border-astragard-charcoal/30 pt-4">
          <div><Label>Authorship lock</Label><p className="text-xs text-primary-foreground/50">Embed verifiable authorship metadata.</p></div>
          <Switch checked={s.authorship_lock} onCheckedChange={(v) => update({ authorship_lock: v })} />
        </div>
        <div className="flex items-center justify-between border-t border-astragard-charcoal/30 pt-4">
          <div><Label>Allow AI training</Label><p className="text-xs text-primary-foreground/50">Permit your work to be used in AI model training.</p></div>
          <Switch checked={s.allow_ai_training} onCheckedChange={(v) => update({ allow_ai_training: v })} />
        </div>
        <div className="border-t border-astragard-charcoal/30 pt-4">
          <Label>Default visibility for new work</Label>
          <Select value={s.visibility_default} onValueChange={(v) => update({ visibility_default: v })}>
            <SelectTrigger className="bg-background/40 mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="incubator">Incubator only</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
