# Database Setup Guide

## Supabase Configuration

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to finish setting up

### 2. Get Your API Keys

1. Go to Project Settings > API
2. Copy your `Project URL` and `anon/public` key
3. Create a `.env.local` file in the `/app` directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run the Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy the entire contents of `lib/supabase/schema.sql`
4. Run the query

This will create:
- `profiles` table (user data)
- `sessions` table (Friday sessions)
- `bookings` table (player bookings)
- `payments` table (payment tracking)
- Row Level Security (RLS) policies
- Automatic triggers and functions

### 4. Create Your First Admin User

1. Go to Authentication > Users in Supabase dashboard
2. Add a new user manually with your email
3. After user is created, go to SQL Editor and run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## Database Schema Overview

### Tables

**profiles**
- Extends Supabase auth.users
- Stores role (player/admin) and payment preferences
- Auto-created on user signup

**sessions**
- Represents Friday badminton sessions
- Contains date, time, venue, max players
- Created by admins

**bookings**
- Links users to sessions
- Can be confirmed or cancelled
- Enforces unique constraint (one booking per user per session)

**payments**
- Tracks weekly or monthly payments
- Links to users and optionally sessions
- Status: pending, paid, overdue

### Security

All tables have Row Level Security (RLS) enabled:
- Users can view most data
- Users can only modify their own data
- Admins have elevated permissions
- Enforced at database level (secure)

## Testing the Setup

Run this query to verify everything is set up:

```sql
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.table_constraints
   WHERE constraint_type = 'CHECK'
   AND table_name = t.table_name) as check_constraints,
  (SELECT COUNT(*) FROM pg_policies
   WHERE tablename = t.table_name) as rls_policies
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';
```

You should see 4 tables with RLS policies applied.
