# Design Decisions - Blue Shuttle Badminton Club

## 1. Technology Stack

**Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
**Backend**: Supabase (PostgreSQL + Auth + Real-time)
**Hosting**: Vercel (Free tier)
**Notifications**: Web Push API / OneSignal
**PWA**: next-pwa

**Rationale**:
- Single codebase for web + mobile (PWA)
- Zero hosting cost with free tiers
- TypeScript for type safety
- Supabase provides auth, database, real-time out of the box
- Next.js App Router for better performance and DX

## 2. Information Architecture (Simplified)

### User Flow:
```
Login → Dashboard → [Book/Cancel | View Schedule | Make Payment]
```

### Admin Flow:
```
Login → Admin Dashboard → [Create Session | Manage Session | Mark Payments]
```

**Rationale**: Reduced from complex multi-step flows to single-page actions where possible.

## 3. Database Schema

### Core Entities:
- **users**: id, email, name, role (player/admin), payment_preference (weekly/monthly)
- **sessions**: id, date, start_time, end_time, max_players, venue
- **bookings**: id, user_id, session_id, created_at
- **payments**: id, user_id, session_id, amount, status, paid_at

**Rationale**:
- Simple normalized structure
- No over-engineering with status machines
- Direct relationship tracking
- Payment tracking separated for clarity

## 4. Design System

### Colors:
- **Primary Green**: `#2D7A2E` (confirmed bookings, success, CTAs)
- **Dark/Black**: `#1A1A1A` (admin sections, headers)
- **Red**: `#DC2626` (pending, errors)
- **Neutral**: Beige/Cream backgrounds `#F5F5F0`
- **White**: Cards and content areas

### Typography:
- **System fonts**: -apple-system, BlinkMacSystemFont for performance
- **Sizes**: Mobile-first (16px base, scales up for desktop)

### Components:
- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: Full-width on mobile, auto on desktop
- **Avatar Circles**: Initials-based, colored backgrounds
- **Status Pills**: Green (paid), Red (pending), Gray (cancelled)

**Rationale**:
- Simple, accessible color scheme
- Green = positive action (derived from designs)
- System fonts = better performance, no web font loading
- Mobile-first = better UX for primary use case

## 5. File Structure (Max 200 lines per file)

```
/app
  /(auth)           # Auth group
  /(user)           # User pages
  /(admin)          # Admin pages
/components
  /ui               # Design system components (<100 lines each)
  /features         # Feature-specific components
/lib
  /supabase         # DB client
  /hooks            # Custom hooks
  /utils            # Helpers
/types              # TypeScript types
```

**Rationale**:
- Route groups for logical separation
- Small, focused files for maintainability
- Clear separation of concerns
- Shared UI components prevent duplication

## 6. Key Simplifications

### From Original Designs:
1. **No complex booking flow**: Single button to book/cancel
2. **Payment is offline**: Just bank transfer details + mark as paid
3. **No in-app messaging**: Relies on external (WhatsApp)
4. **Auto-created sessions**: Admin creates sessions, not automated
5. **Simplified notifications**: Email only initially (PWA push later)

### User Actions Reduced:
- Book/Cancel: 1 click
- View Payment: 1 click (shows bank details)
- Mark Payment Made: 1 click (user-initiated)

### Admin Actions:
- Create Session: Simple form (date/time/spots)
- Mark Paid: 1 click per user
- View Dashboard: Real-time stats

**Rationale**:
- 16-20 players = simple system sufficient
- Weekly cadence = less complexity needed
- Manual payment confirmation = no payment gateway fees
- Trust-based system works for small community

## 7. Progressive Enhancement

### Phase 1 (MVP - Week 1-2):
- Auth (login/signup)
- User dashboard
- Booking system
- Admin dashboard
- Payment tracking

### Phase 2 (Week 3):
- PWA configuration
- Offline support
- Install prompts

### Phase 3 (Week 4):
- Push notifications
- Reports/Export
- Polish

**Rationale**: Ship fast, iterate based on real usage.

## 8. Performance Targets

- **Lighthouse Score**: 90+ on all metrics
- **Load Time**: <2s on 3G
- **Bundle Size**: <200KB initial JS
- **Database**: <10MB for first year

**How**:
- Server components by default
- Minimal client-side JS
- Optimistic updates where possible
- Image optimization with Next.js Image

## 9. Security Decisions

- **Auth**: Supabase Auth (email + password)
- **RLS**: Row-level security for all tables
- **HTTPS**: Enforced via Vercel
- **No credit cards**: Bank transfer only (reduces liability)
- **Admin role check**: Server-side on every admin action

## 10. Mobile-First Principles

- Touch targets: Minimum 44px
- Full-width buttons on mobile
- Bottom navigation for key actions
- Swipe gestures for common actions
- No hover states required for functionality

**Rationale**: Primary usage will be on mobile devices, desktop is secondary.
