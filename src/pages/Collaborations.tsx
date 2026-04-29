import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Users, Search, MessageSquare, Handshake, Rocket, AlertTriangle } from "lucide-react";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const steps = [
  { icon: Search, title: "Discover", desc: "Browse creative profiles across all nine niches." },
  { icon: MessageSquare, title: "Connect", desc: "Reach out to potential collaborators through the platform." },
  { icon: Handshake, title: "Align", desc: "Agree on scope, roles, and creative direction." },
  { icon: Users, title: "Collaborate", desc: "Work together within the structured framework." },
  { icon: Rocket, title: "Launch", desc: "Bring the project to market through the Incubator or Marketplace." },
];

export default function Collaborations() {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary font-ui text-sm tracking-widest uppercase mb-4">Collaborations Hub</p>
          <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">
            Find Your Creative <span className="gradient-text">Counterpart</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-primary-foreground/60 font-body">
            The Collaborations Hub is an internal space for creatives to discover, connect, and build together across disciplines.
          </p>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="How It Works" light />
          <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="text-center p-4 group">
                  <div className="w-14 h-14 rounded-full border border-astragard-charcoal/30 flex items-center justify-center mx-auto mb-4 group-hover:border-secondary/40 transition-colors">
                    <step.icon className="h-6 w-6 text-secondary/60 group-hover:text-secondary transition-colors" />
                  </div>
                  <h4 className="font-heading text-sm text-primary-foreground">{step.title}</h4>
                  <p className="text-primary-foreground/40 text-xs font-body mt-2">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 max-w-2xl">
          <AnimatedSection>
            <div className="flex gap-4 p-6 border border-secondary/20 rounded-lg bg-secondary/5">
              <AlertTriangle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading text-sm text-primary-foreground">Note for Creatives</h4>
                <p className="text-primary-foreground/50 text-xs font-body mt-1">
                  Some Incubator projects involve speculative work. All terms are transparent and agreed upon before collaboration begins.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/10 text-center">
        <Link to="/contact">
          <Button size="lg" className="gradient-bg text-primary-foreground font-ui">Find Creatives to Collaborate With</Button>
        </Link>
      </section>
    </Layout>
  );
}
