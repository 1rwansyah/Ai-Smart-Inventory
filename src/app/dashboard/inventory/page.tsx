/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/inventory/page.tsx
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { 
  ArrowLeft, 
  Package, 
  Hash, 
  Tag, 
  Box,
  AlertCircle,
  PlusCircle,
  ChevronRight,
  BarChart3
} from "lucide-react";

export default async function InventoryPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h2>
            <p className="text-gray-600 mb-6">Silakan login untuk mengakses inventory</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: items } = await supabase
    .from("products")
    .select(`
      id,
      name,
      sku,
      category,
      created_at,
      stocks (
        quantity
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Kembali ke Dashboard</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
                  <p className="text-gray-600 text-sm">Kelola semua produk dalam sistem</p>
                </div>
              </div>
            </div>
            
            <Link
              href="/dashboard/scan"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="font-medium">Scan Produk Baru</span>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Produk</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{items?.length || 0}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stok Tersedia</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {items?.filter((item: { stocks: { quantity: any; }[]; }) => (item.stocks?.[0]?.quantity ?? 0) > 0).length || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Box className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Habis Stok</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {items?.filter(item => (item.stocks?.[0]?.quantity ?? 0) <= 0).length || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Daftar Produk</h2>
              </div>
              <div className="text-sm text-gray-600">
                {items?.length || 0} item
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Package className="w-4 h-4" />
                      Nama Produk
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Hash className="w-4 h-4" />
                      SKU
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Tag className="w-4 h-4" />
                      Kategori
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 justify-end">
                      <Box className="w-4 h-4" />
                      Stok
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items && items.length > 0 ? (
                  items.map((item) => {
                    const stockQuantity = item.stocks?.[0]?.quantity ?? 0;
                    const isLowStock = stockQuantity > 0 && stockQuantity <= 10;
                    const isOutOfStock = stockQuantity <= 0;
                    
                    return (
                      <tr 
                        key={item.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Ditambahkan: {new Date(item.created_at).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-2">
                            <code className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-mono border border-gray-200">
                              {item.sku || "N/A"}
                            </code>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {item.category ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                {item.category}
                              </span>
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-3">
                            <div className="text-right">
                              <span className={`text-lg font-semibold ${
                                isOutOfStock ? 'text-red-600' :
                                isLowStock ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {stockQuantity}
                              </span>
                              <div className="text-xs text-gray-500">unit</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12">
                      <div className="text-center max-w-md mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Belum ada produk
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Mulai dengan memindai produk baru untuk menambahkannya ke inventory
                        </p>
                        <Link
                          href="/dashboard/scan"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Scan Produk Pertama
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div>
            Data diperbarui: {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Stok Tersedia
            </span>
            <span className="inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Stok Rendah
            </span>
            <span className="inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Habis Stok
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}




