import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { WORLDS, type ArtistCategory } from "@/lib/worlds";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Profile {
  id: string;
  display_name: string;
  category: ArtistCategory | null;
  bio: string | null;
  avatar_url: string | null;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError("We couldn't load your profile. Please try again.");
          toast.error(error.message);
        } else if (!data) {
          setError("Your profile is still being prepared. Please sign out and sign in again.");
          toast.error("Profile not found. Please sign in again.");
        }
        setProfile(data as Profile | null);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (profile?.category) {
      document.title = `${WORLDS[profile.category].themeName} — Astragard`;
    } else {
      document.title = "Your World — Astragard";
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-astragard-dark text-primary-foreground/60 flex items-center justify-center font-ui">
        Loading your dashboard…
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out of Astragard.");
    navigate("/", { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-astragard-dark text-primary-foreground flex items-center justify-center px-4 font-ui">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-heading text-2xl">Dashboard unavailable</h1>
          <p className="text-primary-foreground/60 font-body">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()} className="gradient-bg text-primary-foreground">Try again</Button>
            <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell
      profile={profile}
      onSignOut={handleSignOut}
      onProfileUpdate={(p) => setProfile(p)}
    />
  );
}
