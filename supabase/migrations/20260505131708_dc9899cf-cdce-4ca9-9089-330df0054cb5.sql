
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS authorship_mode text NOT NULL DEFAULT 'human',
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS submitted_to_incubator boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS outcome text DEFAULT '';

CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  one_liner text NOT NULL DEFAULT '',
  intent text NOT NULL DEFAULT '',
  media_url text DEFAULT '',
  media_type text DEFAULT 'image',
  use_cases text[] NOT NULL DEFAULT '{}',
  engagement_options text[] NOT NULL DEFAULT '{}',
  pricing_style text NOT NULL DEFAULT 'commission',
  pricing_display text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are public"
ON public.listings FOR SELECT TO authenticated, anon
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users insert own listings"
ON public.listings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own listings"
ON public.listings FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own listings"
ON public.listings FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER listings_set_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
