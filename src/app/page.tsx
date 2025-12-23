import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">WarehouseAI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Fitur
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Harga
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dokumentasi
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Kontak
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="hidden md:inline-flex">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Mulai Gratis
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Kelola Gudang 10x Lebih Cepat dengan AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Scan barcode/label dengan AI, update stok otomatis real-time, dan dapatkan alert stok menipis
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">  
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Mulai Gratis
            </Button>
          </Link>
          <Link href="/auth/login"> 
            <Button size="lg" variant="outline">
              Masuk
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="text-blue-600 text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">AI Scan Input</h3>
            <p className="text-gray-600">
              Foto barcode/label - AI mengisi nama barang, SKU, kategori, jumlah otomatis
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-green-600 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Auto Stock Update</h3>
            <p className="text-gray-600">
              Stok barang keluar/masuk langsung update real-time
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-red-600 text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">Low Stock Alert</h3>
            <p className="text-gray-600">
              AI deteksi barang hampir habis & beri peringatan otomatis via Telegram/Email
            </p>
          </Card>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Harga Terjangkau</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 border-2">
            <h3 className="text-2xl font-bold mb-4">Freemium</h3>
            <div className="text-4xl font-bold mb-6">Gratis</div>
            <ul className="space-y-3 mb-8">
              <li>✓ Hingga 250 barang</li>
              <li>✓ AI Scan Basic</li>
              <li>✓ Update stok manual</li>
              <li>✓ Dashboard sederhana</li>
            </ul>
            <Link href="/auth/register">
              <Button className="w-full">Mulai Sekarang</Button>
            </Link>
          </Card>

          <Card className="p-8 border-2 border-blue-500 bg-blue-50">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm inline-block mb-4">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <div className="text-4xl font-bold mb-6">
              Rp 30.000<span className="text-lg text-gray-600">/bulan</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li>✓ Unlimited barang</li>
              <li>✓ AI Scan Premium</li>
              <li>✓ Auto stock update</li>
              <li>✓ Low stock alert</li>
              <li>✓ Multi-gudang</li>
              <li>✓ Telegram/Email alert</li>
            </ul>
            <Link href="/auth/register?plan=pro">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Upgrade ke Pro
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}