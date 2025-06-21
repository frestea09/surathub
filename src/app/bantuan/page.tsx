
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
    { id: 'staf', name: 'Staf Umum', role: 'Staf/Pengguna' },
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
            { title: "Merespon & Mendelegasikan Surat", steps: ["Buka 'Surat Masuk' untuk melihat surat yang memerlukan tindakan.", "Gunakan 'Buat Disposisi' untuk meneruskan surat dengan instruksi ke staf/unit terkait.", "Gunakan opsi 'Tolak' atau 'Setujui' untuk merespon surat dengan cepat."] },
            { title: "Menganalisis & Mengekspor Laporan", steps: ["Buka menu 'Laporan'.", "Pilih rentang tanggal yang diinginkan.", "Grafik dan tabel akan otomatis diperbarui.", "Klik 'Ekspor' untuk mengunduh data dalam format CSV untuk analisis lebih lanjut."] }
        ]
    },
    ppk: {
        faq: [
            { q: "Bagaimana cara membuat rangkaian surat pengadaan dari awal sampai akhir?", a: "Alurnya adalah: Surat Perintah -> Surat Pesanan (Internal) -> Surat Pesanan (Vendor) -> Berita Acara Pemeriksaan -> Berita Acara Serah Terima. Anda bisa memulai dengan klik 'Buat Surat'." },
            { q: "Apa fungsi tombol 'Ambil Data'?", a: "Tombol ini adalah kunci efisiensi. Saat membuat surat di tahap selanjutnya (misal, membuat Surat Pesanan dari Surat Perintah), klik 'Ambil Data' untuk otomatis mengisi informasi yang relevan dari surat sebelumnya, mengurangi input manual dan potensi kesalahan." },
            { q: "Di mana saya bisa melihat draf surat yang sedang saya kerjakan?", a: "Semua draf yang Anda simpan akan muncul di halaman 'Surat Keluar' di bawah tab 'Draft'." },
            { q: "Tanggal yang saya pilih ternyata hari libur, apakah bermasalah?", a: "Tidak masalah. Sistem akan memberi Anda peringatan jika tanggal yang dipilih adalah hari libur nasional, namun Anda tetap dapat melanjutkannya jika memang diperlukan. Ini hanya sebagai pengingat." }
        ],
        guide: [
            { title: "Membuat Alur Surat Pengadaan", steps: ["Klik 'Buat Surat', lalu pilih 'Surat Perintah' dan isi detailnya. Simpan sebagai draf.", "Selanjutnya, buat 'Surat Pesanan (Internal)'. Gunakan fitur 'Ambil Data' untuk menarik detail dari Surat Perintah yang tadi dibuat.", "Lanjutkan alur yang sama untuk 'Surat Pesanan (Vendor)', 'Berita Acara Pemeriksaan', hingga 'Berita Acara Serah Terima'. Selalu gunakan 'Ambil Data' untuk menyambungkan alur."] },
            { title: "Melacak Status & Menyimpan Draf", steps: ["Buka halaman 'Surat Keluar' untuk melihat status semua surat yang Anda buat.", "Gunakan tab (Semua, Draft, Terkirim) untuk memfilter.", "Setelah menyimpan draf, Anda akan otomatis diarahkan ke tab 'Draft' di halaman 'Surat Keluar'."] }
        ]
    },
    staf: {
        faq: [
            { q: "Bagaimana cara membuat surat baru?", a: "Klik tombol 'Buat Surat' di pojok kanan atas. Pilih jenis surat yang ingin dibuat dari daftar yang tersedia." },
            { q: "Di mana saya bisa menemukan draf yang belum selesai?", a: "Semua draf Anda tersimpan di halaman 'Surat Keluar' di bawah tab 'Draft'. Anda bisa melanjutkannya dari sana." },
            { q: "Bagaimana saya tahu jika ada surat atau tugas baru untuk saya?", a: "Periksa halaman 'Surat Masuk' dan menu 'Notifikasi' (ikon lonceng) secara berkala. Surat yang didisposisikan kepada Anda akan muncul di sana." }
        ],
        guide: [
            { title: "Membuat Surat Umum", steps: ["Klik 'Buat Surat', lalu pilih template yang sesuai (misal: Surat Perintah).", "Isi semua detail yang diperlukan pada formulir.", "Gunakan panel 'Preview' di sebelah kanan untuk memastikan format surat sudah benar sebelum 'Simpan' atau 'Cetak'."] },
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
