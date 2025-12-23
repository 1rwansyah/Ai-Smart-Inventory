/* eslint-disable @next/next/no-img-element */
// src/app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { 
  Package, 
  Boxes, 
  AlertTriangle, 
  ScanLine, 
  Eye, 
  TrendingUp, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Calendar,
  LogOut
} from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
            <p className="text-gray-600 mb-6">Silakan login untuk mengakses dashboard</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // total produk
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // total stok
  const { data: stocks } = await supabase
    .from("stocks")
    .select("quantity");

  const totalStock =
    stocks?.reduce((sum, s) => sum + (s.quantity || 0), 0) ?? 0;

  // stok rendah (<=5)
  const { data: lowStock } = await supabase
    .from("stocks")
    .select(`
      quantity,
      products (
        name,
        category,
        brand
      )
    `)
    .lte("quantity", 5)
    .order("quantity", { ascending: true })
    .limit(5);

  // Get recent products
  const { data: recentProducts } = await supabase
    .from("products")
    .select(`
      id,
      name,
      category,
      created_at,
      stocks (
        quantity
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get categories count
  const { data: categories } = await supabase
    .from("products")
    .select("category")
    .not("category", "is", null);

  const uniqueCategories = new Set(categories?.map(p => p.category)).size;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Generate random avatar URL based on user email for consistency
  const getRandomAvatar = (seed: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Gudang</h1>
                <p className="text-gray-600 text-sm">Selamat datang, {user.email?.split('@')[0] || 'Pengguna'}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              
              {/* User Profile with Random Avatar */}
              <div className="relative group">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <img
                      src={getRandomAvatar(user.email || 'user')}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm hover:border-blue-200 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                
                {/* User Info Dropdown with Logout */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 p-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={getRandomAvatar(user.email || 'user')}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.email?.split('@')[0] || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <Link
                      href="/auth/logout"
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar dari akun
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Produk</p>
                  <p className="text-3xl font-bold text-gray-900">{totalProducts ?? 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Boxes className="w-4 h-4" />
                  <span>{uniqueCategories} kategori berbeda</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Stok</p>
                  <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Boxes className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Stok tersedia</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Stok Menipis</p>
                  <p className="text-3xl font-bold text-red-600">{lowStock?.length ?? 0}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lowStock?.length ?? 0} produk perlu restock</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Aktivitas</p>
                  <p className="text-3xl font-bold text-gray-900">{recentProducts?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>Aktif hari ini</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Aksi Cepat</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/scan"
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <ScanLine className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Scan Produk Baru</h3>
                  <p className="text-blue-100 text-sm">Tambah produk baru dengan AI scan</p>
                </Link>

                <Link
                  href="/dashboard/inventory"
                  className="group bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Lihat Inventory</h3>
                  <p className="text-green-100 text-sm">Kelola semua produk di gudang</p>
                </Link>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Produk Terbaru</h2>
                <Link 
                  href="/dashboard/inventory" 
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Lihat semua
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {recentProducts && recentProducts.length > 0 ? (
                <div className="space-y-3">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded-md">
                              {product.category || "Uncategorized"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Boxes className="w-3 h-3" />
                              {product.stocks?.[0]?.quantity ?? 0} stok
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(product.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 font-medium mb-2">Belum ada produk</h3>
                  <p className="text-gray-600 text-sm mb-4">Mulai dengan menambahkan produk pertama</p>
                  <Link
                    href="/dashboard/scan"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ScanLine className="w-4 h-4" />
                    Tambah Produk
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Low Stock */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Stok Menipis</h2>
                  <p className="text-sm text-gray-600">Perlu restock segera</p>
                </div>
              </div>

              {lowStock && lowStock.length > 0 ? (
                <div className="space-y-4">
                  {lowStock.map((item, i) => (
                    <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-red-200">
                            <Package className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.products?.name}</p>
                            {item.products?.brand && (
                              <p className="text-sm text-gray-600">{item.products.brand}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{item.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md">
                          {item.products?.category || "Umum"}
                        </span>
                        <span className="text-red-600 font-medium">Sisa {item.quantity} unit</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      href="/dashboard/inventory?filter=low-stock"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Kelola Stok Menipis
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-full mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-gray-900 font-medium mb-2">Stok Aman</h3>
                  <p className="text-gray-600 text-sm">Semua produk memiliki stok yang cukup</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Status Sistem</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Semua sistem berjalan normal</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Diperbarui: {new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}