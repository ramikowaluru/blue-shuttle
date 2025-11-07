# Deployment Guide

## Step-by-Step Deployment to Production

### 1. Prepare Supabase

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name: "blue-shuttle"
4. Set a strong database password (save it!)
5. Choose a region close to your users
6. Click "Create new project"

#### Run Database Schema
1. Wait for project to finish setting up
2. Go to SQL Editor
3. Click "New Query"
4. Copy entire contents of `lib/supabase/schema.sql`
5. Paste and click "Run"
6. Verify tables created in Table Editor

#### Get API Credentials
1. Go to Project Settings > API
2. Copy "Project URL"
3. Copy "anon public" key
4. Save both for next step

### 2. Deploy to Vercel

#### Initial Setup
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New... > Project"
4. Import your GitHub repository
5. Select the `app` directory as root directory

#### Configure Environment Variables
In Vercel project settings, add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
\`\`\`

#### Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Visit your URL: `<your-project>.vercel.app`

### 3. Create Admin Account

#### Sign Up
1. Visit your deployed app
2. Click "Sign up"
3. Create your admin account
4. You'll be redirected to player dashboard

#### Promote to Admin
1. Go to Supabase SQL Editor
2. Run this query with your email:

\`\`\`sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
\`\`\`

3. Log out and log back in
4. You should now see Admin Dashboard

### 4. Configure Custom Domain (Optional)

#### In Vercel:
1. Go to Project Settings > Domains
2. Add your domain
3. Follow DNS configuration instructions

### 5. Test the App

#### As Player:
- [ ] Sign up with test account
- [ ] View dashboard
- [ ] Book a session (once admin creates one)
- [ ] View payment details
- [ ] Cancel booking

#### As Admin:
- [ ] Create new session
- [ ] View bookings
- [ ] Check stats

### 6. Install as PWA

#### On Mobile (iOS):
1. Open app in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Name it "Blue Shuttle"
5. Tap "Add"

#### On Mobile (Android):
1. Open app in Chrome
2. Tap menu (three dots)
3. Tap "Install app" or "Add to Home screen"
4. Follow prompts

#### On Desktop:
1. Open app in Chrome
2. Look for install icon in address bar
3. Click to install

### 7. Production Checklist

- [ ] Database schema deployed
- [ ] Environment variables set in Vercel
- [ ] Admin account created
- [ ] Test booking flow works
- [ ] PWA installs correctly
- [ ] Custom domain configured (if needed)
- [ ] Bank transfer details updated in payment page
- [ ] Backup Supabase database

### 8. Ongoing Maintenance

#### Weekly:
- Review bookings
- Check payment statuses
- Create next Friday session

#### Monthly:
- Export data for records
- Review active players
- Check Supabase usage (free tier: 500MB)

#### As Needed:
- Update player roles
- Adjust pricing in payment page
- Modify session times/venues

### 9. Monitoring

#### Vercel:
- Check Analytics tab for usage
- Monitor build logs
- Check error logs

#### Supabase:
- Monitor database size (limit: 500MB)
- Check auth users (limit: 50,000 MAU)
- Review API usage

### 10. Backup Strategy

#### Database:
1. Go to Supabase Dashboard
2. Database > Backups
3. Enable automatic backups (available on paid plans)
4. Or manually export via SQL Editor

#### Code:
- Keep GitHub repo up to date
- Tag releases for major changes

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify Next.js version compatibility
- Check build logs in Vercel

### Authentication Issues
- Verify Supabase URL and key
- Check RLS policies are enabled
- Ensure user email is confirmed

### Database Connection
- Test Supabase connection in dashboard
- Verify network/firewall settings
- Check project status (not paused)

### PWA Not Installing
- Ensure manifest.json is accessible
- Check service worker is registered
- Verify HTTPS (required for PWA)

## Cost Breakdown

### Free Tier Limits:
- **Vercel**: Unlimited bandwidth, 100GB-hrs compute
- **Supabase**: 500MB database, 50,000 MAU, 2GB bandwidth
- **Total Cost**: £0/month

### When You'll Need to Upgrade:
- **Supabase**: >500MB data or >50,000 active users
- **Vercel**: Commercial use or heavy traffic

For 50-100 users: Free tier is sufficient!

## Support

Questions? Check:
1. GitHub Issues
2. Supabase Documentation
3. Vercel Documentation
4. Next.js Documentation
