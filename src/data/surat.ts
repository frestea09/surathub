
// This type is now defined in the hook, let's keep a single source of truth.
// A single unified type for all kinds of "surat"
export type Surat = {
    nomor: string;
    judul: string;
    jenis: "Surat Masuk" | "Surat Keluar";
    tipe: string; // e.g., 'SPP', 'SP-Vendor', 'BA', 'BASTB', 'Masuk'
    status: 'Draft' | 'Terkirim' | 'Diarsipkan' | 'Ditolak' | 'Baru' | 'Didisposisikan' | 'Selesai';
    tanggal: string;
    unit: string;
    penanggungJawab: string;
    dariKe: string;
};


const getUnitForSurat = (surat: any): string => {
    const perihal = surat.perihal?.toLowerCase() || surat.judul?.toLowerCase() || '';
    if (perihal.includes('keuangan')) return 'Keuangan';
    if (perihal.includes('farmasi') || perihal.includes('pengadaan')) return 'Pengadaan';
    if (perihal.includes('dinas')) return 'Umum';
    if (surat.tujuan?.toLowerCase().includes('kepala') || surat.tujuan?.toLowerCase().includes('direktur')) return 'Pimpinan';
    return 'Umum';
};

const mapToUnifiedFormat = (item: any, jenis: 'Surat Keluar' | 'Surat Masuk', tipe: string, unit?: string): Surat => {
    const base = jenis === 'Surat Keluar' ? item.formData || item : item;
    const tanggalSource = base.tanggalSurat || base.tanggalSuratReferensi || base.tanggal;
    const tanggal = tanggalSource
        ? new Date(tanggalSource).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    return {
        nomor: base.nomor || base.noSurat,
        judul: base.perihal || 'N/A',
        jenis,
        tipe,
        status: base.status || 'Draft',
        tanggal,
        unit: unit || getUnitForSurat(base),
        penanggungJawab: base.namaPenandaTangan || base.disposisi || 'Admin',
        dariKe: base.penerima || base.pengirim || base.vendorNama || 'Internal',
    };
};

const initialSuratMasukData = [
    {
        nomor: "123/A/UM/2024",
        perihal: "Undangan Rapat Koordinasi",
        pengirim: "Kementerian Kesehatan",
        tanggal: "2024-07-25",
        status: "Didisposisikan",
        disposisi: "Direktur Utama"
    },
    {
        nomor: "INV/2024/07/998",
        perihal: "Invoice Pembelian ATK",
        pengirim: "CV. ATK Bersama",
        tanggal: "2024-07-26",
        status: "Baru",
        disposisi: "Belum"
    },
];


export const fetchAllSurat = (): Surat[] => {
    try {
        if (typeof window === 'undefined') {
            return []; // Return empty on server
        }

        const suratPerintahList = JSON.parse(localStorage.getItem('suratPerintahList') || '[]').map((s:any) => mapToUnifiedFormat(s, 'Surat Keluar', 'SPP', 'Pengadaan'));
        const suratPesananList = JSON.parse(localStorage.getItem('suratPesananList') || '[]').map((s:any) => mapToUnifiedFormat(s, 'Surat Keluar', 'SP', 'Pengadaan'));
        const suratPesananFinalList = JSON.parse(localStorage.getItem('suratPesananFinalList') || '[]').map((s:any) => mapToUnifiedFormat(s, 'Surat Keluar', 'SP-Vendor', 'Pengadaan'));
        const beritaAcaraList = JSON.parse(localStorage.getItem('beritaAcaraList') || '[]').map((s:any) => mapToUnifiedFormat(s, 'Surat Keluar', 'BA', 'Pengadaan'));
        const bastbList = JSON.parse(localStorage.getItem('bastbList') || '[]').map((s:any) => mapToUnifiedFormat(s, 'Surat Keluar', 'BASTB', 'Pengadaan'));
        const suratMasukList = initialSuratMasukData.map(s => mapToUnifiedFormat(s, 'Surat Masuk', 'Masuk'));

        const allSurat = [
            ...suratMasukList,
            ...suratPerintahList,
            ...suratPesananList,
            ...suratPesananFinalList,
            ...beritaAcaraList,
            ...bastbList
        ];
        
        const uniqueSurat = allSurat.filter((surat, index, self) =>
            index === self.findIndex((s) => s.nomor === surat.nomor)
        );

        return uniqueSurat.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    } catch (e) {
        console.error("Failed to load surat from localStorage", e);
        return [];
    }
};
