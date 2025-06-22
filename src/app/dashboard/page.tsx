
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Bell, CheckCircle, FileClock, FileStack, MoreHorizontal, FileSearch, XCircle, FilePenLine, Mailbox, Send, UserCheck, Share2, AlertTriangle } from "lucide-react";
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
import { useSuratStore, type Surat } from "@/store/suratStore";
import { Skeleton } from "@/components/ui/skeleton";

const mockUsers = [
    { id: 'admin', name: 'Admin Utama', role: 'Administrator Sistem', unit: 'All' },
    { id: 'direktur', name: 'dr. H. Yani Sumpena Muchtar, SH, MH.Kes', role: 'Direktur', unit: 'All' },
    { id: 'keuangan', name: 'Jane Doe', role: 'Kepala Bagian Keuangan', unit: 'Keuangan' },
    { id: 'ppk', name: 'Saep Trian Prasetia.S.Si.Apt', role: 'Pejabat Pembuat Komitmen', unit: 'Pengadaan' },
    { id: 'ppbj', name: 'Deti Hapitri, A.Md.Gz', role: 'Pejabat Pengadaan Barang Jasa', unit: 'Pengadaan' },
    { id: 'staf', name: 'Staf Umum', role: 'Staf/Pengguna', unit: 'Umum' },
    { id: 'yanmed', name: 'Dr. Anisa Fitriani, Sp.A', role: 'Kepala Bidang Pelayanan Medik', unit: 'Pelayanan' },
];


const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Disetujui: "default",
  Selesai: "default",
  Terkirim: "default",
  Diarsipkan: "default",
  Diproses: "secondary",
  Draft: "secondary",
  Baru: "secondary",
  Didisposisikan: "outline",
  Ditolak: "destructive",
};

const DashboardStatCardSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-3 w-full" />
        </CardContent>
    </Card>
);


export default function DashboardPage() {
  const { toast } = useToast();
  const { surat, isLoading, error, fetchAllSurat, updateSurat } = useSuratStore();

  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLacakOpen, setIsLacakOpen] = useState(false);
  const [isTolakConfirmOpen, setIsTolakConfirmOpen] = useState(false);

  useEffect(() => {
    fetchAllSurat();
  }, [fetchAllSurat]);

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

  const handleTolakConfirm = () => {
    if (!selectedSurat) return;
    updateSurat(selectedSurat.nomor, { status: 'Ditolak' });
    toast({
        title: "Berhasil",
        description: `Surat nomor ${selectedSurat.nomor} telah ditolak.`,
        variant: "destructive",
    });
    setIsTolakConfirmOpen(false);
    setSelectedSurat(null);
  };

  const { filteredSurat, dynamicStatCards } = useMemo(() => {
      const data = (currentUser.unit === 'All') 
          ? surat || []
          : (surat || []).filter(s => s.unit === currentUser.unit || s.unit === "Pimpinan" );

      const cards = [
        {
          title: "Surat Diproses",
          value: data.filter(s => ['Diproses', 'Draft', 'Baru', 'Didisposisikan'].includes(s.status)).length.toString(),
          description: "Surat dalam proses pengerjaan",
          icon: FileClock,
        },
        {
          title: "Surat Ditolak",
          value: data.filter(s => s.status === 'Ditolak').length.toString(),
          description: "Surat yang telah ditolak",
          icon: XCircle,
        },
        {
          title: "Selesai Bulan Ini",
          value: data.filter(s => {
              const suratDate = new Date(s.tanggal);
              const now = new Date();
              return (s.status === 'Selesai' || s.status === 'Disetujui' || s.status === 'Terkirim' || s.status === 'Diarsipkan') &&
                  suratDate.getMonth() === now.getMonth() &&
                  suratDate.getFullYear() === now.getFullYear();
          }).length.toString(),
          description: "Total surat yang sudah selesai bulan ini",
          icon: CheckCircle,
        },
        {
          title: "Total Arsip",
          value: data.length.toString(),
          description: "Total semua surat terarsip",
          icon: FileStack,
        },
      ];

      return { filteredSurat: data, dynamicStatCards: cards };
  }, [currentUser, surat]);

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

  if (error) {
    return (
        <AppLayout>
             <Card className="bg-destructive/10 border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle />
                        Gagal Memuat Data Surat
                    </CardTitle>
                    <CardDescription className="text-destructive">
                        Terjadi kesalahan saat mengambil data surat: {error}
                    </CardDescription>
                </CardHeader>
            </Card>
        </AppLayout>
    )
  }

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
        {isLoading ? (
            <>
                <DashboardStatCardSkeleton />
                <DashboardStatCardSkeleton />
                <DashboardStatCardSkeleton />
                <DashboardStatCardSkeleton />
            </>
        ) : (
            dynamicStatCards.map((card, index) => (
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
            ))
        )}
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
             {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-8 w-1/3 ml-auto" />
                </div>
             ) : (
                <DataTable 
                    columns={columns} 
                    data={filteredSurat} 
                />
             )}
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
            {selectedSurat?.jenis === 'Surat Masuk' ? (
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
