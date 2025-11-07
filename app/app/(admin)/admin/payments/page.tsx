'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

type PlayerPayment = {
  id: string;
  full_name: string;
  email: string;
  payment_preference: 'weekly' | 'monthly';
  payment_id?: string;
  payment_status?: 'pending' | 'paid' | 'overdue';
  payment_amount?: number;
  session_id?: string;
};

export default function ManagePaymentsPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [players, setPlayers] = useState<PlayerPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    } else if (user && isAdmin) {
      fetchPayments();
    }
  }, [user, isAdmin, authLoading, router, selectedMonth, selectedYear]);

  async function fetchPayments() {
    setLoading(true);
    try {
      // Get all players
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'player')
        .order('full_name');

      if (!profiles) {
        setPlayers([]);
        return;
      }

      // Get payments for selected month/year
      const playersWithPayments = await Promise.all(
        profiles.map(async (profile) => {
          const { data: payment } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', profile.id)
            .eq('month', selectedMonth)
            .eq('year', selectedYear)
            .maybeSingle();

          return {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            payment_preference: profile.payment_preference,
            payment_id: payment?.id,
            payment_status: payment?.status,
            payment_amount: payment?.amount,
            session_id: payment?.session_id,
          };
        })
      );

      setPlayers(playersWithPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid(playerId: string, paymentId?: string) {
    try {
      if (paymentId) {
        // Update existing payment
        await supabase
          .from('payments')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('id', paymentId);
      } else {
        // Create new payment record
        const amount = selectedMonth ? 40 : 12; // Default monthly/weekly
        await supabase.from('payments').insert({
          user_id: playerId,
          amount,
          payment_type: 'monthly',
          status: 'paid',
          paid_at: new Date().toISOString(),
          month: selectedMonth,
          year: selectedYear,
        });
      }

      // Refresh data
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  }

  async function markAsPending(paymentId: string) {
    try {
      await supabase
        .from('payments')
        .update({
          status: 'pending',
          paid_at: null,
        })
        .eq('id', paymentId);

      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const paidCount = players.filter(p => p.payment_status === 'paid').length;
  const pendingCount = players.filter(p => !p.payment_status || p.payment_status === 'pending').length;
  const totalRevenue = players
    .filter(p => p.payment_status === 'paid')
    .reduce((sum, p) => sum + (p.payment_amount || 0), 0);

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Manage Payments</h1>

        {/* Month Selector */}
        <Card padding="md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-neutral-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month} {selectedYear}
              </option>
            ))}
          </select>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card padding="md" className="text-center">
            <div className="text-2xl font-bold text-primary">{paidCount}</div>
            <div className="text-xs text-gray-600">Paid</div>
          </Card>
          <Card padding="md" className="text-center">
            <div className="text-2xl font-bold text-danger">{pendingCount}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </Card>
          <Card padding="md" className="text-center">
            <div className="text-2xl font-bold">£{totalRevenue}</div>
            <div className="text-xs text-gray-600">Total</div>
          </Card>
        </div>

        {/* Players List */}
        <div>
          <h3 className="font-semibold mb-3">
            Players ({players.length})
          </h3>
          <div className="space-y-2">
            {players.length === 0 ? (
              <Card padding="lg">
                <p className="text-center text-gray-600">No players found</p>
              </Card>
            ) : (
              players.map((player) => (
                <Card
                  key={player.id}
                  padding="md"
                  className={player.payment_status === 'paid' ? 'border-primary' : ''}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={player.full_name} size="md" />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {player.full_name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {player.email}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="neutral" size="sm">
                          {player.payment_preference}
                        </Badge>
                        {player.payment_amount && (
                          <Badge variant="neutral" size="sm">
                            £{player.payment_amount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {player.payment_status === 'paid' ? (
                        <>
                          <Badge variant="success" className="whitespace-nowrap">
                            Paid ✓
                          </Badge>
                          <button
                            onClick={() => markAsPending(player.payment_id!)}
                            className="text-xs text-gray-600 hover:text-gray-900"
                          >
                            Undo
                          </button>
                        </>
                      ) : (
                        <Button
                          onClick={() => markAsPaid(player.id, player.payment_id)}
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
