import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { WORLDS, type ArtistCategory } from "@/lib/worlds";
import { ShieldCheck, BadgeCheck, Sparkles, ArrowRight, MapPin } from "lucide-react";

interface Listing {
  id: string;
  user_id: string;
  title: string;
  one_liner: string;
  intent: string;
  media_url: string | null;
  use_cases: string[];
  engagement_options: string[];
  pricing_style: string;
  pricing_display: string;
}
interface Profile {
  id: string;
  professional_name: string | null;
  display_name: string;
  category: ArtistCategory | null;
  authorship_mode: string;
  verified: boolean;
  bio: string | null;
  city: string | null;
  country: string | null;
  years_experience: number | null;
}

const AUTH_LABEL: Record<string, string> = {
  human: "Human", ai_assisted: "AI-Assisted", hybrid: "Hybrid",
};

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [creator, setCreator] = useState<Profile | null>(null);
  const [related, setRelated] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data: l } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
      const lst = l as Listing | null;
      setListing(lst);
      if (lst) {
        const { data: p } = await supabase.from("profiles")
          .select("id, professional_name, display_name, category, authorship_mode, verified, bio, city, country, years_experience")
          .eq("id", lst.user_id).maybeSingle();
        setCreator(p as Profile | null);
        const { data: rel } = await supabase.from("listings").select("*")
          .eq("user_id", lst.user_id).neq("id", lst.id).eq("status", "active").limit(4);
        setRelated((rel as Listing[]) ?? []);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Layout><div className="pt-32 container mx-auto px-4 text-primary-foreground/50 font-body">Loading…</div></Layout>;
  if (!listing) return <Layout><div className="pt-32 container mx-auto px-4 text-primary-foreground font-heading text-2xl">Work not found.</div></Layout>;

  const world = creator?.category ? WORLDS[creator.category] : null;
  const name = creator?.professional_name || creator?.display_name || "Astragard Creator";

  return (
    <Layout>
      {/* HERO */}
      <section className="pt-28 bg-astragard-dark">
        <div className="container mx-auto px-4 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
              {listing.media_url ? (
                <img src={listing.media_url} alt={listing.title}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-[1.02]" />
              ) : (
                <div className="h-full flex items-center justify-center"><Sparkles className="h-12 w-12 text-secondary/30" /></div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center">
            {world && <p className="text-[11px] tracking-widest uppercase text-secondary font-ui">{world.themeName} · Creative World</p>}
            <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground mt-3">{listing.title}</h1>
            <p className="text-primary-foreground/60 font-body mt-2">by {name}{creator?.category && <span className="text-primary-foreground/40"> · {WORLDS[creator.category].label}</span>}</p>
            {listing.one_liner && <p className="font-body italic text-primary-foreground/70 mt-5 text-lg leading-relaxed">"{listing.one_liner}"</p>}
            {creator?.verified && (
              <div className="inline-flex items-center gap-2 mt-5 text-secondary text-sm font-ui">
                <BadgeCheck className="h-4 w-4" /> Verified Human Authorship
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-7">
              <Button className="gradient-bg text-primary-foreground font-ui">Request Collaboration</Button>
              <Button variant="outline" className="border-secondary/50 text-secondary font-ui">Commission Work</Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Intent */}
      <section className="py-20 bg-astragard-dark">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-xs tracking-widest uppercase text-secondary font-ui">Why This Work Exists</p>
          <p className="font-heading text-2xl md:text-3xl text-primary-foreground mt-3 leading-relaxed">
            {listing.intent || "The creator has not yet shared the story behind this work."}
          </p>
        </div>
      </section>

      {/* SECTION 3 — Creative Breakdown */}
      <section className="py-12 bg-astragard-dark border-t border-astragard-charcoal/15">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-heading text-2xl text-primary-foreground mb-6">Creative Breakdown</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { l: "Format", v: world?.label ?? "—" },
              { l: "Style / Tone", v: listing.pricing_style ? "Defined by creator" : "—" },
              { l: "Tools", v: "Disclosed by creator" },
            ].map((b) => (
              <div key={b.l} className="border border-astragard-charcoal/20 rounded-md p-5">
                <p className="text-[10px] tracking-widest uppercase text-secondary/70 font-ui">{b.l}</p>
                <p className="font-body text-primary-foreground mt-1">{b.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Protection */}
      <section className="py-16 bg-astragard-dark border-t border-astragard-charcoal/15">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-5">
            <ShieldCheck className="h-5 w-5 text-secondary" />
            <h2 className="font-heading text-2xl text-primary-foreground">Creative Protection & Authorship</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-secondary/40 text-secondary">Authorship: {AUTH_LABEL[creator?.authorship_mode ?? "human"] ?? "Human"}</Badge>
            <Badge variant="outline" className="border-secondary/40 text-secondary">AI Usage: {creator?.authorship_mode === "human" ? "None" : "Declared"}</Badge>
            <Badge variant="outline" className="border-secondary/40 text-secondary">Ownership: Creator Retained</Badge>
            <Badge variant="outline" className="border-secondary/40 text-secondary">Collaboration: {listing.engagement_options.includes("Request Collaboration") ? "Open" : "Project-Based"}</Badge>
          </div>
          <p className="text-primary-foreground/55 font-body italic text-sm mt-5">
            This work is governed under the Astragard Creative Protection Framework.
          </p>
        </div>
      </section>

      {/* SECTION 5 — Use Cases */}
      {listing.use_cases.length > 0 && (
        <section className="py-12 bg-astragard-dark border-t border-astragard-charcoal/15">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-heading text-2xl text-primary-foreground mb-5">Where This Work Performs Best</h2>
            <div className="flex flex-wrap gap-2">
              {listing.use_cases.map((u) => (
                <span key={u} className="px-4 py-2 rounded-full border border-secondary/30 text-sm text-primary-foreground/80 font-ui">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6 — Engagement */}
      <section className="py-16 bg-astragard-dark border-t border-astragard-charcoal/15">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-heading text-2xl text-primary-foreground mb-6">Work With This Creator</h2>
          <div className="flex flex-wrap gap-3">
            <Button className="gradient-bg text-primary-foreground font-ui">Request Collaboration</Button>
            <Button variant="outline" className="border-astragard-charcoal/40 text-primary-foreground/80 font-ui">Commission Custom Work</Button>
            <Button variant="outline" className="border-astragard-charcoal/40 text-primary-foreground/80 font-ui">License This Work</Button>
            <Button variant="outline" className="border-secondary/40 text-secondary font-ui">Submit to Incubator</Button>
          </div>
          {listing.pricing_display && (
            <p className="text-primary-foreground/40 font-body text-sm mt-6">{listing.pricing_display}</p>
          )}
        </div>
      </section>

      {/* SECTION 7 — Creator preview */}
      <section className="py-16 bg-astragard-dark border-t border-astragard-charcoal/15">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-xs tracking-widest uppercase text-secondary font-ui mb-3">About the Creator</p>
          <h3 className="font-heading text-2xl text-primary-foreground">{name}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/50 font-body mt-2">
            {(creator?.city || creator?.country) && (
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {[creator?.city, creator?.country].filter(Boolean).join(", ")}</span>
            )}
            {creator?.years_experience != null && <span>{creator.years_experience}+ years experience</span>}
          </div>
          {creator?.bio && <p className="font-body text-primary-foreground/70 mt-4 max-w-2xl">{creator.bio}</p>}
          <Button variant="outline" className="mt-6 border-secondary/40 text-secondary font-ui">View Full Profile</Button>
        </div>
      </section>

      {/* SECTION 8 — Related */}
      {related.length > 0 && (
        <section className="py-16 bg-astragard-dark border-t border-astragard-charcoal/15">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl text-primary-foreground mb-6">More from this creator</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <Link key={r.id} to={`/marketplace/${r.id}`} className="block group border border-astragard-charcoal/20 rounded-lg overflow-hidden hover:border-secondary/40 transition-all">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10">
                    {r.media_url && <img src={r.media_url} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading text-base text-primary-foreground">{r.title}</h4>
                    {r.one_liner && <p className="text-xs text-primary-foreground/50 italic font-body mt-1 line-clamp-2">{r.one_liner}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 9 — Final CTA */}
      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/15 text-center">
        <h2 className="font-heading text-3xl text-primary-foreground">Have a project in mind?</h2>
        <Link to="/contact" className="inline-block mt-6">
          <Button size="lg" className="gradient-bg text-primary-foreground font-ui">
            Start a Conversation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </Layout>
  );
}
