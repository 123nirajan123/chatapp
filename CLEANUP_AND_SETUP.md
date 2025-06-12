# Fix Database Setup - Handle Partial Migration

## The Issue
Your migration was partially executed, which is why you're getting the error about the policy already existing. We need to clean up and ensure all parts of the database are properly set up.

## Solution: Run This Clean SQL Script

Copy and paste this SQL script into your Supabase SQL Editor. This script will safely handle the partial migration state:

```sql
-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can read all user profiles" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can read all messages" ON messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create users table (will skip if already exists)
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  unique_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table (will skip if already exists)
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
CREATE POLICY "Users can read all user profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_users_unique_id ON users(unique_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify setup with a simple query
SELECT 'Database setup completed successfully!' as status;
```

## Steps to Execute:

1. **Go to your Supabase dashboard**
2. **Click on "SQL Editor" in the left sidebar**
3. **Click "New Query"**
4. **Copy and paste the entire SQL script above**
5. **Click "Run"**
6. **You should see "Database setup completed successfully!" at the bottom**

## After Running the Script:

1. **Refresh your ChatSpace application**
2. **Try logging in with Google again**
3. **The authentication should now work properly**

## What This Script Does:

- ✅ Safely removes any existing conflicting policies
- ✅ Creates tables if they don't exist (won't duplicate)
- ✅ Sets up fresh, clean policies
- ✅ Creates all necessary indexes
- ✅ Sets up automatic timestamp updates
- ✅ Verifies the setup completed successfully

This approach handles the partial migration state and ensures everything is set up correctly without conflicts.