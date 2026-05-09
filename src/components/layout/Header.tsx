import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Framework", path: "/about" },
  { label: "Incubator", path: "/incubator" },
  { label: "Marketplace", path: "/marketplace" },
  {
    label: "For Brands",
    children: [
      { label: "How It Works", path: "/how-it-works/brands" },
      { label: "Submit a Challenge", path: "/brands/submit" },
      { label: "Brand Dashboard", path: "/brands/dashboard" },
    ],
  },
  {
    label: "For Creatives",
    children: [
      { label: "How It Works", path: "/how-it-works/creatives" },
      { label: "Apply to Astragard", path: "/apply" },
    ],
  },
  {
    label: "Explore",
    children: [
      { label: "Omnificense", path: "/omnificense" },
      { label: "Collaborations Hub", path: "/collaborations" },
      { label: "Dragon's Vault", path: "/dragons-vault" },
      { label: "Blog / Stories", path: "/blog" },
    ],
  },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-ui",
        isScrolled
          ? "bg-astragard-dark/95 backdrop-blur-md border-b border-astragard-charcoal/20 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/astragard-logo.png"
            alt="Astragard"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 min-w-[200px]">
                    <div className="bg-astragard-dark/95 backdrop-blur-md border border-astragard-charcoal/20 rounded-lg py-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-4 py-2.5 text-sm text-primary-foreground/70 hover:text-secondary hover:bg-astragard-charcoal/10 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path!}
                className={cn(
                  "px-4 py-2 text-sm transition-colors",
                  location.pathname === item.path
                    ? "text-secondary"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link to="/auth" className="hidden md:block text-sm text-primary-foreground/80 hover:text-secondary transition-colors font-ui">
            Sign in
          </Link>
          <Link to="/apply" className="hidden md:block">
            <Button className="gradient-bg text-primary-foreground font-ui text-sm hover:opacity-90 transition-opacity">
              Apply to Astragard
            </Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-primary-foreground"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-astragard-dark/98 backdrop-blur-md border-t border-astragard-charcoal/20 mt-2">
          <nav className="container mx-auto py-6 px-4 flex flex-col gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="flex items-center justify-between w-full py-3 text-primary-foreground/80 font-ui text-sm"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", openDropdown === item.label && "rotate-180")}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="pl-4 flex flex-col gap-1 mb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="py-2 text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path!}
                  className="py-3 text-sm text-primary-foreground/80 hover:text-primary-foreground font-ui transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link to="/contact" className="mt-4">
              <Button className="w-full gradient-bg text-primary-foreground font-ui">
                Book a Discovery Call
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
