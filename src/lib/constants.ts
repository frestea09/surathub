
export const ROLES = {
  "Pimpinan & Pengawas": [
    "Direktur",
    "Dewan Pengawas",
    "Satuan Pengawasan Intern (SPI)",
  ],
  "Wakil Direktur Umum dan Sumber Daya": [
    "Wakil Direktur Umum dan Sumber Daya",
    "Kepala Bagian Umum dan Kepegawaian",
    "Tim Kerja Bidang Umum & Kepegawaian",
    "Kepala Bagian Keuangan",
    "Tim Kerja Bidang Pendapatan",
    "Tim Kerja Bidang Pengeluaran",
    "Kepala Bagian Perencanaan dan Kehumasan",
    "Tim Kerja Bidang Perencanaan",
    "Tim Kerja Bidang Kehumasan",
  ],
  "Wakil Direktur Pelayanan": [
    "Wakil Direktur Pelayanan",
    "Kepala Bidang Pelayanan Medik",
    "Tim Kerja Bidang Pelayanan Medik",
    "Kepala Bidang Pelayanan Keperawatan",
    "Tim Kerja Bidang Pelayanan Keperawatan",
    "Kepala Bidang Mutu Pelayanan",
    "Tim Kerja Bidang Mutu Pelayanan",
    "Kepala Bidang Rawat Inap",
    "Tim Kerja Bidang Rawat Inap",
  ],
  "Wakil Direktur Penunjang": [
    "Wakil Direktur Penunjang",
    "Kepala Bidang Penunjang Medik",
    "Tim Kerja Bidang Farmasi",
    "Tim Kerja Bidang Radiologi",
    "Tim Kerja Bidang Laboratorium",
    "Tim Kerja Bidang Rehabilitasi Medik",
    "Tim Kerja Bidang Gizi",
    "Kepala Bidang Penunjang Non-Medik",
    "Tim Kerja Bidang Sarana & Prasarana",
    "Tim Kerja Bidang Keamanan",
    "Tim Kerja Bidang Kebersihan dan Pengelolaan Sampah",
  ],
  "Komite & SMF": [
    "Komite Rekrutmen Medis",
    "Komite Etik dan Hukum",
    "Komite Pengendalian Infeksi",
    "Komite Mutu dan Keselamatan Pasien",
    "SMF (Sarana Medis Fungsional)",
  ],
};

export const USERS_STORAGE_KEY = 'surathub_users';

// Admin Page Constants
export const USER_PAGE_HEADING = "Manajemen Pengguna";
export const USER_PAGE_DESCRIPTION = "Kelola pengguna yang terdaftar di sistem. Tambah, ubah, atau hapus akun pengguna.";
export const ADD_USER_BUTTON_LABEL = "Tambah Pengguna";

// User Form Constants
export const ADD_USER_TITLE = "Tambah Pengguna Baru";
export const ADD_USER_DESCRIPTION = "Isi formulir untuk menambahkan pengguna baru ke sistem.";
export const EDIT_USER_TITLE = "Ubah Data Pengguna";
export const EDIT_USER_DESCRIPTION_PREFIX = "Perbarui informasi untuk pengguna:";
export const NAMA_LENGKAP_LABEL = "Nama Lengkap";
export const NIP_USERNAME_LABEL = "NIP / Username";
export const PASSWORD_LABEL = "Password";
export const CONFIRM_PASSWORD_LABEL = "Konfirmasi Password";
export const JABATAN_ROLE_LABEL = "Jabatan / Role";
export const STATUS_LABEL = "Status";
export const SAVE_USER_BUTTON_LABEL = "Simpan Pengguna";
export const UPDATE_USER_BUTTON_LABEL = "Simpan Perubahan";
export const BACK_TO_ADMIN_LINK_TEXT = "Kembali ke Manajemen Pengguna";
export const CANCEL_AND_BACK_LINK_TEXT = "Batal dan Kembali";

// Placeholders
export const NAMA_LENGKAP_PLACEHOLDER = "Masukkan nama lengkap";
export const NIP_USERNAME_PLACEHOLDER = "Masukkan NIP atau username";
export const PASSWORD_PLACEHOLDER = "Masukkan password";
export const CONFIRM_PASSWORD_PLACEHOLDER = "Konfirmasi password Anda";
export const JABATAN_PLACEHOLDER = "Pilih jabatan pengguna";
export const STATUS_PLACEHOLDER = "Pilih status pengguna";
export const PASSWORD_EDIT_PLACEHOLDER = "Kosongkan jika tidak ingin mengubah";

// Status Options
export const STATUS_OPTIONS = ["Aktif", "Non-Aktif"];

// Column Headers
export const COLUMN_NIP = "NIP/Username";
export const COLUMN_NAMA = "Nama";
export const COLUMN_JABATAN = "Jabatan";
export const COLUMN_PASSWORD = "Password";
export const COLUMN_STATUS = "Status";
export const COLUMN_ACTIONS_LABEL = "Aksi";
export const ACTION_EDIT_LABEL = "Ubah";
export const ACTION_DELETE_LABEL = "Hapus";

// Dialogs
export const DELETE_CONFIRM_TITLE = "Konfirmasi Hapus Pengguna";
export const DELETE_CONFIRM_DESCRIPTION_PREFIX = "Apakah Anda yakin ingin menghapus pengguna";
export const DELETE_CONFIRM_DESCRIPTION_SUFFIX = "? Tindakan ini tidak dapat dibatalkan.";
export const CANCEL_BUTTON_LABEL = "Batal";
export const CONFIRM_DELETE_BUTTON_LABEL = "Ya, Hapus";

// Navigation
export const NAV_LINKS = {
  DASHBOARD: "Dashboard",
  SURAT_MASUK: "Surat Masuk",
  SURAT_KELUAR: "Surat Keluar",
  LAPORAN: "Laporan",
  ARSIP_BUNDLE: "Arsip Bundle",
  NOTIFIKASI: "Notifikasi",
  ADMIN: "Admin",
  LOG_AKTIVITAS: "Log Aktivitas",
  BANTUAN: "Bantuan",
  PENGATURAN: "Pengaturan",
};

// Header & User Menu
export const HEADER_SR = {
  TOGGLE_NAV: "Toggle navigation menu",
  TOGGLE_NOTIF: "Toggle notifications",
  TOGGLE_USER_MENU: "Toggle user menu",
  SEARCH_PLACEHOLDER: "Cari surat...",
};

export const USER_MENU = {
  PROFIL: "Profil",
  PENGATURAN: "Pengaturan",
  KELUAR: "Keluar",
};

export const NOTIFICATION_MENU = {
  LABEL: "Notifikasi",
  VIEW_ALL: "Lihat semua notifikasi",
};

// Buat Surat Button & Popover
export const BUAT_SURAT_POPOVER = {
  BUTTON_LABEL: "Buat Surat",
  SEARCH_PLACEHOLDER: "Cari jenis surat...",
  NOT_FOUND: "Jenis surat tidak ditemukan.",
  SURAT_PERINTAH: "1. Surat Perintah",
  SURAT_PESANAN_INTERNAL: "2. Surat Pesanan (Internal)",
  SURAT_PESANAN_VENDOR: "3. Surat Pesanan (Vendor)",
  BERITA_ACARA_PEMERIKSAAN: "4. Berita Acara Pemeriksaan",
  BERITA_ACARA_SERAH_TERIMA: "5. Berita Acara Serah Terima",
  SURAT_PERINTAH_PENGADAAN: "1. Surat Perintah Pengadaan",
  BERITA_ACARA_HASIL_PENGADAAN: "2. Berita Acara Hasil Pengadaan",
  SURAT_PESANAN_UMUM: "3. Surat Pesanan",
  BERITA_ACARA_PEMERIKSAAN_UMUM: "4. Berita Acara Pemeriksaan",
};
