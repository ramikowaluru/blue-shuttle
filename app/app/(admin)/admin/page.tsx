'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Badge } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

type SessionWithBookings = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  max_players: number;
  bookingsCount: number;
  pendingPayments: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, isAdmin } = useAuth();
  const [nextSession, setNextSession] = useState<SessionWithBookings | null>(null);
  const [stats, setStats] = useState({ revenue: 0, players: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    } else if (user && isAdmin) {
      fetchDashboardData();
    }
  }, [user, isAdmin, authLoading, router]);

  async function fetchDashboardData() {
    try {
      // Get next session
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1);

      if (sessions && sessions[0]) {
        const session = sessions[0];

        // Get bookings count for this session
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', session.id)
          .eq('status', 'confirmed');

        // Get pending payments for this session
        const { count: pendingCount } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        setNextSession({
          ...session,
          bookingsCount: bookingsCount || 0,
          pendingPayments: pendingCount || 0,
        });
      }

      // Get stats for current month
      const now = new Date();
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('month', now.getMonth() + 1)
        .eq('year', now.getFullYear())
        .eq('status', 'paid');

      const revenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Get total players
      const { count: playersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'player');

      // Get sessions this month
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const { count: sessionsCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .gte('date', firstDay)
        .lte('date', lastDay);

      setStats({
        revenue,
        players: playersCount || 0,
        sessions: sessionsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
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

  if (!profile || !isAdmin) return null;

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
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">{profile.full_name} • Organizer</p>
          </div>
          <button className="text-2xl">⋮</button>
        </div>

        {/* Next Session Card */}
        {nextSession ? (
          <Card variant="default" padding="none" className="bg-black text-white overflow-hidden">
            <div className="p-6">
              <p className="text-sm opacity-75 mb-2">This Friday - {sessionDate}</p>
              <div className="flex gap-3 mb-4">
                <Badge variant="neutral" className="bg-gray-700 text-white">
                  {nextSession.bookingsCount} confirmed
                </Badge>
                <Badge variant="danger" className="bg-red-900 text-white">
                  {nextSession.pendingPayments} pending payment
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/admin/session/${nextSession.id}`)}
              fullWidth
              className="rounded-none bg-white text-black hover:bg-gray-100"
              size="lg"
            >
              Manage Session
            </Button>
          </Card>
        ) : (
          <Card padding="lg">
            <p className="text-center text-gray-600 mb-4">No upcoming sessions</p>
            <Button onClick={() => router.push('/admin/create-session')} fullWidth>
              Create New Session
            </Button>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold">£{stats.revenue}</div>
            <div className="text-xs text-gray-600">This month</div>
          </Card>
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold">{stats.players}</div>
            <div className="text-xs text-gray-600">Players</div>
          </Card>
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold">{stats.sessions}</div>
            <div className="text-xs text-gray-600">Sessions</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/admin/create-session')}
              className="w-full p-4 bg-black text-white rounded-lg text-left flex items-center gap-3 hover:bg-gray-900 touch-manipulation"
            >
              <span>✚</span>
              <span className="font-medium">Create New Session</span>
            </button>
            <button
              onClick={() => router.push('/admin/payments')}
              className="w-full p-4 bg-white rounded-lg border border-neutral-border text-left flex items-center gap-3 hover:bg-gray-50 touch-manipulation"
            >
              <span>💳</span>
              <span className="font-medium">Manage Payments</span>
            </button>
            <button className="w-full p-4 bg-white rounded-lg border border-neutral-border text-left flex items-center gap-3 hover:bg-gray-50 touch-manipulation">
              <span>👥</span>
              <span className="font-medium">View All Players</span>
            </button>
            <button className="w-full p-4 bg-white rounded-lg border border-neutral-border text-left flex items-center gap-3 hover:bg-gray-50 touch-manipulation">
              <span>🔔</span>
              <span className="font-medium">Send Notification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
