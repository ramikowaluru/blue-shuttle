# Friday Badminton Club - Simplified Booking Portal User Journeys

## Current Situation
- **When:** Fridays only (2-hour sessions)
- **Organizer:** Maz manages everything
- **Payment:** Weekly or monthly to Maz's account
- **Current System:** WhatsApp messages for bookings
- **Budget:** ~£120/week (3 courts, 10-12 players)
- **Need:** Simple, cost-effective digital solution

---

## User Personas

### 1. **Maz (Organizer)**
- Manages weekly sessions
- Collects payments
- Tracks who's playing each week
- Needs to reduce WhatsApp admin work

### 2. **Regular Player (8-10 people)**
- Plays every Friday
- Pays monthly in advance
- Wants to easily confirm attendance

### 3. **Occasional Player (2-4 people)**
- Plays when space available
- Pays weekly
- Needs to know if spots are open

---

## Core User Journeys (Simplified)

### Journey 1: Weekly Session Setup (Maz)

**Goal:** Set up Friday's session and notify players

**Steps:**
1. **Monday - Open Booking**
   - Logs into simple admin page
   - Clicks "Create This Friday's Session"
   - System auto-fills date/time (Friday, 2 hours)
   - Sets available spots (10-12)

2. **Auto-Notify Players**
   - System sends email/SMS to all members
   - "Friday session open - confirm your spot"
   - Shows who's already confirmed

3. **Track Confirmations**
   - Dashboard shows confirmed players
   - Displays payment status (paid monthly/owes weekly)
   - Sends reminder on Wednesday

4. **Friday Morning**
   - Gets final list
   - System shows any last-minute cancellations

---

### Journey 2: Regular Player - Monthly Payment & Booking

**Goal:** Pay monthly and auto-book all Fridays

**Steps:**
1. **Start of Month**
   - Receives payment reminder
   - Clicks link to payment page
   - Pays monthly fee (£40-50)
   - Shows Maz's payment details or simple transfer option

2. **Auto-Booking**
   - System automatically reserves spot for all Fridays
   - Can opt-out of specific weeks

3. **Weekly Confirmation**
   - Gets Monday notification
   - One-click confirm or skip week
   - If skipping, spot opens for others

---

### Journey 3: Occasional Player - Weekly Booking

**Goal:** Book available spot and pay weekly

**Steps:**
1. **Check Availability**
   - Visits simple booking page
   - Sees if spots available this Friday
   - Views who else is playing

2. **Reserve Spot**
   - Clicks "Book This Week"
   - Enters name/email if first time

3. **Payment**
   - Sees weekly fee (£10-12)
   - Gets Maz's payment details
   - Marks as "Will Pay" or "Paid"

4. **Confirmation**
   - Receives confirmation email
   - Gets reminder to pay Maz

---

### Journey 4: Quick Cancellation

**Goal:** Cancel this week's session

**Steps:**
1. **Access Booking**
   - Clicks link in email/SMS
   - Or visits simple website

2. **Cancel**
   - One button: "Can't make it this week"
   - Spot immediately opens for others

3. **Notification**
   - Maz gets notified
   - Waitlist players get notified

---

### Journey 5: Payment Tracking (Maz)

**Goal:** Track who has paid

**Steps:**
1. **Payment Dashboard**
   - Simple list of players
   - Checkboxes for "Paid"
   - Shows monthly vs weekly payers

2. **Mark Payments**
   - When receives bank transfer
   - Ticks player as paid
   - System tracks payment history

3. **Send Reminders**
   - One-click reminder to unpaid players
   - Automatic Thursday reminder

---

## Technical Implementation (Cost-Effective)

### Option 1: Free/Cheap Tools (£0-10/month)
- **Google Forms** + **Google Sheets** for bookings
- **WhatsApp Business** for automated messages
- **Bank transfer** for payments
- **Google Sites** for simple website

### Option 2: Simple Booking Tool (£15-30/month)
- **Calendly** or **SimplyBook.me**
- **Stripe/PayPal** for optional online payments
- Email/SMS notifications included
- Mobile-friendly

### Option 3: Custom Simple Solution (£20-50/month hosting)
- Basic web app (could build with free tools)
- **Vercel/Netlify** free hosting
- **Supabase** free database
- **Sendgrid** free tier for emails
- Bank details displayed (no payment processing)

---

## MVP Features (Phase 1)

### Must Have:
1. **Simple booking page** - Shows Friday slots
2. **Player list** - Who's confirmed
3. **Payment tracking** - Manual marking by Maz
4. **Email/SMS notifications** - Automated reminders
5. **Mobile-friendly** - Works on phones

### Nice to Have (Phase 2):
- WhatsApp integration
- Waitlist feature
- Payment history
- Player statistics
- Court preferences

### Skip for Now:
- Online payment processing (use bank transfer)
- Complex scheduling (only Fridays)
- Membership tiers (keep it simple)
- Mobile app (use web)

---

## Simplified User Flow

```
Monday Morning:
Maz → Opens session → Players get notified

Monday-Thursday:
Players → Confirm spot → Pay Maz directly

Friday:
Maz → Checks final list → Manages session

Weekly Repeat
```

---

## Cost Breakdown

### Running Costs (Estimated):
- **Hosting:** £0-20/month
- **Domain:** £10/year
- **Email/SMS:** £5-10/month (or free tier)
- **Total:** £15-30/month maximum

### Per Player Cost:
- 12 players × 4 weeks = 48 player-sessions/month
- £30/month ÷ 48 = £0.62 per player per session
- Could charge £11 instead of £10 to cover platform

---

## Success Metrics

### For Maz:
- Time saved: From 2 hours/week on WhatsApp to 15 minutes
- Payment tracking: 100% visibility
- No-shows: Reduced by 50%

### For Players:
- Booking time: Under 30 seconds
- Can see who's playing
- Clear payment status
- No WhatsApp spam

---

## Implementation Recommendations

### Start With:
1. **Google Forms** for bookings (free, immediate)
2. **Google Sheets** for Maz to track (free)
3. **Email** for confirmations (free)
4. Test for 4 weeks

### Then Consider:
- Simple web app if Google Forms too limited
- Add SMS if emails not being read
- Add waitlist if demand increases

### Avoid Initially:
- Payment processing (fees eat into small amounts)
- Complex features (keep it simple)
- Native apps (expensive to maintain)

---

## Sample Messages

### Booking Confirmation:
```
Hi [Name],
You're confirmed for Friday Badminton!
📅 This Friday, 7-9pm
📍 [Venue]
💷 £10 (pay Maz via transfer)
👥 8 confirmed so far

Can't make it? Click here to cancel.
```

### Payment Reminder:
```
Hi [Name],
Reminder: Friday badminton payment due
💷 £10 for this week (or £40 monthly)
🏦 Transfer to Maz: [Account Details]
✅ Click here when paid

Thanks!
```