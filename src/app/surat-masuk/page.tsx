
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Archive,
  CheckCircle,
  FileSearch,
  Mailbox,
  MoreHorizontal,
  Search,
  Share2,
  Trash2,
  XCircle,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { AppLayout } from "@/components/templates/AppLayout";
import { DataTable } from "@/components/ui/data-table";
import { useSurat, type Surat } from "@/hooks/useSurat";
import { Skeleton } from "@/components/ui/skeleton";

type SuratMasuk = {
    nomor: string;
    perihal: string;
    pengirim: string;
    tanggal: string;
    status: string;
    disposisi: string;
};

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Baru: "secondary",
  Didisposisikan: "outline",
  Selesai: "default",
  Diarsipkan: "default",
  Ditolak: "destructive",
  Draft: "secondary",
  Terkirim: "default",
};

const allRoles = [
  "Direktur",
  "Dewan Pengawas",
  "Satuan Pengawasan Intern (SPI)",
  "Wakil Direktur Umum dan Sumber Daya",
  "Kepala Bagian Umum dan Kepegawaian",
  "Tim Kerja Bidang Umum & Kepegawaian",
  "Kepala Bagian Keuangan",
  "Tim Kerja Bidang Pendapatan",
  "Tim Kerja Bidang Pengeluaran",
  "Kepala Bagian Perencanaan dan Kehumasan",
  "Wakil Direktur Pelayanan",
  "Kepala Bidang Pelayanan Medik",
  "Kepala Bidang Pelayanan Keperawatan",
  "Kepala Bidang Mutu Pelayanan",
  "Kepala Bidang Rawat Inap",
  "Wakil Direktur Penunjang",
  "Kepala Bidang Penunjang Medik",
  "Tim Kerja Bidang Farmasi",
  "Kepala Bidang Penunjang Non-Medik",
  "Komite Rekrutmen Medis",
  "SMF (Sarana Medis Fungsional)",
];

export default function SuratMasukPage() {
  const { toast } = useToast();
  const { surat: allSurat, isLoading } = useSurat();
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [dialogAction, setDialogAction] = useState<'detail' | 'disposisi' | 'lacak' | 'selesai' | 'arsip' | 'tolak' | 'hapus' | null>(null);
  const [disposisiTo, setDisposisiTo] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("semua");
  const [disposisiSearchTerm, setDisposisiSearchTerm] = useState("");

  useEffect(() => {
    if (allSurat) {
        const filtered = allSurat.filter(s => s.jenis === 'Surat Masuk');
        setSuratList(filtered);
    }
  }, [allSurat]);
  
  const closeDialog = () => {
    setSelectedSurat(null);
    setDialogAction(null);
  }

  const handleActionClick = (surat: Surat, action: 'detail' | 'disposisi' | 'lacak' | 'selesai' | 'arsip' | 'tolak' | 'hapus') => {
    setSelectedSurat(surat);
    setDialogAction(action);
    if (action === 'disposisi') {
        setDisposisiTo([]);
        setDisposisiSearchTerm("");
    };
  };
  
  const handleArsipConfirm = () => {
    if (!selectedSurat) return;
    setSuratList(prev => 
      prev.map(s => s.nomor === selectedSurat.nomor ? { ...s, status: 'Diarsipkan' } : s)
    );
    toast({
        title: "Berhasil",
        description: `Surat nomor ${selectedSurat.nomor} telah diarsipkan.`,
    });
    closeDialog();
  };

  const handleTolakConfirm = () => {
    if (!selectedSurat) return;
    setSuratList(prev =>
      prev.map(s => (s.nomor === selectedSurat.nomor ? { ...s, status: 'Ditolak' } : s))
    );
    toast({
      title: "Berhasil",
      description: `Surat nomor ${selectedSurat.nomor} telah ditolak.`,
      variant: "destructive"
    });
    closeDialog();
  };
  
  const handleHapusConfirm = () => {
    if (!selectedSurat) return;
    setSuratList(prev => 
      prev.filter(s => s.nomor !== selectedSurat.nomor)
    );
    toast({
        title: "Berhasil Dihapus",
        description: `Surat nomor ${selectedSurat.nomor} telah dihapus dari sistem.`,
    });
    closeDialog();
  }
  
  const handleSelesaiConfirm = () => {
    if (!selectedSurat) return;
    setSuratList(prev =>
      prev.map(s => s.nomor === selectedSurat.nomor ? { ...s, status: 'Selesai' } : s)
    );
    toast({
      title: "Berhasil",
      description: `Proses untuk surat nomor ${selectedSurat.nomor} telah diselesaikan.`,
    });
    closeDialog();
  };

  const handleDisposisiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSurat || disposisiTo.length === 0) {
        toast({
            variant: "destructive",
            title: "Gagal Disposisi",
            description: "Silakan pilih setidaknya satu tujuan disposisi.",
        });
        return;
    }

    const tujuanJoined = disposisiTo.join(', ');
    setSuratList(prev => 
      prev.map(s => s.nomor === selectedSurat.nomor ? { ...s, status: 'Didisposisikan', penanggungJawab: tujuanJoined } : s)
    );
     toast({
        title: "Disposisi Berhasil",
        description: `Surat nomor ${selectedSurat.nomor} telah didisposisikan ke ${tujuanJoined}.`,
    });
    closeDialog();
  };

  const filteredSurat = useMemo(() => suratList.filter(surat => {
    if (activeTab === "semua") return true;
    if (activeTab === "baru") return surat.status === "Baru";
    if (activeTab === "didisposisikan") return surat.status === "Didisposisikan";
    if (activeTab === "selesai") return surat.status === "Selesai" || surat.status === "Diarsipkan";
    if (activeTab === "ditolak") return surat.status === "Ditolak";
    return true;
  }), [suratList, activeTab]);

  const filteredRoles = allRoles.filter(role =>
    role.toLowerCase().includes(disposisiSearchTerm.toLowerCase())
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
          header: "Pengirim",
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
              return <Badge variant={statusVariant[status]}>{status}</Badge>
          }
      },
      {
          accessorKey: "penanggungJawab",
          header: "Disposisi",
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
                          <DropdownMenuItem onClick={() => handleActionClick(surat, 'disposisi')} disabled={surat.status !== 'Baru'}>
                              <Share2 className="mr-2 h-4 w-4" />
                              Buat Disposisi
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick(surat, 'lacak')} disabled={surat.penanggungJawab === 'Belum'}>
                              <FileSearch className="mr-2 h-4 w-4" />
                              Lacak Disposisi
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleActionClick(surat, 'selesai')} disabled={surat.status !== 'Didisposisikan'}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Selesaikan Proses
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
        <h1 className="text-lg font-semibold md:text-2xl">Surat Masuk</h1>
      </div>
      <Tabs defaultValue="semua" onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="baru">Baru</TabsTrigger>
            <TabsTrigger value="didisposisikan">Didisposisikan</TabsTrigger>
            <TabsTrigger value="selesai">Selesai & Diarsipkan</TabsTrigger>
             <TabsTrigger value="ditolak" className="text-destructive">Ditolak</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={activeTab}>
              <Card>
                <CardHeader>
                    <CardTitle>Daftar Surat Masuk</CardTitle>
                    <CardDescription>Kelola semua surat yang diterima.</CardDescription>
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
            <DialogTitle>Detail Surat Masuk</DialogTitle>
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
                <Label htmlFor="perihal" className="text-right">Perihal</Label>
                <Input id="perihal" value={selectedSurat.judul} readOnly className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pengirim" className="text-right">Pengirim</Label>
                <Input id="pengirim" value={selectedSurat.dariKe} readOnly className="col-span-3" />
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
                <Label htmlFor="disposisi" className="text-right">Disposisi</Label>
                <Input id="disposisi" value={selectedSurat.penanggungJawab} readOnly className="col-span-3" />
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
      
      {/* Disposisi Dialog */}
      <Dialog open={dialogAction === 'disposisi'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <form onSubmit={handleDisposisiSubmit}>
            <DialogHeader>
              <DialogTitle>Buat Disposisi Surat</DialogTitle>
              <DialogDescription>
                Teruskan surat ke bagian atau pejabat terkait. Pilih satu atau lebih tujuan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Tujuan Disposisi</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari peran/jabatan..."
                    value={disposisiSearchTerm}
                    onChange={(e) => setDisposisiSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <ScrollArea className="h-48 w-full rounded-md border p-4">
                  <div className="space-y-2">
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role}`}
                            checked={disposisiTo.includes(role)}
                            onCheckedChange={(checked) => {
                              setDisposisiTo((prev) =>
                                checked ? [...prev, role] : prev.filter((r) => r !== role)
                              );
                            }}
                          />
                          <Label htmlFor={`role-${role}`} className="font-normal cursor-pointer">{role}</Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center">Peran tidak ditemukan.</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instruksi">Instruksi</Label>
                <Textarea id="instruksi" name="instruksi" placeholder="Contoh: 'Untuk ditindaklanjuti segera'" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="catatan">Catatan</Label>
                <Textarea id="catatan" name="catatan" placeholder="Catatan tambahan jika ada..." />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
              <Button type="submit">Kirim Disposisi</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lacak Disposisi Dialog */}
      <Dialog open={dialogAction === 'lacak'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alur Disposisi Surat</DialogTitle>
            <DialogDescription>
              Linimasa pergerakan surat masuk secara internal.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ul className="space-y-4">
                <li className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white">
                            <Mailbox className="h-4 w-4" />
                        </div>
                        <div className="w-px h-16 bg-border"></div>
                    </div>
                    <div>
                        <p className="font-semibold">Surat Diterima</p>
                        <p className="text-sm text-muted-foreground">{selectedSurat?.tanggal}</p>
                        <p className="text-sm">Diterima dari: {selectedSurat?.dariKe}</p>
                    </div>
                </li>
                <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white">
                              <Share2 className="h-4 w-4" />
                          </div>
                          {(selectedSurat?.status === 'Selesai' || selectedSurat?.status === 'Diarsipkan') && <div className="w-px h-16 bg-border"></div>}
                      </div>
                      <div>
                        <p className="font-semibold">Disposisi</p>
                        <p className="text-sm text-muted-foreground">{selectedSurat?.tanggal}</p>
                         <p className="text-sm">Oleh: Direktur, Kepada: {selectedSurat?.penanggungJawab}</p>
                      </div>
                </li>
                  {(selectedSurat?.status === 'Selesai' || selectedSurat?.status === 'Diarsipkan') && (
                    <li className="flex items-start">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold">Selesai Diproses</p>
                          <p className="text-sm text-muted-foreground">2 hari setelah tanggal diterima</p>
                          <p className="text-sm">Proses telah diselesaikan oleh {selectedSurat?.penanggungJawab}.</p>
                        </div>
                    </li>
                  )}
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialogs */}
      <AlertDialog open={['selesai', 'arsip', 'tolak', 'hapus'].includes(dialogAction || '')} onOpenChange={(open) => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction === 'selesai' && 'Konfirmasi Penyelesaian Proses'}
              {dialogAction === 'arsip' && 'Konfirmasi Arsip Surat'}
              {dialogAction === 'tolak' && 'Konfirmasi Penolakan Surat'}
              {dialogAction === 'hapus' && 'Konfirmasi Hapus Surat'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === 'selesai' && 'Apakah Anda yakin ingin menyelesaikan proses untuk surat ini? Status akan diubah menjadi "Selesai".'}
              {dialogAction === 'arsip' && 'Apakah Anda yakin ingin mengarsipkan surat ini? Tindakan ini akan mengubah status surat menjadi "Diarsipkan".'}
              {dialogAction === 'tolak' && 'Apakah Anda yakin ingin menolak surat ini? Status akan diubah menjadi "Ditolak".'}
              {dialogAction === 'hapus' && `Apakah Anda yakin ingin menghapus surat nomor ${selectedSurat?.nomor}? Tindakan ini tidak dapat dibatalkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (dialogAction === 'selesai') handleSelesaiConfirm();
                if (dialogAction === 'arsip') handleArsipConfirm();
                if (dialogAction === 'tolak') handleTolakConfirm();
                if (dialogAction === 'hapus') handleHapusConfirm();
              }}
              className={buttonVariants({ variant: (dialogAction === 'tolak' || dialogAction === 'hapus') ? 'destructive' : 'default' })}
            >
              {dialogAction === 'selesai' && 'Ya, Selesaikan'}
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
