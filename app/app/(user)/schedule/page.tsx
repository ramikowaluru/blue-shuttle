'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Badge } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

type SessionWithBooking = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  max_players: number;
  venue: string;
  confirmed_count: number;
  is_booked: boolean;
};

export default function SchedulePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<SessionWithBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchSessions();
    }
  }, [user, authLoading, router]);

  async function fetchSessions() {
    if (!user) return;

    setLoading(true);
    try {
      // Get upcoming sessions
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(10);

      if (sessionsData) {
        const sessionsWithBookings = await Promise.all(
          sessionsData.map(async (session) => {
            // Get confirmed bookings count
            const { count } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.id)
              .eq('status', 'confirmed');

            // Check if user has booked
            const { data: userBooking } = await supabase
              .from('bookings')
              .select('id')
              .eq('session_id', session.id)
              .eq('user_id', user.id)
              .eq('status', 'confirmed')
              .maybeSingle();

            return {
              ...session,
              confirmed_count: count || 0,
              is_booked: !!userBooking,
            };
          })
        );

        setSessions(sessionsWithBookings);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Upcoming Sessions</h1>

        <div className="space-y-3">
          {sessions.length === 0 ? (
            <Card padding="lg">
              <p className="text-center text-gray-600">
                No upcoming sessions scheduled
              </p>
            </Card>
          ) : (
            sessions.map((session) => {
              const sessionDate = new Date(session.date);
              const dayName = sessionDate.toLocaleDateString('en-GB', { weekday: 'long' });
              const dateStr = sessionDate.toLocaleDateString('en-GB', {
                month: 'short',
                day: 'numeric',
              });
              const spotsLeft = session.max_players - session.confirmed_count;

              return (
                <Card
                  key={session.id}
                  padding="lg"
                  variant={session.is_booked ? 'success' : 'default'}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{dayName}</h3>
                        {session.is_booked && <span className="text-2xl">✓</span>}
                      </div>
                      <p className="text-lg mb-1">{dateStr}</p>
                      <p className="text-base mb-3">
                        {session.start_time} - {session.end_time}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        {session.venue}
                      </p>

                      <div className="flex gap-2">
                        <Badge
                          variant={session.is_booked ? 'success' : 'neutral'}
                          size="sm"
                        >
                          {session.confirmed_count} confirmed
                        </Badge>
                        <Badge
                          variant={spotsLeft > 0 ? 'success' : 'danger'}
                          size="sm"
                        >
                          {spotsLeft} spots left
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {session.is_booked && (
                    <p className="mt-3 font-medium">You're booked for this session</p>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
