import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Users,
  Shield,
  MessageSquare,
  Bell,
  Image as ImageIcon,
  LifeBuoy,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WORLDS, WORLD_LIST, type ArtistCategory } from "@/lib/worlds";
import { toast } from "sonner";
import { ProfileModule } from "./modules/ProfileModule";
import { ProjectsModule } from "./modules/ProjectsModule";
import { PortfolioModule } from "./modules/PortfolioModule";
import { CollaborationsModule } from "./modules/CollaborationsModule";
import { ProtectionModule } from "./modules/ProtectionModule";
import { MessagesModule } from "./modules/MessagesModule";
import { NotificationsModule } from "./modules/NotificationsModule";
import { SupportModule } from "./modules/SupportModule";
import { OverviewModule } from "./modules/OverviewModule";

interface Profile {
  id: string;
  display_name: string;
  category: ArtistCategory | null;
  bio: string | null;
  avatar_url: string | null;
}

interface Props {
  profile: Profile | null;
  onSignOut: () => void;
  onProfileUpdate: (p: Profile) => void;
}

const MODULES = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "portfolio", label: "Portfolio", icon: ImageIcon },
  { id: "collaborations", label: "Collaborations", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "protection", label: "Protection", icon: Shield },
  { id: "support", label: "Support", icon: LifeBuoy },
] as const;

type ModuleId = (typeof MODULES)[number]["id"];

export function DashboardShell({ profile, onSignOut, onProfileUpdate }: Props) {
  const [active, setActive] = useState<ModuleId>("overview");

  // Fall back to a neutral world if user hasn't picked yet
  const world = profile?.category ? WORLDS[profile.category] : null;
  const greetingPlace = world?.greetingPlace ?? "creative space";
  const tagline = world?.tagline ?? "Your voice, your work, and your authorship are protected here.";

  // Apply per-world accent as CSS variable override
  const themeStyle = world
    ? ({ ["--world-accent" as any]: world.accent } as React.CSSProperties)
    : {};

  if (!profile?.category) {
    return <CategoryPicker profileId={profile?.id ?? ""} onPicked={onProfileUpdate} onSignOut={onSignOut} />;
  }

  const renderModule = () => {
    switch (active) {
      case "overview":
        return <OverviewModule profile={profile} world={world!} onJump={setActive} />;
      case "profile":
        return <ProfileModule profile={profile} onUpdate={onProfileUpdate} />;
      case "projects":
        return <ProjectsModule />;
      case "portfolio":
        return <PortfolioModule />;
      case "collaborations":
        return <CollaborationsModule />;
      case "messages":
        return <MessagesModule />;
      case "notifications":
        return <NotificationsModule />;
      case "protection":
        return <ProtectionModule />;
      case "support":
        return <SupportModule />;
    }
  };

  return (
    <div
      className="min-h-screen bg-astragard-dark text-primary-foreground font-ui relative"
      style={themeStyle}
    >
      {/* Ambient world backdrop */}
      <div className="fixed inset-0 -z-10">
        <img
          src={world!.backdrop}
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-astragard-dark/70 via-astragard-dark/85 to-astragard-dark" />
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-astragard-charcoal/30 bg-astragard-dark/60 backdrop-blur-md">
          <Link to="/" className="px-6 py-6 font-heading text-lg gradient-text border-b border-astragard-charcoal/30">
            ASTRAGARD
          </Link>
          <div className="px-6 py-4 border-b border-astragard-charcoal/30">
            <div className="text-[10px] uppercase tracking-widest text-primary-foreground/40">Your World</div>
            <div className="font-heading text-sm mt-1" style={{ color: `hsl(${world!.accent})` }}>
              {world!.themeName}
            </div>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-1">
            {MODULES.map((m) => {
              const Icon = m.icon;
              const isActive = active === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-astragard-charcoal/30 text-primary-foreground"
                      : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-astragard-charcoal/15"
                  )}
                  style={isActive ? { borderLeft: `2px solid hsl(${world!.accent})` } : {}}
                >
                  <Icon className="h-4 w-4" />
                  {m.label}
                </button>
              );
            })}
          </nav>
          <button
            onClick={onSignOut}
            className="m-3 flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-primary-foreground/60 hover:text-primary-foreground hover:bg-astragard-charcoal/20 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Mobile module bar */}
          <div className="lg:hidden border-b border-astragard-charcoal/30 bg-astragard-dark/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center justify-between px-4 py-3">
              <Link to="/" className="font-heading text-base gradient-text">ASTRAGARD</Link>
              <Button variant="ghost" size="sm" onClick={onSignOut} className="text-primary-foreground/70">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex overflow-x-auto gap-1 px-4 pb-3 no-scrollbar">
              {MODULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors",
                    active === m.id
                      ? "bg-astragard-charcoal/40 text-primary-foreground"
                      : "text-primary-foreground/60 hover:text-primary-foreground"
                  )}
                  style={active === m.id ? { borderBottom: `2px solid hsl(${world!.accent})` } : {}}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 lg:px-10 py-8 lg:py-12 max-w-6xl mx-auto">
            {/* Greeting block (always at top) */}
            {active === "overview" && (
              <header className="mb-10 animate-fade-in">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary-foreground/50 mb-3">
                  <Sparkles className="h-3 w-3" style={{ color: `hsl(${world!.accent})` }} />
                  <span>{world!.themeName}</span>
                </div>
                <h1 className="font-heading text-3xl lg:text-5xl mb-4">
                  Welcome back to your <span style={{ color: `hsl(${world!.accent})` }}>{greetingPlace}</span>,
                  <br />
                  <span className="gradient-text">{profile.display_name || "Creator"}</span>
                </h1>
                <p className="font-body text-primary-foreground/70 max-w-2xl text-base lg:text-lg italic">
                  This is your creative space within Astragard. {tagline}
                </p>
              </header>
            )}

            {renderModule()}
          </div>
        </main>
      </div>
    </div>
  );
}

/* -------- First-time category picker (if user signed up without one) -------- */
function CategoryPicker({
  profileId,
  onPicked,
  onSignOut,
}: {
  profileId: string;
  onPicked: (p: any) => void;
  onSignOut: () => void;
}) {
  const [saving, setSaving] = useState<ArtistCategory | null>(null);
  const handlePick = async (cat: ArtistCategory) => {
    const { supabase } = await import("@/integrations/supabase/client");
    if (!profileId) {
      toast.error("Profile not found. Please sign out and sign in again.");
      return;
    }
    setSaving(cat);
    const { data, error } = await supabase
      .from("profiles")
      .update({ category: cat })
      .eq("id", profileId)
      .select()
      .single();
    setSaving(null);
    if (error) return toast.error(error.message);
    if (data) {
      toast.success("Creative world selected. Entering your dashboard…");
      onPicked(data as any);
    }
  };
  return (
    <div className="min-h-screen bg-astragard-dark text-primary-foreground p-8">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="font-heading text-3xl mb-3">Choose your creative world</h1>
        <p className="text-primary-foreground/60 mb-10 font-body">
          Each discipline has its own space. You can change this later in your profile.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORLD_LIST.map((w) => (
            <button
              key={w.id}
              disabled={!!saving}
              onClick={() => handlePick(w.id)}
              className="group relative rounded-lg overflow-hidden border border-astragard-charcoal/30 hover:border-secondary/50 transition-all text-left"
            >
              <div className="aspect-[4/3] relative">
                <img src={w.backdrop} alt={w.label} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-astragard-dark via-astragard-dark/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60">{w.themeName}</div>
                  <div className="font-heading text-base mt-1">{w.label}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onSignOut} className="mt-10 text-sm text-primary-foreground/50 hover:text-primary-foreground">
          Sign out
        </button>
      </div>
    </div>
  );
}
