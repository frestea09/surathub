
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
};


// --- DEMO DATA SEEDING ---
const itemsData = [
  { id: 1, nama: "ALKOHOL 70% 1 LT", satuan: "BOTOL", merk: "ONEMED", jumlah: 24, hargaSatuan: 23800, diskon: 0 },
  { id: 2, nama: "ALKOHOL SWAB ONEMED 100 LBR", satuan: "BUAH", merk: "ONEMED", jumlah: 10000, hargaSatuan: 80, diskon: 0 },
  { id: 3, nama: "APRON ONE BOX 50'S", satuan: "BUAH", merk: "ONEMED", jumlah: 1500, hargaSatuan: 1656, diskon: 0 },
  { id: 4, nama: "CONDOM CATH L ONEMED", satuan: "BUAH", merk: "ONEMED", jumlah: 5, hargaSatuan: 5300, diskon: 0 },
  { id: 5, nama: "CONDOM CATH M ONEMED", satuan: "BUAH", merk: "ONEMED", jumlah: 5, hargaSatuan: 5300, diskon: 0 },
];
const itemsWithKeterangan = itemsData.map(item => ({...item, keterangan: "Baik sesuai dengan SP"}));

const seedInitialData = () => {
    if (typeof window === 'undefined' || localStorage.getItem('surat_data_seeded_v4')) {
        return;
    }
    
    // 1. Surat Perintah (Obat)
    const suratPerintah = [{
        nomor: "000.3/PPK-RSUD OTISTA/IV/2025",
        status: "Terkirim",
        lampiran: "-",
        perihal: "Perintah Pengadaan Barang Farmasi",
        tempat: "Soreang",
        tanggalSurat: new Date("2025-04-08T00:00:00"),
        penerima: "Pejabat Pengadaan Barang Jasa",
        penerimaTempat: "Tempat",
        isiSurat: "Berdasarkan Surat Nota Dinas dari Kepala Bidang Penunjang Non Medik Nomor : 002/FAR-RSUD/IV/2025 , perihal pengadaan obat dan BMHP pada Farmasi, maka dengan ini agar Pejabat Pengadaan Barang/Jasa segara persiapan dan pelaksanaan pengadaan dengan memperhatikan peraturan perundang-undangan yang berlaku dan memperhatikan ketersedian stok Obat dan BMHP.",
        penutup: "Demikian surat ini disampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih",
        jabatanPenandaTangan: "Pejabat Pembuat Komitmen",
        namaPenandaTangan: "Saep Trian Prasetia.S.Si..Apt",
        nipPenandaTangan: "NIP. 198408272008011005",
    }];
    localStorage.setItem('suratPerintahList', JSON.stringify(suratPerintah));

    // 2. Surat Pesanan Internal (Obat)
    const suratPesanan = [{
        formData: {
            nomor: "000.3/PPBJ-RSUD OTISTA/IV/2025",
            perihal: "Penerbitan Surat Pesanan",
            tempat: "Soreang",
            tanggalSurat: new Date("2025-04-09T00:00:00"),
            penerima: "PEJABAT PEMBUAT KOMITMEN",
            penerimaTempat: "Tempat",
            nomorSuratReferensi: "000.3/PPK-RSUD OTISTA/IV/2025",
            tanggalSuratReferensi: new Date("2025-04-08T00:00:00"),
            terbilang: "Delapan Ratus Ribu Rupiah",
            jabatanPenandaTangan: "Pejabat Pengadaan Barang Jasa",
            namaPenandaTangan: "Deti Hapitri, A.Md.Gz",
            nipPenandaTangan: "NIP. 197711042005042013",
            ppn: 11,
            status: "Terkirim",
        },
        items: itemsData,
    }];
    localStorage.setItem('suratPesananList', JSON.stringify(suratPesanan));

    // 3. Surat Pesanan Vendor (Obat)
    const suratPesananFinal = [{
        formData: {
            nomor: "000.3/06-FAR/PPK-RSUD OTISTA/IV/2025",
            perihal: "Pesanan Barang Farmasi",
            tempat: "Soreang",
            tanggalSurat: new Date("2025-04-10T00:00:00"),
            penerima: "PT Intisumber Hasil Sempurna Global",
            penerimaTempat: "Tempat",
            nomorSuratReferensi: "000.3/PPBJ-RSUD OTISTA/IV/2025",
            tanggalSuratReferensi: new Date("2025-04-09T00:00:00"),
            terbilang: "Delapan Ratus Ribu Rupiah",
            jabatanPenandaTangan: "Pejabat Pembuat Komitmen",
            namaPenandaTangan: "Saep Trian Prasetia.S.Si..Apt",
            nipPenandaTangan: "198408272008011005",
            ppn: 11,
            status: "Terkirim",
        },
        items: itemsData,
    }];
    localStorage.setItem('suratPesananFinalList', JSON.stringify(suratPesananFinal));
    
    // 4. Berita Acara Pemeriksaan (Obat)
    const beritaAcara = [{
        formData: {
            nomor: "06/PPK-FAR/RSUDO/IV/2025",
            narasiPembuka: "Pada hari ini, Rabu Tanggal Tiga Puluh Bulan April Tahun Dua Ribu Dua Puluh Lima, bertempat di Rumah Sakit Umum Daerah Oto Iskandar Di Nata, yang bertanda tangan dibawah ini Pejabat Pembuat Komitmen RSUD Oto Iskandar Di Nata Tahun Anggaran 2025, dengan ini menyatakan dengan sebenarnya telah melaksanakan pemeriksaan barang dan jasa.",
            vendorNama: "PT Intisumber Hasil Sempurna Global",
            vendorAlamat: "Jl. Raya Sapan Kawasan DE PRIMA TERRA Blok B-3 No 5 Bojongsoang Bandung",
            nomorSuratReferensi: "000.3/06-FAR/PPK-RSUD OTISTA/IV/2025",
            tanggalSuratReferensi: new Date("2025-04-10T00:00:00"),
            narasiPenutup: "Demikian Berita Acara Pemeriksaan Barang ini, dibuat dalam rangkap 3 (Tiga) untuk di pergunakan sebagaimana mestinya.",
            penyediaNama: "PT Intisumber Hasil Sempurna Global",
            pejabatNama: "Saep Trian Prasetia.S.Si.Apt",
            pejabatNip: "NIP. 198408272008011005",
            status: "Selesai",
        },
        items: itemsWithKeterangan
    }];
    localStorage.setItem('beritaAcaraList', JSON.stringify(beritaAcara));
    
    // 5. Berita Acara Serah Terima (Obat)
    const bastb = [{
        formData: {
            nomor: 'BASTB/06/FAR/IV/2025',
            narasiPembuka: 'Pada hari ini, Rabu Tanggal Tiga Puluh Bulan April Tahun Dua Ribu Dua Puluh Lima, bertempat di Rumah Sakit Umum Daerah Oto Iskandar Di Nata, yang bertanda tangan dibawah ini.',
            pihak1Nama: 'Saep Trian Prasetia.S.Si. Apt',
            pihak1Nip: '198408272008011005',
            pihak1Jabatan: 'Pejabat Pembuat Komitmen RSUD Oto Iskandar Di Nata',
            pihak1Alamat: 'Jalan Raya Gading Tutuka Desa Cingcin, Kecamatan Soreang Kabupaten Bandung',
            pihak2Nama: 'dr. H. Yani Sumpena Muchtar, SH, MH.Kes',
            pihak2Nip: '196711022002121001',
            pihak2Jabatan: 'Kuasa Pengguna Anggaran RSUD Oto Iskandar Di Nata',
            pihak2Alamat: 'Jalan Raya Gading Tutuka Desa Cingcin, Kecamatan Soreang Kabupaten Bandung',
            nomorSuratPesanan: '000.3/06-FAR/PPK-RSUD OTISTA/IV/2025',
            tanggalSuratPesanan: new Date('2025-04-10T00:00:00'),
            nomorBeritaAcara: '06/PPK-FAR/RSUDO/IV/2025',
            tanggalBeritaAcara: new Date('2025-04-30T00:00:00'),
            narasiPenutup: 'Demikian Berita Acara Serah Terima Barang ini, dibuat dalam rangkap 3 (Tiga) untuk di pergunakan sebagaimana mestinya.',
            status: 'Selesai'
        }
    }];
    localStorage.setItem('bastbList', JSON.stringify(bastb));
    
    // 6. Surat Perintah (Umum)
     const suratPerintahUmum = [{
      nomor: "02/Alat Listrik/PPK/V/2025",
      status: "Terkirim",
      lampiran: "-",
      perihal: "Pengadaan Belanja Alat Listrik Bulan Mei 2025",
      tempat: "Soreang",
      tanggalSurat: new Date("2025-05-19T00:00:00"),
      penerima: "Pejabat Pengadaan Barang/Jasa",
      penerimaTempat: "Tempat",
      isiSurat: "Berdasarkan Nota Dinas dari Kepala Bidang Penunjang Non Medik Nomor : 64a/Umpeg/2025 Tanggal 2 Mei 2025 Hal Permohonan Pengadaan Barang Jasa pada IPSRS, maka dengan ini agar Pejabat Pengadaan Barang/Jasa segera persiapan dan pelaksanaan pengadaan dengan memperhatikan peraturan perundang-undangan yang berlaku.",
      penutup: "Demikian surat ini disampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.",
      jabatanPenandaTangan: "PEJABAT PEMBUAT KOMITMEN\nRSUD OTO ISKANDAR DI NATA",
      namaPenandaTangan: "Heru Heriyanto, S. Kep, Ners",
      nipPenandaTangan: "NIP. 19741215 200604 1 014",
    }];
    localStorage.setItem('suratPerintahUmumList', JSON.stringify(suratPerintahUmum));

    // 7. Berita Acara Hasil Pengadaan (Umum)
    const beritaAcaraHasil = [{
        formData: {
            nomor: '02/Alat Listrik/PP/V/2025',
            tanggalSurat: new Date('2025-05-19T00:00:00'),
            namaPaket: 'Pengadaan Belanja Alat Listrik Bulan Mei 2025',
            nilaiNegosiasi: 5308575,
            pejabatNama: 'Asep Yuyun, S.Sos',
            pejabatNip: 'NIP.19741219 201001 1 001',
            status: 'Terkirim',
        },
        peserta: [{ id: 1, nama: 'TB Doa Sepuh', pemilik: 'iin Permana', hasilEvaluasi: 'Lulus' }]
    }];
    localStorage.setItem('beritaAcaraHasilList', JSON.stringify(beritaAcaraHasil));

    // 8. Surat Pesanan (Umum)
    const suratPesananUmum = [{
        formData: {
            nomor: "000.3/02-Alat Listrik/RSUDO/V/2025",
            hal: "Surat Pesanan",
            tempat: "Soreang",
            tanggalSurat: new Date("2025-05-20T00:00:00"),
            penerima: "TB. Doa Sepuh",
            penerimaAlamat: "Jl. Simpang Wetan Desa Sekarwangi Soreang",
            nomorSuratReferensi: "02/Alat Listrik/PP/V/2025",
            tanggalSuratReferensi: new Date("2025-05-19T00:00:00"),
            terbilang: "Lima Juta Tiga Ratus Delapan Ribu Lima Ratus Tujuh Puluh Lima Rupiah",
            jabatanPenandaTangan: "Pejabat Pembuat Komitmen\nRSUD Oto Iskandar Di Nata",
            namaPenandaTangan: "Heru Heriyanto, S.Kep, Ners",
            nipPenandaTangan: "NIP.19741215 200604 1 014",
            ppn: 11,
            status: 'Terkirim'
        },
        items: [
            { id: 1, nama: "Lampu 8 Watt Bulat 4\"", volume: 5, satuan: "Bh", hargaSatuan: 30600 },
            { id: 2, nama: "Steker", volume: 5, satuan: "Bh", hargaSatuan: 12800 },
            { id: 3, nama: "Stop kontak", volume: 5, satuan: "Bh", hargaSatuan: 17400 },
            { id: 4, nama: "Lampu downlight", volume: 50, satuan: "Bh", hargaSatuan: 46000 },
            { id: 5, nama: "Fiting Gantung", volume: 2, satuan: "Bh", hargaSatuan: 8500 },
            { id: 6, nama: "Lampu 15 watt", volume: 2, satuan: "Bh", hargaSatuan: 20500 },
            { id: 7, nama: "Kabel 0,75", volume: 1, satuan: "Rol", hargaSatuan: 429000 },
            { id: 8, nama: "Solasi Nito", volume: 5, satuan: "Bh", hargaSatuan: 12400 },
            { id: 9, nama: "Lampu Neon", volume: 2, satuan: "Bh", hargaSatuan: 46000 },
            { id: 10, nama: "Lampu 8 Watt", volume: 15, satuan: "Bh", hargaSatuan: 56000 },
            { id: 11, nama: "Termial 3L Broco", volume: 10, satuan: "Bh", hargaSatuan: 46000 },
            { id: 12, nama: "Steker Broco", volume: 5, satuan: "Bh", hargaSatuan: 12500 },
            { id: 13, nama: "Stop Kontak Broco", volume: 10, satuan: "Bh", hargaSatuan: 17500 },
        ]
    }];
    localStorage.setItem('suratPesananUmumList', JSON.stringify(suratPesananUmum));

    localStorage.setItem('surat_data_seeded_v4', 'true');
    console.log("Demo surat data seeded into localStorage.");
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
