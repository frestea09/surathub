
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
  { id: "log1", tanggal: "2024-08-01 10:05:12", pengguna: "Admin", aksi: "LOGIN", detail: "Pengguna berhasil login", status: "Info" },
  { id: "log2", tanggal: "2024-08-01 10:10:22", pengguna: "Admin", aksi: "BUAT_SURAT", detail: "Membuat draf surat keluar No. 008/SP/RSUD-O/VIII/2024", status: "Berhasil" },
  { id: "log3", tanggal: "2024-08-01 10:15:03", pengguna: "Admin", aksi: "KIRIM_SURAT", detail: "Mengirim surat keluar No. 008/SP/RSUD-O/VIII/2024", status: "Berhasil" },
  { id: "log4", tanggal: "2024-08-01 11:00:45", pengguna: "Admin", aksi: "TERIMA_SURAT", detail: "Surat masuk No. INV/2024/08/1001 diterima", status: "Info" },
  { id: "log5", tanggal: "2024-08-01 11:02:15", pengguna: "Admin", aksi: "DISPOSISI", detail: "Disposisi surat No. INV/2024/08/1001 ke Bagian Keuangan", status: "Berhasil" },
  { id: "log6", tanggal: "2024-08-01 12:30:00", pengguna: "Admin", aksi: "TAMBAH_PENGGUNA", detail: "Pengguna 'user-test' ditambahkan", status: "Berhasil" },
  { id: "log7", tanggal: "2024-08-01 12:35:10", pengguna: "Admin", aksi: "UBAH_PENGGUNA", detail: "Data pengguna 'Budi Darmawan' diubah", status: "Berhasil" },
  { id: "log8", tanggal: "2024-08-01 14:00:00", pengguna: "system", aksi: "LOGIN_GAGAL", detail: "Upaya login gagal untuk pengguna 'tidakada'", status: "Gagal" },
  { id: "log9", tanggal: "2024-08-01 14:05:00", pengguna: "Admin", aksi: "HAPUS_SURAT", detail: "Surat masuk No. 123/A/UM/2024 dihapus", status: "Berhasil" },
  { id: "log10", tanggal: "2024-08-01 15:00:00", pengguna: "Direktur", aksi: "TOLAK_SURAT", detail: "Surat keluar No. 007/MEMO/RSUD-O/VIII/2024 ditolak", status: "Info" },
  { id: "log11", tanggal: "2024-08-01 16:00:00", pengguna: "Admin", aksi: "LOGOUT", detail: "Pengguna berhasil logout", status: "Info" },
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
