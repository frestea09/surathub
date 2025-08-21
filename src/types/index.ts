
export type User = {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  status: string;
  password?: string;
};

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

export type WorkflowStep = {
    id: string;
    label: string;
    href: string;
};

export type Workflow = {
    id: string;
    title: string;
    description: string;
    steps: WorkflowStep[];
};
