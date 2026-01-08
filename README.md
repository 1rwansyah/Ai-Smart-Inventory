# 🤖 AI Smart Inventory System (AISI)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-blueviolet?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**AI Smart Inventory System (AISI)** adalah solusi manajemen gudang modern yang mengintegrasikan kecerdasan buatan untuk otomatisasi pendataan barang. Dengan memanfaatkan **Google Gemini AI Vision**, sistem ini mampu mengenali barang melalui gambar dan mengelola stok secara cerdas.

---

## 🚀 Fitur Utama

* **🔍 AI Item Recognition**: Cukup unggah foto barang, dan Google Gemini AI akan mengekstrak nama, kategori, dan deskripsi barang secara otomatis.
* **📸 Barcode Scanner**: Integrasi pemindaian barcode untuk input dan pencarian barang yang lebih cepat dan akurat.
* **📧 Low Stock Alert**: Sistem peringatan otomatis melalui **Email** yang akan dikirimkan kepada admin ketika stok barang berada di bawah batas minimum.
* **📊 Real-time Dashboard**: Pantau sirkulasi masuk dan keluar barang secara akurat dengan integrasi **Supabase PostgreSQL**.
* **📱 Responsive Design**: Optimasi penuh untuk penggunaan di perangkat desktop maupun mobile menggunakan **Tailwind CSS**.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS.
- **AI Integration**: [Google Gemini Pro Vision AI](https://ai.google.dev/).
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL & Auth).
- **Notification**: Node.js (Nodemailer / Edge Functions) untuk Email Alert.
- **Deployment**: Vercel.

---

##  Cara Instalasi

1. **Clone Repository**
   ```bash
   git clone [https://github.com/1rwansyah/Ai-Smart-Inventory.git](https://github.com/1rwansyah/Ai-Smart-Inventory.git)
   cd Ai-Smart-Inventory

```

2. **Install Dependencies**
```bash
npm install

```


3. **Konfigurasi Environment Variable**
Buat file `.env.local` dan masukkan API Key Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

```


4. **Jalankan Aplikasi**
```bash
npm run dev

```



---

## 💡 Alur Kerja AI

Sistem ini menggunakan prompt teknik khusus ke **Gemini AI** untuk menganalisis gambar yang diunggah pengguna. AI akan mengembalikan data berformat JSON yang kemudian secara otomatis mengisi formulir stok, sehingga user tidak perlu mengetik manual (Zero-Typing Experience).

---

## 👨‍💻 Kontribusi

Proyek ini dikembangkan oleh **Muhammad Irwansyah**. Jika Anda memiliki saran atau ingin berkontribusi, silakan lakukan *Pull Request* atau hubungi saya melalui email.

---

Copyright © 2024 [Muhammad Irwansyah](https://www.google.com/search?q=https://github.com/1rwansyah)

```

### Mengapa README ini bagus?
1.  **Badge Visual**: Menggunakan badge warna-warni untuk teknologi utama (Next.js, AI, Supabase).
2.  **Struktur Jelas**: Ada deskripsi, fitur, tech stack, hingga cara instalasi.
3.  **Menonjolkan Skill**: Bagian "Alur Kerja AI" menunjukkan bahwa kamu bukan cuma pakai API, tapi paham cara kerjanya.

Mau saya buatkan juga file README untuk proyek lainnya seperti **AI Travel** atau **Circle Twitter Clone**?

```
