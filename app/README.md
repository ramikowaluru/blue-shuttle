# Blue Shuttle - Badminton Booking System

A Progressive Web App (PWA) for managing Friday badminton club bookings and payments.

## Features

### For Players
- 📅 View and book Friday sessions
- 💳 Track payment status
- 📊 View session statistics
- 📱 Install as mobile app (PWA)
- ⚡ Offline support

### For Admins
- 🎯 Create and manage sessions
- 👥 View all bookings
- 💰 Track payments
- 📈 Revenue and attendance analytics

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel (free tier)
- **PWA**: Custom service worker

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)
- Vercel account (free tier)

## Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd app
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `lib/supabase/schema.sql` in the SQL Editor
3. Copy your project URL and anon key from Project Settings > API

### 4. Configure Environment Variables

Create a `.env.local` file:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### 6. Create Admin User

1. Sign up through the app
2. In Supabase SQL Editor, run:

\`\`\`sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
\`\`\`

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

The app will be available at `your-project.vercel.app`

## Project Structure

\`\`\`
app/
├── (auth)/           # Authentication pages
├── (user)/           # Player dashboard
├── (admin)/          # Admin dashboard
├── api/              # API routes
components/
├── ui/               # Reusable UI components
├── features/         # Feature-specific components
lib/
├── supabase/         # Database client & schema
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
types/                # TypeScript types
public/               # Static assets & PWA files
\`\`\`

## Key Design Decisions

- **Mobile-first**: 44px minimum touch targets
- **Modular**: Max 200 lines per file
- **Type-safe**: TypeScript throughout
- **Zero cost**: Free hosting on Vercel + Supabase
- **Offline-ready**: PWA with service worker
- **Simple payments**: Bank transfer (no fees)

## Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
\`\`\`

## Database Schema

See `DATABASE_SETUP.md` for detailed schema documentation.

## Contributing

This is a small community project. Feel free to suggest improvements!

## License

MIT
