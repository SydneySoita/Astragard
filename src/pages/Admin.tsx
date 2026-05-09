import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard, ClipboardList, CreditCard, GitMerge, Briefcase,
  Users, Shield, Wallet, Bell, LogOut, Send, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Profile = {
  id: string; display_name: string; first_name: string | null; last_name: string | null;
  category: string | null; bio: string | null; portfolio_url: string | null;
  application_status: string; fee_paid: boolean; tier: string;
  created_at: string;
};
type Challenge = {
  id: string; user_id: string; title: string; description: string;
  intent: string; use_case: string; creative_needs: string[];
  collaboration_style: string; budget_range: string; timeline: string;
  status: string; stage: string; created_at: string;
};
type Review = {
  id: string; applicant_id: string;
  portfolio_quality: number; authorship_clarity: number; professional_readiness: number;
  protection_alignment: number; collaboration_potential: number; category_fit: number;
  total_score: number; decision: string; notes: string;
};
type Match = {
  id: string; challenge_id: string; creative_id: string;
  total_score: number; reason: string; risk_flags: string[]; status: string;
};
type Revenue = { id: string; user_id: string | null; source: string; amount_cents: number; currency: string; status: string; created_at: string };

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: ClipboardList },
  { id: "fees", label: "Onboarding Fees", icon: CreditCard },
  { id: "matching", label: "Matching", icon: GitMerge },
  { id: "challenges", label: "Challenges", icon: Briefcase },
  { id: "collaborations", label: "Collaborations", icon: Users },
  { id: "protection", label: "Protection", icon: Shield },
  { id: "users", label: "Users", icon: Users },
  { id: "revenue", label: "Revenue", icon: Wallet },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "omnificense", label: "Omnificense", icon: BookOpen },
];

export default function Admin() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [section, setSection] = useState("overview");

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [collabs, setCollabs] = useState<any[]>([]);
  const [protection, setProtection] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [revenue, setRevenue] = useState<Revenue[]>([]);

  // Auth + role gate
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/auth?redirect=/admin");
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user, loading, navigate]);

  const reload = async () => {
    const [p, c, co, pr, rv, ms, rev] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("creative_challenges").select("*").order("created_at", { ascending: false }),
      supabase.from("collaborations").select("*").order("created_at", { ascending: false }),
      supabase.from("protection_settings").select("*"),
      supabase.from("application_reviews").select("*"),
      supabase.from("match_suggestions").select("*").order("created_at", { ascending: false }),
      supabase.from("platform_revenue").select("*").order("created_at", { ascending: false }),
    ]);
    setProfiles((p.data as Profile[]) ?? []);
    setChallenges((c.data as Challenge[]) ?? []);
    setCollabs(co.data ?? []);
    setProtection(pr.data ?? []);
    setReviews((rv.data as Review[]) ?? []);
    setMatches((ms.data as Match[]) ?? []);
    setRevenue((rev.data as Revenue[]) ?? []);
  };

  useEffect(() => { if (isAdmin) reload(); }, [isAdmin]);

  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.id, p])), [profiles]);

  const stats = useMemo(() => ({
    creatives: profiles.length,
    activeChallenges: challenges.filter((c) => c.status !== "completed").length,
    collaborations: collabs.filter((c: any) => c.status === "accepted").length,
    pendingApprovals: profiles.filter((p) => p.application_status !== "approved" && p.application_status !== "rejected").length,
    revenue: revenue.reduce((s, r) => s + (r.status === "paid" ? r.amount_cents : 0), 0) / 100,
  }), [profiles, challenges, collabs, revenue]);

  if (loading || isAdmin === null) {
    return <div className="min-h-screen bg-astragard-dark flex items-center justify-center text-primary-foreground/60 font-ui">Verifying access…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-astragard-dark flex items-center justify-center px-4">
        <div className="max-w-md text-center text-primary-foreground space-y-4 font-ui">
          <Shield className="h-10 w-10 text-secondary mx-auto" />
          <h1 className="font-heading text-2xl">Admin access required</h1>
          <p className="text-primary-foreground/60">Your account is not assigned the admin role. Contact a platform administrator if you believe this is an error.</p>
          <Button variant="outline" onClick={() => navigate("/")}>Return home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-astragard-dark text-primary-foreground font-ui flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-astragard-charcoal/30 bg-astragard-dark/80">
        <Link to="/" className="px-6 py-6 font-heading text-lg gradient-text border-b border-astragard-charcoal/30">ASTRAGARD</Link>
        <div className="px-6 py-4 border-b border-astragard-charcoal/30">
          <div className="text-[10px] uppercase tracking-widest text-primary-foreground/40">Console</div>
          <div className="font-heading text-sm mt-1 text-secondary">Curation & Governance</div>
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
        <button onClick={async () => { await signOut(); navigate("/"); }} className="m-3 flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-primary-foreground/60 hover:text-primary-foreground hover:bg-astragard-charcoal/20">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="lg:hidden border-b border-astragard-charcoal/30 sticky top-0 z-20 bg-astragard-dark/90 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="font-heading gradient-text">ASTRAGARD · ADMIN</Link>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}><LogOut className="h-4 w-4" /></Button>
          </div>
          <div className="flex overflow-x-auto gap-1 px-4 pb-3 no-scrollbar">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => setSection(n.id)} className={cn("px-3 py-1.5 text-xs rounded-full whitespace-nowrap", section === n.id ? "bg-astragard-charcoal/40 text-primary-foreground border-b-2 border-secondary" : "text-primary-foreground/60")}>{n.label}</button>
            ))}
          </div>
        </div>

        <div className="px-4 lg:px-10 py-8 lg:py-12 max-w-7xl mx-auto space-y-8">
          {section === "overview" && <Overview stats={stats} />}
          {section === "applications" && <Applications profiles={profiles} reviews={reviews} reload={reload} />}
          {section === "fees" && <Fees profiles={profiles} />}
          {section === "matching" && <Matching challenges={challenges} profiles={profiles} matches={matches} reload={reload} />}
          {section === "challenges" && <Challenges challenges={challenges} profileMap={profileMap} reload={reload} />}
          {section === "collaborations" && <Collaborations collabs={collabs} profileMap={profileMap} />}
          {section === "protection" && <Protection protection={protection} profileMap={profileMap} />}
          {section === "users" && <UsersSection profiles={profiles} reload={reload} />}
          {section === "revenue" && <RevenueSection revenue={revenue} profileMap={profileMap} />}
          {section === "notifications" && <Notifications profiles={profiles} />}
          {section === "omnificense" && <OmnificenseAdmin projects={[]} />}
        </div>
      </main>
    </div>
  );
}

/* -------- Overview -------- */
function Overview({ stats }: { stats: any }) {
  const cards = [
    { label: "Total Creatives", value: stats.creatives },
    { label: "Active Challenges", value: stats.activeChallenges },
    { label: "Ongoing Collaborations", value: stats.collaborations },
    { label: "Pending Approvals", value: stats.pendingApprovals },
    { label: "Revenue (USD)", value: `$${stats.revenue.toFixed(2)}` },
  ];
  return (
    <>
      <Header title="Platform Overview" subtitle="The state of Astragard at a glance." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="text-[10px] uppercase tracking-widest text-primary-foreground/50">{c.label}</div>
              <div className="font-heading text-3xl mt-2 gradient-text">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- Applications -------- */
const SCORE_FIELDS: { key: keyof Review; label: string; max: number }[] = [
  { key: "portfolio_quality", label: "Portfolio Quality", max: 25 },
  { key: "authorship_clarity", label: "Authorship Clarity", max: 20 },
  { key: "professional_readiness", label: "Professional Readiness", max: 15 },
  { key: "protection_alignment", label: "Protection Alignment", max: 20 },
  { key: "collaboration_potential", label: "Collaboration Potential", max: 15 },
  { key: "category_fit", label: "Category Fit", max: 5 },
];

function decisionFromScore(s: number) {
  if (s >= 80) return "approve";
  if (s >= 65) return "request_revision";
  return "reject";
}
function decisionLabel(d: string) {
  return ({ approve: "Approve", request_revision: "Request Revision", reject: "Reject", waitlist: "Waitlist", pending: "Pending" } as any)[d] ?? d;
}

function Applications({ profiles, reviews, reload }: { profiles: Profile[]; reviews: Review[]; reload: () => void }) {
  const reviewMap = useMemo(() => Object.fromEntries(reviews.map((r) => [r.applicant_id, r])), [reviews]);
  const pending = profiles.filter((p) => p.application_status !== "approved" && p.application_status !== "rejected");
  return (
    <>
      <Header title="Creative Applications" subtitle="Score every applicant against the 100-point Astragard standard." />
      {pending.length === 0 && <Empty body="No pending applications." />}
      <div className="space-y-4">
        {pending.map((p) => <ApplicantRow key={p.id} profile={p} review={reviewMap[p.id]} reload={reload} />)}
      </div>
    </>
  );
}

function ApplicantRow({ profile, review, reload }: { profile: Profile; review?: Review; reload: () => void }) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({
    portfolio_quality: review?.portfolio_quality ?? 0,
    authorship_clarity: review?.authorship_clarity ?? 0,
    professional_readiness: review?.professional_readiness ?? 0,
    protection_alignment: review?.protection_alignment ?? 0,
    collaboration_potential: review?.collaboration_potential ?? 0,
    category_fit: review?.category_fit ?? 0,
  });
  const [notes, setNotes] = useState(review?.notes ?? "");
  const total = Object.values(scores).reduce((a, b) => a + Number(b || 0), 0);
  const recommended = decisionFromScore(total);

  const setScore = (key: string, max: number, value: string) => {
    const n = Math.max(0, Math.min(max, parseInt(value || "0", 10)));
    setScores((s) => ({ ...s, [key]: isNaN(n) ? 0 : n }));
  };

  const save = async (decision: string) => {
    const payload = { applicant_id: profile.id, ...scores, decision, notes };
    const { error: revErr } = review
      ? await supabase.from("application_reviews").update(payload).eq("id", review.id)
      : await supabase.from("application_reviews").insert(payload);
    if (revErr) return toast.error(revErr.message);

    // Update profile + notify
    const newStatus = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : decision;
    await supabase.from("profiles").update({ application_status: newStatus }).eq("id", profile.id);
    await supabase.from("notifications").insert({
      user_id: profile.id,
      title: `Application ${decisionLabel(decision)}`,
      body: decision === "approve"
        ? "Welcome to Astragard. Complete your onboarding fee to activate your dashboard."
        : decision === "reject" ? "Thank you for applying. After review, your application was not accepted at this time."
        : decision === "waitlist" ? "You've been placed on the Astragard waitlist."
        : "We'd love a little more from your application. Check your inbox for details.",
    });
    toast.success("Decision saved.");
    setOpen(false);
    reload();
  };

  return (
    <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="font-heading text-lg truncate">{profile.display_name || `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Unnamed"}</div>
            <div className="text-xs text-primary-foreground/50 mt-1">{profile.category ?? "uncategorised"} · status: {profile.application_status}</div>
            {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="text-xs text-secondary mt-1 inline-block">Portfolio ↗</a>}
          </div>
          <div className="flex items-center gap-2">
            {review && <Badge className="border border-secondary/40 bg-secondary/10 text-secondary">{review.total_score}/100</Badge>}
            <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Review"}</Button>
          </div>
        </div>

        {open && (
          <div className="mt-6 space-y-5 border-t border-astragard-charcoal/30 pt-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCORE_FIELDS.map((f) => (
                <div key={f.key as string}>
                  <Label className="text-xs uppercase tracking-widest text-primary-foreground/60">{f.label} <span className="text-primary-foreground/40">/ {f.max}</span></Label>
                  <Input type="number" min={0} max={f.max} value={scores[f.key as string]} onChange={(e) => setScore(f.key as string, f.max, e.target.value)} className="bg-background/40 mt-1" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-primary-foreground/60">Total</span>
              <Badge className="border border-secondary/40 bg-secondary/10 text-secondary">{total}/100</Badge>
              <span className="text-primary-foreground/50">Recommended:</span>
              <Badge variant="outline" className="border-astragard-charcoal/40">{decisionLabel(recommended)}</Badge>
            </div>
            <div>
              <Label className="text-primary-foreground/70">Reviewer notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="bg-background/40 mt-1" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="gradient-bg text-primary-foreground" onClick={() => save("approve")}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => save("request_revision")}>Request Revision</Button>
              <Button size="sm" variant="outline" onClick={() => save("waitlist")}>Waitlist</Button>
              <Button size="sm" variant="destructive" onClick={() => save("reject")}>Reject</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* -------- Fees -------- */
function Fees({ profiles }: { profiles: Profile[] }) {
  const approved = profiles.filter((p) => p.application_status === "approved");
  return (
    <>
      <Header title="Onboarding Fee Tracking" subtitle="Approved creatives. Dashboards remain locked until payment is confirmed." />
      <div className="space-y-3">
        {approved.length === 0 && <Empty body="No approved creatives yet." />}
        {approved.map((p) => (
          <Card key={p.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-heading text-base">{p.display_name || "Unnamed"}</div>
                <div className="text-xs text-primary-foreground/50 mt-1">{p.category ?? "—"}</div>
              </div>
              <Badge className={cn("border", p.fee_paid ? "bg-green-500/15 text-green-300 border-green-500/30" : "bg-secondary/15 text-secondary border-secondary/30")}>
                {p.fee_paid ? "Activated" : "Pending"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- Matching -------- */
const MATCH_FIELDS: { key: string; label: string; max: number }[] = [
  { key: "field_match", label: "Creative Field", max: 25 },
  { key: "intent_match", label: "Intent", max: 20 },
  { key: "use_case_match", label: "Use Case", max: 15 },
  { key: "portfolio_relevance", label: "Portfolio Relevance", max: 15 },
  { key: "collaboration_match", label: "Collaboration Pref.", max: 10 },
  { key: "budget_match", label: "Budget", max: 5 },
  { key: "timeline_match", label: "Timeline", max: 5 },
  { key: "ai_ownership_match", label: "AI / Ownership", max: 5 },
];

function Matching({ challenges, profiles, matches, reload }: { challenges: Challenge[]; profiles: Profile[]; matches: Match[]; reload: () => void }) {
  const [selected, setSelected] = useState<string>(challenges[0]?.id ?? "");
  useEffect(() => { if (!selected && challenges[0]) setSelected(challenges[0].id); }, [challenges, selected]);
  const challenge = challenges.find((c) => c.id === selected);
  const challengeMatches = matches.filter((m) => m.challenge_id === selected);
  const matchedIds = new Set(challengeMatches.map((m) => m.creative_id));
  const candidates = profiles.filter((p) => p.fee_paid && !matchedIds.has(p.id));

  return (
    <>
      <Header title="Creative Matching Engine" subtitle="Admin-curated matching. Score every creative against the brief." />
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-2">
          {challenges.map((c) => (
            <button key={c.id} onClick={() => setSelected(c.id)} className={cn(
              "w-full text-left p-3 rounded-md border transition-colors",
              selected === c.id ? "border-secondary bg-secondary/10" : "border-astragard-charcoal/30 hover:border-secondary/40"
            )}>
              <div className="font-heading text-sm truncate">{c.title || "Untitled"}</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-foreground/50 mt-1">{c.status}</div>
            </button>
          ))}
          {challenges.length === 0 && <Empty body="No challenges submitted yet." />}
        </div>
        <div className="space-y-6">
          {challenge && (
            <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-heading text-xl">{challenge.title}</h3>
                <p className="text-sm text-primary-foreground/70 font-body">{challenge.description}</p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs">
                  {challenge.intent && <Badge variant="outline" className="border-astragard-charcoal/40">{challenge.intent}</Badge>}
                  {challenge.use_case && <Badge variant="outline" className="border-astragard-charcoal/40">{challenge.use_case}</Badge>}
                  {challenge.budget_range && <Badge variant="outline" className="border-astragard-charcoal/40">{challenge.budget_range}</Badge>}
                  {challenge.timeline && <Badge variant="outline" className="border-astragard-charcoal/40">{challenge.timeline}</Badge>}
                </div>
              </CardContent>
            </Card>
          )}

          {challengeMatches.length > 0 && (
            <div>
              <h3 className="font-heading text-lg mb-3">Suggested matches</h3>
              <div className="space-y-3">
                {challengeMatches.map((m) => {
                  const p = profiles.find((x) => x.id === m.creative_id);
                  return (
                    <Card key={m.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-heading">{p?.display_name ?? "Creator"}</div>
                          <div className="text-xs text-primary-foreground/60 mt-1 max-w-md">{m.reason}</div>
                          {m.risk_flags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {m.risk_flags.map((f) => <Badge key={f} className="bg-destructive/20 text-destructive border-destructive/40 text-[10px]">⚠ {f}</Badge>)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-secondary/15 text-secondary border-secondary/40 border">{m.total_score}%</Badge>
                          <Button size="sm" variant="outline" onClick={async () => { await supabase.from("match_suggestions").update({ status: "invited" }).eq("id", m.id); reload(); }}>Invite</Button>
                          <Button size="sm" variant="ghost" onClick={async () => { await supabase.from("match_suggestions").delete().eq("id", m.id); reload(); }}>Reject</Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {challenge && (
            <div>
              <h3 className="font-heading text-lg mb-3">Score a candidate</h3>
              {candidates.length === 0 && <Empty body="No eligible creatives to match." />}
              <div className="space-y-3">
                {candidates.slice(0, 6).map((p) => <ScoreCandidate key={p.id} challengeId={challenge.id} profile={p} onSaved={reload} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ScoreCandidate({ challengeId, profile, onSaved }: { challengeId: string; profile: Profile; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>(Object.fromEntries(MATCH_FIELDS.map((f) => [f.key, 0])));
  const [reason, setReason] = useState("");
  const [risks, setRisks] = useState("");
  const total = Object.values(scores).reduce((a, b) => a + Number(b || 0), 0);

  const save = async () => {
    const { error } = await supabase.from("match_suggestions").insert({
      challenge_id: challengeId, creative_id: profile.id, ...scores,
      reason, risk_flags: risks.split(",").map((s) => s.trim()).filter(Boolean), status: "suggested",
    });
    if (error) return toast.error(error.message);
    toast.success("Match saved.");
    setOpen(false); onSaved();
  };

  return (
    <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-heading">{profile.display_name}</div>
            <div className="text-xs text-primary-foreground/50">{profile.category}</div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Score"}</Button>
        </div>
        {open && (
          <div className="mt-4 space-y-4 border-t border-astragard-charcoal/30 pt-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MATCH_FIELDS.map((f) => (
                <div key={f.key}>
                  <Label className="text-[10px] uppercase tracking-widest">{f.label} /{f.max}</Label>
                  <Input type="number" min={0} max={f.max} value={scores[f.key]}
                    onChange={(e) => setScores((s) => ({ ...s, [f.key]: Math.max(0, Math.min(f.max, parseInt(e.target.value || "0", 10))) }))}
                    className="bg-background/40 mt-1" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm"><span className="text-primary-foreground/60">Total</span><Badge className="bg-secondary/15 text-secondary border border-secondary/40">{total}/100</Badge></div>
            <div><Label>Reason for match</Label><Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="bg-background/40 mt-1" /></div>
            <div><Label>Risk / mismatch flags (comma separated)</Label><Input value={risks} onChange={(e) => setRisks(e.target.value)} className="bg-background/40 mt-1" /></div>
            <Button size="sm" className="gradient-bg text-primary-foreground" onClick={save}>Save match</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* -------- Challenges -------- */
function Challenges({ challenges, profileMap, reload }: { challenges: Challenge[]; profileMap: Record<string, Profile>; reload: () => void }) {
  const update = async (id: string, patch: Partial<Challenge>) => {
    const { error } = await supabase.from("creative_challenges").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    reload();
  };
  return (
    <>
      <Header title="Challenge Management" subtitle="Every brief submitted by brands." />
      <div className="space-y-3">
        {challenges.length === 0 && <Empty body="No challenges yet." />}
        {challenges.map((c) => (
          <Card key={c.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-heading">{c.title || "Untitled"}</div>
                  <div className="text-xs text-primary-foreground/50 mt-1">{profileMap[c.user_id]?.display_name ?? "Unknown brand"} · {new Date(c.created_at).toLocaleDateString()}</div>
                </div>
                <Badge variant="outline" className="border-astragard-charcoal/40">{c.status}</Badge>
              </div>
              <p className="text-sm text-primary-foreground/70 font-body line-clamp-2">{c.description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => update(c.id, { status: "matched" })}>Move to Matched</Button>
                <Button size="sm" variant="outline" onClick={() => update(c.id, { status: "in_collaboration" })}>In Collaboration</Button>
                <Button size="sm" variant="outline" onClick={() => update(c.id, { stage: "incubator" })}>Move to Incubator</Button>
                <Button size="sm" variant="ghost" onClick={() => update(c.id, { status: "archived" })}>Archive</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- Collaborations -------- */
function Collaborations({ collabs, profileMap }: { collabs: any[]; profileMap: Record<string, Profile> }) {
  return (
    <>
      <Header title="Collaboration Oversight" subtitle="Monitor every active collaboration. Intervene when needed." />
      {collabs.length === 0 && <Empty body="No collaborations yet." />}
      <div className="space-y-3">
        {collabs.map((c) => (
          <Card key={c.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-heading">{c.project_title}</div>
                <div className="text-xs text-primary-foreground/50 mt-1">{profileMap[c.inviter_id]?.display_name ?? "—"} → {profileMap[c.invitee_id]?.display_name ?? "—"}</div>
              </div>
              <Badge variant="outline" className="border-astragard-charcoal/40">{c.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- Protection -------- */
function Protection({ protection, profileMap }: { protection: any[]; profileMap: Record<string, Profile> }) {
  return (
    <>
      <Header title="Creative Protection" subtitle="Ownership choices, AI declarations and framework compliance across the platform." />
      <div className="space-y-3">
        {protection.length === 0 && <Empty body="No protection settings recorded." />}
        {protection.map((p) => (
          <Card key={p.user_id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between gap-4 text-sm">
              <div className="font-heading">{profileMap[p.user_id]?.display_name ?? p.user_id.slice(0, 8)}</div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="border-astragard-charcoal/40">Watermark {p.watermark_enabled ? "on" : "off"}</Badge>
                <Badge variant="outline" className="border-astragard-charcoal/40">Lock {p.authorship_lock ? "on" : "off"}</Badge>
                <Badge variant="outline" className="border-astragard-charcoal/40">AI {p.allow_ai_training ? "allowed" : "blocked"}</Badge>
                <Badge variant="outline" className="border-astragard-charcoal/40">{p.visibility_default}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- Users -------- */
function UsersSection({ profiles, reload }: { profiles: Profile[]; reload: () => void }) {
  const setTier = async (id: string, tier: string) => {
    const { error } = await supabase.from("profiles").update({ tier }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Tier updated."); reload();
  };
  return (
    <>
      <Header title="User Management" subtitle="Manage creatives and brands. Adjust tier and status." />
      <Tabs defaultValue="creatives">
        <TabsList className="bg-astragard-charcoal/20">
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>
        <TabsContent value="creatives" className="mt-5 space-y-3">
          {profiles.map((p) => (
            <Card key={p.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-heading">{p.display_name}</div>
                  <div className="text-xs text-primary-foreground/50 mt-1">{p.category ?? "—"} · {p.application_status} · {p.fee_paid ? "fee paid" : "fee pending"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-astragard-charcoal/40">{p.tier}</Badge>
                  <Button size="sm" variant="outline" onClick={() => setTier(p.id, p.tier === "featured" ? "standard" : "featured")}>{p.tier === "featured" ? "Unfeature" : "Feature"}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="brands" className="mt-5 text-primary-foreground/60 text-sm">
          Brand records appear once they submit a challenge. Use the Challenges section to manage them.
        </TabsContent>
      </Tabs>
    </>
  );
}

/* -------- Revenue -------- */
function RevenueSection({ revenue, profileMap }: { revenue: Revenue[]; profileMap: Record<string, Profile> }) {
  const grouped = revenue.reduce<Record<string, number>>((acc, r) => {
    if (r.status !== "paid") return acc;
    acc[r.source] = (acc[r.source] ?? 0) + r.amount_cents;
    return acc;
  }, {});
  const total = Object.values(grouped).reduce((a, b) => a + b, 0);
  return (
    <>
      <Header title="Revenue Tracking" subtitle="Onboarding fees, commissions, mentorship, Omnificense subscriptions." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Total revenue" value={`$${(total/100).toFixed(2)}`} />
        <Stat label="Onboarding fees" value={`$${((grouped["onboarding_fee"] ?? 0)/100).toFixed(2)}`} />
        <Stat label="Commissions" value={`$${((grouped["commission"] ?? 0)/100).toFixed(2)}`} />
        <Stat label="Subscriptions" value={`$${((grouped["subscription"] ?? 0)/100).toFixed(2)}`} />
      </div>
      <div className="space-y-2">
        {revenue.length === 0 && <Empty body="No revenue events recorded yet." />}
        {revenue.map((r) => (
          <Card key={r.id} className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center justify-between text-sm">
              <div>
                <div className="font-heading capitalize">{r.source.replace(/_/g, " ")}</div>
                <div className="text-xs text-primary-foreground/50">{r.user_id ? profileMap[r.user_id]?.display_name ?? r.user_id.slice(0, 8) : "—"} · {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              <div className="font-heading">${(r.amount_cents/100).toFixed(2)} {r.currency}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="text-[10px] uppercase tracking-widest text-primary-foreground/50">{label}</div>
        <div className="font-heading text-2xl mt-2 gradient-text">{value}</div>
      </CardContent>
    </Card>
  );
}

/* -------- Notifications -------- */
function Notifications({ profiles }: { profiles: Profile[] }) {
  const [target, setTarget] = useState("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!title.trim()) return toast.error("Title is required.");
    setSending(true);
    const recipients = target === "all" ? profiles : profiles.filter((p) => p.id === target);
    const { error } = await supabase.from("notifications").insert(
      recipients.map((p) => ({ user_id: p.id, title, body }))
    );
    setSending(false);
    if (error) return toast.error(error.message);
    toast.success(`Sent to ${recipients.length} recipient(s).`);
    setTitle(""); setBody("");
  };

  return (
    <>
      <Header title="Notifications" subtitle="Send approval decisions, revision requests, platform announcements." />
      <Card className="bg-card/30 border-astragard-charcoal/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Recipient</Label>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full mt-1 bg-background/40 border border-input rounded-md px-3 py-2 text-sm">
              <option value="all">All creatives ({profiles.length})</option>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
            </select>
          </div>
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background/40 mt-1" /></div>
          <div><Label>Message</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="bg-background/40 mt-1" /></div>
          <Button onClick={send} disabled={sending} className="gradient-bg text-primary-foreground">
            <Send className="h-4 w-4 mr-2" /> {sending ? "Sending…" : "Send notification"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

/* -------- Omnificense -------- */
function OmnificenseAdmin({ projects }: { projects: any[] }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("omnificence_articles")
      .select("*")
      .order("created_at", { ascending: false });
    setArticles(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const blank = {
    slug: "", title: "", subtitle: "", content_type: "case_study",
    cover_image_url: "", teaser: "", tier: "paid", status: "draft",
    challenge: "", creative_direction: "", collaboration: "",
    outcome: "", learning: "", body: "", tags: [] as string[],
  };

  const save = async (publish = false) => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      ...editing,
      status: publish ? "published" : editing.status,
      published_at: publish ? new Date().toISOString() : editing.published_at,
      tags: typeof editing.tags === "string"
        ? editing.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : editing.tags,
    };
    const op = editing.id
      ? supabase.from("omnificence_articles").update(payload).eq("id", editing.id)
      : supabase.from("omnificence_articles").insert(payload);
    const { error } = await op;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(publish ? "Published to Omnificense" : "Saved");
    setEditing(null);
    load();
  };

  const togglePublish = async (a: any) => {
    const next = a.status === "published" ? "draft" : "published";
    await supabase.from("omnificence_articles").update({
      status: next,
      published_at: next === "published" ? new Date().toISOString() : null,
    }).eq("id", a.id);
    load();
  };

  return (
    <>
      <Header title="Omnificense" subtitle="Curate and publish case studies, interviews and trend reports." />
      <div className="flex justify-end">
        <Button className="gradient-bg text-primary-foreground" onClick={() => setEditing({ ...blank })}>
          <BookOpen className="h-4 w-4 mr-2" /> New entry
        </Button>
      </div>

      {editing && (
        <Card className="bg-card/30 border-astragard-charcoal/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-xl">{editing.id ? "Edit entry" : "New entry"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Close</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="bg-background/40 mt-1" /></div>
              <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="kebab-case" className="bg-background/40 mt-1" /></div>
              <div><Label>Subtitle</Label><Input value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className="bg-background/40 mt-1" /></div>
              <div><Label>Cover image URL</Label><Input value={editing.cover_image_url} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} className="bg-background/40 mt-1" /></div>
              <div>
                <Label>Type</Label>
                <select value={editing.content_type} onChange={(e) => setEditing({ ...editing, content_type: e.target.value })} className="w-full mt-1 bg-background/40 border border-input rounded-md px-3 py-2 text-sm">
                  <option value="case_study">Case Study</option>
                  <option value="interview">Interview</option>
                  <option value="trend_report">Trend Report</option>
                  <option value="behind_scenes">Behind the Scenes</option>
                  <option value="culture">Culture</option>
                </select>
              </div>
              <div>
                <Label>Access tier</Label>
                <select value={editing.tier} onChange={(e) => setEditing({ ...editing, tier: e.target.value })} className="w-full mt-1 bg-background/40 border border-input rounded-md px-3 py-2 text-sm">
                  <option value="paid">Paid (subscribers)</option>
                  <option value="free">Free (preview teaser)</option>
                </select>
              </div>
            </div>
            <div><Label>Teaser (always public)</Label><Textarea rows={3} value={editing.teaser} onChange={(e) => setEditing({ ...editing, teaser: e.target.value })} className="bg-background/40 mt-1" /></div>

            {editing.content_type === "case_study" ? (
              <div className="space-y-3">
                {[
                  ["challenge", "01 — The Challenge"],
                  ["creative_direction", "02 — The Creative Direction"],
                  ["collaboration", "03 — The Collaboration"],
                  ["outcome", "04 — The Outcome"],
                  ["learning", "05 — The Learning"],
                ].map(([k, label]) => (
                  <div key={k}>
                    <Label>{label}</Label>
                    <Textarea rows={4} value={editing[k] || ""} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} className="bg-background/40 mt-1" />
                  </div>
                ))}
              </div>
            ) : (
              <div><Label>Body</Label><Textarea rows={10} value={editing.body || ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="bg-background/40 mt-1" /></div>
            )}

            <div><Label>Tags (comma separated)</Label><Input value={Array.isArray(editing.tags) ? editing.tags.join(", ") : editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} className="bg-background/40 mt-1" /></div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => save(false)} disabled={saving}>Save draft</Button>
              <Button className="gradient-bg text-primary-foreground" onClick={() => save(true)} disabled={saving}>
                {editing.status === "published" ? "Update published" : "Publish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {articles.length === 0 && <Empty body="No Omnificense entries yet." />}
        {articles.map((a) => (
          <Card key={a.id} className="bg-card/30 border-astragard-charcoal/30">
            <CardContent className="p-5 flex flex-wrap gap-4 items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-secondary/40 text-secondary">{a.content_type.replace("_", " ")}</Badge>
                  <Badge variant="outline" className={cn("text-[10px] uppercase tracking-widest", a.status === "published" ? "border-green-500/40 text-green-400" : "border-primary-foreground/30 text-primary-foreground/60")}>{a.status}</Badge>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{a.tier}</Badge>
                </div>
                <div className="font-heading text-lg truncate">{a.title || "(untitled)"}</div>
                <div className="text-xs text-primary-foreground/50 truncate">/{a.slug}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing({ ...a, tags: a.tags || [] })}>Edit</Button>
                <Button variant="outline" size="sm" onClick={() => togglePublish(a)}>
                  {a.status === "published" ? "Unpublish" : "Publish"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/* -------- shared -------- */
function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-2 animate-fade-in">
      <h1 className="font-heading text-3xl lg:text-4xl">{title}</h1>
      <p className="text-primary-foreground/60 font-body mt-2">{subtitle}</p>
    </header>
  );
}
function Empty({ body }: { body: string }) {
  return (
    <Card className="bg-card/20 border-dashed border-astragard-charcoal/30">
      <CardContent className="p-8 text-center text-primary-foreground/50 font-body text-sm">{body}</CardContent>
    </Card>
  );
}
