import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { WORLD_LIST, type ArtistCategory } from "@/lib/worlds";

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState<ArtistCategory | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = mode === "signup" ? "Join Astragard" : "Sign in to Astragard";
  }, [mode]);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        if (!category) {
          toast.error("Please choose your creative world.");
          setSubmitting(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: displayName.trim(), category },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created. Entering your world…");
          navigate("/dashboard", { replace: true });
        } else {
          toast.success("Account created. Please confirm your email, then sign in to enter your world.");
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back. Entering your world…");
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      const message = err.message === "Email not confirmed"
        ? "Please confirm your email before signing in."
        : err.message ?? "Authentication failed. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-astragard-dark text-primary-foreground flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 font-heading text-2xl gradient-text">
          ASTRAGARD
        </Link>
        <div className="bg-card/40 backdrop-blur-sm border border-astragard-charcoal/30 rounded-xl p-8">
          <h1 className="font-heading text-2xl mb-2 text-center">
            {mode === "signup" ? "Enter your world" : "Welcome back"}
          </h1>
          <p className="text-sm text-primary-foreground/60 text-center mb-6 font-body">
            {mode === "signup"
              ? "Choose your craft. Step into your creative space."
              : "Your work, your voice, your authorship — protected."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 font-ui">
            {mode === "signup" && (
              <>
                <div>
                  <Label htmlFor="name">Display name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="bg-background/40" />
                </div>
                <div>
                  <Label htmlFor="cat">Your creative world</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as ArtistCategory)}>
                    <SelectTrigger id="cat" className="bg-background/40">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORLD_LIST.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/40" />
            </div>
            <div>
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-background/40" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full gradient-bg text-primary-foreground">
              {submitting ? "…" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-primary-foreground/60 font-ui">
            {mode === "signup" ? "Already part of Astragard?" : "New to Astragard?"}{" "}
            <button
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-secondary hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
