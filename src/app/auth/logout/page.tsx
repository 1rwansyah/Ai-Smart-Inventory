// src/app/auth/logout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/middleware';

export default function LogoutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const logout = async () => {
      try {
        // Sign out from Supabase
        await supabase.auth.signOut();
        
        // Optional: Clear any additional local storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/auth/login');
          router.refresh();
        }, 1000);
      } catch (error) {
        console.error('Error during logout:', error);
        // Still redirect even if there's an error
        router.push('/auth/login');
      }
    };

    logout();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sedang keluar...</h2>
        <p className="text-gray-600">Anda akan diarahkan ke halaman login</p>
        <div className="mt-8">
          <div className="inline-flex space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}