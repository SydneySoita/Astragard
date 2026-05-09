
-- Articles
CREATE TABLE public.omnificence_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text DEFAULT '',
  content_type text NOT NULL DEFAULT 'case_study', -- case_study | interview | trend_report | behind_scenes | culture
  cover_image_url text DEFAULT '',
  teaser text NOT NULL DEFAULT '', -- always public
  tier text NOT NULL DEFAULT 'paid', -- free | paid
  status text NOT NULL DEFAULT 'draft', -- draft | published
  -- Case study sections
  challenge text DEFAULT '',
  creative_direction text DEFAULT '',
  collaboration text DEFAULT '',
  outcome text DEFAULT '',
  learning text DEFAULT '',
  -- Generic body for non-case-study formats
  body text DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  source_project_id uuid,
  author_id uuid,
  curated_by uuid,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.omnificence_articles ENABLE ROW LEVEL SECURITY;

-- Public can read only minimal fields of published articles via a view; for simplicity allow SELECT but app gates body fields
-- We'll gate full content server-side via a function. Public SELECT returns rows but consumers should use the function for paid bodies.
CREATE POLICY "Published articles are public"
ON public.omnificence_articles FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Admins manage articles"
ON public.omnificence_articles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_omnificence_articles_updated
BEFORE UPDATE ON public.omnificence_articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_omnif_status_published ON public.omnificence_articles(status, published_at DESC);
CREATE INDEX idx_omnif_type ON public.omnificence_articles(content_type);

-- Subscriptions
CREATE TABLE public.omnificence_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  tier text NOT NULL DEFAULT 'monthly', -- monthly | annual
  status text NOT NULL DEFAULT 'active', -- active | canceled | expired
  started_at timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz,
  provider text DEFAULT '',
  provider_subscription_id text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.omnificence_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscription"
ON public.omnificence_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins manage subscriptions"
ON public.omnificence_subscriptions FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_omnif_subs_updated
BEFORE UPDATE ON public.omnificence_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helper: does current user have active access?
CREATE OR REPLACE FUNCTION public.has_omnificence_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    has_role(_user_id, 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.omnificence_subscriptions
      WHERE user_id = _user_id
        AND status = 'active'
        AND (current_period_end IS NULL OR current_period_end > now())
    );
$$;
