import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const categories = ["Creative Spotlights", "Industry Insight", "Process Stories", "Brand Collaborations", "Platform Updates"];

const posts = [
  { title: "The Future of Cross-Niche Collaboration", category: "Industry Insight", date: "Mar 2026", excerpt: "How creative boundaries are dissolving in the age of AI-assisted workflows." },
  { title: "Spotlight: Aria Wells on Visual Storytelling", category: "Creative Spotlights", date: "Feb 2026", excerpt: "A conversation about process, protection, and pushing creative limits." },
  { title: "Inside the Incubator: Echoes of Ember", category: "Process Stories", date: "Feb 2026", excerpt: "How a team of five creatives from different niches built something extraordinary." },
  { title: "Why Brands Are Moving Beyond Freelance Platforms", category: "Brand Collaborations", date: "Jan 2026", excerpt: "The shift from transactional hiring to structured creative partnerships." },
  { title: "Astragard Marketplace: What's New", category: "Platform Updates", date: "Jan 2026", excerpt: "New categories, improved storefront tools, and payment updates." },
  { title: "Protecting Authorship in the Age of AI", category: "Industry Insight", date: "Dec 2025", excerpt: "Why creative protection matters more than ever — and what we're doing about it." },
];

export default function Blog() {
  return (
    <Layout>
      <section className="pt-32 pb-12 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">Blog & <span className="gradient-text">Stories</span></h1>
          <p className="mt-6 max-w-2xl mx-auto text-primary-foreground/60 font-body">
            Creative spotlights, industry insight, and stories from the Astragard ecosystem.
          </p>
        </div>
      </section>

      <section className="py-6 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <span key={cat} className="px-4 py-2 border border-astragard-charcoal/20 rounded-full text-sm font-ui text-primary-foreground/50 hover:border-secondary/30 hover:text-primary-foreground/80 transition-all cursor-pointer">
              {cat}
            </span>
          ))}
        </div>
      </section>

      <section className="py-12 bg-astragard-dark">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {posts.map((post, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <article className="border border-astragard-charcoal/20 rounded-lg overflow-hidden group hover:border-secondary/30 transition-all cursor-pointer h-full flex flex-col">
                  <div className="h-36 bg-gradient-to-br from-primary/10 to-secondary/10" />
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs font-ui text-secondary/60 tracking-widest uppercase">{post.category}</p>
                    <h3 className="font-heading text-lg text-primary-foreground mt-2 group-hover:text-secondary transition-colors">{post.title}</h3>
                    <p className="text-primary-foreground/40 text-sm font-body mt-2 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-primary-foreground/30 font-ui">{post.date}</span>
                      <span className="text-secondary text-sm font-ui flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
