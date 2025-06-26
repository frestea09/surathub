# SuratHub: Sistem Manajemen Surat Modern

SuratHub adalah aplikasi web modern yang dirancang untuk menyederhanakan dan mengotomatiskan alur kerja manajemen surat di lingkungan perkantoran, khususnya untuk studi kasus Rumah Sakit Umum Daerah (RSUD). Dibangun dengan tumpukan teknologi terkini, aplikasi ini menawarkan pengalaman pengguna yang intuitif, alur kerja yang efisien, dan fitur-fitur canggih untuk menangani berbagai jenis surat, dari surat perintah hingga proses pengadaan yang kompleks.

Aplikasi ini adalah contoh proyek yang dibangun di dalam Firebase Studio, menunjukkan kapabilitas pengembangan aplikasi web full-stack dengan cepat.

## ✨ Fitur Utama

-   **Dashboard Interaktif**: Visualisasi data surat yang komprehensif dengan kartu statistik dan grafik. Tampilan dapat disesuaikan berdasarkan peran pengguna.
-   **Manajemen Surat Lengkap**: Mengelola surat masuk dan surat keluar dengan alur kerja yang jelas (Draft, Terkirim, Diarsipkan, Ditolak).
-   **Alur Kerja Pengadaan 5 Langkah**: Alur kerja terpandu untuk proses pengadaan barang/jasa, mulai dari Surat Perintah, Surat Pesanan Internal, Surat Pesanan ke Vendor, Berita Acara Pemeriksaan, hingga Berita Acara Serah Terima.
-   **Fitur "Ambil Data"**: Mengurangi entri data manual dengan mengimpor informasi secara otomatis dari dokumen sebelumnya dalam alur kerja.
-   **Cetak Bundle Dokumen**: Menggabungkan semua dokumen terkait dalam satu alur pengadaan ke dalam satu halaman untuk dicetak atau dikirim.
-   **Pengiriman Email ke Vendor**: Mengirimkan bundle dokumen pengadaan langsung ke email vendor melalui integrasi dengan layanan email (Resend).
-   **Manajemen Pengguna (CRUD)**: Antarmuka untuk menambah, melihat, mengubah, dan menghapus data pengguna beserta perannya.
-   **Laporan Dinamis**: Hasilkan laporan terperinci dengan filter berdasarkan rentang tanggal dan peran, lalu ekspor data ke format CSV.
-   **Pusat Bantuan & Log Aktivitas**: Panduan pengguna berbasis peran dan catatan semua aktivitas penting di dalam sistem.
-   **Desain Responsif**: Tampilan yang optimal di berbagai perangkat, dari desktop hingga mobile.

## 🚀 Tumpukan Teknologi

-   **Framework**: Next.js (App Router)
-   **Bahasa**: TypeScript
-   **Styling**: Tailwind CSS
-   **Komponen UI**: shadcn/ui
-   **Manajemen State**: Zustand
-   **Formulir**: React Hook Form & Zod
-   **Grafik**: Recharts
-   **Pengiriman Email**: Resend & React Email
-   **Penyimpanan Data**: Data demo disimpan di `localStorage` peramban untuk kemudahan prototyping.

## ▶️ Menjalankan Proyek Secara Lokal

Proyek ini dikonfigurasi untuk berjalan dengan mudah.

1.  **Instalasi Dependensi**:
    ```bash
    npm install
    ```

2.  **Menjalankan Server Pengembangan**:
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:3000`.

3.  **Mengirim Email (Opsional)**:
    Untuk mengaktifkan fitur pengiriman email, Anda perlu mendapatkan API Key dari [Resend](https://resend.com).
    -   Buat file `.env` di root proyek.
    -   Tambahkan kunci API Anda ke file tersebut:
        ```env
        RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
        ```

## 🗂️ Struktur Data

Untuk tujuan demonstrasi dan prototyping cepat, semua data aplikasi (pengguna dan surat) disimpan di `localStorage` peramban Anda. Logika untuk ini dapat ditemukan di dalam file `src/store/userStore.ts` dan `src/store/suratStore.ts`. Saat aplikasi pertama kali dimuat, data awal (seed) akan dimasukkan ke `localStorage` jika belum ada.

---
*Proyek ini dibuat dan dikelola di dalam Firebase Studio.*
