import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Sparkles, Eye, Mic2, FlaskConical, Film, ArrowRight } from "lucide-react";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const rooms = [
  { icon: Sparkles, title: "Futurism", desc: "Exploring the frontier of creative technology, AI co-creation, and what comes next." },
  { icon: Eye, title: "Voices of Tomorrow", desc: "Profiles and interviews with emerging creative talent shaping culture." },
  { icon: Mic2, title: "Behind the Scenes", desc: "Process stories, creative breakdowns, and the reality of building original work." },
  { icon: FlaskConical, title: "Research & Strategy", desc: "Industry analysis, creative economy trends, and strategic thought leadership." },
  { icon: Film, title: "Animation Spotlight", desc: "Celebrating motion design, animated storytelling, and visual experimentation." },
];

export default function Omnificense() {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-secondary font-ui text-sm tracking-widest uppercase mb-4">Digital Magazine</p>
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-bold">
            <span className="gradient-text">Omnificense</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-primary-foreground/60 font-body">
            Not a blog. A gallery. A publication. A cultural archive. 
            Omnificense is Astragard's editorial space — otherworldly and intentional.
          </p>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="Exhibition Rooms" gradient />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {rooms.map((room, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="relative border border-astragard-charcoal/20 rounded-lg overflow-hidden group hover:border-secondary/30 transition-all h-full">
                  <div className="h-40 bg-gradient-to-br from-primary/10 via-astragard-dark to-secondary/10 flex items-center justify-center">
                    <room.icon className="h-12 w-12 text-secondary/40 group-hover:text-secondary/70 transition-all group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl text-primary-foreground">{room.title}</h3>
                    <p className="text-primary-foreground/50 text-sm font-body mt-2">{room.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/10 text-center">
        <div className="container mx-auto px-4">
          <p className="text-primary-foreground/50 font-body mb-8 max-w-xl mx-auto">
            Omnificense operates on a subscription model. Access featured content, exclusive stories, and curated creative exhibitions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-bg text-primary-foreground font-ui">Enter Omnificense <ArrowRight className="ml-2 h-4 w-4" /></Button>
            <Button size="lg" variant="outline" className="border-secondary/40 text-secondary font-ui">Subscribe to Omnificense</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
