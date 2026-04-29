import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)}>{children}</div>;
}

const faqs = [
  { q: "How does Astragard differ from freelance platforms?", a: "Astragard is a structured creative collaboration framework — not a marketplace where anyone can list. Every creative is vetted, and every engagement follows a transparent process." },
  { q: "Who can join as a creative?", a: "Any professional working in one of our nine creative niches can apply. We review portfolios, experience, and creative alignment before onboarding." },
  { q: "How does the Incubator work?", a: "The Incubator is a space for collaborative creative projects. Creatives submit or join projects, collaborate across niches, and develop work that can gain commercial traction." },
  { q: "Is my work protected on Astragard?", a: "Yes. Creative integrity and authorship protection are foundational to the platform. All IP terms are structured before collaboration begins." },
  { q: "How do payments work?", a: "Payments are processed securely through our platform. Creatives receive fair compensation, and all terms are transparent." },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Message sent", description: "We'll be in touch soon." });
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">Get in <span className="gradient-text">Touch</span></h1>
          <p className="mt-6 max-w-2xl mx-auto text-primary-foreground/60 font-body">
            Whether you're a brand, a creative, or a potential partner — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 max-w-2xl">
          <AnimatedSection>
            {submitted ? (
              <div className="text-center py-16">
                <p className="gradient-text font-heading text-2xl">Thank you!</p>
                <p className="text-primary-foreground/50 font-body mt-4">We've received your message and will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-ui text-primary-foreground/60 mb-2 block">Name</label>
                  <Input required className="bg-astragard-dark border-astragard-charcoal/30 text-primary-foreground font-ui" />
                </div>
                <div>
                  <label className="text-sm font-ui text-primary-foreground/60 mb-2 block">Email</label>
                  <Input required type="email" className="bg-astragard-dark border-astragard-charcoal/30 text-primary-foreground font-ui" />
                </div>
                <div>
                  <label className="text-sm font-ui text-primary-foreground/60 mb-2 block">Reason for Contact</label>
                  <Select>
                    <SelectTrigger className="bg-astragard-dark border-astragard-charcoal/30 text-primary-foreground font-ui">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand">I'm a Brand / Looking for Talent</SelectItem>
                      <SelectItem value="creative">I'm a Creative / Want to Join</SelectItem>
                      <SelectItem value="partner">Partnership / Investment Enquiry</SelectItem>
                      <SelectItem value="support">Support / General Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-ui text-primary-foreground/60 mb-2 block">Message</label>
                  <Textarea required rows={5} className="bg-astragard-dark border-astragard-charcoal/30 text-primary-foreground font-ui" />
                </div>
                <Button type="submit" size="lg" className="w-full gradient-bg text-primary-foreground font-ui">Send Message</Button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4 max-w-2xl">
          <SectionHeading title="Frequently Asked Questions" light />
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-astragard-charcoal/20 rounded-lg px-6 data-[state=open]:border-secondary/30 transition-colors">
                <AccordionTrigger className="text-primary-foreground font-ui text-sm hover:text-secondary">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-primary-foreground/50 font-body text-sm">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
