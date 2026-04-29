import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { FileText, Search, Eye, Rocket } from "lucide-react";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const steps = [
  { icon: FileText, num: "01", title: "Share Your Brief", desc: "Tell us about your project, your brand, and the creative talent you need. We handle the rest." },
  { icon: Search, num: "02", title: "We Curate", desc: "Our team reviews your brief and hand-selects the best-fit creatives from our vetted network." },
  { icon: Eye, num: "03", title: "Review & Approve", desc: "You review curated profiles, portfolios, and proposals. No algorithms — just quality." },
  { icon: Rocket, num: "04", title: "Project Moves Forward", desc: "Once matched, collaboration begins within our structured framework with full transparency." },
];

export default function HowItWorksBrands() {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary font-ui text-sm tracking-widest uppercase mb-4">How It Works</p>
          <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">For <span className="gradient-text">Brands</span></h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-primary-foreground/60 font-body">
            From brief to delivery — a streamlined process that puts quality and creative alignment first.
          </p>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="flex gap-6 md:gap-8 items-start group">
                  <div className="shrink-0 w-16 h-16 rounded-lg gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <step.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-secondary/60 font-ui text-xs tracking-widest">{step.num}</p>
                    <h3 className="font-heading text-xl text-primary-foreground mt-1">{step.title}</h3>
                    <p className="text-primary-foreground/50 font-body text-sm mt-2">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/10 text-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact"><Button size="lg" className="gradient-bg text-primary-foreground font-ui">Submit a Brand Brief</Button></Link>
          <Link to="/contact"><Button size="lg" variant="outline" className="border-astragard-charcoal/40 text-primary-foreground font-ui">Book a Discovery Call</Button></Link>
          <Link to="/incubator"><Button size="lg" variant="outline" className="border-secondary/40 text-secondary font-ui">Explore the Incubator</Button></Link>
        </div>
      </section>
    </Layout>
  );
}
