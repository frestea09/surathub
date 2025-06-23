
"use client";

import { useState } from 'react';
import { AppLayout } from "@/components/templates/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const mockUsers = [
    { id: 'admin', name: 'Admin Utama', role: 'Administrator Sistem' },
    { id: 'direktur', name: 'dr. H. Yani Sumpena Muchtar, SH, MH.Kes', role: 'Direktur' },
    { id: 'ppk', name: 'Saep Trian Prasetia.S.Si.Apt', role: 'Pejabat Pembuat Komitmen' },
    { id: 'ppbj', name: 'Deti Hapitri, A.Md.Gz', role: 'Pejabat Pengadaan Barang Jasa' },
    { id: 'staf', name: 'Staf Umum / Pengguna', role: 'Staf/Pengguna' },
];

type HelpContent = {
    faq: { q: string; a: string }[];
    guide: { title: string; steps: string[] }[];
}

const helpContent: Record<string, HelpContent> = {
    admin: {
        faq: [
            { q: "Bagaimana cara menambahkan pengguna baru?", a: "Masuk ke menu 'Admin' dari sidebar, lalu klik tombol 'Tambah Pengguna' di pojok kanan atas. Isi formulir yang tersedia dan simpan." },
            { q: "Bagaimana cara mengubah status pengguna (Aktif/Non-Aktif)?", a: "Di halaman 'Admin', temukan pengguna yang ingin diubah. Klik menu tiga titik di sebelah kanan, lalu pilih 'Ubah'. Di halaman edit, Anda akan menemukan dropdown 'Status' untuk mengubahnya." },
            { q: "Mengapa saya tidak bisa menghapus beberapa pengguna awal?", a: "Pengguna awal seperti Direktur dan PPK adalah bagian dari data inti untuk demo alur kerja dan tidak dapat dihapus melalui UI untuk menjaga konsistensi data." },
            { q: "Dimana saya bisa memantau semua aktivitas di sistem?", a: "Buka menu 'Log Aktivitas' dari sidebar. Halaman ini mencatat semua tindakan penting seperti login, pembuatan surat, perubahan data pengguna, dll. Gunakan filter di atas tabel untuk mencari log spesifik." }
        ],
        guide: [
            { title: "Mengelola Pengguna (CRUD)", steps: ["Buka menu 'Admin' untuk melihat, mencari, dan memfilter semua pengguna.", "Klik 'Tambah Pengguna' untuk mendaftarkan akun baru.", "Gunakan menu aksi (tiga titik) pada setiap baris untuk 'Ubah' data dan status pengguna, atau 'Hapus' pengguna dari sistem.", "Saat mengubah, Anda akan diarahkan ke halaman khusus edit. Setelah selesai, Anda akan kembali ke daftar admin."] },
            { title: "Memantau Sistem via Log", steps: ["Buka menu 'Log Aktivitas'.", "Gunakan filter 'Filter Pengguna' atau 'Filter Aksi' untuk menyaring catatan.", "Periksa log secara berkala untuk mendeteksi aktivitas yang tidak biasa atau upaya login yang gagal."] }
        ]
    },
    direktur: {
        faq: [
            { q: "Bagaimana cara melihat ringkasan performa seluruh unit?", a: "Halaman 'Dashboard' adalah pusat informasi Anda. Gunakan dropdown 'Tampilan Sebagai' di pojok kanan atas untuk beralih perspektif dan melihat data spesifik untuk unit lain, seperti Keuangan atau Pengadaan." },
            { q: "Bagaimana cara saya menyetujui atau menolak surat dengan cepat?", a: "Di halaman 'Dashboard' pada tabel 'Surat Terbaru', atau di halaman 'Surat Masuk'/'Surat Keluar', gunakan menu aksi (tiga titik) pada surat yang relevan. Anda akan menemukan opsi untuk 'Setujui', 'Tolak', atau 'Buat Disposisi'." },
            { q: "Bagaimana cara mengekspor laporan untuk rapat?", a: "Masuk ke menu 'Laporan', atur rentang tanggal yang Anda inginkan menggunakan filter tanggal, lalu klik tombol 'Ekspor'. Ini akan mengunduh file CSV yang berisi data yang ditampilkan di tabel." }
        ],
        guide: [
            { title: "Menggunakan Dashboard Interaktif", steps: ["Saat pertama kali masuk, Dashboard menampilkan ringkasan data untuk semua unit.", "Gunakan dropdown 'Tampilan Sebagai' untuk memfilter data berdasarkan unit atau peran tertentu.", "Periksa kartu statistik untuk gambaran cepat dan analisis tren melalui grafik."] },
            { title: "Merespon & Mendelegasikan Surat", steps: ["Buka 'Surat Masuk' untuk melihat surat yang memerlukan tindakan.", "Gunakan 'Buat Disposisi' untuk meneruskan surat dengan instruksi ke staf/unit terkait.", "Gunakan opsi 'Tolak' atau 'Setujui' pada surat keluar untuk merespon permintaan dari tim Anda."] },
            { title: "Menganalisis & Mengekspor Laporan", steps: ["Buka menu 'Laporan'.", "Pilih rentang tanggal yang diinginkan.", "Grafik dan tabel akan otomatis diperbarui.", "Klik 'Ekspor' untuk mengunduh data dalam format CSV untuk analisis lebih lanjut."] }
        ]
    },
    ppk: {
        faq: [
            { q: "Bagaimana alur lengkap pengadaan barang dari awal sampai akhir?", a: "Alur lengkapnya ada 5 tahap: 1. Surat Perintah, 2. Surat Pesanan (Internal), 3. Surat Pesanan (Vendor), 4. Berita Acara Pemeriksaan, dan 5. Berita Acara Serah Terima. Anda akan lebih banyak terlibat di tahap 1, 3, 4, dan 5." },
            { q: "Apa fungsi tombol 'Ambil Data'?", a: "Tombol ini adalah kunci efisiensi. Saat membuat surat di tahap selanjutnya (misal, membuat Surat Pesanan Vendor dari Surat Pesanan Internal), klik 'Ambil Data' untuk otomatis mengisi informasi dari surat sebelumnya, mengurangi input manual dan potensi kesalahan." },
            { q: "Bagaimana cara mencetak dokumen?", a: "Di setiap halaman pembuatan surat, ada tombol 'Cetak' di pojok kanan atas. Ini akan membuka pratinjau cetak browser Anda untuk dokumen yang sedang Anda lihat." },
            { q: "Di mana saya bisa melihat draf surat yang sedang saya kerjakan?", a: "Semua draf yang Anda simpan akan muncul di halaman 'Surat Keluar' di bawah tab 'Draft'." }
        ],
        guide: [
            { title: "Memulai Alur Surat Pengadaan (Surat Perintah)", steps: ["Klik 'Buat Surat', lalu pilih 'Surat Perintah' dan isi detailnya.", "Surat ini ditujukan untuk Pejabat Pengadaan (PPBJ) sebagai dasar untuk proses selanjutnya.", "Simpan sebagai draf atau langsung kirim."] },
            { title: "Membuat Surat Pesanan ke Vendor", steps: ["Setelah PPBJ membuat Surat Pesanan Internal, Anda bisa melanjutkan dengan membuat 'Surat Pesanan (Vendor)'.", "Gunakan fitur 'Ambil Data' untuk menarik detail dari Surat Pesanan Internal yang dibuat PPBJ.", "Lengkapi detail vendor dan informasi lain yang diperlukan, lalu kirim."] },
            { title: "Membuat Berita Acara", steps: ["Setelah barang diterima, buat 'Berita Acara Pemeriksaan'. Ambil data dari 'Surat Pesanan (Vendor)' untuk konsistensi.", "Lanjutkan dengan 'Berita Acara Serah Terima' untuk menyelesaikan proses. Gunakan 'Ambil Data' dari Berita Acara Pemeriksaan."] }
        ]
    },
    ppbj: {
        faq: [
            { q: "Apa tugas utama saya dalam alur pengadaan?", a: "Tugas utama Anda adalah membuat 'Surat Pesanan (Internal)' setelah menerima 'Surat Perintah' dari Pejabat Pembuat Komitmen (PPK)." },
            { q: "Bagaimana cara memulai pembuatan Surat Pesanan Internal?", a: "Buka halaman 'Buat Surat', pilih 'Surat Pesanan (Internal)'. Gunakan tombol 'Ambil Data' untuk mengimpor detail dari Surat Perintah yang relevan." },
            { q: "Di mana saya bisa melihat Surat Perintah yang masuk?", a: "Surat Perintah yang ditujukan kepada Anda akan muncul di halaman 'Surat Masuk'." }
        ],
        guide: [
            { title: "Menindaklanjuti Surat Perintah", steps: ["Buka 'Surat Masuk' untuk melihat Surat Perintah baru dari PPK.", "Buka halaman 'Buat Surat', pilih 'Surat Pesanan (Internal)'.", "Gunakan tombol 'Ambil Data' dan pilih Surat Perintah yang sesuai. Sebagian besar formulir akan terisi otomatis.", "Lengkapi detail barang, harga, dan informasi lainnya. Kirim surat ini kembali ke PPK."] }
        ]
    },
    staf: {
        faq: [
            { q: "Bagaimana cara membuat surat baru?", a: "Klik tombol 'Buat Surat' di pojok kanan atas. Pilih jenis surat yang ingin dibuat dari daftar yang tersedia. Jika Anda bagian dari tim pengadaan, pastikan mengikuti alur yang benar." },
            { q: "Di mana saya bisa menemukan draf yang belum selesai?", a: "Semua draf Anda tersimpan di halaman 'Surat Keluar' di bawah tab 'Draft'. Anda bisa melanjutkannya dari sana." },
            { q: "Bagaimana saya tahu jika ada surat atau tugas baru untuk saya?", a: "Periksa halaman 'Surat Masuk' dan menu 'Notifikasi' (ikon lonceng) secara berkala. Surat yang didisposisikan kepada Anda akan muncul di sana." }
        ],
        guide: [
            { title: "Membuat Surat Umum", steps: ["Klik 'Buat Surat', lalu pilih template yang sesuai (misal: Surat Perintah jika Anda memiliki wewenang).", "Isi semua detail yang diperlukan pada formulir.", "Gunakan panel 'Preview' di sebelah kanan untuk memastikan format surat sudah benar sebelum 'Simpan' atau 'Cetak'."] },
            { title: "Menindaklanjuti Disposisi", steps: ["Buka 'Surat Masuk', cari surat yang statusnya 'Didisposisikan' kepada Anda.", "Baca instruksi pada disposisi.", "Setelah tindakan selesai, gunakan menu aksi (tiga titik) dan pilih 'Selesaikan Proses' untuk mengubah statusnya menjadi 'Selesai'."] }
        ]
    }
};

export default function BantuanPage() {
    const [selectedRole, setSelectedRole] = useState('staf');
    const content = helpContent[selectedRole] || helpContent.staf;
    const currentUser = mockUsers.find(u => u.id === selectedRole) || mockUsers[3];

    return (
        <AppLayout>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pusat Bantuan</h1>
                 <div className="w-64">
                    <Label htmlFor="role-switcher">Lihat Bantuan Sebagai:</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger id="role-switcher">
                            <SelectValue placeholder="Pilih Peran" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockUsers.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.name} ({user.role})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Pertanyaan Umum (FAQ) untuk {currentUser.role}</CardTitle>
                        <CardDescription>Jawaban cepat untuk pertanyaan yang sering diajukan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {content.faq.map((item, index) => (
                                <AccordionItem value={`faq-${index}`} key={index}>
                                    <AccordionTrigger>{item.q}</AccordionTrigger>
                                    <AccordionContent>
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Panduan Pengguna untuk {currentUser.role}</CardTitle>
                        <CardDescription>Langkah-langkah untuk menggunakan fitur utama.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Accordion type="single" collapsible className="w-full">
                            {content.guide.map((item, index) => (
                                <AccordionItem value={`guide-${index}`} key={index}>
                                    <AccordionTrigger>{item.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="list-disc space-y-2 pl-5">
                                            {item.steps.map((step, stepIndex) => (
                                                <li key={stepIndex}>{step}</li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
