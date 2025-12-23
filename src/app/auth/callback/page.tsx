'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession();
      if (!error) {
        router.replace('/dashboard'); // ganti sesuai tujuan
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Login berhasil, mengalihkan...</p>
    </div>
  );
}
