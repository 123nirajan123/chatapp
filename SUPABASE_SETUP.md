# Supabase Setup Instructions for ChatSpace

## Step 1: Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `ChatSpace`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## Step 2: Configure Authentication
1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Site URL", add your development URL:
   - `http://localhost:5173`
   - `https://your-webcontainer-url` (current: `https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--858c0e43.local-credentialless.webcontainer-api.io`)
3. Under "Redirect URLs", add the same URLs
4. Enable Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials:
     - Client ID: `438377522721-fcbvqsl87cu23vcv11arkghln2o5rltd.apps.googleusercontent.com`
     - Client Secret: (get from Google Cloud Console)

## Step 3: Run Database Migrations
1. The migration file `supabase/migrations/create_users_and_messages.sql` will create:
   - `users` table for user profiles
   - `messages` table for chat messages
   - Row Level Security (RLS) policies
   - Real-time subscriptions
   - Indexes for performance

2. To apply the migration:
   - Copy the SQL from the migration file
   - Go to SQL Editor in your Supabase dashboard
   - Paste and run the SQL

## Step 4: Get Your Environment Variables
1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon (public) key
3. Create a `.env` file in your project root:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 5: Configure Google OAuth in Supabase
1. In Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID: `438377522721-fcbvqsl87cu23vcv11arkghln2o5rltd.apps.googleusercontent.com`
   - Client Secret: (from Google Cloud Console)
4. The redirect URL should be: `https://your-project-id.supabase.co/auth/v1/callback`

## Step 6: Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add these to "Authorized JavaScript origins":
   - `https://your-project-id.supabase.co`
4. Add these to "Authorized redirect URIs":
   - `https://your-project-id.supabase.co/auth/v1/callback`

## Features Enabled:
- ✅ Real-time messaging with Supabase Realtime
- ✅ Google OAuth authentication
- ✅ User profiles with unique display IDs
- ✅ Message history persistence
- ✅ Row Level Security for data protection
- ✅ Automatic user session management
- ✅ Responsive design with connection status

## Database Schema:
- **users**: Stores user profiles with Google OAuth integration
- **messages**: Stores chat messages with user relationships
- **RLS Policies**: Secure data access based on authentication
- **Real-time**: Live message updates across all connected clients

## Testing:
1. Ensure your `.env` file has the correct Supabase credentials
2. Make sure Google OAuth is configured in both Supabase and Google Cloud Console
3. Test the login flow and real-time messaging
4. Check the Supabase dashboard to see data being created

## Troubleshooting:
- **Authentication errors**: Check Google OAuth configuration
- **Database errors**: Verify migration was applied correctly
- **Real-time not working**: Check if RLS policies allow read access
- **Environment variables**: Ensure `.env` file is properly configured