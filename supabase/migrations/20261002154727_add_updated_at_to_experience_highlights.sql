ALTER TABLE experience_highlights ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
