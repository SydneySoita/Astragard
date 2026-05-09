
-- Brand profiles
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name text NOT NULL DEFAULT '',
  company_name text NOT NULL DEFAULT '',
  industry text DEFAULT '',
  website text DEFAULT '',
  phone text DEFAULT '',
  country text DEFAULT '',
  logo_url text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands view own profile" ON public.brand_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Brands insert own profile" ON public.brand_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Brands update own profile" ON public.brand_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER brand_profiles_set_updated
BEFORE UPDATE ON public.brand_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Creative challenges
CREATE TABLE IF NOT EXISTS public.creative_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  intent text DEFAULT '',
  use_case text DEFAULT '',
  creative_needs text[] NOT NULL DEFAULT '{}',
  collaboration_style text DEFAULT '',
  budget_range text DEFAULT '',
  timeline text DEFAULT '',
  ownership_preference text DEFAULT '',
  ai_preference text DEFAULT '',
  contact_name text DEFAULT '',
  contact_company text DEFAULT '',
  contact_email text DEFAULT '',
  contact_phone text DEFAULT '',
  status text NOT NULL DEFAULT 'under_review',
  stage text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.creative_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands manage own challenges" ON public.creative_challenges FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER creative_challenges_set_updated
BEFORE UPDATE ON public.creative_challenges
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_challenges_user ON public.creative_challenges(user_id);
