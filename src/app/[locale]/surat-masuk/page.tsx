
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Archive,
  CheckCircle,
  FileSearch,
  Mailbox,
  MoreHorizontal,
  Search,
  Share2,
} from "lucide-react";

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import DashboardLayout from "@/components/dashboard-layout";

const initialSuratMasukData = [
    {
        nomor: "123/A/UM/2024",
        perihal: "Undangan Rapat Koordinasi",
        pengirim: "Kementerian Kesehatan",
        tanggal: "2024-07-25",
        status: "Baru",
        disposisi: "Belum"
    },
    {
        nomor: "005/B/FIN/2024",
        perihal: "Laporan Keuangan Bulanan",
        pengirim: "Bagian Keuangan Internal",
        tanggal: "2024-07-24",
        status: "Didisposisikan",
        disposisi: "Direktur Utama"
    },
    {
        nomor: "PNW/2024/VI/045",
        perihal: "Penawaran Kerjasama Alat Medis",
        pengirim: "PT. Medika Jaya",
        tanggal: "2024-07-22",
        status: "Selesai",
        disposisi: "Bagian Pengadaan"
    },
    {
        nomor: "EXT/VII/2024/001",
        perihal: "Permohonan Data Pasien",
        pengirim: "Dinas Kesehatan Kota",
        tanggal: "2024-07-21",
        status: "Didisposisikan",
        disposisi: "Bagian Rekam Medis"
    },
    {
        nomor: "INT/HRD/2024/012",
        perihal: "Pengajuan Cuti Karyawan",
        pengirim: "John Doe (Staff)",
        tanggal: "2024-07-20",
        status: "Selesai",
        disposisi: "HRD"
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

type SuratMasuk = typeof initialSuratMasukData[0];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Baru: "secondary",
  Didisposisikan: "outline",
  Selesai: "default",
  Diarsipkan: "default",
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
  const t = useTranslations('SuratMasukPage');
  const [suratList, setSuratList] = useState<SuratMasuk[]>(initialSuratMasukData);
  const [selectedSurat, setSelectedSurat] = useState<SuratMasuk | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDisposisiOpen, setIsDisposisiOpen] = useState(false);
  const [disposisiTo, setDisposisiTo] = useState<string[]>([]);
  const [isLacakDisposisiOpen, setIsLacakDisposisiOpen] = useState(false);
  const [isArsipConfirmOpen, setIsArsipConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("semua");
  const [disposisiSearchTerm, setDisposisiSearchTerm] = useState("");


  const handleActionClick = (surat: SuratMasuk, action: 'detail' | 'disposisi' | 'arsip' | 'lacak-disposisi') => {
    setSelectedSurat(surat);
    if (action === 'detail') setIsDetailOpen(true);
    if (action === 'disposisi') {
        setDisposisiTo([]);
        setDisposisiSearchTerm("");
        setIsDisposisiOpen(true);
    };
    if (action === 'arsip') setIsArsipConfirmOpen(true);
    if (action === 'lacak-disposisi') setIsLacakDisposisiOpen(true);
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
    setIsArsipConfirmOpen(false);
    setSelectedSurat(null);
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
      prev.map(s => s.nomor === selectedSurat.nomor ? { ...s, status: 'Didisposisikan', disposisi: tujuanJoined } : s)
    );
     toast({
        title: "Disposisi Berhasil",
        description: `Surat nomor ${selectedSurat.nomor} telah didisposisikan ke ${tujuanJoined}.`,
    });
    setIsDisposisiOpen(false);
    setSelectedSurat(null);
  };

  const filteredSurat = suratList.filter(surat => {
    if (activeTab === "semua") return true;
    if (activeTab === "baru") return surat.status === "Baru";
    if (activeTab === "didisposisikan") return surat.status === "Didisposisikan";
    if (activeTab === "selesai") return surat.status === "Selesai" || surat.status === "Diarsipkan";
    return true;
  });

  const filteredRoles = allRoles.filter(role =>
    role.toLowerCase().includes(disposisiSearchTerm.toLowerCase())
  );

  return (
    <DashboardLayout active_nav="surat-masuk">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{t('title')}</h1>
        </div>
        <Tabs defaultValue="semua" onValueChange={setActiveTab}>
        <div className="flex items-center">
            <TabsList>
            <TabsTrigger value="semua">{t('tabAll')}</TabsTrigger>
            <TabsTrigger value="baru">{t('tabNew')}</TabsTrigger>
            <TabsTrigger value="didisposisikan">{t('tabDisposed')}</TabsTrigger>
            <TabsTrigger value="selesai">{t('tabFinished')}</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value={activeTab}>
                <Card>
                <CardHeader>
                    <CardTitle>{t('cardTitle')}</CardTitle>
                    <CardDescription>{t('cardDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t('tableHeaderNumber')}</TableHead>
                        <TableHead>{t('tableHeaderSubject')}</TableHead>
                        <TableHead>{t('tableHeaderSender')}</TableHead>
                        <TableHead className="text-center">{t('tableHeaderDate')}</TableHead>
                        <TableHead className="text-center">{t('tableHeaderStatus')}</TableHead>
                        <TableHead className="text-center">{t('tableHeaderDisposition')}</TableHead>
                        <TableHead>
                            <span className="sr-only">Aksi</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSurat.map((surat) => (
                        <TableRow key={surat.nomor}>
                            <TableCell className="font-medium">{surat.nomor}</TableCell>
                            <TableCell>{surat.perihal}</TableCell>
                            <TableCell>{surat.pengirim}</TableCell>
                            <TableCell className="text-center">{surat.tanggal}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={statusVariant[surat.status as keyof typeof statusVariant]}>{surat.status}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{surat.disposisi}</TableCell>
                            <TableCell>
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
                                    {t('actionViewDetail')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleActionClick(surat, 'disposisi')} disabled={surat.status !== 'Baru'}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    {t('actionCreateDisposition')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleActionClick(surat, 'lacak-disposisi')} disabled={surat.disposisi === 'Belum'}>
                                    <FileSearch className="mr-2 h-4 w-4" />
                                    {t('actionTrackDisposition')}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleActionClick(surat, 'arsip')} disabled={surat.status === 'Diarsipkan'}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    {t('actionArchive')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
        </TabsContent>
        </Tabs>
      
      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
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
                <Input id="perihal" value={selectedSurat.perihal} readOnly className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pengirim" className="text-right">Pengirim</Label>
                <Input id="pengirim" value={selectedSurat.pengirim} readOnly className="col-span-3" />
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
                <Input id="disposisi" value={selectedSurat.disposisi} readOnly className="col-span-3" />
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
      <Dialog open={isDisposisiOpen} onOpenChange={setIsDisposisiOpen}>
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
      <Dialog open={isLacakDisposisiOpen} onOpenChange={setIsLacakDisposisiOpen}>
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
                        <p className="text-sm">Diterima dari: {selectedSurat?.pengirim}</p>
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
                         <p className="text-sm">Oleh: Direktur, Kepada: {selectedSurat?.disposisi}</p>
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
                          <p className="text-sm">Proses telah diselesaikan oleh {selectedSurat?.disposisi}.</p>
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

      {/* Arsip Confirm Dialog */}
      <AlertDialog open={isArsipConfirmOpen} onOpenChange={setIsArsipConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Arsip Surat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengarsipkan surat ini? Tindakan ini akan mengubah status surat menjadi &quot;Diarsipkan&quot; dan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleArsipConfirm}>Ya, Arsipkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
