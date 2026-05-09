import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { WORLDS, type ArtistCategory } from "@/lib/worlds";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingRow {
  id: string;
  user_id: string;
  title: string;
  one_liner: string;
  intent: string;
  media_url: string | null;
  use_cases: string[];
  engagement_options: string[];
  pricing_display: string;
  pricing_style: string;
}
interface ProfileRow {
  id: string;
  professional_name: string | null;
  display_name: string;
  category: ArtistCategory | null;
  authorship_mode: string;
  verified: boolean;
  city: string | null;
  country: string | null;
}

const TABS = [
  { id: "explore", label: "Explore Work" },
  { id: "field", label: "By Creative Field" },
  { id: "intent", label: "By Intent" },
  { id: "use", label: "By Use Case" },
  { id: "collab", label: "By Collaboration Type" },
] as const;

const FIELDS: { id: ArtistCategory; label: string }[] = [
  { id: "voiceover", label: "Voiceover Artists" },
  { id: "authors", label: "Writers & Authors" },
  { id: "visual", label: "Visual / Motion Creators" },
  { id: "product", label: "Designers" },
  { id: "musicians", label: "Musicians" },
  { id: "fashion", label: "Fashion Designers" },
  { id: "science", label: "Research & Discovery" },
];
const INTENTS = ["Storytelling", "Commercial", "Cultural", "Experimental", "Educational"];
const USE_CASES = ["Brand Campaign", "Film/Media", "Product", "Voice Work", "Spatial Design", "Digital"];
const COLLABS = ["Request Collaboration", "Commission Work", "License This Work", "Submit to Incubator"];
const AUTHORSHIPS = [
  { id: "human", label: "Human Created" },
  { id: "ai_assisted", label: "AI-Assisted" },
  { id: "hybrid", label: "Hybrid" },
];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-astragard-charcoal/20 pb-5">
      <h4 className="text-xs uppercase tracking-widest font-ui text-secondary/80 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({
  checked, onChange, label,
}: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm font-body text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

export default function Marketplace() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("explore");
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileRow>>({});
  const [loading, setLoading] = useState(true);

  const [fField, setFField] = useState<ArtistCategory[]>([]);
  const [fIntent, setFIntent] = useState<string[]>([]);
  const [fUse, setFUse] = useState<string[]>([]);
  const [fCollab, setFCollab] = useState<string[]>([]);
  const [fAuthor, setFAuthor] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: ls } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      const rows = (ls as ListingRow[]) ?? [];
      setListings(rows);
      const ids = Array.from(new Set(rows.map((r) => r.user_id)));
      if (ids.length) {
        const { data: ps } = await supabase
          .from("profiles")
          .select("id, professional_name, display_name, category, authorship_mode, verified, city, country")
          .in("id", ids);
        const map: Record<string, ProfileRow> = {};
        (ps as ProfileRow[] | null)?.forEach((p) => (map[p.id] = p));
        setProfiles(map);
      }
      setLoading(false);
    })();
  }, []);

  const toggle = <T,>(arr: T[], v: T, set: (v: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const p = profiles[l.user_id];
      if (fField.length && (!p?.category || !fField.includes(p.category))) return false;
      if (fIntent.length && !fIntent.some((i) => (l.intent || "").toLowerCase().includes(i.toLowerCase()))) return false;
      if (fUse.length && !fUse.some((u) => l.use_cases.includes(u))) return false;
      if (fCollab.length && !fCollab.some((c) => l.engagement_options.includes(c))) return false;
      if (fAuthor.length && (!p || !fAuthor.includes(p.authorship_mode))) return false;
      return true;
    });
  }, [listings, profiles, fField, fIntent, fUse, fCollab, fAuthor]);

  return (
    <Layout>
      <section className="pt-32 pb-10 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <p className="text-secondary font-ui text-sm tracking-widest uppercase mb-4">The Creative Value Layer</p>
          <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">
            A Curated <span className="gradient-text">Gallery</span> of Living Work
          </h1>
          <p className="mt-6 text-primary-foreground/60 font-body">
            Discover creators by intent, context and craft — never by price first. Every piece carries its own protection terms.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-astragard-dark border-y border-astragard-charcoal/15">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center py-4">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "text-sm font-ui tracking-wide pb-1 border-b-2 transition-colors",
                  tab === t.id
                    ? "text-secondary border-secondary"
                    : "text-primary-foreground/50 border-transparent hover:text-primary-foreground/80"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-astragard-dark">
        <div className="container mx-auto px-4 grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Filters */}
          <aside className="space-y-6">
            <FilterGroup title="Creative Field">
              {FIELDS.map((f) => (
                <CheckRow key={f.id} label={f.label} checked={fField.includes(f.id)}
                  onChange={() => toggle(fField, f.id, setFField)} />
              ))}
            </FilterGroup>
            <FilterGroup title="Intent">
              {INTENTS.map((i) => (
                <CheckRow key={i} label={i} checked={fIntent.includes(i)}
                  onChange={() => toggle(fIntent, i, setFIntent)} />
              ))}
            </FilterGroup>
            <FilterGroup title="Use Case">
              {USE_CASES.map((u) => (
                <CheckRow key={u} label={u} checked={fUse.includes(u)}
                  onChange={() => toggle(fUse, u, setFUse)} />
              ))}
            </FilterGroup>
            <FilterGroup title="Collaboration">
              {COLLABS.map((c) => (
                <CheckRow key={c} label={c} checked={fCollab.includes(c)}
                  onChange={() => toggle(fCollab, c, setFCollab)} />
              ))}
            </FilterGroup>
            <FilterGroup title="Authorship">
              {AUTHORSHIPS.map((a) => (
                <CheckRow key={a.id} label={a.label} checked={fAuthor.includes(a.id)}
                  onChange={() => toggle(fAuthor, a.id, setFAuthor)} />
              ))}
            </FilterGroup>
          </aside>

          {/* Gallery */}
          <div>
            {loading ? (
              <p className="text-primary-foreground/40 font-body text-sm">Loading the gallery…</p>
            ) : filtered.length === 0 ? (
              <div className="border border-dashed border-astragard-charcoal/30 rounded-lg p-16 text-center">
                <Sparkles className="h-8 w-8 text-secondary/50 mx-auto mb-3" />
                <p className="font-heading text-xl text-primary-foreground">The gallery is being curated.</p>
                <p className="text-primary-foreground/50 font-body text-sm mt-2">
                  No work matches these filters yet. Adjust the filters or check back soon.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {filtered.map((l) => {
                  const p = profiles[l.user_id];
                  const world = p?.category ? WORLDS[p.category] : null;
                  const name = p?.professional_name || p?.display_name || "Astragard Creator";
                  return (
                    <Link
                      key={l.id}
                      to={`/marketplace/${l.id}`}
                      className="group block border border-astragard-charcoal/20 rounded-lg overflow-hidden hover:border-secondary/40 transition-all bg-astragard-dark/40"
                    >
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                        {l.media_url ? (
                          <img src={l.media_url} alt={l.title} loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Sparkles className="h-10 w-10 text-secondary/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        {world && (
                          <p className="text-[11px] tracking-widest uppercase text-secondary/70 font-ui mb-1">
                            {world.label}
                          </p>
                        )}
                        <h3 className="font-heading text-xl text-primary-foreground">{l.title}</h3>
                        {l.one_liner && (
                          <p className="text-sm text-primary-foreground/55 italic font-body mt-1 line-clamp-2">
                            {l.one_liner}
                          </p>
                        )}
                        <p className="text-xs text-primary-foreground/40 font-ui mt-3">
                          by {name}
                          {p?.verified && <span className="text-secondary"> ✓</span>}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {l.use_cases.slice(0, 3).map((u) => (
                            <Badge key={u} variant="outline" className="text-[10px] border-astragard-charcoal/40 text-primary-foreground/60">{u}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 mt-4 text-[11px] text-secondary/80 font-body italic">
                          <ShieldCheck className="h-3 w-3" /> Protected under Astragard Framework
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/10 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl text-primary-foreground">Have a project in mind?</h2>
          <p className="text-primary-foreground/50 font-body mt-3 max-w-xl mx-auto">
            Start a conversation with a creator, or invite the Astragard team to curate a shortlist for your brief.
          </p>
          <Link to="/contact" className="inline-block mt-6">
            <Button size="lg" className="gradient-bg text-primary-foreground font-ui">
              Start a Conversation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
