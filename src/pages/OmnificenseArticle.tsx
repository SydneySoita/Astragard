import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useOmnificenceAccess } from "@/hooks/useOmnificenceAccess";
import { Lock, ArrowLeft, ArrowRight } from "lucide-react";

type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  cover_image_url: string;
  teaser: string;
  tier: string;
  content_type: string;
  challenge: string;
  creative_direction: string;
  collaboration: string;
  outcome: string;
  learning: string;
  body: string;
  tags: string[];
  published_at: string | null;
};

export default function OmnificenseArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { hasAccess, user } = useOmnificenceAccess();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("omnificence_articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      setArticle(data as Article | null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container mx-auto px-4 text-primary-foreground/50 font-body">Loading…</div>
      </Layout>
    );
  }
  if (!article) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <p className="text-primary-foreground/60 font-body">Entry not found.</p>
          <Link to="/omnificense" className="text-secondary font-ui mt-4 inline-block">Back to Omnificense</Link>
        </div>
      </Layout>
    );
  }

  const isLocked = article.tier === "paid" && !hasAccess;
  const isCaseStudy = article.content_type === "case_study";

  return (
    <Layout>
      <article className="bg-astragard-dark">
        {/* Cover */}
        <div className="relative pt-28">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <Link to="/omnificense" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-primary-foreground/50 hover:text-secondary font-ui mb-8">
              <ArrowLeft className="h-3 w-3" /> Back to archive
            </Link>
            <Badge variant="outline" className="border-secondary/40 text-secondary uppercase tracking-wider text-[10px] mb-6">
              {article.content_type.replace("_", " ")}
            </Badge>
            <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground leading-[1.05] font-bold">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="mt-6 text-xl md:text-2xl text-primary-foreground/70 font-body italic leading-snug">
                {article.subtitle}
              </p>
            )}
          </div>
          {article.cover_image_url && (
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl mt-12">
              <div className="aspect-[16/9] overflow-hidden rounded-lg border border-astragard-charcoal/20">
                <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl py-16">
          <p className="text-lg text-primary-foreground/70 font-body leading-relaxed first-letter:font-heading first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-secondary first-letter:leading-none">
            {article.teaser}
          </p>

          {isLocked ? (
            <div className="mt-16 border border-secondary/30 bg-secondary/5 rounded-lg p-10 text-center">
              <Lock className="h-8 w-8 text-secondary mx-auto mb-4" />
              <p className="text-xs tracking-[0.3em] uppercase text-secondary font-ui">Subscribers only</p>
              <h3 className="font-heading text-2xl md:text-3xl text-primary-foreground mt-3">
                Continue reading inside Omnificense
              </h3>
              <p className="mt-4 text-primary-foreground/60 font-body max-w-md mx-auto">
                The full case study — challenge, direction, collaboration, outcome and learning —
                is available to subscribers.
              </p>
              <Link to={user ? "/contact?topic=omnificense" : "/auth?redirect=/omnificense"}>
                <Button size="lg" className="mt-8 gradient-bg text-primary-foreground font-ui">
                  Subscribe — $10/mo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : isCaseStudy ? (
            <div className="mt-16 space-y-14">
              {[
                { label: "01 — The Challenge", body: article.challenge },
                { label: "02 — The Creative Direction", body: article.creative_direction },
                { label: "03 — The Collaboration", body: article.collaboration },
                { label: "04 — The Outcome", body: article.outcome },
                { label: "05 — The Learning", body: article.learning },
              ]
                .filter((s) => s.body && s.body.trim().length > 0)
                .map((s) => (
                  <section key={s.label}>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-secondary font-ui mb-3">{s.label}</p>
                    <div className="font-body text-primary-foreground/75 text-lg leading-relaxed whitespace-pre-wrap">
                      {s.body}
                    </div>
                  </section>
                ))}
            </div>
          ) : (
            <div className="mt-12 font-body text-primary-foreground/75 text-lg leading-relaxed whitespace-pre-wrap">
              {article.body}
            </div>
          )}

          {article.tags?.length > 0 && (
            <div className="mt-16 pt-8 border-t border-astragard-charcoal/20 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span key={t} className="text-[10px] tracking-widest uppercase text-primary-foreground/40 font-ui px-2 py-1 border border-astragard-charcoal/30 rounded">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}
