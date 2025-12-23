'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User, LogOut, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  email: string;
}

export default function DashboardHeader({ email }: DashboardHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Tanggal di kiri */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        {new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </div>

      {/* User avatar + dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-gray-700 text-sm">{email.split('@')[0]}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
