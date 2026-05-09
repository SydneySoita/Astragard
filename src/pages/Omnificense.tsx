import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useOmnificenceAccess } from "@/hooks/useOmnificenceAccess";
import { Lock, ArrowRight, Sparkles, Mic2, BarChart3, Film, Globe2 } from "lucide-react";

type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  cover_image_url: string;
  teaser: string;
  tier: string;
  content_type: string;
  tags: string[];
  published_at: string | null;
};

const TYPE_META: Record<string, { label: string; icon: any }> = {
  case_study: { label: "Case Study", icon: Sparkles },
  interview: { label: "Interview", icon: Mic2 },
  trend_report: { label: "Trend Report", icon: BarChart3 },
  behind_scenes: { label: "Behind the Scenes", icon: Film },
  culture: { label: "Culture", icon: Globe2 },
};

export default function Omnificense() {
  const { hasAccess, user } = useOmnificenceAccess();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("omnificence_articles")
        .select("id,slug,title,subtitle,cover_image_url,teaser,tier,content_type,tags,published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setArticles(data || []);
    })();
  }, []);

  const filtered = filter === "all" ? articles : articles.filter((a) => a.content_type === filter);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <Layout>
      {/* Editorial masthead */}
      <section className="pt-32 pb-16 bg-astragard-dark relative overflow-hidden border-b border-astragard-charcoal/20">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8 text-xs tracking-[0.3em] uppercase text-primary-foreground/50 font-ui">
            <span>Astragard / Metazine</span>
            <span>Vol. I — Living Archive</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl text-primary-foreground font-bold leading-[0.95]">
            <span className="gradient-text">Omnificense</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/60 font-body leading-relaxed">
            A curated record of African creative evolution. Case studies, interviews,
            behind-the-scenes journeys, and trend reports — selected, never algorithmic.
          </p>
          {!hasAccess && (
            <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5">
              <Lock className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs tracking-wider uppercase text-secondary font-ui">
                Free preview · Subscribe for full access
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="bg-astragard-dark border-b border-astragard-charcoal/10 sticky top-[68px] z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex gap-2 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            ...Object.entries(TYPE_META).map(([id, m]) => ({ id, label: m.label })),
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-ui tracking-wider uppercase whitespace-nowrap transition-all border ${
                filter === t.id
                  ? "bg-secondary/15 text-secondary border-secondary/40"
                  : "text-primary-foreground/50 border-astragard-charcoal/30 hover:text-primary-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="py-16 bg-astragard-dark">
          <div className="container mx-auto px-4 lg:px-8">
            <Link to={`/omnificense/${featured.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 border border-astragard-charcoal/20">
                  {featured.cover_image_url ? (
                    <img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary/40 font-heading text-2xl">Featured</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="border-secondary/40 text-secondary uppercase tracking-wider text-[10px]">
                      {TYPE_META[featured.content_type]?.label || "Editorial"}
                    </Badge>
                    {featured.tier === "paid" && (
                      <span className="text-[10px] uppercase tracking-widest text-secondary/70 font-ui inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Subscribers
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl text-primary-foreground leading-tight group-hover:text-secondary transition-colors">
                    {featured.title}
                  </h2>
                  {featured.subtitle && (
                    <p className="mt-4 text-lg text-primary-foreground/70 font-body italic">{featured.subtitle}</p>
                  )}
                  <p className="mt-6 text-primary-foreground/60 font-body leading-relaxed">{featured.teaser}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-secondary font-ui text-sm">
                    Read the full piece <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Archive */}
      <section className="py-16 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-baseline justify-between mb-10">
            <h3 className="font-heading text-2xl text-primary-foreground">The Archive</h3>
            <span className="text-xs tracking-widest uppercase text-primary-foreground/40 font-ui">
              {rest.length} entries
            </span>
          </div>

          {rest.length === 0 ? (
            <p className="text-primary-foreground/50 font-body italic">More entries are being curated.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((a) => {
                const Icon = TYPE_META[a.content_type]?.icon || Sparkles;
                return (
                  <Link key={a.id} to={`/omnificense/${a.slug}`} className="group">
                    <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-astragard-charcoal/20 mb-4 relative">
                      {a.cover_image_url ? (
                        <img src={a.cover_image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="h-10 w-10 text-secondary/30" />
                        </div>
                      )}
                      {a.tier === "paid" && (
                        <div className="absolute top-3 right-3 bg-astragard-dark/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] uppercase tracking-widest text-secondary font-ui inline-flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-secondary/70 font-ui mb-2">
                      {TYPE_META[a.content_type]?.label}
                    </p>
                    <h4 className="font-heading text-xl text-primary-foreground group-hover:text-secondary transition-colors leading-snug">
                      {a.title}
                    </h4>
                    <p className="mt-2 text-sm text-primary-foreground/50 font-body line-clamp-2">{a.teaser}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Subscription CTA */}
      {!hasAccess && (
        <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <p className="text-secondary text-xs tracking-[0.3em] uppercase font-ui mb-4">Subscribe</p>
            <h2 className="font-heading text-3xl md:text-5xl text-primary-foreground leading-tight">
              Step inside the <span className="gradient-text">full archive</span>
            </h2>
            <p className="mt-6 text-primary-foreground/60 font-body text-lg">
              Full case studies, behind-the-scenes journeys, exclusive interviews and trend reports —
              published monthly. Curated, never algorithmic.
            </p>
            <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <div className="border border-astragard-charcoal/30 rounded-lg p-6 text-left">
                <p className="text-xs tracking-widest uppercase text-primary-foreground/50 font-ui">Monthly</p>
                <p className="mt-2 font-heading text-3xl text-primary-foreground">$10<span className="text-base text-primary-foreground/50">/mo</span></p>
                <p className="mt-3 text-sm text-primary-foreground/60 font-body">Full access. Cancel anytime.</p>
              </div>
              <div className="border border-secondary/40 bg-secondary/5 rounded-lg p-6 text-left">
                <p className="text-xs tracking-widest uppercase text-secondary font-ui">Annual</p>
                <p className="mt-2 font-heading text-3xl text-primary-foreground">$30<span className="text-base text-primary-foreground/50">/mo equiv.</span></p>
                <p className="mt-3 text-sm text-primary-foreground/60 font-body">Best value · early access to drops.</p>
              </div>
            </div>
            <Link to={user ? "/contact?topic=omnificense" : "/auth?redirect=/omnificense"}>
              <Button size="lg" className="mt-10 gradient-bg text-primary-foreground font-ui">
                Subscribe to Omnificense <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </Layout>
  );
}
