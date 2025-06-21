
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
            { q: "Bagaimana cara menambahkan pengguna baru?", a: "Masuk ke menu 'Admin' dari sidebar, lalu klik tombol 'Tambah Pengguna'. Isi formulir yang tersedia dan simpan." },
            { q: "Bagaimana cara mengubah atau menonaktifkan pengguna?", a: "Di halaman 'Admin', temukan pengguna yang ingin diubah, klik menu tiga titik di sebelah kanan, lalu pilih 'Ubah'. Anda dapat mengubah detail dan status pengguna di halaman edit." },
            { q: "Dimana saya bisa melihat aktivitas sistem?", a: "Semua aktivitas penting tercatat di menu 'Log Aktivitas'. Halaman ini menunjukkan siapa yang melakukan apa dan kapan, sangat berguna untuk audit dan keamanan." }
        ],
        guide: [
            { title: "Mengelola Pengguna", steps: ["Buka menu 'Admin' untuk melihat semua pengguna.", "Gunakan tombol 'Tambah Pengguna' untuk mendaftarkan akun baru.", "Gunakan menu aksi (tiga titik) untuk 'Ubah' atau 'Hapus' pengguna yang sudah ada."] },
            { title: "Memantau Sistem", steps: ["Buka menu 'Log Aktivitas' untuk meninjau jejak audit.", "Gunakan filter untuk mencari aktivitas spesifik berdasarkan pengguna atau jenis aksi."] }
        ]
    },
    direktur: {
        faq: [
            { q: "Bagaimana cara melihat ringkasan status semua surat?", a: "Halaman 'Dashboard' adalah tempat utama Anda. Di sana terdapat kartu statistik, grafik, dan tabel yang merangkum semua aktivitas surat-menyurat." },
            { q: "Bagaimana cara saya menyetujui atau menolak surat?", a: "Di halaman 'Surat Masuk' atau 'Surat Keluar', gunakan menu aksi (tiga titik) pada surat yang relevan. Anda akan menemukan opsi untuk menyetujui, menolak, atau melakukan disposisi." },
            { q: "Dimana saya bisa melihat laporan detail?", a: "Menu 'Laporan' menyediakan analisis mendalam. Anda dapat memfilter berdasarkan rentang tanggal dan mengekspor data ke CSV untuk analisis lebih lanjut." }
        ],
        guide: [
            { title: "Menggunakan Dashboard", steps: ["Gunakan dropdown 'Tampilan Sebagai' untuk melihat perspektif unit lain.", "Periksa kartu statistik untuk gambaran cepat.", "Analisis tren bulanan melalui grafik volume surat."] },
            { title: "Merespon Surat", steps: ["Buka 'Surat Masuk' untuk melihat surat yang memerlukan tindakan Anda.", "Gunakan tombol 'Buat Disposisi' untuk meneruskan surat ke staf terkait.", "Gunakan opsi 'Tolak' jika surat tidak sesuai."] },
            { title: "Menganalisis Laporan", steps: ["Buka menu 'Laporan'.", "Pilih rentang tanggal yang diinginkan.", "Klik 'Ekspor' untuk mengunduh data dalam format CSV."] }
        ]
    },
    ppk: {
        faq: [
            { q: "Bagaimana cara membuat surat baru?", a: "Klik tombol 'Buat Surat' di pojok kanan atas. Pilih jenis surat yang ingin dibuat dari daftar, misalnya 'Surat Perintah' atau 'Berita Acara'." },
            { q: "Dimana saya bisa melihat draf surat yang sudah saya simpan?", a: "Semua draf Anda tersimpan di halaman 'Surat Keluar' di bawah tab 'Draft'." },
            { q: "Bagaimana alur pembuatan surat dari awal sampai akhir?", a: "Alurnya adalah: Surat Perintah -> Surat Pesanan (Internal) -> Surat Pesanan (Vendor) -> Berita Acara Pemeriksaan -> Berita Acara Serah Terima. Anda bisa menggunakan tombol 'Ambil Data' di setiap tahap untuk menarik informasi dari surat sebelumnya." }
        ],
        guide: [
            { title: "Membuat Surat Pengadaan", steps: ["Mulai dengan membuat 'Surat Perintah' dari menu 'Buat Surat'.", "Setelah disimpan, lanjutkan ke 'Surat Pesanan (Internal)' dan gunakan fitur 'Ambil Data' untuk mengimpor detail dari Surat Perintah.", "Lanjutkan alur yang sama untuk jenis surat berikutnya hingga BASTB."] },
            { title: "Melacak Status Surat", steps: ["Buka halaman 'Surat Keluar' untuk melihat status semua surat yang telah Anda buat.", "Gunakan menu aksi (tiga titik) dan pilih 'Lacak Alur' untuk melihat riwayat lengkap sebuah surat."] }
        ]
    },
    staf: {
        faq: [
            { q: "Bagaimana cara membuat surat baru?", a: "Klik tombol 'Buat Surat' di pojok kanan atas. Pilih jenis surat yang ingin dibuat dari daftar." },
            { q: "Dimana saya bisa melihat draf surat yang sudah saya simpan?", a: "Semua draf Anda tersimpan di halaman 'Surat Keluar' di bawah tab 'Draft'." },
            { q: "Bagaimana saya tahu jika ada surat masuk untuk saya?", a: "Periksa halaman 'Surat Masuk' dan menu 'Notifikasi' (ikon lonceng) secara berkala untuk melihat surat atau disposisi yang ditujukan kepada Anda." }
        ],
        guide: [
            { title: "Membuat Surat", steps: ["Klik 'Buat Surat', pilih template yang sesuai.", "Isi semua detail yang diperlukan pada formulir di sebelah kiri.", "Gunakan panel 'Preview' di sebelah kanan untuk memastikan format surat sudah benar sebelum menyimpan atau mencetak."] },
            { title: "Menindaklanjuti Surat Masuk", steps: ["Buka 'Surat Masuk', cari surat yang didisposisikan kepada Anda.", "Lakukan tindakan sesuai instruksi.", "Setelah selesai, gunakan menu aksi (tiga titik) dan pilih 'Selesaikan Proses' untuk mengubah statusnya."] }
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
