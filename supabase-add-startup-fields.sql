-- Add startup_name, has_launched_token, has_live_token, and token_contract columns to whitelist table
ALTER TABLE whitelist 
ADD COLUMN IF NOT EXISTS startup_name TEXT,
ADD COLUMN IF NOT EXISTS has_launched_token BOOLEAN,
ADD COLUMN IF NOT EXISTS has_live_token BOOLEAN,
ADD COLUMN IF NOT EXISTS token_contract TEXT;

