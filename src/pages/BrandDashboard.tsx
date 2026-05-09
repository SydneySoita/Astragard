import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard, FolderOpen, Users, MessageSquare, Shield,
  Bookmark, BarChart3, Plus, Search, Sparkles, MessageCircle, LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  description: string;
  intent: string;
  use_case: string;
  creative_needs: string[];
  collaboration_style: string;
  budget_range: string;
  timeline: string;
  ownership_preference: string;
  ai_preference: string;
  status: string;
  stage: string;
  created_at: string;
}

interface BrandProfile {
  id: string;
  brand_name: string;
  company_name: string;
  industry: string;
}

const STATUS_LABELS: Record<string, string> = {
  under_review: "Under Review",
  matched: "Creatives Matched",
  in_collaboration: "In Collaboration",
  completed: "Completed",
};

const STATUS_COLORS: Record<string, string> = {
  under_review: "bg-secondary/15 text-secondary border-secondary/30",
  matched: "bg-primary/15 text-primary border-primary/30",
  in_collaboration: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  completed: "bg-green-500/15 text-green-300 border-green-500/30",
};

export default function BrandDashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [busy, setBusy] = useState(true);
  const [section, setSection] = useState("overview");

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/brands/dashboard");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setBusy(true);
      const [{ data: bp }, { data: ch }] = await Promise.all([
        supabase.from("brand_profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("creative_challenges").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (!bp) {
        // bootstrap an empty brand profile so the user can edit later
        await supabase.from("brand_profiles").insert({ id: user.id, brand_name: user.email?.split("@")[0] ?? "Your Brand", company_name: "" });
        const { data: bp2 } = await supabase.from("brand_profiles").select("*").eq("id", user.id).maybeSingle();
        setProfile(bp2 as BrandProfile);
      } else setProfile(bp as BrandProfile);
      setChallenges((ch as Challenge[]) ?? []);
      setBusy(false);
    })();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out.");
    navigate("/", { replace: true });
  };

  if (loading || busy) {
    return <div className="min-h-screen bg-astragard-dark flex items-center justify-center text-primary-foreground/60 font-ui">Loading your brand workspace…</div>;
  }

  const active = challenges.filter((c) => c.status !== "completed");
  const completed = challenges.filter((c) => c.status === "completed");

  return (
    <div className="min-h-screen bg-astragard-dark text-primary-foreground font-ui">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-astragard-charcoal/30 bg-astragard-dark/80">
          <Link to="/" className="px-6 py-6 font-heading text-lg gradient-text border-b border-astragard-charcoal/30">ASTRAGARD</Link>
          <div className="px-6 py-4 border-b border-astragard-charcoal/30">
            <div className="text-[10px] uppercase tracking-widest text-primary-foreground/40">Brand Workspace</div>
            <div className="font-heading text-sm mt-1 text-secondary">{profile?.brand_name || "Your Brand"}</div>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-1">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => setSection(n.id)} className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                section === n.id ? "bg-astragard-charcoal/30 text-primary-foreground border-l-2 border-secondary" : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-astragard-charcoal/15"
              )}>
                <n.icon className="h-4 w-4" /> {n.label}
              </button>
            ))}
          </nav>
          <button onClick={handleSignOut} className="m-3 flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-primary-foreground/60 hover:text-primary-foreground hover:bg-astragard-charcoal/20">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>

        <main className="flex-1 min-w-0">
          {/* Mobile nav */}
          <div className="lg:hidden border-b border-astragard-charcoal/30 sticky top-0 bg-astragard-dark/90 backdrop-blur-md z-20">
            <div className="flex items-center justify-between px-4 py-3">
              <Link to="/" className="font-heading text-base gradient-text">ASTRAGARD</Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut className="h-4 w-4" /></Button>
            </div>
            <div className="flex overflow-x-auto gap-1 px-4 pb-3 no-scrollbar">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => setSection(n.id)} className={cn(
                  "px-3 py-1.5 text-xs rounded-full whitespace-nowrap",
                  section === n.id ? "bg-astragard-charcoal/40 text-primary-foreground border-b-2 border-secondary" : "text-primary-foreground/60"
                )}>{n.label}</button>
              ))}
            </div>
          </div>

          <div className="px-4 lg:px-10 py-8 lg:py-12 max-w-6xl mx-auto">
            {section === "overview" && (
              <>
                <header className="mb-10 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary-foreground/50 mb-3">
                    <Sparkles className="h-3 w-3 text-secondary" />
                    <span>Brand Workspace</span>
                  </div>
                  <h1 className="font-heading text-3xl lg:text-5xl mb-3">
                    Welcome back, <span className="gradient-text">{profile?.brand_name || "Brand"}</span>
                  </h1>
                  <p className="text-primary-foreground/60 font-body italic">Your creative projects are active within Astragard.</p>
                </header>

                {/* Quick actions */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
                  <QuickAction icon={Plus} label="Submit New Challenge" onClick={() => navigate("/brands/submit")} primary />
                  <QuickAction icon={Search} label="Browse Creatives" onClick={() => navigate("/marketplace")} />
                  <QuickAction icon={Sparkles} label="Enter Incubator" onClick={() => navigate("/incubator")} />
                  <QuickAction icon={MessageCircle} label="Start Conversation" onClick={() => setSection("workspace")} />
                </div>

                {/* Active challenges */}
                <section>
                  <div className="flex items-end justify-between mb-5">
                    <h2 className="font-heading text-2xl">Active challenges</h2>
                    <button onClick={() => setSection("challenges")} className="text-xs text-secondary hover:text-secondary/80 uppercase tracking-widest">View all</button>
                  </div>
                  {active.length === 0 ? (
                    <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
                      <CardContent className="p-10 text-center">
                        <p className="text-primary-foreground/60 font-body mb-5">You haven't submitted a creative challenge yet.</p>
                        <Button onClick={() => navigate("/brands/submit")} className="gradient-bg text-primary-foreground">Submit your first challenge</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {active.slice(0, 4).map((c) => <ChallengeCard key={c.id} c={c} />)}
                    </div>
                  )}
                </section>
              </>
            )}

            {section === "challenges" && (
              <Section title="My Challenges" subtitle="Every brief you've submitted, with current status and curation stage.">
                <Tabs defaultValue="all">
                  <TabsList className="bg-astragard-charcoal/20">
                    <TabsTrigger value="all">All ({challenges.length})</TabsTrigger>
                    <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-6 space-y-3">{challenges.map((c) => <ChallengeRow key={c.id} c={c} />)}</TabsContent>
                  <TabsContent value="active" className="mt-6 space-y-3">{active.map((c) => <ChallengeRow key={c.id} c={c} />)}</TabsContent>
                  <TabsContent value="completed" className="mt-6 space-y-3">{completed.map((c) => <ChallengeRow key={c.id} c={c} />)}</TabsContent>
                </Tabs>
                {challenges.length === 0 && <EmptyState onAction={() => navigate("/brands/submit")} actionLabel="Submit a challenge" body="No challenges yet." />}
              </Section>
            )}

            {section === "matched" && (
              <Section title="Matched Creatives" subtitle="Astragard curates creators based on your intent — not algorithms.">
                <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm"><CardContent className="p-10 text-center text-primary-foreground/60 font-body">
                  Curation begins after a challenge moves to <span className="text-secondary">Creatives Matched</span>. You'll see proposed creatives and the reason for each match here.
                </CardContent></Card>
              </Section>
            )}

            {section === "workspace" && (
              <Section title="Collaboration Workspace" subtitle="Messaging, file sharing, milestones and timeline live here once a project begins.">
                <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm"><CardContent className="p-10 text-center text-primary-foreground/60 font-body">
                  No active collaborations yet. Once a creative accepts a project, the workspace opens here.
                </CardContent></Card>
              </Section>
            )}

            {section === "protection" && (
              <Section title="Creative Protection" subtitle="Ownership structure, AI agreements and collaboration terms — applied to every project you run.">
                <div className="grid md:grid-cols-3 gap-4">
                  <ProtectionCard title="Ownership" body="Choose Creator Retained, Shared, or Full Transfer per project." />
                  <ProtectionCard title="AI Agreements" body="Define whether AI is allowed, limited, or excluded from delivery." />
                  <ProtectionCard title="Collaboration Terms" body="Astragard's framework governs every engagement by default." />
                </div>
              </Section>
            )}

            {section === "saved" && (
              <Section title="Saved Work" subtitle="Creatives and projects you've bookmarked from the Creative Value Layer.">
                <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm"><CardContent className="p-10 text-center text-primary-foreground/60 font-body">
                  Nothing saved yet. Bookmark work from <Link to="/marketplace" className="text-secondary underline">Marketplace</Link> to gather it here.
                </CardContent></Card>
              </Section>
            )}

            {section === "insights" && (
              <Section title="Insights" subtitle="Project performance, collaboration health, outcome summaries. Selected outcomes are featured in Omnificense.">
                <div className="grid md:grid-cols-3 gap-4">
                  <Stat label="Active challenges" value={active.length} />
                  <Stat label="Completed projects" value={completed.length} />
                  <Stat label="Total submitted" value={challenges.length} />
                </div>
              </Section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "challenges", label: "My Challenges", icon: FolderOpen },
  { id: "matched", label: "Matched Creatives", icon: Users },
  { id: "workspace", label: "Workspace", icon: MessageSquare },
  { id: "protection", label: "Protection", icon: Shield },
  { id: "saved", label: "Saved Work", icon: Bookmark },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="font-heading text-3xl lg:text-4xl mb-2">{title}</h1>
        <p className="text-primary-foreground/60 font-body">{subtitle}</p>
      </header>
      {children}
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick, primary }: any) {
  return (
    <button onClick={onClick} className={cn(
      "flex items-center gap-3 p-4 rounded-md border text-left transition-all",
      primary
        ? "gradient-bg border-transparent text-primary-foreground hover:opacity-90"
        : "bg-card/30 border-astragard-charcoal/30 text-primary-foreground/80 hover:border-secondary/40 hover:text-primary-foreground"
    )}>
      <Icon className="h-5 w-5 shrink-0" />
      <span className="text-sm font-ui">{label}</span>
    </button>
  );
}

function ChallengeCard({ c }: { c: Challenge }) {
  return (
    <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm hover:border-secondary/40 transition-colors">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg leading-tight">{c.title || "Untitled challenge"}</h3>
          <Badge className={cn("border", STATUS_COLORS[c.status] ?? STATUS_COLORS.under_review)}>{STATUS_LABELS[c.status] ?? c.status}</Badge>
        </div>
        <p className="text-xs text-primary-foreground/50 uppercase tracking-widest font-ui">Stage · {c.stage}</p>
        <p className="text-sm text-primary-foreground/70 font-body line-clamp-2">{c.description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {c.intent && <Badge variant="outline" className="border-astragard-charcoal/40">{c.intent}</Badge>}
          {c.timeline && <Badge variant="outline" className="border-astragard-charcoal/40">{c.timeline}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

function ChallengeRow({ c }: { c: Challenge }) {
  return (
    <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-heading text-base truncate">{c.title || "Untitled challenge"}</div>
          <div className="text-xs text-primary-foreground/50 mt-1 font-ui">{new Date(c.created_at).toLocaleDateString()} · {c.creative_needs.slice(0, 3).join(", ")}</div>
        </div>
        <Badge className={cn("border shrink-0", STATUS_COLORS[c.status] ?? STATUS_COLORS.under_review)}>{STATUS_LABELS[c.status] ?? c.status}</Badge>
      </CardContent>
    </Card>
  );
}

function EmptyState({ body, actionLabel, onAction }: { body: string; actionLabel: string; onAction: () => void }) {
  return (
    <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm mt-6"><CardContent className="p-10 text-center">
      <p className="text-primary-foreground/60 font-body mb-5">{body}</p>
      <Button onClick={onAction} className="gradient-bg text-primary-foreground">{actionLabel}</Button>
    </CardContent></Card>
  );
}

function ProtectionCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm"><CardContent className="p-6 space-y-2">
      <Shield className="h-5 w-5 text-secondary" />
      <h3 className="font-heading text-lg">{title}</h3>
      <p className="text-sm text-primary-foreground/60 font-body">{body}</p>
    </CardContent></Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm"><CardContent className="p-6">
      <div className="text-xs uppercase tracking-widest text-primary-foreground/50">{label}</div>
      <div className="font-heading text-4xl mt-2 gradient-text">{value}</div>
    </CardContent></Card>
  );
}
