
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
    { id: 'vendor', name: 'Vendor Eksternal', role: 'Vendor' },
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
            { q: "Apa saja alur kerja pengadaan yang ada?", a: "Ada dua alur utama: 1. Pengadaan Obat & BMHP (5 tahap: SPP, SP, SP-Vendor, BA, BASTB). 2. Pengadaan Barang Jasa Umum (4 tahap: SPU, BAH, SP-Umum, BA-Umum). Anda akan terlibat di sebagian besar tahap, terutama yang berhubungan dengan Vendor." },
            { q: "Vendor meminta revisi pada surat pesanan, di mana saya bisa melihat pesannya?", a: "Buka menu 'Surat Keluar', lalu klik tab 'Revisi Diminta'. Temukan suratnya, klik menu aksi (tiga titik), dan pilih 'Lihat Detail'. Pesan dari vendor akan terlihat jelas di dalam dialog pada bagian 'Riwayat Revisi'." },
            { q: "Bagaimana cara mengirim dokumen ke vendor?", a: "Di halaman Surat Keluar, temukan Surat Pesanan (Vendor/Umum) yang sudah jadi. Klik menu aksi (tiga titik) dan pilih 'Cetak Bundle'. Di halaman bundle, klik tombol 'Terbitkan ke Vendor'. Ini akan membuat dokumen dapat diakses oleh vendor melalui portal mereka." },
            { q: "Apa fungsi tombol 'Ambil Data'?", a: "Tombol ini adalah kunci efisiensi. Saat membuat surat di tahap selanjutnya, klik 'Ambil Data' untuk otomatis mengisi informasi dari surat sebelumnya, mengurangi input manual dan potensi kesalahan." }
        ],
        guide: [
            { title: "Memulai Alur Surat Pengadaan (Obat & Umum)", steps: ["Klik 'Buat Surat', lalu pilih jenis pengadaan.", "Pilih 'Surat Perintah' (untuk Obat) atau 'Surat Perintah Pengadaan' (untuk Umum).", "Surat ini ditujukan untuk Pejabat Pengadaan (PPBJ) sebagai dasar untuk proses selanjutnya.", "Simpan sebagai draf atau langsung kirim."] },
            { title: "Membuat Surat Pesanan ke Vendor", steps: ["Setelah PPBJ membuat Surat Pesanan Internal (alur obat) atau BA Hasil Pengadaan (alur umum), Anda bisa melanjutkan membuat 'Surat Pesanan (Vendor)' atau 'Surat Pesanan (Umum)'.", "Gunakan fitur 'Ambil Data' untuk menarik detail dari surat sebelumnya.", "Lengkapi detail vendor dan informasi lain yang diperlukan, lalu terbitkan."] },
            { title: "Menanggapi Permintaan Revisi", steps: ["Jika vendor meminta revisi, surat akan muncul di tab 'Revisi Diminta' pada halaman Surat Keluar.", "Buka detail surat untuk melihat catatan revisi dari vendor.", "Klik 'Edit Draf' atau 'Revisi Draf' untuk memperbaiki surat sesuai permintaan, lalu terbitkan kembali."] },
            { title: "Menyelesaikan & Mengarsipkan Bundle", steps: ["Setelah semua dokumen dalam satu alur selesai, Anda bisa melihatnya sebagai satu kesatuan di halaman 'Arsip Bundle'.", "Gunakan pencarian di 'Arsip Bundle' untuk menemukan bundle lengkap berdasarkan fragmen nomor surat (misal: '06-FAR' atau 'Alat Listrik')."] }
        ]
    },
    ppbj: {
        faq: [
            { q: "Apa tugas utama saya dalam alur pengadaan?", a: "Dalam alur obat, tugas Anda adalah membuat 'Surat Pesanan (Internal)' setelah menerima 'Surat Perintah'. Dalam alur umum, tugas Anda adalah membuat 'BA Hasil Pengadaan' setelah menerima 'Surat Perintah Pengadaan'." },
            { q: "Bagaimana cara memulai pekerjaan saya?", a: "Periksa 'Surat Masuk' untuk melihat Surat Perintah baru. Setelah itu, buka 'Buat Surat', pilih alur yang sesuai, dan pilih dokumen yang menjadi tugas Anda (misal: Surat Pesanan Internal). Gunakan tombol 'Ambil Data' untuk mengimpor detail dari Surat Perintah yang relevan." },
            { q: "Di mana saya bisa melihat Surat Perintah yang masuk?", a: "Surat Perintah yang ditujukan kepada Anda akan muncul di halaman 'Surat Masuk'." }
        ],
        guide: [
            { title: "Menindaklanjuti Surat Perintah", steps: ["Buka 'Surat Masuk' untuk melihat Surat Perintah baru dari PPK.", "Buka halaman 'Buat Surat', pilih alur yang relevan, lalu pilih dokumen yang harus Anda buat.", "Gunakan tombol 'Ambil Data' dan pilih Surat Perintah yang sesuai. Sebagian besar formulir akan terisi otomatis.", "Lengkapi detail yang diperlukan, lalu kirim surat kembali."] }
        ]
    },
    vendor: {
        faq: [
            { q: "Di mana saya bisa melihat pesanan baru?", a: "Semua pesanan baru dari RSUD akan muncul di halaman 'Dashboard' Anda. Dashboard adalah halaman utama setelah Anda login." },
            { q: "Bagaimana cara saya menyetujui pesanan?", a: "Di dashboard, cari pesanan yang ingin Anda proses. Klik tombol 'Lihat Bundle'. Setelah meninjau dokumen, jika semua sudah sesuai, klik tombol 'Konfirmasi & Setujui Pesanan' di bagian atas halaman." },
            { q: "Bagaimana jika ada yang salah atau saya punya pertanyaan tentang pesanan?", a: "Di halaman 'Lihat Bundle', klik tombol 'Ajukan Pertanyaan / Revisi'. Tulis pesan Anda di formulir yang muncul. Pesanan akan otomatis dikembalikan ke tim internal dengan status 'Revisi Diminta'." },
            { q: "Apa yang terjadi setelah saya menyetujui pesanan?", a: "Setelah Anda menyetujui, status pesanan akan berubah menjadi 'Disetujui'. Tim internal RSUD akan melanjutkan proses pengadaan berdasarkan konfirmasi Anda." },
        ],
        guide: [
            { title: "Mengelola Pesanan Baru", steps: ["Login ke Portal Vendor.", "Periksa tabel di Dashboard untuk melihat semua pesanan yang dikirimkan kepada Anda.", "Status 'Terkirim' menandakan pesanan baru yang memerlukan tindakan Anda."] },
            { title: "Meninjau dan Merespon Pesanan", steps: ["Klik tombol 'Lihat Bundle' untuk melihat semua dokumen terkait pesanan.", "Tinjau detail, jumlah, dan spesifikasi barang/jasa yang diminta.", "Jika sesuai, klik 'Konfirmasi & Setujui Pesanan'.", "Jika ada pertanyaan atau perlu koreksi, klik 'Ajukan Pertanyaan / Revisi' dan kirimkan catatan Anda."] }
        ]
    },
    staf: {
        faq: [
            { q: "Bagaimana cara membuat surat umum (di luar alur pengadaan)?", a: "Untuk saat ini, fitur 'Buat Surat' difokuskan pada alur pengadaan. Untuk surat umum, silakan koordinasikan dengan atasan atau administrator sistem." },
            { q: "Di mana saya bisa menemukan draf yang belum selesai?", a: "Jika Anda terlibat dalam alur pengadaan, draf Anda tersimpan di halaman 'Surat Keluar' di bawah tab 'Draft'. Anda bisa melanjutkannya dari sana." },
            { q: "Bagaimana saya tahu jika ada surat atau tugas baru untuk saya?", a: "Periksa halaman 'Surat Masuk' dan menu 'Notifikasi' (ikon lonceng) secara berkala. Surat yang didisposisikan kepada Anda akan muncul di sana." }
        ],
        guide: [
            { title: "Menindaklanjuti Disposisi", steps: ["Buka 'Surat Masuk', cari surat yang statusnya 'Didisposisikan' kepada Anda.", "Baca instruksi pada disposisi.", "Setelah tindakan selesai, gunakan menu aksi (tiga titik) dan pilih 'Selesaikan Proses' untuk mengubah statusnya menjadi 'Selesai'."] }
        ]
    }
};

export default function BantuanPage() {
    const [selectedRole, setSelectedRole] = useState('ppk');
    const content = helpContent[selectedRole] || helpContent.staf;
    const currentUser = mockUsers.find(u => u.id === selectedRole) || mockUsers[2];

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
