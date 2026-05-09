
-- Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS country text DEFAULT '',
  ADD COLUMN IF NOT EXISTS professional_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS years_experience int,
  ADD COLUMN IF NOT EXISTS portfolio_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS website_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS city text DEFAULT '',
  ADD COLUMN IF NOT EXISTS application_status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS fee_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_step int NOT NULL DEFAULT 1;

-- Extend protection_settings for the Commitment screen
ALTER TABLE public.protection_settings
  ADD COLUMN IF NOT EXISTS ownership_preference text,
  ADD COLUMN IF NOT EXISTS collaboration_preference text,
  ADD COLUMN IF NOT EXISTS ai_usage_preference text,
  ADD COLUMN IF NOT EXISTS authorship_confirmation boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_disclosure_confirmation boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ownership_respect_confirmation boolean NOT NULL DEFAULT false;

-- Agreements table
CREATE TABLE IF NOT EXISTS public.user_agreements (
  user_id uuid PRIMARY KEY,
  terms_accepted boolean NOT NULL DEFAULT false,
  privacy_accepted boolean NOT NULL DEFAULT false,
  framework_accepted boolean NOT NULL DEFAULT false,
  accepted_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own agreements"
ON public.user_agreements FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Storage bucket for portfolio uploads & avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('creative-uploads', 'creative-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read creative uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'creative-uploads');

CREATE POLICY "Users upload own creative files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'creative-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own creative files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'creative-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own creative files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'creative-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
