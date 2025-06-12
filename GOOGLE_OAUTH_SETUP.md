# Google OAuth Setup Instructions

## Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one

## Step 2: Enable Google+ API
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" if available

## Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "ChatSpace"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email) if in testing mode

## Step 4: Configure OAuth 2.0 Client
1. Go to "APIs & Services" > "Credentials"
2. Find your OAuth 2.0 Client ID: `438377522721-fcbvqsl87cu23vcv11arkghln2o5rltd.apps.googleusercontent.com`
3. Click on it to edit
4. Add these to "Authorized JavaScript origins":
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
   - `https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--858c0e43.local-credentialless.webcontainer-api.io`
   - `https://your-domain.com` (for production)

## Step 5: Authorized Redirect URIs (if needed)
Add these redirect URIs:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--858c0e43.local-credentialless.webcontainer-api.io`

## Step 6: Publish Your App (for production)
1. Go back to "OAuth consent screen"
2. Click "Publish App" to make it available to all users
3. Or keep it in testing mode and add specific test users

## Important Notes for WebContainer Development:
- **WebContainer URLs are dynamic**: Each time you restart or redeploy, you may get a different URL
- **Current WebContainer URL**: `https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--858c0e43.local-credentialless.webcontainer-api.io`
- **Action Required**: You must add the current WebContainer URL to your Google Cloud Console OAuth settings
- **Steps to add current URL**:
  1. Copy the current URL from your browser address bar
  2. Go to Google Cloud Console > APIs & Services > Credentials
  3. Edit your OAuth 2.0 Client ID
  4. Add the current URL to both "Authorized JavaScript origins" and "Authorized redirect URIs"
  5. Save the changes
  6. Wait 5-10 minutes for changes to propagate

## Common Issues:
- **Error 403: access_blocked** - App not published or user not in test users
- **Error 400: redirect_uri_mismatch** - Domain not in authorized origins
- **Error 400: invalid_client** - Client ID incorrect or not configured properly
- **GSI_LOGGER: Failed to open popup window** - Current URL not in authorized origins (most common in WebContainer)

## Testing:
After configuration, wait 5-10 minutes for changes to propagate, then test the login.

## Quick Fix for Current Session:
1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on OAuth 2.0 Client ID: `438377522721-fcbvqsl87cu23vcv11arkghln2o5rltd.apps.googleusercontent.com`
3. Add this URL to "Authorized JavaScript origins": `https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--858c0e43.local-credentialless.webcontainer-api.io`
4. Add the same URL to "Authorized redirect URIs"
5. Save and wait 5-10 minutes