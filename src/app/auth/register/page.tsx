/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Form data sebelum submit:', formData);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      console.log('Memulai signup...');
      
      // **PERUBAHAN 1: Signup tanpa options data dulu**
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        // **COMMENT DULU options data**
        // options: {
        //   data: {
        //     business_name: formData.businessName,
        //     phone: formData.phone,
        //     plan: plan || 'free',
        //   }
        // }
      });

      console.log('Hasil signup:', { authData, authError });

      if (authError) {
        console.error('Error dari supabase auth:', authError);
        throw authError;
      }

      // **PERUBAHAN 2: Tunggu sebentar sebelum insert profile**
      if (authData.user) {
        console.log('User created:', authData.user.id);
        
        // Tunggu 2 detik untuk memastikan user benar-benar terbuat
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // **PERUBAHAN 3: Buat profile dengan error handling lebih baik**
        try {
          console.log('Membuat profile...');
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: formData.email.trim(),
              business_name: formData.businessName || '',
              phone: formData.phone || '',
              plan: plan || 'free',
            });

          if (profileError) {
            console.error('Error membuat profile:', profileError);
            // Jangan throw error untuk profile, lanjutkan saja
            // karena profile bisa dibuat nanti melalui trigger atau manual
          } else {
            console.log('Profile berhasil dibuat');
          }
        } catch (profileErr) {
          console.error('Catch error saat membuat profile:', profileErr);
          // Tetap lanjutkan, jangan berhenti
        }

        // **PERUBAHAN 4: Buat warehouse dengan error handling**
        try {
          console.log('Membuat warehouse...');
          const { error: warehouseError } = await supabase
            .from('warehouses')
            .insert({
              user_id: authData.user.id,
              name: 'Gudang Utama',
              location: 'Lokasi belum diatur',
              is_default: true,
            });

          if (warehouseError) {
            console.error('Error membuat warehouse:', warehouseError);
          } else {
            console.log('Warehouse berhasil dibuat');
          }
        } catch (warehouseErr) {
          console.error('Catch error saat membuat warehouse:', warehouseErr);
        }
      }

      // **PERUBAHAN 5: Success message lebih informatif**
      alert(`
        Registrasi berhasil! 🎉
        
        Email: ${formData.email}
        Status: ${authData.session ? 'Sudah login' : 'Menunggu verifikasi email'}
        
        Silakan cek email Anda untuk verifikasi.
        Setelah verifikasi, Anda bisa login.
      `);
      
      // Redirect ke login
      router.push('/auth/login');
      
    } catch (error: any) {
      console.error('Full error dalam handleSubmit:', error);
      
      // **PERUBAHAN 6: Error message lebih spesifik**
      let errorMessage = 'Registrasi gagal';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'Email ini sudah terdaftar. Silakan gunakan email lain atau login.';
      } else if (error.message?.includes('password')) {
        errorMessage = 'Password terlalu lemah. Gunakan minimal 6 karakter.';
      } else if (error.message?.includes('invalid email')) {
        errorMessage = 'Format email tidak valid.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // **PERUBAHAN 7: Tambahkan button untuk testing tanpa submit**
  const handleTestConnection = async () => {
    console.log('Testing Supabase connection...');
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Session test:', { data, error });
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      console.log('Profiles test:', { profiles, profilesError });
      
      alert('Test selesai, lihat console untuk hasil');
    } catch (err) {
      console.error('Test error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Atau{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
              masuk ke akun yang sudah ada
            </Link>
          </p>
          {plan === 'pro' && (
            <div className="mt-4 bg-blue-50 text-blue-700 p-3 rounded-md">
              Anda mendaftar untuk paket <strong>Pro</strong> (30 hari gratis)
            </div>
          )}
          
          {/* Button untuk testing */}
          <button 
            onClick={handleTestConnection}
            className="mt-2 text-xs text-gray-500 underline"
            type="button"
          >
            Test Koneksi Database
          </button>
        </div>

        <Card className="p-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Nama Bisnis/UMKM *
              </label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="mt-1"
                placeholder="Nama toko/UMKM Anda"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Nomor Telepon/WhatsApp
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
                placeholder="0812-3456-7890"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password * (minimal 6 karakter)
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Konfirmasi Password *
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1"
                placeholder="Ketik ulang password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Saya setuju dengan{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Kebijakan Privasi
                </Link>
              </label>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p className="font-semibold mb-2">
                Dengan mendaftar, Anda mendapatkan:
              </p>
              <ul className="space-y-1 text-left">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>250 barang gratis (Freemium)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>AI Scan Basic</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Dashboard real-time</span>
                </li>
                {plan === 'pro' && (
                  <li className="flex items-center text-green-600 font-semibold">
                    <span className="mr-2">✓</span>
                    <span>30 hari gratis paket Pro</span>
                  </li>
                )}
              </ul>
              
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
                <p className="font-semibold">Tips:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Gunakan email yang aktif untuk verifikasi</li>
                  <li>• Password minimal 6 karakter</li>
                  <li>• Cek folder spam jika email tidak muncul</li>
                </ul>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}