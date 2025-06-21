
"use client";

import React, { useState, useMemo } from "react";
import { Bell, CheckCircle, FileClock, FileStack, MoreHorizontal, Download, FileSearch, XCircle, FilePenLine, Mailbox, Send, UserCheck, Share2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DashboardChart } from "@/components/dashboard-chart";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppLayout } from "@/components/templates/AppLayout";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";

const mockUsers = [
    { id: 'admin', name: 'Admin', role: 'Admin', unit: 'All' },
    { id: 'direktur', name: 'Dr. H. Yani Sumpena', role: 'Direktur', unit: 'All' },
    { id: 'kabag-keuangan', name: 'Jane Doe', role: 'Kepala Bagian Keuangan', unit: 'Keuangan' },
    { id: 'ppk', name: 'Saep Trian Prasetia', role: 'Pejabat Pembuat Komitmen', unit: 'Pengadaan' },
    { id: 'kabag-umum', name: 'Budi Darmawan', role: 'Kepala Bagian Umum', unit: 'Umum' },
];

const initialSuratData = [
  { nomor: "SP-2024-05-001", judul: "Surat Perintah Pengadaan ATK", jenis: "SPP", tipe: "Keluar", status: "Diproses", tanggal: "2024-05-20", unit: "Umum", penanggungJawab: "Admin" },
  { nomor: "BA-2024-05-015", judul: "Berita Acara Pemeriksaan Barang", jenis: "BA", tipe: "Keluar", status: "Disetujui", tanggal: "2024-05-18", unit: "Pengadaan", penanggungJawab: "Saep Trian Prasetia" },
  { nomor: "ND-2024-05-032", judul: "Nota Dinas Rapat Koordinasi", jenis: "Nota Dinas", tipe: "Keluar", status: "Terkirim", tanggal: "2024-05-17", unit: "Pimpinan", penanggungJawab: "Dr. H. Yani Sumpena" },
  { nomor: "BAST-2024-04-098", judul: "BAST Pengadaan Komputer", jenis: "BAST", tipe: "Keluar", status: "Selesai", tanggal: "2024-04-30", unit: "Keuangan", penanggungJawab: "Jane Doe" },
  { nomor: "SP-2024-05-002", judul: "Surat Perintah Perbaikan AC", jenis: "SPP", tipe: "Keluar", status: "Diproses", tanggal: "2024-05-21", unit: "Umum", penanggungJawab: "Admin" },
  { nomor: "ND-2024-05-033", judul: "Nota Dinas Cuti Tahunan", jenis: "Nota Dinas", tipe: "Keluar", status: "Terkirim", tanggal: "2024-05-22", unit: "Kepegawaian", penanggungJawab: "Kepala Bagian Umum" },
  { nomor: "INV/2024/07/998", judul: "Invoice Pembelian ATK", jenis: "Masuk", tipe: "Masuk", tanggal: "2024-07-26", unit: "Keuangan", penanggungJawab: "Admin" },
  { nomor: "123/A/UM/2024", judul: "Undangan Rapat Koordinasi", jenis: "Masuk", tipe: "Masuk", tanggal: "2024-07-25", unit: "Pimpinan", penanggungJawab: "Direktur Utama" },
];

type Surat = typeof initialSuratData[0];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Disetujui: "default",
  Selesai: "default",
  Diproses: "secondary",
  Terkirim: "outline",
  Ditolak: "destructive",
  Masuk: "secondary",
};

export default function DashboardPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [suratData, setSuratData] = useState<Surat[]>(initialSuratData);
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLacakOpen, setIsLacakOpen] = useState(false);
  const [isTolakConfirmOpen, setIsTolakConfirmOpen] = useState(false);

  const handleRoleChange = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        setCurrentUser(user);
    }
  };

  const handleActionClick = (surat: Surat, action: 'detail' | 'lacak' | 'tolak') => {
    setSelectedSurat(surat);
    if (action === 'detail') setIsDetailOpen(true);
    if (action === 'lacak') setIsLacakOpen(true);
    if (action === 'tolak') setIsTolakConfirmOpen(true);
  };
  
  const handleDownloadPdf = () => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: "Fungsi unduh PDF akan segera tersedia.",
    });
  };

  const handleTolakConfirm = () => {
    if (!selectedSurat) return;
    setSuratData(prev => 
      prev.map(s => s.nomor === selectedSurat.nomor ? { ...s, status: 'Ditolak' } : s)
    );
    toast({
        title: "Berhasil",
        description: `Surat nomor ${selectedSurat.nomor} telah ditolak.`,
        variant: "destructive",
    });
    setIsTolakConfirmOpen(false);
    setSelectedSurat(null);
  };

  const { filteredSurat, dynamicStatCards } = useMemo(() => {
      const surat = (currentUser.unit === 'All') 
          ? suratData
          : suratData.filter(s => s.unit === currentUser.unit);

      const cards = [
        {
          title: "Surat Diproses",
          value: surat.filter(s => s.status === 'Diproses').length.toString(),
          description: "Surat dalam proses pengerjaan",
          icon: FileClock,
        },
        {
          title: "Surat Ditolak",
          value: surat.filter(s => s.status === 'Ditolak').length.toString(),
          description: "Surat yang telah ditolak",
          icon: XCircle,
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
  }, [currentUser, suratData]);

  const columns: ColumnDef<Surat>[] = [
    { accessorKey: "nomor", header: "No. Surat" },
    { accessorKey: "judul", header: "Judul" },
    { accessorKey: "jenis", header: "Jenis" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={statusVariant[status as keyof typeof statusVariant] || 'default'}>{status}</Badge>
      }
    },
    { accessorKey: "tanggal", header: "Tanggal" },
    {
      id: "actions",
      cell: ({ row }) => {
        const surat = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleActionClick(surat, 'detail')}>
                <FileSearch className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick(surat, 'lacak')}>
                <FileSearch className="mr-2 h-4 w-4" />
                 Lacak
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Unduh PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => handleActionClick(surat, 'tolak')}>
                <XCircle className="mr-2 h-4 w-4" />
                Tolak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ];

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
             <DataTable 
                columns={columns} 
                data={filteredSurat} 
                searchKey="judul"
                searchPlaceholder="Cari berdasarkan judul..."
              />
          </CardContent>
        </Card>
      </div>
      
      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Surat</DialogTitle>
            <DialogDescription>
              Detail lengkap dari surat yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {selectedSurat && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nomor" className="text-right">Nomor</Label>
                <Input id="nomor" value={selectedSurat.nomor} readOnly className="col-span-3" />
              </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="judul" className="text-right">Judul</Label>
                <Input id="judul" value={selectedSurat.judul} readOnly className="col-span-3" />
              </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jenis" className="text-right">Jenis</Label>
                <Input id="jenis" value={selectedSurat.jenis} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tanggal" className="text-right">Tanggal</Label>
                <Input id="tanggal" value={selectedSurat.tanggal} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Input id="status" value={selectedSurat.status} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="penanggungJawab" className="text-right">P. Jawab</Label>
                <Input id="penanggungJawab" value={selectedSurat.penanggungJawab} readOnly className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alur Dialog */}
      <Dialog open={isLacakOpen} onOpenChange={setIsLacakOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alur Lengkap Surat</DialogTitle>
            <DialogDescription>
              Linimasa perjalanan surat nomor <span className="font-semibold">{selectedSurat?.nomor}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedSurat?.tipe === 'Masuk' ? (
              <ul className="space-y-4">
                  <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><Mailbox className="h-4 w-4" /></div>
                          <div className="w-px h-16 bg-border"></div>
                      </div>
                      <div>
                          <p className="font-semibold">Surat Diterima</p>
                          <p className="text-sm text-muted-foreground">Oleh: Admin, Pada: {selectedSurat.tanggal}</p>
                          <p className="text-sm">Surat diterima dari Kemenkes.</p>
                      </div>
                  </li>
                  <li className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><Share2 className="h-4 w-4" /></div>
                            <div className="w-px h-16 bg-border"></div>
                        </div>
                        <div>
                          <p className="font-semibold">Disposisi</p>
                          <p className="text-sm text-muted-foreground">Oleh: Admin, Kepada: {selectedSurat.penanggungJawab}</p>
                          <p className="text-sm">Surat diteruskan untuk ditindaklanjuti.</p>
                        </div>
                  </li>
                    <li className="flex items-start">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white"><CheckCircle className="h-4 w-4" /></div>
                        <div className="ml-4">
                          <p className="font-semibold">Proses Selesai</p>
                          <p className="text-sm text-muted-foreground">Oleh: {selectedSurat.penanggungJawab}</p>
                          <p className="text-sm">{selectedSurat.status === 'Selesai' || selectedSurat.status === 'Disetujui' ? 'Tindakan yang diperlukan telah selesai.' : 'Surat masih dalam proses.'}</p>
                        </div>
                    </li>
              </ul>
            ) : (
                <ul className="space-y-4">
                  <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><FilePenLine className="h-4 w-4" /></div>
                          <div className="w-px h-16 bg-border"></div>
                      </div>
                      <div>
                          <p className="font-semibold">Draft Dibuat</p>
                          <p className="text-sm text-muted-foreground">Oleh: {selectedSurat?.penanggungJawab}, Pada: {selectedSurat?.tanggal}</p>
                          <p className="text-sm">Surat sedang dalam proses pembuatan.</p>
                      </div>
                  </li>
                    <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><UserCheck className="h-4 w-4" /></div>
                          <div className="w-px h-16 bg-border"></div>
                      </div>
                      <div>
                        <p className="font-semibold">Disetujui</p>
                        <p className="text-sm text-muted-foreground">{selectedSurat?.status !== 'Diproses' ? 'Oleh: Atasan Terkait' : 'Menunggu persetujuan'}</p>
                        <p className="text-sm">Persetujuan internal untuk pengiriman.</p>
                      </div>
                  </li>
                  <li className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-white"><Send className="h-4 w-4" /></div>
                        <div className="ml-4">
                        <p className="font-semibold">Surat Terkirim</p>
                        <p className="text-sm text-muted-foreground">{selectedSurat?.status === 'Terkirim' ? `Kepada: Tujuan Terkait` : 'Surat belum dikirim'}</p>
                        <p className="text-sm">Surat telah dikirimkan ke tujuan.</p>
                      </div>
                  </li>
              </ul>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tolak Confirm Dialog */}
      <AlertDialog open={isTolakConfirmOpen} onOpenChange={setIsTolakConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penolakan Surat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menolak surat ini? Status akan diubah menjadi &quot;Ditolak&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleTolakConfirm} className={buttonVariants({ variant: "destructive" })}>Ya, Tolak</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
