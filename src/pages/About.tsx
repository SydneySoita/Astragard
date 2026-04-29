import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Flame, TrendingUp, Link2, Sword } from "lucide-react";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const fourPillars = [
  { icon: Flame, title: "Change", desc: "We challenge conventions that limit creative potential." },
  { icon: TrendingUp, title: "Evolution", desc: "Continuous growth for creatives and the platform itself." },
  { icon: Link2, title: "Connection", desc: "Bridging diverse talent with aligned vision." },
  { icon: Sword, title: "Courage", desc: "Boldness in protecting authorship and creative rights." },
];

export default function About() {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-bold tracking-tight">
            About <span className="gradient-text">Astragard</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-primary-foreground/60 font-body">
            Astragard is a creative protection and collaboration platform operating at the intersection of AI, authorship, and cultural integrity. 
            We exist to ensure that creative talent is discovered, protected, and empowered — not commoditised.
          </p>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Four Pillars" gradient />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fourPillars.map((p, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="p-8 border border-astragard-charcoal/20 rounded-lg bg-astragard-dark/60 hover:border-secondary/30 transition-all h-full group">
                  <p.icon className="h-8 w-8 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-heading text-lg text-primary-foreground mb-3">{p.title}</h3>
                  <p className="text-primary-foreground/50 text-sm font-body">{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="For Shareholders & Partners" subtitle="Astragard is built for scale. Our framework supports sustainable growth with a transparent revenue model." light />
          <div className="text-center">
            <p className="max-w-2xl mx-auto text-primary-foreground/50 font-body mb-8">
              We operate a commission-based model across the Marketplace and Incubator, supported by subscription tiers through Dragon's Vault, 
              ensuring alignment between platform growth and creative value.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/10 text-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact"><Button size="lg" className="gradient-bg text-primary-foreground font-ui">Start a Conversation</Button></Link>
          <Link to="/how-it-works/brands"><Button size="lg" variant="outline" className="border-astragard-charcoal/40 text-primary-foreground font-ui">Explore How It Works</Button></Link>
        </div>
      </section>
    </Layout>
  );
}
