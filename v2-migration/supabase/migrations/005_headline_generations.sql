-- 005_headline_generations.sql
-- Log each Haiku copy-generation call for analytics:
-- which options reps pick, per product × customer × channel.
--
-- Applied after: 004_storage_bucket.sql

CREATE TABLE public.headline_generations (
  id                      uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  zoho_user_id            text         NOT NULL,
  product                 text         NOT NULL,
  customer_segment        text         NOT NULL,
  channel                 text         NOT NULL,
  key_message             text         NOT NULL,
  rep_name                text,
  options                 jsonb        NOT NULL,
  selected_index          int          CHECK (selected_index IS NULL OR selected_index BETWEEN 0 AND 2),
  haiku_input_tokens      int,
  haiku_output_tokens     int,
  created_at              timestamptz  NOT NULL DEFAULT now(),
  selected_at             timestamptz
);

CREATE INDEX idx_headline_generations_zoho_user
  ON public.headline_generations (zoho_user_id, created_at DESC);

CREATE INDEX idx_headline_generations_product
  ON public.headline_generations (product, customer_segment, created_at DESC);

-- Row-level security: users see only their own generations
ALTER TABLE public.headline_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own headline generations"
  ON public.headline_generations
  FOR SELECT
  TO authenticated
  USING (
    zoho_user_id = (auth.jwt() ->> 'zoho_user_id')::text
  );

CREATE POLICY "Users can insert own headline generations"
  ON public.headline_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    zoho_user_id = (auth.jwt() ->> 'zoho_user_id')::text
  );

CREATE POLICY "Users can update selected_index on own headline generations"
  ON public.headline_generations
  FOR UPDATE
  TO authenticated
  USING (
    zoho_user_id = (auth.jwt() ->> 'zoho_user_id')::text
  )
  WITH CHECK (
    zoho_user_id = (auth.jwt() ->> 'zoho_user_id')::text
  );

-- Admins (role = 'service_role') bypass RLS for analytics/dashboards
-- No explicit policy needed — service_role always bypasses.

COMMENT ON TABLE  public.headline_generations IS 'Claude Haiku 4.5 copy generations from /quick intake. Each row = 3 options with one selected by rep.';
COMMENT ON COLUMN public.headline_generations.options IS 'jsonb array of { headline, cta } objects (length 3).';
COMMENT ON COLUMN public.headline_generations.selected_index IS 'Which of the 3 options the rep picked. Null until selection.';
