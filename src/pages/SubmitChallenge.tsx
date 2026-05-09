import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";

const INTENTS = ["Storytelling", "Brand Identity", "Cultural Expression", "Product Experience", "Campaign / Marketing", "Experimental / Research"];
const USE_CASES = ["Film / Media", "Social / Digital", "Product / Interface", "Live Experience", "Voice / Audio", "Physical Space"];
const NEEDS = ["Voiceover Artist", "Writer / Author", "Designer", "Musician", "Product Designer", "Game / Audio", "Fashion Designer", "Research / Experimental", "I'm not sure — recommend for me"];
const COLLAB = ["Fully collaborative (Incubator)", "Direct commission", "Licensing existing work", "Open to guidance"];
const BUDGETS = ["Under $500", "$500 – $2,000", "$2,000 – $10,000", "$10,000+", "Prefer to discuss"];
const TIMELINES = ["Urgent (1–2 weeks)", "Short term (~1 month)", "Medium (1–3 months)", "Flexible"];
const OWNERSHIP = ["Creator Retained", "Shared", "Full Transfer"];
const AI_PREF = ["AI Allowed", "Limited AI", "Human-Only"];

const TOTAL_STEPS = 9;

interface FormState {
  title: string; description: string;
  intent: string; use_case: string;
  creative_needs: string[];
  collaboration_style: string;
  budget_range: string; timeline: string;
  ownership_preference: string; ai_preference: string;
  contact_name: string; contact_company: string; contact_email: string; contact_phone: string;
}

const initial: FormState = {
  title: "", description: "", intent: "", use_case: "",
  creative_needs: [], collaboration_style: "",
  budget_range: "", timeline: "", ownership_preference: "", ai_preference: "",
  contact_name: "", contact_company: "", contact_email: "", contact_phone: "",
};

export default function SubmitChallenge() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [f, setF] = useState<FormState>(initial);

  const update = (patch: Partial<FormState>) => setF((p) => ({ ...p, ...patch }));

  const toggleNeed = (n: string) => {
    setF((p) => ({
      ...p,
      creative_needs: p.creative_needs.includes(n)
        ? p.creative_needs.filter((x) => x !== n)
        : [...p.creative_needs, n],
    }));
  };

  const canContinue = () => {
    switch (step) {
      case 1: return f.title.trim() && f.description.trim().length >= 10;
      case 2: return !!f.intent;
      case 3: return !!f.use_case;
      case 4: return f.creative_needs.length > 0;
      case 5: return !!f.collaboration_style;
      case 6: return !!f.budget_range;
      case 7: return !!f.timeline;
      case 8: return !!f.ownership_preference && !!f.ai_preference;
      case 9: return f.contact_name && f.contact_email && /\S+@\S+\.\S+/.test(f.contact_email);
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit your challenge.");
      sessionStorage.setItem("astragard_pending_challenge", JSON.stringify(f));
      navigate("/auth?redirect=/brands/submit");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("creative_challenges").insert({
      user_id: user.id, ...f,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Challenge submitted.");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="pt-32 pb-24 min-h-[80vh] flex items-center">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mx-auto h-16 w-16 rounded-full gradient-bg flex items-center justify-center mb-8">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-primary-foreground mb-6">Your challenge has been received.</h1>
            <p className="text-primary-foreground/60 font-body text-lg mb-10">
              Astragard will review and curate the right creative direction for you. You'll find the status of every challenge in your Brand Dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/brands/dashboard")} className="gradient-bg text-primary-foreground">View Dashboard</Button>
              <Button variant="outline" onClick={() => { setF(initial); setStep(1); setSubmitted(false); }}>Submit another</Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-primary-foreground/50 mb-3 font-ui">
              <span>Step {step} of {TOTAL_STEPS}</span>
              <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="h-1 bg-astragard-charcoal/30 rounded-full overflow-hidden">
              <div className="h-full gradient-bg transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
            </div>
          </div>

          <Card className="bg-card/40 border-astragard-charcoal/30 backdrop-blur-sm p-8 md:p-12">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-secondary text-xs uppercase tracking-widest mb-3 font-ui">Challenge</p>
                  <h2 className="font-heading text-3xl text-primary-foreground">What are you trying to create or solve?</h2>
                  <p className="text-primary-foreground/60 font-body mt-3">Speak plainly. The more honest the brief, the better the curation.</p>
                </div>
                <div>
                  <Label className="text-primary-foreground/80">Working title</Label>
                  <Input value={f.title} onChange={(e) => update({ title: e.target.value })} placeholder="e.g. Brand soundtrack for our new campaign" className="bg-background/40 mt-2" />
                </div>
                <div>
                  <Label className="text-primary-foreground/80">Describe the challenge</Label>
                  <Textarea value={f.description} onChange={(e) => update({ description: e.target.value })} rows={8} placeholder="What does success look like? What is the audience? What is the feeling you're after?" className="bg-background/40 mt-2" />
                  <p className="text-xs text-primary-foreground/40 mt-2">Tip: focus on intent, audience, and emotion before format.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <CardSelect title="What is the intent behind this project?" subtitle="Choose the closest direction." options={INTENTS} value={f.intent} onChange={(v) => update({ intent: v })} />
            )}
            {step === 3 && (
              <CardSelect title="Where will this work be used?" subtitle="The medium shapes the craft." options={USE_CASES} value={f.use_case} onChange={(v) => update({ use_case: v })} />
            )}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl text-primary-foreground">Which creative voices do you need?</h2>
                  <p className="text-primary-foreground/60 font-body mt-3">Select all that apply — or let us recommend.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {NEEDS.map((n) => {
                    const active = f.creative_needs.includes(n);
                    return (
                      <button key={n} type="button" onClick={() => toggleNeed(n)} className={cn(
                        "flex items-center gap-3 p-4 rounded-md border text-left transition-all font-ui text-sm",
                        active ? "border-secondary bg-secondary/10 text-primary-foreground" : "border-astragard-charcoal/40 text-primary-foreground/70 hover:border-secondary/50"
                      )}>
                        <Checkbox checked={active} className="pointer-events-none" />
                        <span>{n}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {step === 5 && (
              <CardSelect title="How would you like to collaborate?" subtitle="There's no wrong answer — just intention." options={COLLAB} value={f.collaboration_style} onChange={(v) => update({ collaboration_style: v })} />
            )}
            {step === 6 && (
              <CardSelect title="What's your budget range?" subtitle="We use ranges to respect creative time." options={BUDGETS} value={f.budget_range} onChange={(v) => update({ budget_range: v })} />
            )}
            {step === 7 && (
              <CardSelect title="What's your timeline?" subtitle="The more flexible, the more curated the match." options={TIMELINES} value={f.timeline} onChange={(v) => update({ timeline: v })} />
            )}
            {step === 8 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-heading text-3xl text-primary-foreground">Creative protection preferences</h2>
                  <p className="text-primary-foreground/60 font-body mt-3">These define the foundation of every collaboration.</p>
                </div>
                <div className="space-y-3">
                  <Label className="text-secondary text-xs tracking-widest uppercase">Ownership</Label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {OWNERSHIP.map((o) => <ChoiceCard key={o} label={o} active={f.ownership_preference === o} onClick={() => update({ ownership_preference: o })} />)}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-secondary text-xs tracking-widest uppercase">AI usage</Label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {AI_PREF.map((o) => <ChoiceCard key={o} label={o} active={f.ai_preference === o} onClick={() => update({ ai_preference: o })} />)}
                  </div>
                </div>
              </div>
            )}
            {step === 9 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl text-primary-foreground">Where can we reach you?</h2>
                  <p className="text-primary-foreground/60 font-body mt-3">Only Astragard sees this. Never shared without your permission.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Full name</Label><Input value={f.contact_name} onChange={(e) => update({ contact_name: e.target.value })} className="bg-background/40 mt-2" /></div>
                  <div><Label>Company</Label><Input value={f.contact_company} onChange={(e) => update({ contact_company: e.target.value })} className="bg-background/40 mt-2" /></div>
                  <div><Label>Email</Label><Input type="email" value={f.contact_email} onChange={(e) => update({ contact_email: e.target.value })} className="bg-background/40 mt-2" /></div>
                  <div><Label>Phone</Label><Input value={f.contact_phone} onChange={(e) => update({ contact_phone: e.target.value })} className="bg-background/40 mt-2" /></div>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-astragard-charcoal/30">
              <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              {step < TOTAL_STEPS ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue()} className="gradient-bg text-primary-foreground">
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canContinue() || submitting} className="gradient-bg text-primary-foreground">
                  {submitting ? "Submitting…" : "Submit Challenge"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

function CardSelect({ title, subtitle, options, value, onChange }: { title: string; subtitle: string; options: string[]; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl text-primary-foreground">{title}</h2>
        <p className="text-primary-foreground/60 font-body mt-3">{subtitle}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {options.map((o) => <ChoiceCard key={o} label={o} active={value === o} onClick={() => onChange(o)} />)}
      </div>
    </div>
  );
}

function ChoiceCard({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(
      "p-5 rounded-md border text-left transition-all font-ui text-sm",
      active
        ? "border-secondary bg-secondary/10 text-primary-foreground shadow-[0_0_0_1px_hsl(var(--secondary))]"
        : "border-astragard-charcoal/40 text-primary-foreground/70 hover:border-secondary/50 hover:text-primary-foreground"
    )}>
      {label}
    </button>
  );
}
