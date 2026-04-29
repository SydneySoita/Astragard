import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Lightbulb, Users, TrendingUp, Award, ArrowRight } from "lucide-react";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const brandBenefits = [
  "Access original creative projects before market",
  "Commission bespoke collaborative work",
  "Transparent project milestones and deliverables",
  "Intellectual property structured from day one",
];

const creativeBenefits = [
  "Develop ideas with cross-niche collaborators",
  "Access resources and mentorship",
  "Retain ownership of your creative contribution",
  "Speculative work that can gain commercial traction",
];

const showcaseProjects = [
  { title: "Echoes of Ember", category: "Animation × Music", status: "In Development" },
  { title: "The Cartographer's Dream", category: "Illustration × Writing", status: "Seeking Collaborators" },
  { title: "Neon Meridian", category: "Photography × Creative Tech", status: "Completed" },
];

export default function Incubator() {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-secondary font-ui text-sm tracking-widest uppercase mb-4">The Incubator</p>
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-bold">
            Where Ideas Are <span className="gradient-text">Developed</span>,<br />Not Just Displayed
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-primary-foreground/60 font-body">
            The Astragard Incubator is a structured environment for collaborative creative projects — 
            from concept to commercial reality.
          </p>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <AnimatedSection>
            <div className="p-8 border border-astragard-charcoal/20 rounded-lg bg-astragard-dark/60 h-full">
              <Users className="h-8 w-8 text-secondary mb-4" />
              <h3 className="font-heading text-2xl text-primary-foreground mb-6">For Brands</h3>
              <ul className="space-y-3">
                {brandBenefits.map((b, i) => (
                  <li key={i} className="flex gap-3 items-start text-primary-foreground/60 text-sm font-body">
                    <div className="w-1.5 h-1.5 rounded-full gradient-bg mt-2 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={150}>
            <div className="p-8 border border-astragard-charcoal/20 rounded-lg bg-astragard-dark/60 h-full">
              <Lightbulb className="h-8 w-8 text-secondary mb-4" />
              <h3 className="font-heading text-2xl text-primary-foreground mb-6">For Creatives</h3>
              <ul className="space-y-3">
                {creativeBenefits.map((b, i) => (
                  <li key={i} className="flex gap-3 items-start text-primary-foreground/60 text-sm font-body">
                    <div className="w-1.5 h-1.5 rounded-full gradient-bg mt-2 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="Project Showcase" subtitle="A glimpse into the creative collaborations being developed within the Incubator." light />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {showcaseProjects.map((project, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="border border-astragard-charcoal/20 rounded-lg overflow-hidden group hover:border-secondary/30 transition-all">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Award className="h-12 w-12 text-secondary/40 group-hover:text-secondary/60 transition-colors" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-ui text-secondary/70 tracking-widest uppercase">{project.category}</p>
                    <h4 className="font-heading text-lg text-primary-foreground mt-2">{project.title}</h4>
                    <p className="text-primary-foreground/40 text-xs font-ui mt-3">{project.status}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/10 text-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact"><Button size="lg" className="gradient-bg text-primary-foreground font-ui">Submit a Project <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          <Link to="/how-it-works/creatives"><Button size="lg" variant="outline" className="border-secondary/40 text-secondary font-ui">Join the Incubator</Button></Link>
        </div>
      </section>
    </Layout>
  );
}
