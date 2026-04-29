import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { ShoppingBag, Search, CreditCard, Package, Star, ArrowRight } from "lucide-react";

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return <div ref={ref} className={cn("transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const categories = ["All", "Audiobooks", "E-books", "Art Prints", "Digital Art", "Music", "Photography", "Templates", "Courses", "Merchandise"];

const placeholderProducts = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  title: ["Midnight Canvas", "Echoes in Ink", "Digital Horizon", "Painted Words", "Sound of Fire", "Pixel Dreams"][i],
  category: categories[1 + (i % 8)],
  price: [14.99, 9.99, 24.99, 19.99, 12.99, 29.99][i],
  creator: ["Aria Wells", "Marcus Obi", "Luna Frost", "Theo Blake", "Sana Kim", "Eliot Ren"][i],
}));

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? placeholderProducts : placeholderProducts.filter(p => p.category === activeCategory);

  return (
    <Layout>
      <section className="pt-32 pb-12 bg-astragard-dark">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary font-ui text-sm tracking-widest uppercase mb-4">The Marketplace</p>
          <h1 className="font-heading text-4xl md:text-5xl text-primary-foreground font-bold">Original Creative <span className="gradient-text">Work</span></h1>
          <p className="mt-6 max-w-2xl mx-auto text-primary-foreground/60 font-body">
            Discover and purchase directly from the talent who made it. Every purchase supports an independent creative.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-ui transition-all",
                  activeCategory === cat
                    ? "gradient-bg text-primary-foreground"
                    : "border border-astragard-charcoal/20 text-primary-foreground/50 hover:border-secondary/30 hover:text-primary-foreground/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 bg-astragard-dark">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <AnimatedSection key={product.id} delay={i * 80}>
                <div className="border border-astragard-charcoal/20 rounded-lg overflow-hidden group hover:border-secondary/30 transition-all cursor-pointer">
                  <div className="h-56 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-secondary/30 group-hover:text-secondary/50 transition-colors" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-ui text-secondary/60 tracking-widest uppercase">{product.category}</p>
                    <h4 className="font-heading text-lg text-primary-foreground mt-1">{product.title}</h4>
                    <p className="text-primary-foreground/40 text-xs font-ui mt-1">by {product.creator}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="gradient-text font-heading text-lg">£{product.price}</span>
                      <Button size="sm" className="gradient-bg text-primary-foreground font-ui text-xs">Add to Cart</Button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How to Shop */}
      <section className="py-24 bg-astragard-dark border-t border-astragard-charcoal/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="How to Shop" light />
          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Search, label: "Browse" },
              { icon: Star, label: "Select" },
              { icon: ShoppingBag, label: "Add to Cart" },
              { icon: CreditCard, label: "Checkout" },
              { icon: Package, label: "Receive" },
            ].map((step, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <div className="text-center p-4">
                  <step.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <p className="text-primary-foreground/70 font-ui text-sm">{step.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-astragard-dark border-t border-astragard-charcoal/10 text-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/how-it-works/brands"><Button size="lg" className="gradient-bg text-primary-foreground font-ui">Hire a Creative <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          <Link to="/how-it-works/creatives"><Button size="lg" variant="outline" className="border-secondary/40 text-secondary font-ui">Open a Storefront</Button></Link>
        </div>
      </section>
    </Layout>
  );
}
