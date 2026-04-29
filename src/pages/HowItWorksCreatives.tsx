import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your Astragard account and begin the onboarding process." },
  { num: "02", title: "Build Your Profile", desc: "Showcase your skills, experience, and creative niche." },
  { num: "03", title: "Upload Your Portfolio", desc: "Add your best work — the portfolio that defines your craft." },
  { num: "04", title: "Open Your Storefront", desc: "List products and services in the Marketplace." },
  { num: "05", title: "Collaborate", desc: "Get matched with brands or fellow creatives through structured projects." },
  { num: "06", title: "Join the Incubator", desc: "Submit or join collaborative projects to develop original work." },
  { num: "07", title: "Earn & Grow", desc: "Receive fair compensation and build your creative career within a protected ecosystem." },
];

export default function HowItWorksCreatives() {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary font-ui text-sm tracking-widest uppercase mb-4">How It Works</p>
          <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">For <span className="gradient-text">Creatives</span></h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-primary-foreground/60 font-body">
            Seven steps from signup to earning. Your talent, protected and empowered.
          </p>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent" />
            <div className="space-y-10">
              {steps.map((step, i) => (
                <AnimatedSection key={i} delay={i * 100}>
                  <div className="flex gap-6 items-start relative">
                    <div className="shrink-0 w-16 h-16 rounded-full border-2 border-astragard-charcoal/30 bg-astragard-dark flex items-center justify-center z-10">
                      <span className="gradient-text font-heading text-lg font-bold">{step.num}</span>
                    </div>
                    <div className="pt-3">
                      <h3 className="font-heading text-lg text-primary-foreground">{step.title}</h3>
                      <p className="text-primary-foreground/50 font-body text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/10 text-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact"><Button size="lg" className="gradient-bg text-primary-foreground font-ui">Join as a Creative</Button></Link>
          <Link to="/incubator"><Button size="lg" variant="outline" className="border-secondary/40 text-secondary font-ui">View the Incubator</Button></Link>
        </div>
      </section>
    </Layout>
  );
}
