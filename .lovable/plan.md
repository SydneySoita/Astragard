

# Astragard Website — Build Plan

## Phase 1: Foundation & Core Pages (This Implementation)

### 1. Design System Setup
- Configure Tailwind with Astragard brand palette: Deep Red `#C43A2F`, Gold `#C9A24D`, Charcoal `#7A7A8C`, Light Grey `#B2B2C0`, Dark `#111111`
- Import Google Fonts: **Cinzel** (headings), **Libre Baskerville** (body), **Inter** (nav/buttons/UI)
- Primary gradient: `linear-gradient(135deg, #C43A2F, #C9A24D)` for buttons, logo accents, hero
- CTA button styles: Primary (red `#C43A2F`, hover gold), Secondary (charcoal outline)
- Copy logo image and hero background images into project assets

### 2. Animated Intro Loader
- Full-screen cinematic entry: dark screen → dragon video plays → logo reveal with fire particle effect
- Use the uploaded dragon video (`WhatsApp_Video`) as the animation source
- Tagline "Where Creativity Becomes Limitless" fades in beneath logo
- 3–5 second runtime, skip button after 1.5s
- First-visit cookie so it only plays once per session

### 3. Global Layout Components
- **Header/Navigation**: Sticky header with 6 primary items (Home, Framework, Incubator, Marketplace, How It Works, Join/Enquire)
- Dropdown menus for "How It Works" (For Brands / For Creatives), "Explore" (Omnificense, Collaborations Hub, Dragon's Vault, Blog), "Join/Enquire" (4 items)
- Sticky "Book a Discovery Call" CTA button in header
- **Footer**: Legal links, tagline strip, social links, copyright
- Mobile hamburger menu with full navigation

### 4. Homepage
- **Hero section**: Cinematic full-width with dual CTAs — "Request Curated Talent" + "Join as a Creative", secondary "Book a Discovery Call"
- **Problem section**: "Hiring great creative talent shouldn't feel like guesswork" with pain points
- **Solution section**: 4 value pillars (Curated Talent, Guided Matching, Structured Collaboration, Creative Integrity)
- **Who We Are** preview with 4 pillars (Change, Evolution, Connection, Courage)
- **Creative Niches** grid showcasing 9 categories
- **Incubator preview** section with CTA
- **Marketplace preview** section with CTA
- **Trust & credibility indicators**
- Background images using the uploaded fantasy/cinematic photos

### 5. About Astragard Page
- Philosophy, mission, and positioning content
- "For Shareholders & Partners" section
- 4 pillars section
- 9 creative niches showcase
- CTAs: "Start a Conversation", "Explore How It Works", "View the Framework"

### 6. How It Works — For Brands
- 4-step process flow (Share Brief → Curate → Review → Project Moves Forward)
- "Who This Is For" section
- CTAs: "Submit a Brand Brief", "Book a Discovery Call", "Explore the Incubator"

### 7. How It Works — For Creatives
- 7-step onboarding flow (Sign Up → Profile → Upload → Storefront → Collaborate → Incubator → Earn)
- Cross-niche collaboration example
- CTAs: "Join as a Creative", "View the Incubator", "Read the Creative Guide"

### 8. The Incubator Page
- Flagship feature showcase: "Where Ideas Are Developed, Not Just Displayed"
- For Brands / For Creatives benefit sections
- The Model explanation (speculative collaboration → commercial traction)
- "Why Brands Choose Astragard" section
- Project showcase card layout (placeholder cards)
- CTAs: "Submit a Project", "Join the Incubator"

### 9. The Marketplace Page (UI Only)
- Product grid layout with category filters (9 categories: Audiobooks, E-books, Art Prints, etc.)
- Placeholder product cards
- "How to Shop" 5-step flow
- User account features list
- CTAs: "Browse Creative Work", "Hire a Creative", "Open a Storefront"
- Cart/checkout UI placeholder (functional payment integration in a later phase)

### 10. Omnificense — Digital Magazine Page
- Gallery-style editorial layout — NOT a standard blog
- 5 "Exhibition Rooms" showcased as cards/sections (Futurism, Voices of Tomorrow, BTS, Research & Strategy, Animation Spotlight)
- Subscription access model explanation
- CTAs: "Enter Omnificense", "Subscribe to Omnificense"

### 11. Collaborations Hub Page
- Internal creative collaboration space description
- 5-step "How It Works" flow
- Discovery features section
- Speculative work notice for creatives
- CTA: "Find Creatives to Collaborate With"

### 12. Dragon's Vault — Membership Page
- 3 tiered membership cards: Spark, Flame, Inferno — each with benefits
- For Shareholders section (revenue model explanation)
- CTAs: "Choose Your Tier", "Enter the Vault", "View Membership Benefits"

### 13. Blog / Stories Page
- Content category listing (Creative Spotlights, Industry Insight, Process Stories, Brand Collaborations, Platform Updates)
- Article card grid layout with placeholder posts
- CTA: "Read More"

### 14. Contact & Support Page
- Contact form (Name, Email, Reason dropdown, Message)
- "Book a Discovery Call" CTA
- FAQ accordion section with provided Q&As

### 15. Legal Pages (Placeholder)
- Terms of Use, Privacy Policy, Copyright Policy, Seller Policy, Payment Terms, Incubator Agreement — all as placeholder pages with titles and "Content pending legal review"

### 16. Animations & Interactions
- Fade-in on scroll transitions for all sections
- Hover effects on cards and CTAs (gold hover state)
- Smooth scroll behavior
- Micro-interactions on buttons (gradient shift on hover)
- Subtle ember glow on dragon/logo elements where present

## Future Phases (Not in this build)
- Supabase integration for auth, user accounts, and database
- Stripe payment integration for marketplace checkout
- CMS for blog/Omnificense content management
- 3D interactive gallery experience for Omnificense
- Real-time collaboration features for the Hub
- Dragon's Vault subscription/payment tiers

