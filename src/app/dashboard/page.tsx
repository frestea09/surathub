
"use client";

import React, { useState, useMemo } from "react";
import { Bell, CheckCircle, FileClock, FileStack, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardChart } from "@/components/dashboard-chart";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppLayout } from "@/components/templates/AppLayout";

const mockUsers = [
    { id: 'admin', name: 'Admin', role: 'Admin', unit: 'All' },
    { id: 'direktur', name: 'Dr. H. Yani Sumpena', role: 'Direktur', unit: 'All' },
    { id: 'kabag-keuangan', name: 'Jane Doe', role: 'Kepala Bagian Keuangan', unit: 'Keuangan' },
    { id: 'ppk', name: 'Saep Trian Prasetia', role: 'Pejabat Pembuat Komitmen', unit: 'Pengadaan' },
    { id: 'kabag-umum', name: 'Budi Darmawan', role: 'Kepala Bagian Umum', unit: 'Umum' },
];

const allSuratData = [
  { nomor: "SP-2024-05-001", judul: "Surat Perintah Pengadaan ATK", jenis: "SPP", status: "Diproses", tanggal: "2024-05-20", unit: "Umum", penanggungJawab: "Admin" },
  { nomor: "BA-2024-05-015", judul: "Berita Acara Pemeriksaan Barang", jenis: "BA", status: "Disetujui", tanggal: "2024-05-18", unit: "Pengadaan", penanggungJawab: "Saep Trian Prasetia" },
  { nomor: "ND-2024-05-032", judul: "Nota Dinas Rapat Koordinasi", jenis: "Nota Dinas", status: "Terkirim", tanggal: "2024-05-17", unit: "Pimpinan", penanggungJawab: "Dr. H. Yani Sumpena" },
  { nomor: "BAST-2024-04-098", judul: "BAST Pengadaan Komputer", jenis: "BAST", status: "Selesai", tanggal: "2024-04-30", unit: "Keuangan", penanggungJawab: "Jane Doe" },
  { nomor: "SP-2024-05-002", judul: "Surat Perintah Perbaikan AC", jenis: "SPP", status: "Ditolak", tanggal: "2024-05-21", unit: "Umum", penanggungJawab: "Admin" },
  { nomor: "ND-2024-05-033", judul: "Nota Dinas Cuti Tahunan", jenis: "Nota Dinas", status: "Terkirim", tanggal: "2024-05-22", unit: "Kepegawaian", penanggungJawab: "Kepala Bagian Umum" },
  { nomor: "INV/2024/07/998", perihal: "Invoice Pembelian ATK", jenis: "Masuk", tanggal: "2024-07-26", unit: "Keuangan", penanggungJawab: "Admin" },
  { noSurat: "123/A/UM/2024", perihal: "Undangan Rapat Koordinasi", jenis: "Masuk", tanggal: "2024-07-25", unit: "Pimpinan", penanggungJawab: "Direktur Utama" },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Disetujui: "default",
  Selesai: "default",
  Diproses: "secondary",
  Terkirim: "outline",
  Ditolak: "destructive",
};

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);

  const handleRoleChange = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        setCurrentUser(user);
    }
  };

  const { filteredSurat, dynamicStatCards } = useMemo(() => {
      const surat = (currentUser.unit === 'All') 
          ? allSuratData 
          : allSuratData.filter(s => s.unit === currentUser.unit);

      const cards = [
        {
          title: "Surat Diproses",
          value: surat.filter(s => s.status === 'Diproses').length.toString(),
          description: "Surat dalam proses pengerjaan",
          icon: FileClock,
        },
        {
          title: "Jatuh Tempo",
          value: surat.filter(s => s.status === 'Ditolak').length.toString(), // Example logic
          description: "Surat perlu perhatian segera",
          icon: Bell,
        },
        {
          title: "Selesai Bulan Ini",
          value: surat.filter(s => s.status === 'Selesai' || s.status === 'Disetujui').length.toString(),
          description: "Total surat yang sudah selesai",
          icon: CheckCircle,
        },
        {
          title: "Total Arsip",
          value: surat.length.toString(),
          description: "Total semua surat terarsip",
          icon: FileStack,
        },
      ];

      return { filteredSurat: surat, dynamicStatCards: cards };
  }, [currentUser]);


  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard ({currentUser.role})</h1>
          <div className="w-64">
            <Label htmlFor="role-switcher">Tampilan Sebagai:</Label>
            <Select value={currentUser.id} onValueChange={handleRoleChange}>
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
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {dynamicStatCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardChart data={filteredSurat} />
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Surat Terbaru</CardTitle>
              <CardDescription>
                Daftar surat yang baru-baru ini diproses untuk {currentUser.unit === 'All' ? 'semua unit' : `unit ${currentUser.unit}`}.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Surat</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead className="text-center">Jenis</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Tanggal</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurat.slice(0, 6).map((surat) => (
                  <TableRow key={surat.nomor}>
                    <TableCell className="font-medium">
                      {surat.nomor}
                    </TableCell>
                    <TableCell>{surat.judul || surat.perihal}</TableCell>
                    <TableCell className="text-center">{surat.jenis}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusVariant[surat.status as keyof typeof statusVariant] || 'default'}>
                        {surat.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{surat.tanggal}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          <DropdownMenuItem>Lacak</DropdownMenuItem>
                          <DropdownMenuItem>Unduh PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
