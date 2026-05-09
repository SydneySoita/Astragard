import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { document.title = "Sign in to Astragard"; }, []);

  useEffect(() => {
    if (loading || !user) return;
    (async () => {
      const { data: profile } = await supabase.from("profiles").select("fee_paid, application_status").eq("id", user.id).maybeSingle();
      if (profile?.fee_paid) navigate("/dashboard", { replace: true });
      else navigate("/apply", { replace: true });
    })();
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back.");
    } catch (err: any) {
      const message = err.message === "Email not confirmed"
        ? "Please confirm your email before signing in."
        : err.message ?? "Authentication failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-astragard-dark text-primary-foreground flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 font-heading text-2xl gradient-text">ASTRAGARD</Link>
        <div className="bg-card/40 backdrop-blur-sm border border-astragard-charcoal/30 rounded-xl p-8">
          <h1 className="font-heading text-2xl mb-2 text-center">Welcome back</h1>
          <p className="text-sm text-primary-foreground/60 text-center mb-6 font-body">
            Your work, your voice, your authorship — protected.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 font-ui">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/40" />
            </div>
            <div>
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background/40" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full gradient-bg text-primary-foreground">
              {submitting ? "…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-center text-primary-foreground/60 font-ui">
            New to Astragard?{" "}
            <Link to="/apply" className="text-secondary hover:underline">Begin your application</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
