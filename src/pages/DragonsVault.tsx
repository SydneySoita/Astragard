import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Flame, Zap, Crown, Check } from "lucide-react";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const tiers = [
  {
    icon: Zap,
    name: "Spark",
    price: "Free",
    desc: "Essential access to the Astragard ecosystem.",
    features: ["Basic profile & portfolio", "Marketplace browsing", "Community access", "Blog & Stories access"],
    accent: "border-astragard-charcoal/30",
  },
  {
    icon: Flame,
    name: "Flame",
    price: "£9.99/mo",
    desc: "Enhanced tools for serious creatives.",
    features: ["Priority matching", "Incubator submissions", "Collaborations Hub access", "Omnificense subscription", "Analytics dashboard"],
    accent: "border-secondary/40",
    featured: true,
  },
  {
    icon: Crown,
    name: "Inferno",
    price: "£24.99/mo",
    desc: "Full platform access with premium features.",
    features: ["Everything in Flame", "Featured profile placement", "Priority support", "Revenue share boost", "Custom storefront branding", "Early access to features"],
    accent: "border-primary/40",
  },
];

export default function DragonsVault() {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-secondary font-ui text-sm tracking-widest uppercase mb-4">Membership</p>
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-bold">
            Dragon's <span className="gradient-text">Vault</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-primary-foreground/60 font-body">
            Choose the tier that matches your creative ambition. Every level unlocks deeper access to the Astragard ecosystem.
          </p>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className={cn(
                  "border rounded-lg p-8 h-full flex flex-col transition-all hover:scale-[1.02]",
                  tier.accent,
                  tier.featured ? "bg-gradient-to-b from-secondary/5 to-transparent" : "bg-astragard-dark/60"
                )}>
                  <tier.icon className={cn("h-10 w-10 mb-4", tier.featured ? "text-secondary" : "text-primary-foreground/40")} />
                  <h3 className="font-heading text-2xl text-primary-foreground">{tier.name}</h3>
                  <p className="gradient-text font-heading text-3xl mt-2">{tier.price}</p>
                  <p className="text-primary-foreground/50 text-sm font-body mt-3">{tier.desc}</p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex gap-2 items-start text-primary-foreground/60 text-sm font-ui">
                        <Check className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={cn("mt-8 w-full font-ui", tier.featured ? "gradient-bg text-primary-foreground" : "bg-astragard-charcoal/20 text-primary-foreground/70 hover:bg-astragard-charcoal/30")}>
                    Choose {tier.name}
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading title="For Shareholders" subtitle="Dragon's Vault provides predictable recurring revenue that scales with the creative community. Each tier is designed to align platform growth with creator success." light />
        </div>
      </section>
    </Layout>
  );
}
