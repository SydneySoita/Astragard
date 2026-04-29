import { Link } from "react-router-dom";

const footerLinks = {
  Platform: [
    { label: "Framework", path: "/about" },
    { label: "Incubator", path: "/incubator" },
    { label: "Marketplace", path: "/marketplace" },
    { label: "Collaborations Hub", path: "/collaborations" },
  ],
  Explore: [
    { label: "Omnificense", path: "/omnificense" },
    { label: "Dragon's Vault", path: "/dragons-vault" },
    { label: "Blog / Stories", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ],
  Legal: [
    { label: "Terms of Use", path: "/legal/terms" },
    { label: "Privacy Policy", path: "/legal/privacy" },
    { label: "Copyright Policy", path: "/legal/copyright" },
    { label: "Seller Policy", path: "/legal/seller" },
    { label: "Payment Terms", path: "/legal/payment" },
    { label: "Incubator Agreement", path: "/legal/incubator" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-astragard-dark text-primary-foreground/70 border-t border-astragard-charcoal/20">
      {/* Tagline Strip */}
      <div className="border-b border-astragard-charcoal/20 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="font-heading text-2xl md:text-3xl gradient-text">
            Where Creativity Becomes Limitless
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 className="font-heading text-sm text-primary-foreground/90 mb-4 tracking-wider uppercase">
              {section}
            </h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-ui text-primary-foreground/50 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Logo column */}
        <div className="col-span-2 md:col-span-1">
          <img
            src="/images/astragard-logo.png"
            alt="Astragard"
            className="h-12 w-auto mb-4 opacity-70"
          />
          <p className="text-xs text-primary-foreground/40 font-ui">
            Astragard Ltd. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/30 font-ui mt-1">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
