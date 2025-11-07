'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(email: string, password: string) {
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single<{ role: 'player' | 'admin' }>();

      if (!profileError && profile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await handleLogin(email, password);
  }

  async function handleAdminLogin() {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      await handleLogin(adminEmail, adminPassword);
    } else {
      setError('Admin credentials not configured');
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Blue Shuttle</h1>
        <p className="text-gray-600">Friday Badminton Club</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <div className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-neutral-border">
        <Button
          type="button"
          onClick={handleAdminLogin}
          fullWidth
          variant="secondary"
          disabled={loading}
          className="bg-black text-white hover:bg-gray-800"
        >
          {loading ? 'Signing in...' : '🔑 Quick Admin Login'}
        </Button>
        <p className="mt-2 text-xs text-center text-gray-500">
          Admin quick access
        </p>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-primary font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}
