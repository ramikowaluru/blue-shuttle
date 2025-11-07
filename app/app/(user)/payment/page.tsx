'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default function PaymentPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [amount, setAmount] = useState(12);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  async function handlePaymentRecorded() {
    if (!user) return;

    setLoading(true);
    try {
      const now = new Date();

      await supabase.from('payments').insert({
        user_id: user.id,
        amount,
        payment_type: 'weekly',
        status: 'pending',
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error recording payment:', error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 text-center max-w-md">
          <div className="text-primary text-5xl mb-4">✓</div>
          <h2 className="text-xl font-bold mb-2">Payment Recorded!</h2>
          <p className="text-gray-600">Maz will confirm once received</p>
        </Card>
      </div>
    );
  }

  const reference = user ? `${profile?.full_name.split(' ').map(n => n[0]).join('')}-${new Date().toISOString().split('T')[0]}` : '';

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Make a Payment</h1>

        {/* Booking Confirmation */}
        <Card variant="success" padding="lg">
          <p className="text-sm opacity-90 mb-1">Booked for</p>
          <p className="text-xl font-bold">Friday, Oct 6, 7-9 PM</p>
          <div className="flex gap-2 mt-3">
            <span className="text-sm opacity-90">9 confirmed</span>
            <span className="text-sm opacity-90">• 3 spots left</span>
          </div>
        </Card>

        {/* Payment Details */}
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💳</span>
            <h2 className="text-xl font-semibold">Payment Details</h2>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-neutral-border">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-xl">£{amount}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">For:</span>
              <span className="font-semibold">Friday, Oct 6</span>
            </div>
          </div>

          <div className="bg-neutral-bg p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg mb-3">Transfer to Maz:</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Sort Code:</span>
              <span className="font-mono font-semibold">12-34-56</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account:</span>
              <span className="font-mono font-semibold">12345678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-mono font-semibold text-sm">{reference}</span>
            </div>
          </div>

          <Button
            onClick={handlePaymentRecorded}
            fullWidth
            size="lg"
            className="mt-6"
            disabled={loading}
          >
            {loading ? 'Recording...' : "I've Made the Payment"}
          </Button>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold">4</div>
            <div className="text-sm text-gray-600">Sessions played</div>
          </Card>
          <Card padding="md" className="text-center">
            <div className="text-3xl font-bold text-primary">Paid</div>
            <div className="text-sm text-gray-600">October dues</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
