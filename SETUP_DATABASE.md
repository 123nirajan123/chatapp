# Database Setup Instructions

## The Problem
The errors you're seeing indicate that the `users` and `messages` tables don't exist in your Supabase database yet. The migration file exists in your project, but it needs to be executed in your Supabase dashboard.

## Quick Fix - Execute the Migration

### Step 1: Copy the Migration SQL
The complete SQL migration is in `supabase/migrations/20250611160319_teal_rice.sql`. Here's the content you need to run:

```sql
/*
  # Create users and messages tables for ChatSpace

  1. New Tables
    - `users`
      - `id` (text, primary key) - Google's unique ID
      - `unique_id` (text, unique) - Our custom 6-digit display ID
      - `name` (text) - User's display name
      - `email` (text, unique) - User's email from Google
      - `avatar` (text) - User's avatar URL
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `user_id` (text, foreign key to users.id)
      - `content` (text) - Message content
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to insert their own data
    - Add policies for users to update their own profile
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  unique_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
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

-- Users policies
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

-- Messages policies
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
```

### Step 2: Execute in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire SQL code above
5. Click **Run** to execute the migration

### Step 3: Verify Tables Were Created
After running the SQL:
1. Go to **Table Editor** in your Supabase dashboard
2. You should see two new tables: `users` and `messages`
3. Check that both tables have the correct columns and structure

### Step 4: Test Your Application
Once the tables are created:
1. Refresh your application
2. Try logging in with Google
3. The errors should be resolved and the app should work properly

## What This Migration Creates:
- ✅ `users` table for storing user profiles
- ✅ `messages` table for storing chat messages
- ✅ Row Level Security (RLS) policies for data protection
- ✅ Indexes for better query performance
- ✅ Automatic timestamp updates
- ✅ Foreign key relationships between tables

## Troubleshooting:
- **Still getting errors?** Make sure you're connected to the correct Supabase project
- **Permission errors?** Ensure you're logged in as the project owner
- **SQL errors?** Copy the exact SQL from above - don't modify it
- **Tables not showing?** Refresh the Table Editor page

After completing these steps, your ChatSpace application should work without the database-related errors.