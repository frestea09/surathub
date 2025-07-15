
import { create } from 'zustand';
import type { User } from './userStore';

export type Surat = {
    nomor: string;
    judul: string;
    jenis: "Surat Masuk" | "Surat Keluar";
    tipe: string; // e.g., 'SPP', 'SP', 'SP-Vendor'
    status: 'Draft' | 'Terkirim' | 'Diarsipkan' | 'Ditolak' | 'Baru' | 'Didisposisikan' | 'Selesai' | 'Disetujui' | 'Revisi Diminta';
    tanggal: string;
    unit: string;
    penanggungJawab: string;
    dariKe: string;
    data: any; // Original form data
    revisionHistory?: { by: string; date: string; message: string }[];
};

type SuratState = {
    surat: Surat[];
    isLoading: boolean;
    error: string | null;
    fetchAllSurat: (activeUser?: User | null) => void;
    addSurat: (surat: Omit<Surat, 'jenis' | 'unit'>) => void;
    updateSurat: (nomor: string, updatedData: Partial<Omit<Surat, 'nomor'>>) => void;
    deleteSurat: (nomor: string) => void;
    addRevisionNote: (nomor: string, note: { by: string; date: string; message: string }) => void;
}

const SURAT_STORAGE_KEY = 'surathub_surat_v3';

const getUnitForSurat = (suratData: any): string => {
    const perihal = suratData.judul?.toLowerCase() || suratData.perihal?.toLowerCase() || suratData.hal?.toLowerCase() || suratData.namaPaket?.toLowerCase() || '';
    if (perihal.includes('keuangan')) return 'Keuangan';
    if (perihal.includes('farmasi') || perihal.includes('pengadaan') || perihal.includes('obat') || perihal.includes('listrik')) return 'Pengadaan';
    if (perihal.includes('dinas')) return 'Umum';
    if (suratData.penerima?.toLowerCase().includes('kepala') || suratData.penerima?.toLowerCase().includes('direktur')) return 'Pimpinan';
    return 'Umum';
};

const mapToUnifiedFormat = (item: any, jenis: 'Surat Keluar' | 'Surat Masuk', tipe: string): Surat => {
    const base = jenis === 'Surat Keluar' ? item.formData || item : item;
    const tanggalSource = base.tanggalSurat || base.tanggalSuratReferensi || base.tanggalBeritaAcara || base.tanggal;
    const tanggal = tanggalSource
        ? new Date(tanggalSource).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    const judul = base.perihal || base.hal || base.judul || base.namaPaket || `Dokumen Tipe ${tipe}`;

    return {
        nomor: base.nomor || `DRAFT-${Date.now()}`,
        judul,
        jenis,
        tipe,
        status: base.status || 'Draft',
        tanggal,
        unit: getUnitForSurat({ ...base, judul }),
        penanggungJawab: base.namaPenandaTangan || base.pejabatNama || base.pihak1Nama || 'Admin',
        dariKe: base.penerima || base.vendorNama || base.pengirim || 'Internal',
        data: item, // Store the original object with formData/items structure
        revisionHistory: base.revisionHistory || [],
    };
};

const getInitialSuratData = (): Surat[] => {
    // Alur Pengadaan Obat & BMHP
    const itemsDataObat = [
      { id: 1, nama: "ALKOHOL 70% 1 LT", satuan: "BOTOL", merk: "ONEMED", jumlah: 24, hargaSatuan: 23800, diskon: 0 },
      { id: 2, nama: "ALKOHOL SWAB ONEMED 100 LBR", satuan: "BUAH", merk: "ONEMED", jumlah: 10000, hargaSatuan: 80, diskon: 0 },
    ];
    const sppData = { nomor: "000.3/PPK-RSUD OTISTA/IV/2025", status: "Terkirim", perihal: "Perintah Pengadaan Barang Farmasi", tanggalSurat: new Date("2025-04-08T00:00:00"), penerima: "Pejabat Pengadaan Barang Jasa", namaPenandaTangan: "Saep Trian Prasetia.S.Si..Apt" };
    const spData = { formData: { nomor: "000.3/PPBJ-RSUD OTISTA/IV/2025", perihal: "Penerbitan Surat Pesanan", tanggalSurat: new Date("2025-04-09T00:00:00"), nomorSuratReferensi: "000.3/PPK-RSUD OTISTA/IV/2025", status: "Terkirim"}, items: itemsDataObat };
    const spVendorData = { formData: { nomor: "000.3/06-FAR/PPK-RSUD OTISTA/IV/2025", perihal: "Pesanan Barang Farmasi", tanggalSurat: new Date("2025-04-10T00:00:00"), penerima: "PT Intisumber Hasil Sempurna Global", nomorSuratReferensi: "000.3/PPBJ-RSUD OTISTA/IV/2025", status: "Terkirim", revisionHistory: []}, items: itemsDataObat };
    const baData = { formData: { nomor: "06/PPK-FAR/RSUDO/IV/2025", perihal: "BA Pemeriksaan untuk PT Intisumber", vendorNama: "PT Intisumber Hasil Sempurna Global", nomorSuratReferensi: "000.3/06-FAR/PPK-RSUD OTISTA/IV/2025", status: "Terkirim", tanggalSuratReferensi: new Date("2025-04-11T00:00:00")}, items: itemsDataObat.map(item => ({...item, keterangan: "Baik sesuai dengan SP"})) };
    const bastbData = { formData: { nomor: 'BASTB/06/FAR/IV/2025', perihal: "BASTB untuk PT Intisumber", nomorBeritaAcara: '06/PPK-FAR/RSUDO/IV/2025', status: 'Selesai', tanggalBeritaAcara: new Date("2025-04-12T00:00:00") }};

    // Alur Pengadaan Barang Jasa Umum
    const itemsDataUmum = [{ id: 1, nama: "Lampu 8 Watt Bulat 4\"", volume: 5, satuan: "Bh", hargaSatuan: 30600 }];
    const spuData = { nomor: "02/Alat Listrik/PPK/V/2025", perihal: "Pengadaan Belanja Alat Listrik Bulan Mei 2025", tanggalSurat: new Date("2025-05-19T00:00:00"), status: "Terkirim" };
    const bahData = { formData: { nomor: '02/Alat Listrik/PP/V/2025', namaPaket: 'Pengadaan Belanja Alat Listrik Bulan Mei 2025', tanggalSurat: new Date('2025-05-20T00:00:00'), status: 'Terkirim', nomorSuratReferensi: '02/Alat Listrik/PPK/V/2025'}, peserta: [{ id: 1, nama: 'TB Doa Sepuh', pemilik: 'iin Permana', hasilEvaluasi: 'Lulus' }] };
    const spUmumData = { formData: { nomor: "000.3/02-Alat Listrik/RSUDO/V/2025", hal: "Surat Pesanan Alat Listrik", tanggalSurat: new Date("2025-05-21T00:00:00"), penerima: "TB. Doa Sepuh", nomorSuratReferensi: "02/Alat Listrik/PP/V/2025", status: "Terkirim", revisionHistory: []}, items: itemsDataUmum };
    const baUmumData = { formData: { nomor: "02/BAP-Alat Listrik/V/2025", perihal: "BA Pemeriksaan untuk TB. Doa Sepuh", vendorNama: "TB. Doa Sepuh", nomorSuratReferensi: "000.3/02-Alat Listrik/RSUDO/V/2025", tanggalSurat: new Date("2025-05-22T00:00:00"), status: "Selesai"}, items: itemsDataUmum.map(i => ({...i, keterangan: "Sesuai"})) };
    
    // Surat Masuk
    const sm1 = { nomor: "123/A/UM/2024", judul: "Undangan Rapat Koordinasi", dariKe: "Kementerian Kesehatan", tanggal: "2024-07-25", status: "Didisposisikan", penanggungJawab: "Direktur Utama" };
    const sm2 = { nomor: "INV/2024/07/998", judul: "Invoice Pembelian ATK", dariKe: "CV. ATK Bersama", tanggal: "2024-07-26", status: "Baru", penanggungJawab: "Belum" };

    return [
        mapToUnifiedFormat(sppData, 'Surat Keluar', 'SPP'),
        mapToUnifiedFormat(spData, 'Surat Keluar', 'SP'),
        mapToUnifiedFormat(spVendorData, 'Surat Keluar', 'SP-Vendor'),
        mapToUnifiedFormat(baData, 'Surat Keluar', 'BA'),
        mapToUnifiedFormat(bastbData, 'Surat Keluar', 'BASTB'),
        mapToUnifiedFormat(spuData, 'Surat Keluar', 'SPU'),
        mapToUnifiedFormat(bahData, 'Surat Keluar', 'BAH'),
        mapToUnifiedFormat(spUmumData, 'Surat Keluar', 'SP-Umum'),
        mapToUnifiedFormat(baUmumData, 'Surat Keluar', 'BA-Umum'),
        mapToUnifiedFormat(sm1, 'Surat Masuk', 'Masuk'),
        mapToUnifiedFormat(sm2, 'Surat Masuk', 'Masuk'),
    ];
};

const fetchSuratFromStorage = (activeUser?: User | null): Surat[] => {
    try {
        if (typeof window === 'undefined') return [];

        let allSurat: Surat[] = [];
        const storedSurat = localStorage.getItem(SURAT_STORAGE_KEY);
        
        if (storedSurat) {
            allSurat = JSON.parse(storedSurat);
        } else {
            allSurat = getInitialSuratData();
            localStorage.setItem(SURAT_STORAGE_KEY, JSON.stringify(allSurat));
        }
        
        if (activeUser && activeUser.jabatan === 'Vendor') {
            return allSurat.filter(s => s.dariKe === activeUser.nama && (s.tipe === 'SP-Vendor' || s.tipe === 'SP-Umum'))
                           .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
        }

        return allSurat.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    } catch (e) {
        console.error("Failed to load surat from localStorage", e);
        return [];
    }
};

const saveSuratToStorage = (suratList: Surat[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(SURAT_STORAGE_KEY, JSON.stringify(suratList));
    }
}

export const useSuratStore = create<SuratState>((set, get) => ({
    surat: [],
    isLoading: true,
    error: null,
    
    fetchAllSurat: (activeUser) => {
        set({ isLoading: true, error: null });
        try {
            const surat = fetchSuratFromStorage(activeUser);
            set({ surat, isLoading: false });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },

    addSurat: (newSuratData) => {
        const { surat } = get();
        const fullSuratObject = mapToUnifiedFormat(newSuratData.data, 'Surat Keluar', newSuratData.tipe);
        
        const existingIndex = surat.findIndex(s => s.nomor === fullSuratObject.nomor);
        let updatedList;

        if (existingIndex > -1) {
            updatedList = [...surat];
            updatedList[existingIndex] = fullSuratObject;
        } else {
            updatedList = [...surat, fullSuratObject];
        }
        
        saveSuratToStorage(updatedList);
        set({ surat: updatedList });
    },

    updateSurat: (nomor, updatedData) => {
        const { surat } = get();
        const updatedList = surat.map(s => {
            if (s.nomor === nomor) {
                const newSurat = { ...s, ...updatedData };
                const dataTarget = newSurat.data.formData || newSurat.data;
                Object.assign(dataTarget, updatedData);
                return newSurat;
            }
            return s;
        });
        saveSuratToStorage(updatedList);
        set({ surat: updatedList });
    },

    addRevisionNote: (nomor, note) => {
        const { surat } = get();
        const updatedList = surat.map(s => {
            if (s.nomor === nomor) {
                const newHistory = [...(s.revisionHistory || []), note];
                const newSurat = { ...s, revisionHistory: newHistory };
                
                const dataTarget = newSurat.data.formData || newSurat.data;
                dataTarget.revisionHistory = newHistory;
                
                return newSurat;
            }
            return s;
        });
        saveSuratToStorage(updatedList);
        set({ surat: updatedList });
    },

    deleteSurat: (nomor) => {
        const { surat } = get();
        const updatedList = surat.filter(s => s.nomor !== nomor);
        saveSuratToStorage(updatedList);
        set({ surat: updatedList });
    }
}));
