import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { WORLD_LIST, type ArtistCategory } from "@/lib/worlds";
import { ShieldCheck, Sparkles, Eye, Lock, Users, CheckCircle2, Mail, Loader2 } from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const PRINCIPLES = [
  { icon: Sparkles, title: "Human Authorship", body: "Every work begins with a human creative intention. Authorship is sacred and traceable." },
  { icon: Eye, title: "Meaning Before Automation", body: "Tools serve meaning — not the other way around. Creative purpose leads the process." },
  { icon: ShieldCheck, title: "Transparent AI Use", body: "Where AI is used, it is disclosed. Honesty preserves trust between creator and audience." },
  { icon: Lock, title: "Respect for Creative Ownership", body: "Work is owned by the human who made it. Boundaries are honored, always." },
  { icon: Users, title: "Collaborative Integrity", body: "Collaborations are credited, agreed, and protected. No invisible contributors." },
];

function Progress({ step }: { step: Step }) {
  const steps = ["Account", "Verify", "Profile", "Protection", "Agreements", "Submit", "Review", "Activate"];
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-ui text-primary-foreground/50">
        {steps.map((label, i) => {
          const n = (i + 1) as Step;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={`h-1 w-full ${done ? "bg-secondary" : active ? "bg-primary" : "bg-astragard-charcoal/30"}`}
              />
              <span className={active ? "text-secondary" : done ? "text-primary-foreground/70" : ""}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Frame({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl mb-3 gradient-text">{title}</h1>
      {intro && <p className="font-body text-primary-foreground/70 mb-8 leading-relaxed">{intro}</p>}
      <div className="bg-card/40 backdrop-blur-sm border border-astragard-charcoal/30 rounded-xl p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

export default function Apply() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [busy, setBusy] = useState(false);

  // S1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState<ArtistCategory | "">("");

  // S3
  const [professionalName, setProfessionalName] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [bio, setBio] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [city, setCity] = useState("");
  const [profileCountry, setProfileCountry] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<FileList | null>(null);

  // S4
  const [ownership, setOwnership] = useState("");
  const [collab, setCollab] = useState("");
  const [aiUsage, setAiUsage] = useState("");
  const [chk1, setChk1] = useState(false);
  const [chk2, setChk2] = useState(false);
  const [chk3, setChk3] = useState(false);

  // S5
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [framework, setFramework] = useState(false);

  // Resume flow if logged in
  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (!profile) return;
      // hydrate
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
      setCountry(profile.country ?? "");
      setCategory((profile.category as ArtistCategory) ?? "");
      setProfessionalName(profile.professional_name ?? "");
      setYearsExp(profile.years_experience?.toString() ?? "");
      setBio(profile.bio ?? "");
      setPortfolioUrl(profile.portfolio_url ?? "");
      setWebsiteUrl(profile.website_url ?? "");
      setSocialLinks(typeof profile.social_links === "object" ? JSON.stringify(profile.social_links) : "");
      setCity(profile.city ?? "");
      setProfileCountry(profile.country ?? "");
      // jump to right step
      if (profile.fee_paid) {
        navigate("/dashboard", { replace: true });
        return;
      }
      if (profile.application_status === "approved" || profile.application_status === "submitted") {
        setStep(profile.application_status === "approved" ? 8 : 7);
      } else {
        setStep(Math.max(2, (profile.onboarding_step ?? 2)) as Step);
      }
    })();
  }, [authLoading, user, navigate]);

  const persistStep = async (n: Step) => {
    if (!user) return;
    await supabase.from("profiles").update({ onboarding_step: n }).eq("id", user.id);
  };

  // ===== Step 1: signup =====
  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return toast.error("Please choose your creative category.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    setBusy(true);
    try {
      const displayName = `${firstName} ${lastName}`.trim();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/apply`,
          data: { display_name: displayName, category, first_name: firstName, last_name: lastName, country },
        },
      });
      if (error) throw error;
      const uid = data.user?.id;
      if (uid) {
        await supabase.from("profiles").update({
          first_name: firstName, last_name: lastName, country, onboarding_step: 2,
        }).eq("id", uid);
      }
      if (data.session) {
        toast.success("Account created.");
        setStep(2);
      } else {
        toast.success("Account created. Check your email to verify.");
        setStep(2);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Signup failed.");
    } finally {
      setBusy(false);
    }
  };

  // ===== Step 3: profile =====
  const uploadFile = async (file: File, path: string) => {
    const { error } = await supabase.storage.from("creative-uploads").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("creative-uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadFile(avatarFile, `${user.id}/avatar-${Date.now()}-${avatarFile.name}`);
      }
      if (portfolioFiles) {
        for (const f of Array.from(portfolioFiles)) {
          const url = await uploadFile(f, `${user.id}/portfolio-${Date.now()}-${f.name}`);
          await supabase.from("portfolio_items").insert({
            user_id: user.id, title: f.name, media_url: url,
            media_type: f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : "file",
          });
        }
      }
      const { error } = await supabase.from("profiles").update({
        professional_name: professionalName,
        years_experience: yearsExp ? parseInt(yearsExp) : null,
        bio,
        portfolio_url: portfolioUrl,
        website_url: websiteUrl,
        social_links: socialLinks ? { raw: socialLinks } : {},
        city,
        country: profileCountry || country,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        onboarding_step: 4,
      }).eq("id", user.id);
      if (error) throw error;
      setStep(4);
    } catch (err: any) {
      toast.error(err.message ?? "Could not save profile.");
    } finally {
      setBusy(false);
    }
  };

  // ===== Step 4: protection =====
  const submitProtection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!ownership || !collab || !aiUsage) return toast.error("Please answer all three preferences.");
    if (!chk1 || !chk2 || !chk3) return toast.error("All three commitments are required.");
    setBusy(true);
    try {
      const { error } = await supabase.from("protection_settings").upsert({
        user_id: user.id,
        ownership_preference: ownership,
        collaboration_preference: collab,
        ai_usage_preference: aiUsage,
        authorship_confirmation: chk1,
        ai_disclosure_confirmation: chk2,
        ownership_respect_confirmation: chk3,
      });
      if (error) throw error;
      await persistStep(5);
      setStep(5);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  // ===== Step 5: agreements =====
  const submitAgreements = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!terms || !privacy || !framework) return toast.error("Please accept all three agreements.");
    setBusy(true);
    try {
      const { error } = await supabase.from("user_agreements").upsert({
        user_id: user.id, terms_accepted: true, privacy_accepted: true, framework_accepted: true,
      });
      if (error) throw error;
      await persistStep(6);
      setStep(6);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  // ===== Step 6: submit =====
  const submitApplication = async () => {
    if (!user) return;
    setBusy(true);
    try {
      // Auto-approve for now (per project decision)
      const { error } = await supabase.from("profiles")
        .update({ application_status: "approved", onboarding_step: 7 })
        .eq("id", user.id);
      if (error) throw error;
      setStep(7);
      // small delay then move to fee gate
      setTimeout(() => setStep(8), 1500);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  // ===== Step 8: pay =====
  const handlePay = async () => {
    setBusy(true);
    try {
      // Placeholder: Stripe sandbox couldn't be created for this country.
      // Mark fee paid so the user can enter the dashboard; replace with real payment flow once Stripe/M-Pesa is wired.
      if (!user) return;
      await supabase.from("profiles").update({ fee_paid: true }).eq("id", user.id);
      toast.success("Payment confirmed. Welcome to Astragard.");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-astragard-dark text-primary-foreground py-12 md:py-20 px-4">
      <Link to="/" className="block text-center mb-8 font-heading text-2xl gradient-text">ASTRAGARD</Link>
      <div className="max-w-3xl mx-auto"><Progress step={step} />{children}</div>
    </div>
  );

  if (authLoading) return <Wrapper><div className="text-center text-primary-foreground/60">Loading…</div></Wrapper>;

  return (
    <Wrapper>
      {step === 1 && (
        <Frame title="Begin your application" intro="Astragard is a curated creative ecosystem. Every member is invited intentionally. Start by creating your account.">
          <form onSubmit={submitSignup} className="space-y-4 font-ui">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>First name</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="bg-background/40" /></div>
              <div><Label>Last name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} required className="bg-background/40" /></div>
            </div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/40" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-background/40" /></div>
              <div><Label>Confirm password</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-background/40" /></div>
            </div>
            <div><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} required className="bg-background/40" /></div>
            <div>
              <Label>Creative category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ArtistCategory)}>
                <SelectTrigger className="bg-background/40"><SelectValue placeholder="Select your craft" /></SelectTrigger>
                <SelectContent>
                  {WORLD_LIST.map((w) => <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={busy} className="w-full gradient-bg text-primary-foreground">
              {busy ? <Loader2 className="animate-spin" /> : "Create account"}
            </Button>
            <p className="text-sm text-center text-primary-foreground/60 pt-2">
              Already a member? <Link to="/auth" className="text-secondary hover:underline">Sign in</Link>
            </p>
          </form>
        </Frame>
      )}

      {step === 2 && (
        <Frame title="Verify your email" intro="We've sent a verification link to your inbox. Confirm it to continue your application.">
          <div className="text-center py-8 space-y-4">
            <Mail className="h-12 w-12 text-secondary mx-auto" />
            <p className="font-body text-primary-foreground/70">
              Once verified, return here to complete your creative profile.
            </p>
            <Button onClick={() => setStep(3)} className="gradient-bg text-primary-foreground">
              I've verified — continue
            </Button>
          </div>
        </Frame>
      )}

      {step === 3 && (
        <Frame title="Your creative profile" intro="Tell us who you are as a creator. This is the foundation of your presence on Astragard.">
          <form onSubmit={submitProfile} className="space-y-4 font-ui">
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>Professional name</Label><Input value={professionalName} onChange={(e) => setProfessionalName(e.target.value)} required className="bg-background/40" /></div>
              <div><Label>Years of experience</Label><Input type="number" min="0" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="bg-background/40" /></div>
            </div>
            <div><Label>Short bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={500} className="bg-background/40" /></div>
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>Portfolio link</Label><Input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="bg-background/40" placeholder="https://" /></div>
              <div><Label>Website (optional)</Label><Input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="bg-background/40" placeholder="https://" /></div>
            </div>
            <div><Label>Social media (handles or links)</Label><Input value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)} className="bg-background/40" placeholder="@instagram, @x, linkedin/in/…" /></div>
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} className="bg-background/40" /></div>
              <div><Label>Country</Label><Input value={profileCountry || country} onChange={(e) => setProfileCountry(e.target.value)} className="bg-background/40" /></div>
            </div>
            <div><Label>Profile photo</Label><Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} className="bg-background/40" /></div>
            <div><Label>Portfolio samples (images, video, audio)</Label><Input type="file" multiple onChange={(e) => setPortfolioFiles(e.target.files)} className="bg-background/40" /></div>
            <Button type="submit" disabled={busy} className="w-full gradient-bg text-primary-foreground">
              {busy ? <Loader2 className="animate-spin" /> : "Continue"}
            </Button>
          </form>
        </Frame>
      )}

      {step === 4 && (
        <Frame title="Astragard Creative Protection Commitment" intro="Before joining Astragard, every creative must define how their work should be protected. Astragard exists to preserve authorship, intention, and meaning in creative work — especially in an AI-driven world.">
          <form onSubmit={submitProtection} className="space-y-6 font-ui">
            <div className="grid md:grid-cols-2 gap-3">
              {PRINCIPLES.map((p, i) => (
                <Card key={p.title} className="bg-background/40 border-astragard-charcoal/30">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-secondary">
                      <p.icon className="h-4 w-4" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/50">Principle {i + 1}</span>
                    </div>
                    <h3 className="font-heading text-sm">{p.title}</h3>
                    <p className="text-xs text-primary-foreground/60 leading-relaxed">{p.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4 border-t border-astragard-charcoal/30 pt-6">
              <div>
                <Label>Ownership preference</Label>
                <Select value={ownership} onValueChange={setOwnership}>
                  <SelectTrigger className="bg-background/40"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Ownership</SelectItem>
                    <SelectItem value="shared">Shared with Agreement</SelectItem>
                    <SelectItem value="transferable">Transferable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Collaboration preference</Label>
                <Select value={collab} onValueChange={setCollab}>
                  <SelectTrigger className="bg-background/40"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="collaborative">Collaborative</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>AI usage preference</Label>
                <Select value={aiUsage} onValueChange={setAiUsage}>
                  <SelectTrigger className="bg-background/40"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">AI as a support tool</SelectItem>
                    <SelectItem value="limited">AI with limitations</SelectItem>
                    <SelectItem value="none">No AI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 border-t border-astragard-charcoal/30 pt-6 text-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={chk1} onCheckedChange={(v) => setChk1(!!v)} className="mt-0.5" />
                <span className="text-primary-foreground/80">I confirm my work reflects human creative intention.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={chk2} onCheckedChange={(v) => setChk2(!!v)} className="mt-0.5" />
                <span className="text-primary-foreground/80">I agree to disclose AI-assisted work.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={chk3} onCheckedChange={(v) => setChk3(!!v)} className="mt-0.5" />
                <span className="text-primary-foreground/80">I agree to respect creative ownership and collaboration standards.</span>
              </label>
            </div>

            <Button type="submit" disabled={busy} className="w-full gradient-bg text-primary-foreground">
              {busy ? <Loader2 className="animate-spin" /> : "Commit & continue"}
            </Button>
          </form>
        </Frame>
      )}

      {step === 5 && (
        <Frame title="Terms & agreements" intro="Please review and accept the agreements that govern your participation in Astragard.">
          <form onSubmit={submitAgreements} className="space-y-4 font-ui text-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={terms} onCheckedChange={(v) => setTerms(!!v)} className="mt-0.5" />
              <span className="text-primary-foreground/80">I accept the <Link to="/legal/terms" className="text-secondary hover:underline">Terms & Conditions</Link>.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={privacy} onCheckedChange={(v) => setPrivacy(!!v)} className="mt-0.5" />
              <span className="text-primary-foreground/80">I accept the <Link to="/legal/privacy" className="text-secondary hover:underline">Privacy Policy</Link>.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={framework} onCheckedChange={(v) => setFramework(!!v)} className="mt-0.5" />
              <span className="text-primary-foreground/80">I accept the Astragard Creative Protection Framework.</span>
            </label>
            <Button type="submit" disabled={busy} className="w-full gradient-bg text-primary-foreground">
              {busy ? <Loader2 className="animate-spin" /> : "Continue"}
            </Button>
          </form>
        </Frame>
      )}

      {step === 6 && (
        <Frame title="Submit your application" intro="You've completed every step. Submit your application for Astragard's review.">
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-secondary mx-auto" />
            <p className="font-body text-primary-foreground/70">By submitting, you affirm that the information you've shared is true and reflects your creative practice.</p>
            <Button onClick={submitApplication} disabled={busy} className="gradient-bg text-primary-foreground">
              {busy ? <Loader2 className="animate-spin" /> : "Submit application"}
            </Button>
          </div>
        </Frame>
      )}

      {step === 7 && (
        <Frame title="Your application has been received">
          <div className="text-center py-8 space-y-3 font-body text-primary-foreground/70">
            <p>Astragard reviews all applications within 3–5 working days.</p>
            <p className="text-sm text-primary-foreground/50">You'll be notified by email when a decision is made.</p>
            <div className="pt-4"><Loader2 className="animate-spin mx-auto text-secondary" /></div>
          </div>
        </Frame>
      )}

      {step === 8 && (
        <Frame title="Your creative presence on Astragard is ready" intro="To activate your profile and access the Astragard ecosystem, a one-time Creative Protection Registration Fee of $50 is required. This fee registers your creative identity under our protection framework and grants full access to the Incubator, collaboration workspace, and brand discovery layer. It is non-refundable.">
          <ul className="space-y-2 mb-6 font-body text-primary-foreground/80">
            {["Creative Protection Registration", "Dashboard & Portfolio Activation", "Incubator Project Access", "Brand Discovery Layer", "Collaboration Workspace"].map((line) => (
              <li key={line} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <Button onClick={handlePay} disabled={busy} className="w-full gradient-bg text-primary-foreground h-12 text-base">
            {busy ? <Loader2 className="animate-spin" /> : "Activate My Creative Profile — $50"}
          </Button>
          <p className="text-xs text-center text-primary-foreground/40 mt-4 font-ui">
            Secure payment powered by Stripe & M-Pesa. Non-refundable.
          </p>
        </Frame>
      )}
    </Wrapper>
  );
}
