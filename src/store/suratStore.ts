
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
        nomor: base.nomor || base.noSurat || `DRAFT-${Date.now()}`,
        judul: base.perihal || 'N/A',
        jenis,
        tipe,
        status: base.status || 'Draft',
        tanggal,
        unit: unit || getUnitForSurat(base),
        penanggungJawab: base.namaPenandaTangan || base.disposisi || 'Admin',
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
    'bastbList'
];
const suratTipeMap: { [key: string]: string } = {
    'suratPerintahList': 'SPP',
    'suratPesananList': 'SP',
    'suratPesananFinalList': 'SP-Vendor',
    'beritaAcaraList': 'BA',
    'bastbList': 'BASTB'
};

const fetchSuratFromStorage = (): Surat[] => {
    try {
        if (typeof window === 'undefined') return [];

        let allSurat: Surat[] = [];

        // Fetch Surat Keluar from multiple localStorage keys
        suratStorageKeys.forEach(key => {
            const list = JSON.parse(localStorage.getItem(key) || '[]').map((s: any) => mapToUnifiedFormat(s, 'Surat Keluar', suratTipeMap[key], 'Pengadaan'));
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
        const list = JSON.parse(localStorage.getItem(listKey) || '[]');
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
                        const list = JSON.parse(localStorage.getItem(key) || '[]');
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
