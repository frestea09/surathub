
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ShieldAlert, ShieldCheck, Info } from "lucide-react";

import { AppLayout } from "@/components/templates/AppLayout";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LogEntry = {
  id: string;
  tanggal: string;
  pengguna: string;
  aksi: string;
  detail: string;
  status: "Berhasil" | "Gagal" | "Info";
};

const mockLogData: LogEntry[] = [
  { id: "log1", tanggal: "2024-08-01 10:05:12", pengguna: "admin-01", aksi: "LOGIN_BERHASIL", detail: "Pengguna 'Admin Utama' berhasil login dari IP 192.168.1.10", status: "Info" },
  { id: "log2", tanggal: "2024-08-01 10:10:22", pengguna: "ppk-01", aksi: "BUAT_SURAT_PERINTAH", detail: "Membuat draf 'Surat Perintah' No. 000.3/PPK-RSUD OTISTA/IV/2025", status: "Berhasil" },
  { id: "log3", tanggal: "2024-08-01 10:15:03", pengguna: "ppk-01", aksi: "KIRIM_SURAT", detail: "Surat Perintah No. 000.3/PPK-RSUD OTISTA/IV/2025 dikirim ke Pejabat Pengadaan", status: "Berhasil" },
  { id: "log4", tanggal: "2024-08-01 10:30:00", pengguna: "ppbj-01", aksi: "BUAT_SURAT_PESANAN", detail: "Membuat draf 'Surat Pesanan (Internal)' No. 000.3/PPBJ-RSUD OTISTA/IV/2025", status: "Berhasil" },
  { id: "log5", tanggal: "2024-08-01 10:35:00", pengguna: "ppbj-01", aksi: "KIRIM_SURAT", detail: "Surat Pesanan (Internal) No. 000.3/PPBJ-RSUD OTISTA/IV/2025 dikirim ke PPK", status: "Berhasil" },
  { id: "log6", tanggal: "2024-08-01 10:45:00", pengguna: "ppk-01", aksi: "BUAT_SURAT_PESANAN_FINAL", detail: "Membuat draf 'Surat Pesanan (Vendor)' No. 000.3/06-FAR/PPK-RSUD OTISTA/IV/2025", status: "Berhasil" },
  { id: "log7", tanggal: "2024-08-01 10:50:00", pengguna: "ppk-01", aksi: "KIRIM_SURAT", detail: "Surat Pesanan (Vendor) No. 000.3/06-FAR/PPK-RSUD OTISTA/IV/2025 dikirim ke Vendor", status: "Berhasil" },
  { id: "log8", tanggal: "2024-08-01 11:00:45", pengguna: "admin-01", aksi: "TERIMA_SURAT_MASUK", detail: "Surat masuk No. INV/2024/07/998 dari 'CV. ATK Bersama' diterima", status: "Info" },
  { id: "log9", tanggal: "2024-08-01 11:02:15", pengguna: "admin-01", aksi: "BUAT_DISPOSISI", detail: "Disposisi surat No. INV/2024/07/998 ke 'Kepala Bagian Keuangan'", status: "Berhasil" },
  { id: "log10", tanggal: "2024-08-01 11:30:00", pengguna: "ppk-01", aksi: "BUAT_BERITA_ACARA", detail: "Membuat draf 'Berita Acara Pemeriksaan' No. 06/PPK-FAR/RSUDO/IV/2025", status: "Berhasil" },
  { id: "log11", tanggal: "2024-08-01 11:35:00", pengguna: "ppk-01", aksi: "BUAT_BASTB", detail: "Membuat draf 'Berita Acara Serah Terima' No. BASTB/06/FAR/IV/2025", status: "Berhasil" },
  { id: "log12", tanggal: "2024-08-01 12:30:00", pengguna: "admin-01", aksi: "TAMBAH_PENGGUNA", detail: "Pengguna 'Andi Wijaya' (Staf) ditambahkan", status: "Berhasil" },
  { id: "log13", tanggal: "2024-08-01 12:35:10", pengguna: "admin-01", aksi: "UBAH_PENGGUNA", detail: "Status pengguna 'Budi Darmawan' diubah menjadi Non-Aktif", status: "Berhasil" },
  { id: "log14", tanggal: "2024-08-01 14:00:00", pengguna: "system", aksi: "LOGIN_GAGAL", detail: "Upaya login gagal untuk pengguna 'tidakada' dari IP 202.55.12.34", status: "Gagal" },
  { id: "log15", tanggal: "2024-08-01 15:00:00", pengguna: "dir-01", aksi: "TOLAK_SURAT", detail: "Surat keluar No. 007/MEMO/RSUD-O/VIII/2024 ditolak", status: "Info" },
  { id: "log16", tanggal: "2024-08-01 15:15:45", pengguna: "keu-01", aksi: "SELESAIKAN_PROSES", detail: "Proses surat masuk No. 005/B/FIN/2024 diselesaikan", status: "Berhasil" },
  { id: "log17", tanggal: "2024-08-01 15:30:00", pengguna: "dir-01", aksi: "LIHAT_LAPORAN", detail: "Melihat laporan rentang tanggal 01/07/2024 - 31/07/2024", status: "Info" },
  { id: "log18", tanggal: "2024-08-01 15:31:00", pengguna: "dir-01", aksi: "EKSPOR_LAPORAN", detail: "Mengekspor laporan ke CSV", status: "Berhasil" },
  { id: "log19", tanggal: "2024-08-01 16:00:00", pengguna: "admin-01", aksi: "LOGOUT", detail: "Pengguna 'admin-01' berhasil logout", status: "Info" },
];

const statusConfig: { [key: string]: { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ElementType } } = {
  Berhasil: { variant: "default", icon: ShieldCheck },
  Gagal: { variant: "destructive", icon: ShieldAlert },
  Info: { variant: "secondary", icon: Info },
};


export default function LogAktivitasPage() {

  const columns: ColumnDef<LogEntry>[] = [
    {
      accessorKey: "tanggal",
      header: "Waktu",
    },
    {
      accessorKey: "pengguna",
      header: "Pengguna",
    },
    {
      accessorKey: "aksi",
      header: "Aksi",
    },
    {
      accessorKey: "detail",
      header: "Detail",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const config = statusConfig[status];
        return (
            <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                <config.icon className="h-3 w-3" />
                <span>{status}</span>
            </Badge>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Log Aktivitas Sistem</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Catatan Aktivitas</CardTitle>
          <CardDescription>
            Tinjau semua aktivitas penting yang terjadi di dalam sistem. Gunakan filter untuk mencari log spesifik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockLogData}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
