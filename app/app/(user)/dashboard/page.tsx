'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Session = Database['public']['Tables']['sessions']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [nextSession, setNextSession] = useState<Session | null>(null);
  const [myBooking, setMyBooking] = useState<Booking | null>(null);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [recentPayment, setRecentPayment] = useState<Payment | null>(null);
  const [stats, setStats] = useState({ sessionsPlayed: 0, monthlyStatus: 'pending' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  async function fetchDashboardData() {
    if (!user) return;

    try {
      // Get next Friday session
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1)
        .returns<Session[]>();

      if (sessions && sessions.length > 0) {
        setNextSession(sessions[0]);

        // Check if user has booked this session
        const { data: booking } = await supabase
          .from('bookings')
          .select('*')
          .eq('session_id', sessions[0].id)
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .maybeSingle<Booking>();

        setMyBooking(booking);

        // Get confirmed bookings count
        const { count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', sessions[0].id)
          .eq('status', 'confirmed');

        setConfirmedCount(count || 0);
      }

      // Get recent payment for this user
      const now = new Date();
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', now.getMonth() + 1)
        .eq('year', now.getFullYear())
        .maybeSingle<Payment>();

      setRecentPayment(payment);

      // Get stats - sessions played
      const { count: sessionsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'confirmed');

      setStats({
        sessionsPlayed: sessionsCount || 0,
        monthlyStatus: payment?.status === 'paid' ? 'paid' : 'pending',
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking() {
    if (!user || !nextSession) return;

    try {
      if (myBooking) {
        // Cancel booking
        // @ts-ignore - Supabase type issue
        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', myBooking.id);
        setMyBooking(null);
        setConfirmedCount((prev) => prev - 1);
      } else {
        // Create booking
        // @ts-ignore - Supabase type issue
        const { data } = await supabase
          .from('bookings')
          .insert({
            user_id: user.id,
            session_id: nextSession.id,
            status: 'confirmed',
          })
          .select()
          .single();

        if (data) {
          setMyBooking(data);
          setConfirmedCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error booking:', error);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const sessionDate = nextSession
    ? new Date(nextSession.date).toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {profile.full_name.split(' ')[0]}</h1>
            <p className="text-gray-600">Regular Player</p>
          </div>
          <button className="text-2xl">⋮</button>
        </div>

        {/* Next Session */}
        {nextSession ? (
          <Card variant={myBooking ? 'success' : 'default'} padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">This Friday</p>
                <h2 className="text-3xl font-bold">{sessionDate}</h2>
                <p className="text-xl mt-1">
                  {nextSession.start_time} - {nextSession.end_time}
                </p>
              </div>
              {myBooking && <div className="text-4xl">✓</div>}
            </div>

            <div className="flex gap-2 text-sm mb-4 opacity-90">
              <Badge variant="neutral">{confirmedCount} confirmed</Badge>
              <Badge variant={nextSession.max_players - confirmedCount > 0 ? 'success' : 'danger'}>
                {nextSession.max_players - confirmedCount} spots left
              </Badge>
            </div>

            {myBooking ? (
              <p className="font-medium text-lg">You're booked! See you Friday.</p>
            ) : (
              <Button onClick={handleBooking} fullWidth size="lg">
                Book This Session
              </Button>
            )}
          </Card>
        ) : (
          <Card padding="lg">
            <p className="text-center text-gray-600">No upcoming sessions scheduled</p>
          </Card>
        )}

        {/* Payment Status */}
        <Card padding="md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div className="flex-1">
              <h3 className="font-semibold">Payment Recorded</h3>
              <p className="text-sm text-gray-600">Maz will confirm once received</p>
            </div>
            {myBooking && <div className="text-primary text-xl">✓</div>}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold">{stats.sessionsPlayed}</div>
            <div className="text-sm text-gray-600">Sessions played</div>
          </Card>
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold text-primary">
              {stats.monthlyStatus === 'paid' ? 'Paid' : 'Pending'}
            </div>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleString('default', { month: 'long' })} dues
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full p-4 bg-white rounded-lg border border-neutral-border text-left flex items-center gap-3 hover:bg-gray-50 touch-manipulation">
              <span>📅</span>
              <span className="font-medium">View Schedule</span>
            </button>
            <button
              onClick={() => router.push('/payment')}
              className="w-full p-4 bg-white rounded-lg border border-neutral-border text-left flex items-center gap-3 hover:bg-gray-50 touch-manipulation"
            >
              <span>💳</span>
              <span className="font-medium">Make a Payment</span>
            </button>
            <button className="w-full p-4 bg-white rounded-lg border border-neutral-border text-left flex items-center gap-3 hover:bg-gray-50 touch-manipulation">
              <span>👥</span>
              <span className="font-medium">Players List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
