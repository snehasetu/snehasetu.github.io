# Supabase Authentication Setup Guide

This guide will help you set up Supabase Google OAuth authentication for Snehasetu.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Google Cloud account for OAuth setup

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Snehasetu (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** gear icon
2. Navigate to **API** in the left sidebar
3. You'll find two important values:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY`)

## Step 3: Set Up Google OAuth Provider

### Get Google OAuth Credentials

1. Go to https://console.cloud.google.com
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted
6. For Application type, select **Web application**
7. Add authorized redirect URIs:
   ```
   https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback
   ```
   Replace `[YOUR_SUPABASE_PROJECT_REF]` with your project reference (found in your Supabase project URL)

8. Save and copy your **Client ID** and **Client Secret**

### Configure Google Provider in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click to enable it
3. Enter your Google OAuth credentials:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
4. Click **Save**

## Step 4: Add Environment Variables to Replit

1. In your Replit project, click the **Secrets** tab (lock icon in left sidebar)
2. Add the following secrets:

   ```
   VITE_SUPABASE_URL = your_supabase_project_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
   ```

3. Click "Add new secret" for each one

## Step 5: Restart Your Application

1. Stop your running application (if it's running)
2. Start it again - the authentication should now work!

## Testing Authentication

1. Navigate to `/register` in your application
2. Choose either "Volunteer / Donor" or "Old Age Home"
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected back to the application
6. Check the user menu in the navbar to see your profile

## User Roles and Approval

- **Volunteers/Donors**: Automatically approved upon registration
- **Old Age Homes**: Require manual approval before they can post needs
  - OAH users can browse but cannot access the dashboard until approved
  - Approval is done through the backend API (admin interface to be built)

## Troubleshooting

### "Supabase is not configured" error

- Make sure all three environment variables are set in Replit Secrets
- Restart your application after adding secrets

### Google OAuth redirect error

- Verify the redirect URI in Google Cloud Console matches your Supabase callback URL exactly
- Make sure Google OAuth is enabled in Supabase dashboard

### Users not being created

- Check browser console for errors
- Verify the backend server logs for API errors
- Ensure your database is accessible

## Database Schema

The application uses in-memory storage by default. To persist users, you'll need to:

1. Enable PostgreSQL database in Replit
2. Run migrations to create the users table
3. The schema is defined in `shared/schema.ts`

## Next Steps

- Set up database migrations for persistent storage
- Create admin interface to approve OAH accounts
- Add email notifications for approval status
- Implement password reset flow (if needed)
