import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ArrowRight, Shield, Users, Lightbulb, Heart, Palette, BookOpen, Film, Music, Pen, Camera, Code, Mic, Globe } from "lucide-react";

const niches = [
  { icon: Palette, label: "Visual Arts & Illustration" },
  { icon: Film, label: "Animation & Motion Design" },
  { icon: Pen, label: "Writing & Storytelling" },
  { icon: Music, label: "Music & Sound Design" },
  { icon: Camera, label: "Photography & Film" },
  { icon: Code, label: "Creative Technology" },
  { icon: Mic, label: "Voice & Audio Production" },
  { icon: Globe, label: "Cultural Strategy" },
  { icon: BookOpen, label: "Publishing & Editorial" },
];

const pillars = [
  { icon: Shield, title: "Curated Talent", desc: "Every creative is vetted, reviewed, and matched — not algorithmically surfaced." },
  { icon: Users, title: "Guided Matching", desc: "We don't leave you browsing. We match talent to your project with precision." },
  { icon: Lightbulb, title: "Structured Collaboration", desc: "From brief to delivery, every engagement follows a transparent framework." },
  { icon: Heart, title: "Creative Integrity", desc: "We protect authorship, ensure fair compensation, and honour the creative process." },
];

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-bg-1.jpg" alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-astragard-dark/60 via-astragard-dark/80 to-astragard-dark" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-tight leading-tight animate-fade-up">
            The Creative Infrastructure
            <br />
            <span className="gradient-text">the World Deserves</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/60 font-body animate-fade-up" style={{ animationDelay: "200ms" }}>
            Aastragard connects visionary brands with curated creative talent through structured collaboration, 
            cultural integrity, and a framework built for lasting impact.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "400ms" }}>
            <Link to="/how-it-works/brands">
              <Button size="lg" className="gradient-bg text-primary-foreground font-ui text-base px-8 hover:opacity-90">
                Request Curated Talent <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/how-it-works/creatives">
              <Button size="lg" variant="outline" className="border-astragard-charcoal/40 text-primary-foreground font-ui text-base px-8 hover:border-secondary hover:text-secondary">
                Join as a Creative
              </Button>
            </Link>
          </div>
          <Link to="/contact" className="inline-block mt-4 text-sm text-primary-foreground/40 hover:text-secondary transition-colors font-ui animate-fade-up" style={{ animationDelay: "600ms" }}>
            Book a Discovery Call →
          </Link>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-secondary/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 md:py-32 bg-astragard-dark">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Hiring Great Creative Talent Shouldn't Feel Like Guesswork"
            light
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              "Inconsistent quality across freelance platforms",
              "No structured collaboration or project protection",
              "Creative talent treated as interchangeable, not valued",
            ].map((pain, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="text-center p-6 border border-astragard-charcoal/20 rounded-lg bg-astragard-dark/50">
                  <div className="w-2 h-2 rounded-full gradient-bg mx-auto mb-4" />
                  <p className="text-primary-foreground/70 font-body text-sm">{pain}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / Value Pillars */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0">
          <img src="/images/hero-bg-2.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-astragard-dark/90" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <SectionHeading
            title="A Framework, Not a Marketplace"
            subtitle="Astragard provides the infrastructure for creative collaboration that respects both the art and the business."
            gradient
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="p-8 border border-astragard-charcoal/20 rounded-lg bg-astragard-dark/60 hover:border-secondary/30 transition-all duration-500 group h-full">
                  <pillar.icon className="h-8 w-8 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-heading text-lg text-primary-foreground mb-3">{pillar.title}</h3>
                  <p className="text-primary-foreground/50 text-sm font-body">{pillar.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Niches */}
      <section className="py-24 md:py-32 bg-astragard-dark">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Nine Creative Niches"
            subtitle="From visual arts to creative technology — Astragard supports the full spectrum of creative practice."
            light
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {niches.map((niche, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <div className="flex items-center gap-3 p-4 border border-astragard-charcoal/15 rounded-lg hover:border-secondary/30 transition-all duration-300 group cursor-default">
                  <niche.icon className="h-5 w-5 text-secondary/70 group-hover:text-secondary transition-colors shrink-0" />
                  <span className="text-sm font-ui text-primary-foreground/70 group-hover:text-primary-foreground transition-colors">{niche.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Incubator Preview */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-astragard-dark via-astragard-dark to-primary/5" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <SectionHeading
            title="The Incubator"
            subtitle="Where ideas are developed, not just displayed. Submit a project, collaborate with curated talent, and bring creative visions to life."
            gradient
          />
          <Link to="/incubator">
            <Button size="lg" className="gradient-bg text-primary-foreground font-ui hover:opacity-90">
              Explore the Incubator <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-24 md:py-32 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading
            title="The Marketplace"
            subtitle="Discover and purchase original creative work — audiobooks, art prints, digital products, and more — directly from the talent who made them."
            light
          />
          <Link to="/marketplace">
            <Button size="lg" variant="outline" className="border-secondary/40 text-secondary font-ui hover:bg-secondary/10">
              Browse the Marketplace <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 border-t border-astragard-charcoal/20 bg-astragard-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 text-center">
            {[
              { stat: "9", label: "Creative Niches" },
              { stat: "100%", label: "Vetted Talent" },
              { stat: "Fair", label: "Compensation Model" },
              { stat: "Structured", label: "Collaboration Framework" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div>
                  <p className="font-heading text-3xl gradient-text font-bold">{item.stat}</p>
                  <p className="text-primary-foreground/40 text-sm font-ui mt-1">{item.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
