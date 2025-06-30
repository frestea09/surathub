
import create from 'zustand';

export type Surat = {
    nomor: string;
    judul: string;
    jenis: "Surat Masuk" | "Surat Keluar";
    tipe: string;
    status: 'Draft' | 'Terkirim' | 'Diarsipkan' | 'Ditolak' | 'Baru' | 'Didisposisikan' | 'Selesai' | 'Disetujui';
    tanggal: string;
    unit: string;
    penanggungJawab: string;
    dariKe: string;
    data: any; // Original form data
};

type SuratState = {
    surat: Surat[];
    isLoading: boolean;
    error: string | null;
    fetchAllSurat: () => void;
    addSurat: (listKey: string, suratData: any) => void;
    updateSurat: (nomor: string, updatedData: Partial<Surat>) => void;
    deleteSurat: (nomor: string) => void;
}

const getUnitForSurat = (surat: any): string => {
    const perihal = surat.perihal?.toLowerCase() || surat.judul?.toLowerCase() || surat.namaPaket?.toLowerCase() || '';
    if (perihal.includes('keuangan')) return 'Keuangan';
    if (perihal.includes('farmasi') || perihal.includes('pengadaan')) return 'Pengadaan';
    if (perihal.includes('dinas') || perihal.includes('listrik')) return 'Umum';
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
        nomor: base.nomor || base.noSurat || `DRAFT-${Date.now()}`,
        judul: base.perihal || base.hal || base.namaPaket || 'N/A',
        jenis,
        tipe,
        status: base.status || 'Draft',
        tanggal,
        unit: unit || getUnitForSurat(base),
        penanggungJawab: base.namaPenandaTangan || base.pejabatNama || base.disposisi || 'Admin',
        dariKe: base.penerima || base.pengirim || base.vendorNama || 'Internal',
        data: item,
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

const suratStorageKeys = [
    'suratPerintahList', 
    'suratPesananList', 
    'suratPesananFinalList', 
    'beritaAcaraList', 
    'bastbList',
    'suratPerintahUmumList',
    'beritaAcaraHasilList',
    'suratPesananUmumList',
    'beritaAcaraUmumList',
];
const suratTipeMap: { [key: string]: string } = {
    'suratPerintahList': 'SPP',
    'suratPesananList': 'SP',
    'suratPesananFinalList': 'SP-Vendor',
    'beritaAcaraList': 'BA',
    'bastbList': 'BASTB',
    'suratPerintahUmumList': 'SPU',
    'beritaAcaraHasilList': 'BAH',
    'suratPesananUmumList': 'SP-Umum',
    'beritaAcaraUmumList': 'BA-Umum',
};


// --- DEMO DATA SEEDING ---
const seedInitialData = () => {
    if (typeof window === 'undefined' || localStorage.getItem('surat_data_seeded_v5')) {
        return;
    }
    
    // Alur Pengadaan Obat & BMHP
    const itemsDataObat = [
      { id: 1, nama: "ALKOHOL 70% 1 LT", satuan: "BOTOL", merk: "ONEMED", jumlah: 24, hargaSatuan: 23800, diskon: 0 },
      { id: 2, nama: "ALKOHOL SWAB ONEMED 100 LBR", satuan: "BUAH", merk: "ONEMED", jumlah: 10000, hargaSatuan: 80, diskon: 0 },
      { id: 3, nama: "APRON ONE BOX 50'S", satuan: "BUAH", merk: "ONEMED", jumlah: 1500, hargaSatuan: 1656, diskon: 0 },
    ];
    const itemsDataObatWithKeterangan = itemsDataObat.map(item => ({...item, keterangan: "Baik sesuai dengan SP"}));
    localStorage.setItem('suratPerintahList', JSON.stringify([{ nomor: "000.3/PPK-RSUD OTISTA/IV/2025", status: "Terkirim", perihal: "Perintah Pengadaan Barang Farmasi", tanggalSurat: new Date("2025-04-08T00:00:00"), penerima: "Pejabat Pengadaan Barang Jasa", namaPenandaTangan: "Saep Trian Prasetia.S.Si..Apt"}]));
    localStorage.setItem('suratPesananList', JSON.stringify([{ formData: { nomor: "000.3/PPBJ-RSUD OTISTA/IV/2025", perihal: "Penerbitan Surat Pesanan", tanggalSurat: new Date("2025-04-09T00:00:00"), nomorSuratReferensi: "000.3/PPK-RSUD OTISTA/IV/2025", status: "Terkirim"}, items: itemsDataObat}]));
    localStorage.setItem('suratPesananFinalList', JSON.stringify([{ formData: { nomor: "000.3/06-FAR/PPK-RSUD OTISTA/IV/2025", perihal: "Pesanan Barang Farmasi", tanggalSurat: new Date("2025-04-10T00:00:00"), penerima: "PT Intisumber Hasil Sempurna Global", nomorSuratReferensi: "000.3/PPBJ-RSUD OTISTA/IV/2025", status: "Terkirim"}, items: itemsDataObat}]));
    localStorage.setItem('beritaAcaraList', JSON.stringify([{ formData: { nomor: "06/PPK-FAR/RSUDO/IV/2025", vendorNama: "PT Intisumber Hasil Sempurna Global", nomorSuratReferensi: "000.3/06-FAR/PPK-RSUD OTISTA/IV/2025", status: "Selesai", perihal: "BA Pemeriksaan untuk PT Intisumber"}, items: itemsDataObatWithKeterangan}]));
    localStorage.setItem('bastbList', JSON.stringify([{ formData: { nomor: 'BASTB/06/FAR/IV/2025', nomorBeritaAcara: '06/PPK-FAR/RSUDO/IV/2025', status: 'Selesai', perihal: "BASTB untuk PT Intisumber" }}]));

    // Alur Pengadaan Barang Jasa Umum
    const itemsDataUmum = [
        { id: 1, nama: "Lampu 8 Watt Bulat 4\"", volume: 5, satuan: "Bh", hargaSatuan: 30600 },
        { id: 2, nama: "Steker", volume: 5, satuan: "Bh", hargaSatuan: 12800 },
        { id: 3, nama: "Stop kontak", volume: 5, satuan: "Bh", hargaSatuan: 17400 },
        { id: 4, nama: "Lampu downlight", volume: 50, satuan: "Bh", hargaSatuan: 46000 },
        { id: 5, nama: "Fiting Gantung", volume: 2, satuan: "Bh", hargaSatuan: 8500 },
    ];
    const itemsDataUmumWithKeterangan = itemsDataUmum.map(item => ({...item, keterangan: "Baik Sesuai dengan SP"}));
    localStorage.setItem('suratPerintahUmumList', JSON.stringify([{ nomor: "02/Alat Listrik/PPK/V/2025", perihal: "Pengadaan Belanja Alat Listrik Bulan Mei 2025", tanggalSurat: new Date("2025-05-19T00:00:00"), status: "Terkirim"}]));
    localStorage.setItem('beritaAcaraHasilList', JSON.stringify([{ formData: { nomor: '02/Alat Listrik/PP/V/2025', namaPaket: 'Pengadaan Belanja Alat Listrik Bulan Mei 2025', tanggalSurat: new Date('2025-05-19T00:00:00'), status: 'Terkirim'}, peserta: [{ id: 1, nama: 'TB Doa Sepuh', pemilik: 'iin Permana', hasilEvaluasi: 'Lulus' }]}]));
    localStorage.setItem('suratPesananUmumList', JSON.stringify([{ formData: { nomor: "000.3/02-Alat Listrik/RSUDO/V/2025", hal: "Surat Pesanan", tanggalSurat: new Date("2025-05-20T00:00:00"), penerima: "TB. Doa Sepuh", nomorSuratReferensi: "02/Alat Listrik/PP/V/2025", status: "Terkirim"}, items: itemsDataUmum}]));
    localStorage.setItem('beritaAcaraUmumList', JSON.stringify([{ formData: { nomor: "02/BAP-Alat Listrik/V/2025", perihal: "BA Pemeriksaan untuk TB. Doa Sepuh", vendorNama: "TB. Doa Sepuh", narasiRealisasi: "Sebagai realisasi dari Surat Pesanan dari Pejabat Pembuat Komitmen Nomor: 000.3/02-Alat Listrik/RSUDO/V/2025, tanggal 20 Mei 2025 dengan jumlah dan jenis barang sebagai berikut:", status: "Selesai"}, items: itemsDataUmumWithKeterangan}]));
    
    localStorage.setItem('surat_data_seeded_v5', 'true');
    console.log("Demo surat data seeded into localStorage (v5).");
};


const fetchSuratFromStorage = (): Surat[] => {
    try {
        if (typeof window === 'undefined') return [];

        seedInitialData();

        let allSurat: Surat[] = [];

        // Fetch Surat Keluar from multiple localStorage keys
        suratStorageKeys.forEach(key => {
            const list = JSON.parse(localStorage.getItem(key) || '[]').map((s: any) => mapToUnifiedFormat(s, 'Surat Keluar', suratTipeMap[key]));
            allSurat.push(...list);
        });

        // Fetch Surat Masuk
        const suratMasukList = initialSuratMasukData.map(s => mapToUnifiedFormat(s, 'Surat Masuk', 'Masuk'));
        allSurat.push(...suratMasukList);
        
        const uniqueSurat = allSurat.filter((surat, index, self) =>
            index === self.findIndex((s) => s.nomor === surat.nomor)
        );

        return uniqueSurat.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    } catch (e) {
        console.error("Failed to load surat from localStorage", e);
        return [];
    }
};

export const useSuratStore = create<SuratState>((set, get) => ({
    surat: [],
    isLoading: true,
    error: null,
    
    fetchAllSurat: () => {
        set({ isLoading: true, error: null });
        try {
            const surat = fetchSuratFromStorage();
            set({ surat, isLoading: false });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },

    addSurat: (listKey, suratData) => {
        if (typeof window === 'undefined') return;
        const list = JSON.parse(localStorage.getItem(listKey) || '[]'
        );
        const existingIndex = list.findIndex((item: any) => (item.formData || item).nomor === (suratData.formData || suratData).nomor);
        if (existingIndex > -1) {
          list[existingIndex] = suratData;
        } else {
          list.push(suratData);
        }
        localStorage.setItem(listKey, JSON.stringify(list));
        get().fetchAllSurat(); // Re-fetch all to update the unified state
    },

    updateSurat: (nomor, updatedData) => {
        set(state => {
            const newSuratList = state.surat.map(s => {
                if (s.nomor === nomor) {
                    const newSurat = { ...s, ...updatedData };
                    // Also update the underlying data object
                    newSurat.data.status = newSurat.status;
                    if (newSurat.data.formData) {
                        newSurat.data.formData.status = newSurat.status;
                    }

                    // Find the correct localStorage key and update it
                    const key = Object.keys(suratTipeMap).find(k => suratTipeMap[k] === newSurat.tipe);
                    if (key && typeof window !== 'undefined') {
                        const list = JSON.parse(localStorage.getItem(key) || '[]'
                        );
                        const index = list.findIndex((item: any) => (item.formData || item).nomor === nomor);
                        if (index > -1) {
                            if(list[index].formData) {
                                list[index].formData.status = newSurat.status;
                            } else {
                                list[index].status = newSurat.status;
                            }
                            localStorage.setItem(key, JSON.stringify(list));
                        }
                    }
                    return newSurat;
                }
                return s;
            });
            return { surat: newSuratList };
        });
    },

    deleteSurat: (nomor) => {
        set(state => {
            const suratToDelete = state.surat.find(s => s.nomor === nomor);
            if (!suratToDelete) return state;

            const key = Object.keys(suratTipeMap).find(k => suratTipeMap[k] === suratToDelete.tipe);
            if (key && typeof window !== 'undefined') {
                let list = JSON.parse(localStorage.getItem(key) || '[]');
                list = list.filter((item: any) => (item.formData || item).nomor !== nomor);
                localStorage.setItem(key, JSON.stringify(list));
            }
            return { surat: state.surat.filter(s => s.nomor !== nomor) };
        });
    }
}));

    