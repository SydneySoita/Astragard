import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Users, MessageSquare, Shield, Image as ImageIcon, Bell } from "lucide-react";
import type { WorldTheme } from "@/lib/worlds";

interface Props {
  profile: { display_name: string };
  world: WorldTheme;
  onJump: (id: any) => void;
}

const QUICK = [
  { id: "projects", label: "New project", icon: FolderKanban },
  { id: "portfolio", label: "Add portfolio piece", icon: ImageIcon },
  { id: "collaborations", label: "Invite collaborator", icon: Users },
  { id: "protection", label: "Protection settings", icon: Shield },
];

export function OverviewModule({ world, onJump }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active projects", value: "—", icon: FolderKanban },
          { label: "Portfolio pieces", value: "—", icon: ImageIcon },
          { label: "Open collabs", value: "—", icon: Users },
          { label: "Unread", value: "—", icon: Bell },
        ].map((s) => (
          <Card key={s.label} className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-primary-foreground/50">{s.label}</div>
                <div className="font-heading text-2xl mt-1 text-primary-foreground">{s.value}</div>
              </div>
              <s.icon className="h-5 w-5" style={{ color: `hsl(${world.accent})` }} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-heading text-xl mb-4">Step into your work</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.id}
                onClick={() => onJump(q.id)}
                className="text-left p-5 rounded-lg border border-astragard-charcoal/30 bg-card/30 hover:bg-card/50 transition-colors group"
              >
                <Icon
                  className="h-5 w-5 mb-3 transition-transform group-hover:scale-110"
                  style={{ color: `hsl(${world.accent})` }}
                />
                <div className="text-sm font-medium">{q.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
        <CardContent className="p-6 lg:p-8">
          <div className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-2">Authorship status</div>
          <h3 className="font-heading text-xl mb-2">Your work is protected.</h3>
          <p className="text-sm text-primary-foreground/70 max-w-xl font-body">
            Every piece you add to your {world.themeName.toLowerCase()} carries authorship metadata and watermarking by default. Manage protection preferences anytime.
          </p>
          <Button onClick={() => onJump("protection")} className="mt-4 gradient-bg text-primary-foreground">
            Review protection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
