-- Create github_installations table to store GitHub App installation data
CREATE TABLE IF NOT EXISTS github_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  installation_id TEXT NOT NULL UNIQUE,
  account JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_github_installations_user_id ON github_installations(user_id);
CREATE INDEX IF NOT EXISTS idx_github_installations_installation_id ON github_installations(installation_id);

-- Enable RLS
ALTER TABLE github_installations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view their own GitHub installations" ON github_installations;
DROP POLICY IF EXISTS "Users can insert their own GitHub installations" ON github_installations;
DROP POLICY IF EXISTS "Users can update their own GitHub installations" ON github_installations;
DROP POLICY IF EXISTS "Users can delete their own GitHub installations" ON github_installations;

-- Users can only see their own installations
CREATE POLICY "Users can view their own GitHub installations"
  ON github_installations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own installations
CREATE POLICY "Users can insert their own GitHub installations"
  ON github_installations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own installations
CREATE POLICY "Users can update their own GitHub installations"
  ON github_installations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own installations
CREATE POLICY "Users can delete their own GitHub installations"
  ON github_installations
  FOR DELETE
  USING (auth.uid() = user_id);

