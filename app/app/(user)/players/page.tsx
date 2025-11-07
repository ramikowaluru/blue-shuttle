'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Badge, Avatar } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

type Player = {
  id: string;
  full_name: string;
  email: string;
  payment_preference: 'weekly' | 'monthly';
  sessions_played?: number;
};

export default function PlayersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchPlayers();
    }
  }, [user, authLoading, router]);

  async function fetchPlayers() {
    setLoading(true);
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'player')
        .order('full_name');

      if (profiles) {
        const playersWithStats = await Promise.all(
          profiles.map(async (profile) => {
            const { count } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', profile.id)
              .eq('status', 'confirmed');

            return {
              ...profile,
              sessions_played: count || 0,
            };
          })
        );

        setPlayers(playersWithStats);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading players...</p>
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

        <h1 className="text-2xl font-bold mb-6">Players List</h1>

        <div className="space-y-2">
          {players.length === 0 ? (
            <Card padding="lg">
              <p className="text-center text-gray-600">No players found</p>
            </Card>
          ) : (
            players.map((player) => (
              <Card key={player.id} padding="md">
                <div className="flex items-center gap-3">
                  <Avatar name={player.full_name} size="md" />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {player.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {player.email}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="neutral" size="sm">
                        {player.payment_preference}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {player.sessions_played} sessions
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card padding="md" className="bg-neutral-bg text-center">
          <p className="text-sm text-gray-600">
            Total: {players.length} players
          </p>
        </Card>
      </div>
    </div>
  );
}
