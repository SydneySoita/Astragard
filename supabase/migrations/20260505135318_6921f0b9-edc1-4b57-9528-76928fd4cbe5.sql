
-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Application reviews
CREATE TABLE IF NOT EXISTS public.application_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES auth.users(id),
  portfolio_quality int NOT NULL DEFAULT 0,
  authorship_clarity int NOT NULL DEFAULT 0,
  professional_readiness int NOT NULL DEFAULT 0,
  protection_alignment int NOT NULL DEFAULT 0,
  collaboration_potential int NOT NULL DEFAULT 0,
  category_fit int NOT NULL DEFAULT 0,
  total_score int GENERATED ALWAYS AS (portfolio_quality+authorship_clarity+professional_readiness+protection_alignment+collaboration_potential+category_fit) STORED,
  decision text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.application_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage reviews" ON public.application_reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Applicant reads own review" ON public.application_reviews FOR SELECT TO authenticated USING (auth.uid() = applicant_id);
CREATE TRIGGER application_reviews_set_updated BEFORE UPDATE ON public.application_reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Match suggestions
CREATE TABLE IF NOT EXISTS public.match_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.creative_challenges(id) ON DELETE CASCADE,
  creative_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_match int DEFAULT 0,
  intent_match int DEFAULT 0,
  use_case_match int DEFAULT 0,
  portfolio_relevance int DEFAULT 0,
  collaboration_match int DEFAULT 0,
  budget_match int DEFAULT 0,
  timeline_match int DEFAULT 0,
  ai_ownership_match int DEFAULT 0,
  total_score int GENERATED ALWAYS AS (field_match+intent_match+use_case_match+portfolio_relevance+collaboration_match+budget_match+timeline_match+ai_ownership_match) STORED,
  reason text DEFAULT '',
  risk_flags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'suggested',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, creative_id)
);
ALTER TABLE public.match_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage matches" ON public.match_suggestions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER match_suggestions_set_updated BEFORE UPDATE ON public.match_suggestions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Revenue
CREATE TABLE IF NOT EXISTS public.platform_revenue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  source text NOT NULL,
  amount_cents int NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'paid',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.platform_revenue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read revenue" ON public.platform_revenue FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins write revenue" ON public.platform_revenue FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update revenue" ON public.platform_revenue FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Tier on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'standard';

-- Admin-wide visibility on existing tables
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update all profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins view all brand profiles" ON public.brand_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins view all challenges" ON public.creative_challenges FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update all challenges" ON public.creative_challenges FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins view all portfolio" ON public.portfolio_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins view all protection" ON public.protection_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins view all collaborations" ON public.collaborations FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins send notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
