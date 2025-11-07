'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

type SessionDetails = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  max_players: number;
  venue: string;
};

type BookingWithPlayer = {
  id: string;
  user_id: string;
  status: string;
  player_name: string;
  player_email: string;
  payment_status?: 'paid' | 'pending' | 'overdue';
  payment_amount?: number;
};

export default function ManageSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [session, setSession] = useState<SessionDetails | null>(null);
  const [bookings, setBookings] = useState<BookingWithPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    } else if (user && isAdmin) {
      fetchSessionData();
    }
  }, [user, isAdmin, authLoading, router, sessionId]);

  async function fetchSessionData() {
    setLoading(true);
    try {
      // Get session details
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (!sessionData) {
        router.push('/admin');
        return;
      }

      setSession(sessionData);

      // Get bookings with player info
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, user_id, status')
        .eq('session_id', sessionId)
        .eq('status', 'confirmed');

      if (bookingsData) {
        const bookingsWithPlayers = await Promise.all(
          bookingsData.map(async (booking) => {
            // Get player profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', booking.user_id)
              .single();

            // Get payment for this session
            const { data: payment } = await supabase
              .from('payments')
              .select('status, amount')
              .eq('user_id', booking.user_id)
              .eq('session_id', sessionId)
              .maybeSingle();

            return {
              ...booking,
              player_name: profile?.full_name || 'Unknown',
              player_email: profile?.email || '',
              payment_status: payment?.status,
              payment_amount: payment?.amount,
            };
          })
        );

        setBookings(bookingsWithPlayers);
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markPaymentStatus(userId: string, status: 'paid' | 'pending') {
    try {
      // Check if payment exists
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('user_id', userId)
        .eq('session_id', sessionId)
        .maybeSingle();

      if (existingPayment) {
        // Update existing
        await supabase
          .from('payments')
          .update({
            status,
            paid_at: status === 'paid' ? new Date().toISOString() : null,
          })
          .eq('id', existingPayment.id);
      } else {
        // Create new payment record
        await supabase.from('payments').insert({
          user_id: userId,
          session_id: sessionId,
          amount: 12,
          payment_type: 'weekly',
          status,
          paid_at: status === 'paid' ? new Date().toISOString() : null,
        });
      }

      fetchSessionData();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const sessionDate = new Date(session.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const paidCount = bookings.filter(b => b.payment_status === 'paid').length;
  const pendingCount = bookings.filter(b => !b.payment_status || b.payment_status === 'pending').length;

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-2">Manage Session</h1>
        <p className="text-gray-600 mb-6">
          {sessionDate} • {session.start_time}-{session.end_time}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card padding="md" className="text-center">
            <div className="text-2xl font-bold">{confirmedCount}</div>
            <div className="text-xs text-gray-600">Confirmed</div>
          </Card>
          <Card padding="md" className="text-center">
            <div className="text-2xl font-bold text-danger">{pendingCount}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </Card>
          <Card padding="md" className="text-center">
            <div className="text-2xl font-bold">{session.max_players - confirmedCount}</div>
            <div className="text-xs text-gray-600">Spots Left</div>
          </Card>
        </div>

        {/* Session Info */}
        <Card padding="md" className="bg-neutral-bg">
          <h3 className="font-semibold mb-3">Session Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Venue:</span>
              <span className="font-semibold">{session.venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-semibold">{session.max_players} players</span>
            </div>
          </div>
        </Card>

        {/* Confirmed Players */}
        <div>
          <h3 className="font-semibold mb-3">
            Confirmed Players ({confirmedCount})
          </h3>
          <div className="space-y-2">
            {bookings.length === 0 ? (
              <Card padding="lg">
                <p className="text-center text-gray-600">No bookings yet</p>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card
                  key={booking.id}
                  padding="md"
                  className={booking.payment_status === 'paid' ? 'border-primary' : ''}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={booking.player_name} size="md" />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {booking.player_name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {booking.player_email}
                      </p>
                      {booking.payment_amount && (
                        <p className="text-sm text-gray-600 mt-1">
                          £{booking.payment_amount}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {booking.payment_status === 'paid' ? (
                        <>
                          <Badge variant="success" className="whitespace-nowrap">
                            Paid ✓
                          </Badge>
                          <button
                            onClick={() => markPaymentStatus(booking.user_id, 'pending')}
                            className="text-xs text-gray-600 hover:text-gray-900"
                          >
                            Undo
                          </button>
                        </>
                      ) : (
                        <Button
                          onClick={() => markPaymentStatus(booking.user_id, 'paid')}
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
