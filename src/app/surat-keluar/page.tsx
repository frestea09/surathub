
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Archive,
  Download,
  FilePenLine,
  FileSearch,
  MoreHorizontal,
  Send,
  UserCheck,
  XCircle,
  Search,
  Trash2,
  FileArchive,
  Pencil,
  MessageSquareWarning,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppLayout } from "@/components/templates/AppLayout";
import { DataTable } from "@/components/ui/data-table";
import { useSuratStore, type Surat } from "@/store/suratStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore, type User } from "@/store/userStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Terkirim: "default",
  Draft: "secondary",
  Diarsipkan: "outline",
  Ditolak: "destructive",
  Selesai: "default",
  Baru: "secondary",
  Didisposisikan: "outline",
  Disetujui: "default",
  'Revisi Diminta': 'destructive'
};

export default function SuratKeluarPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const { surat, isLoading, fetchAllSurat, updateSurat, deleteSurat } = useSuratStore();
  const { users, fetchUsers: fetchUserStoreUsers } = useUserStore();

  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [dialogAction, setDialogAction] = useState< 'detail' | 'lacak' | 'arsip' | 'kirim' | 'tolak' | 'hapus' | null>(null);
  const [activeTab, setActiveTab] = useState(tabQuery || "semua");
  const [penerima, setPenerima] = useState<string[]>([]);
  const [kirimSearchTerm, setKirimSearchTerm] = useState("");

  useEffect(() => {
    fetchAllSurat();
    fetchUserStoreUsers();
  }, [fetchAllSurat, fetchUserStoreUsers]);

  const isKirimKeVendor = useMemo(() => {
    if (!selectedSurat) return false;
    const vendorUsers = users.filter(u => u.jabatan === 'Vendor').map(u => u.nama);
    return vendorUsers.includes(selectedSurat.dariKe);
  }, [selectedSurat, users]);

  const internalUsers = useMemo(() => users.filter(u => u.jabatan !== 'Vendor'), [users]);

  const suratList = useMemo(() => surat.filter(s => s.jenis === 'Surat Keluar'), [surat]);

  const handleActionClick = (surat: Surat, action: 'detail' | 'lacak' | 'arsip' | 'kirim' | 'tolak' | 'hapus') => {
    setSelectedSurat(surat);
    setDialogAction(action);
     if (action === 'kirim') {
        setPenerima([]);
        setKirimSearchTerm("");
    }
  };

  const handleEditClick = (surat: Surat) => {
    let path = '';
    switch (surat.tipe) {
        case 'SPP':
            path = '/buat-surat';
            break;
        case 'SP':
            path = '/buat-surat-pesanan';
            break;
        case 'SP-Vendor':
            path = '/buat-surat-pesanan-final';
            break;
        case 'BA':
            path = '/buat-berita-acara';
            break;
        case 'BASTB':
            path = '/buat-bastb';
            break;
        case 'SPU':
             path = '/buat-surat-perintah-umum';
            break;
        case 'BAH':
             path = '/buat-berita-acara-hasil';
            break;
        case 'SP-Umum':
             path = '/buat-surat-pesanan-umum';
            break;
        case 'BA-Umum':
            path = '/buat-berita-acara-umum';
            break;
        default:
            toast({
                variant: 'destructive',
                title: 'Gagal',
                description: 'Tipe surat tidak dikenali untuk diedit.',
            });
            return;
    }
    router.push(`${path}?edit=${encodeURIComponent(surat.nomor)}`);
  };
  
  const closeDialog = () => {
    setSelectedSurat(null);
    setDialogAction(null);
  }

  const handleArsipConfirm = () => {
    if (!selectedSurat) return;
    updateSurat(selectedSurat.nomor, { status: 'Diarsipkan' });
    toast({
        title: "Berhasil",
        description: `Surat nomor ${selectedSurat.nomor} telah diarsipkan.`,
    });
    closeDialog();
  };
  
  const handleTolakConfirm = () => {
    if (!selectedSurat) return;
    updateSurat(selectedSurat.nomor, { status: 'Ditolak' });
    toast({
        title: "Berhasil",
        description: `Surat nomor ${selectedSurat.nomor} telah ditolak.`,
        variant: "destructive"
    });
    closeDialog();
  };
  
  const handleHapusConfirm = () => {
    if (!selectedSurat) return;
    deleteSurat(selectedSurat.nomor);
    toast({
        title: "Berhasil Dihapus",
        description: `Surat nomor ${selectedSurat.nomor} telah dihapus dari sistem.`,
    });
    closeDialog();
  }

  const handleKirimConfirm = () => {
    if (!selectedSurat) return;

    if(isKirimKeVendor) {
        updateSurat(selectedSurat.nomor, { status: 'Terkirim' });
        toast({
            title: 'Berhasil Diterbitkan',
            description: `Surat nomor ${selectedSurat.nomor} telah diterbitkan ke portal vendor.`,
        });
    } else {
        if (penerima.length === 0) {
            toast({
                variant: "destructive",
                title: "Gagal Mengirim",
                description: "Silakan pilih setidaknya satu penerima internal.",
            });
            return;
        }
        updateSurat(selectedSurat.nomor, { status: 'Terkirim', dariKe: penerima.join(', ') });
        toast({
            title: `Berhasil Terkirim`,
            description: `Surat nomor ${selectedSurat.nomor} telah dikirim ke ${penerima.length} penerima.`,
        });
    }
    closeDialog();
  };
  
  const filteredSurat = useMemo(() => suratList.filter(surat => {
    if (activeTab === "semua") return true;
    if (activeTab === "draft") return surat.status === "Draft";
    if (activeTab === "terkirim") return surat.status === "Terkirim" || surat.status === "Disetujui";
    if (activeTab === "diarsipkan") return surat.status === "Diarsipkan";
    if (activeTab === "ditolak") return surat.status === "Ditolak";
    if (activeTab === "revisi") return surat.status === "Revisi Diminta";
    return true;
  }), [suratList, activeTab]);

  const filteredUsers = internalUsers.filter(
    user =>
      user.nama.toLowerCase().includes(kirimSearchTerm.toLowerCase()) ||
      user.jabatan.toLowerCase().includes(kirimSearchTerm.toLowerCase())
  );
  
  const columns: ColumnDef<Surat>[] = [
      {
          accessorKey: "nomor",
          header: "Nomor Surat",
      },
      {
          accessorKey: "judul",
          header: "Perihal",
      },
      {
          accessorKey: "dariKe",
          header: "Tujuan",
      },
      {
          accessorKey: "tanggal",
          header: "Tanggal",
      },
      {
          accessorKey: "status",
          header: "Status",
          cell: ({ row }) => {
              const status = row.getValue("status") as keyof typeof statusVariant;
              return <Badge variant={statusVariant[status] || 'default'}>{status}</Badge>
          }
      },
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
                          <DropdownMenuItem onClick={() => handleEditClick(surat)} disabled={surat.status !== 'Draft' && surat.status !== 'Revisi Diminta'}>
                              <Pencil className="mr-2 h-4 w-4" />
                              {surat.status === 'Revisi Diminta' ? 'Revisi Draf' : 'Edit Draf'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick(surat, 'kirim')} disabled={surat.status !== 'Draft'}>
                              <Send className="mr-2 h-4 w-4" />
                              Kirim / Terbitkan
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick(surat, 'lacak')}>
                              <FileSearch className="mr-2 h-4 w-4" />
                              Lacak Alur
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem
                            onClick={() => router.push(`/cetak-bundle?nomor=${surat.nomor}&tipe=${surat.tipe}`)}
                            >
                                <FileArchive className="mr-2 h-4 w-4" />
                                Cetak Bundle
                            </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick(surat, 'arsip')} disabled={surat.status === 'Diarsipkan'}>
                              <Archive className="mr-2 h-4 w-4" />
                              Arsipkan
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleActionClick(surat, 'tolak')}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Tolak
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleActionClick(surat, 'hapus')}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              )
          }
      }
  ];

  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Surat Keluar</h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="revisi">
                <MessageSquareWarning className="mr-2 h-4 w-4" />
                Revisi Diminta
            </TabsTrigger>
            <TabsTrigger value="terkirim">Terkirim</TabsTrigger>
            <TabsTrigger value="diarsipkan">Diarsipkan</TabsTrigger>
            <TabsTrigger value="ditolak" className="text-destructive">Ditolak</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={activeTab}>
              <Card>
                <CardHeader>
                    <CardTitle>Daftar Surat Keluar</CardTitle>
                    <CardDescription>Kelola semua surat yang dibuat dan dikirim.</CardDescription>
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
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={dialogAction === 'detail'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Surat Keluar</DialogTitle>
            <DialogDescription>
              Detail lengkap dari surat keluar yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {selectedSurat && (
            <ScrollArea className="max-h-[60vh]">
            <div className="grid gap-4 py-4 pr-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nomor" className="text-right">Nomor</Label>
                <Input id="nomor" value={selectedSurat.nomor} readOnly className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="perihal" className="text-right">Perihal</Label>
                <Input id="perihal" value={selectedSurat.judul} readOnly className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tujuan" className="text-right">Tujuan</Label>
                <Input id="tujuan" value={selectedSurat.dariKe} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tanggal" className="text-right">Tanggal</Label>
                <Input id="tanggal" value={selectedSurat.tanggal} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Input id="status" value={selectedSurat.status} readOnly className="col-span-3" />
              </div>

               {selectedSurat.revisionHistory && selectedSurat.revisionHistory.length > 0 && (
                 <div className="col-span-4 mt-4">
                    <Label>Riwayat Revisi</Label>
                    <div className="mt-2 space-y-3 rounded-md border p-4 bg-yellow-50/50">
                        {selectedSurat.revisionHistory.map((rev, index) => (
                             <div key={index} className="flex gap-3">
                                <MessageSquareWarning className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold">{rev.by}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(rev.date).toLocaleString('id-ID')}</p>
                                    <p className="text-sm mt-1">{rev.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
               )}
            </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Lacak Pengiriman Dialog */}
      <Dialog open={dialogAction === 'lacak'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alur Pengiriman Surat</DialogTitle>
            <DialogDescription>
              Linimasa persetujuan internal dan pengiriman surat keluar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ul className="space-y-4">
                <li className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white">
                            <FilePenLine className="h-4 w-4" />
                        </div>
                        <div className="w-px h-16 bg-border"></div>
                    </div>
                    <div>
                        <p className="font-semibold">Draft Dibuat</p>
                        <p className="text-sm text-muted-foreground">Senin, 29 Jul 2024, 10:00 WIB</p>
                        <p className="text-sm">Dibuat oleh: Tim Kerja Bidang Umum</p>
                    </div>
                </li>
                <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white">
                              <UserCheck className="h-4 w-4" />
                          </div>
                          <div className="w-px h-16 bg-border"></div>
                      </div>
                      <div>
                        <p className="font-semibold">Disetujui Kepala Bagian</p>
                        <p className="text-sm text-muted-foreground">Senin, 29 Jul 2024, 11:30 WIB</p>
                         <p className="text-sm">Disetujui oleh: Kepala Bagian Umum</p>
                      </div>
                </li>
                <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white">
                              <UserCheck className="h-4 w-4" />
                          </div>
                          <div className="w-px h-16 bg-border"></div>
                      </div>
                      <div>
                        <p className="font-semibold">Disetujui Wakil Direktur</p>
                        <p className="text-sm text-muted-foreground">Senin, 29 Jul 2024, 14:00 WIB</p>
                         <p className="text-sm">Disetujui oleh: Wakil Direktur Umum</p>
                      </div>
                </li>
                  <li className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground">
                          <Send className="h-4 w-4" />
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold">Surat Terkirim</p>
                        <p className="text-sm text-muted-foreground">Senin, 29 Jul 2024, 14:30 WIB</p>
                        <p className="text-sm">Surat berhasil dikirim ke {selectedSurat?.dariKe}.</p>
                      </div>
                </li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Kirim Surat Dialog (Internal) */}
      <Dialog open={dialogAction === 'kirim' && !isKirimKeVendor} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kirim Surat Internal</DialogTitle>
            <DialogDescription>
              Pilih penerima surat nomor <span className="font-semibold">{selectedSurat?.nomor}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Pilih Penerima</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau jabatan..."
                  value={kirimSearchTerm}
                  onChange={(e) => setKirimSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-48 w-full rounded-md border p-4">
                <div className="space-y-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={penerima.includes(user.nama)}
                          onCheckedChange={(checked) => {
                            setPenerima((prev) =>
                              checked
                                ? [...prev, user.nama]
                                : prev.filter((p) => p !== user.nama)
                            );
                          }}
                        />
                        <Label htmlFor={`user-${user.id}`} className="font-normal cursor-pointer">
                          {user.nama} <span className="text-muted-foreground">({user.jabatan})</span>
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">Pengguna tidak ditemukan.</p>
                  )}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Pesan Tambahan (Opsional)</Label>
              <Textarea id="message" placeholder="Tambahkan pesan singkat untuk penerima..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" onClick={closeDialog}>Batal</Button></DialogClose>
            <Button onClick={handleKirimConfirm}>Kirim Surat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialogs */}
      <AlertDialog open={dialogAction === 'arsip' || dialogAction === 'tolak' || dialogAction === 'hapus' || (dialogAction === 'kirim' && isKirimKeVendor)} onOpenChange={(open) => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction === 'kirim' && 'Konfirmasi Penerbitan ke Vendor'}
              {dialogAction === 'arsip' && 'Konfirmasi Arsip Surat'}
              {dialogAction === 'tolak' && 'Konfirmasi Penolakan Surat'}
              {dialogAction === 'hapus' && 'Konfirmasi Hapus Surat'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === 'kirim' && `Apakah Anda yakin ingin menerbitkan surat ini ke portal vendor ${selectedSurat?.dariKe}?`}
              {dialogAction === 'arsip' && 'Apakah Anda yakin ingin mengarsipkan surat ini? Status akan diubah menjadi "Diarsipkan".'}
              {dialogAction === 'tolak' && 'Apakah Anda yakin ingin menolak surat ini? Status akan diubah menjadi "Ditolak".'}
              {dialogAction === 'hapus' && `Apakah Anda yakin ingin menghapus surat nomor ${selectedSurat?.nomor}? Tindakan ini tidak dapat dibatalkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleKirimConfirm}
              className={buttonVariants({ variant: (dialogAction === 'tolak' || dialogAction === 'hapus') ? 'destructive' : 'default' })}
            >
              {dialogAction === 'kirim' && 'Ya, Terbitkan'}
              {dialogAction === 'arsip' && 'Ya, Arsipkan'}
              {dialogAction === 'tolak' && 'Ya, Tolak'}
              {dialogAction === 'hapus' && 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
