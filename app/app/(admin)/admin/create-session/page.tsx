'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default function CreateSessionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');
  const [maxPlayers, setMaxPlayers] = useState('12');
  const [venue, setVenue] = useState('Sports Complex, Court 1-3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('sessions').insert({
        date,
        start_time: startTime,
        end_time: endTime,
        max_players: parseInt(maxPlayers),
        venue,
        created_by: user.id,
      });

      if (insertError) throw insertError;

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  }

  // Calculate summary
  const summary = {
    date: date ? new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) : '',
    time: `${startTime} - ${endTime}`,
    spots: `${maxPlayers} players`,
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Create New Session</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <Input
            label="Number of Spots"
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            min="1"
            max="20"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Venue
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-border bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              placeholder="Maximum players for this session"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notify"
              className="w-5 h-5 rounded text-primary focus:ring-primary"
              defaultChecked
            />
            <label htmlFor="notify" className="text-sm">
              Notify all players when session is created
            </label>
          </div>

          {/* Summary */}
          {date && (
            <Card padding="md" className="bg-neutral-bg">
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{summary.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{summary.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spots:</span>
                  <span className="font-semibold">{summary.spots}</span>
                </div>
              </div>
            </Card>
          )}

          {error && (
            <div className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={loading}
            className="bg-black hover:bg-gray-900"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </Button>
        </form>
      </div>
    </div>
  );
}
