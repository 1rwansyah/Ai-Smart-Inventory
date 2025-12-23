// src/app/dashboard/scan/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Tambahkan ini
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Save, 
  Package, 
  Tag, 
  Hash, 
  Calendar, 
  Building, 
  ChevronDown,
  AlertCircle,
  CheckCircle,
  X,
  ScanLine,
  Box
} from "lucide-react";
import ScanCamera from "@/components/ScanCamera";

type FormData = {
  name: string;
  brand: string;
  category: string;
  sku: string;
  expired_date: string;
  qty: number;
  type: "IN" | "OUT";
};

export default function ScanPage() {
  const router = useRouter(); // Tambahkan ini
  const [form, setForm] = useState<FormData | null>(null);
  const [raw, setRaw] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeParse = (text: string) => {
    try {
      return JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      setError("Gagal memparsing data dari AI");
      return null;
    }
  };

  // Handler untuk scan file (upload atau capture camera)
  const handleScan = async (file: File) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setRaw("");
    setForm(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];

        const res = await fetch("/api/scan", {
          method: "POST",
          body: JSON.stringify({ imageBase64: base64 }),
        });

        if (!res.ok) throw new Error("Gagal memproses gambar");

        const data = await res.json();
        setRaw(data.text);

        const parsed = safeParse(data.text);

        if (parsed) {
          setForm({
            name: parsed?.name || "",
            brand: parsed?.brand || "",
            category: parsed?.category || "",
            sku: parsed?.sku || "",
            expired_date: parsed?.expired_date || "",
            qty: 1,
            type: "IN",
          });
          setSuccess("Data berhasil di-ekstrak dari gambar!");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat scanning");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Gagal membaca file gambar");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // Simpan ke inventory
  const saveToInventory = async () => {
    if (!form) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const action = form.type === "IN" ? "masuk" : "keluar";
        setSuccess(`Produk berhasil ${action} inventory ✅`);
        
        // Redirect ke halaman inventory setelah 2 detik
        setTimeout(() => {
          router.push("/dashboard/inventory"); // Tambahkan ini
        }, 2000);
        
        // Reset form
        setTimeout(() => {
          setForm(null);
          setRaw("");
          setSuccess(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }, 2000);
      } else {
        throw new Error(data.error || "Gagal menyimpan produk");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  // Handler untuk upload file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleScan(e.target.files[0]);
    }
  };

  // Form field configurations
  const formFields = [
    { key: "name" as keyof FormData, label: "Nama Produk", icon: Package, type: "text" },
    { key: "brand" as keyof FormData, label: "Merek", icon: Building, type: "text" },
    { key: "category" as keyof FormData, label: "Kategori", icon: Tag, type: "text" },
    { key: "sku" as keyof FormData, label: "SKU", icon: Hash, type: "text" },
    { key: "expired_date" as keyof FormData, label: "Tanggal Kadaluarsa", icon: Calendar, type: "date" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Kembali ke Dashboard</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <ScanLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Scan Produk</h1>
                  <p className="text-gray-600 text-sm">Pindai produk baru dengan AI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Cara Scan</p>
                  <p className="text-lg font-bold text-gray-900">Upload atau Kamera</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Ekstrak Otomatis</p>
                  <p className="text-lg font-bold text-gray-900">AI Powered</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <ScanLine className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Simpan Data</p>
                  <p className="text-lg font-bold text-gray-900">Ke Inventory</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Save className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Scan Methods */}
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Gambar</h3>
                  <p className="text-sm text-gray-600">Upload foto produk yang sudah ada</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Pilih file gambar (JPG, PNG, WebP)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Memproses gambar...</span>
                </div>
              )}
            </div>

            {/* Camera Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Scan Langsung</h3>
                  <p className="text-sm text-gray-600">Gunakan kamera untuk scan langsung</p>
                </div>
              </div>
              <div className={`border-2 border-dashed border-gray-300 rounded-xl overflow-hidden ${isLoading ? 'opacity-50' : ''}`}>
                <ScanCamera onScan={handleScan} />
              </div>
            </div>
          </div>

          {/* Right Column - Form Results */}
          <div className="space-y-6">
            {/* Form Results Card */}
            {form && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Hasil Scan</h3>
                      <p className="text-sm text-gray-600">Periksa dan edit data produk</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setForm(null);
                      setRaw("");
                      setSuccess(null);
                      setError(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 mb-6">
                  {formFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <field.icon className="w-4 h-4" />
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={form[field.key] as string}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                      />
                    </div>
                  ))}

                  {/* Stock Controls */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Box className="w-4 h-4" />
                        Jenis Transaksi
                      </label>
                      <div className="relative">
                        <select
                          value={form.type}
                          onChange={(e) => setForm({ ...form, type: e.target.value as "IN" | "OUT" })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                          <option value="IN">Stok Masuk</option>
                          <option value="OUT">Stok Keluar</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Package className="w-4 h-4" />
                        Jumlah
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={form.qty}
                        onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={saveToInventory}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Simpan ke Inventory
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3 animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Sukses</h4>
                  <p className="text-sm text-green-600 mt-1">{success}</p>
                  <p className="text-xs mt-2 text-green-500">
                    Mengarahkan ke halaman inventory...
                  </p>
                </div>
              </div>
            )}

            {/* Raw Output Card */}
            {raw && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Hash className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Raw AI Output</h4>
                      <p className="text-sm text-gray-600">Data mentah dari AI</p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${showRaw ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {showRaw && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono">{raw}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Gunakan kamera atau upload gambar dengan label produk yang jelas untuk hasil terbaik</p>
        </div>
      </div>
    </div>
  );
}

