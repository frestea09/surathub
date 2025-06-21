
"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Archive,
  Bell,
  FileSearch,
  FileText,
  Home,
  LineChart,
  MoreHorizontal,
  Package,
  PanelLeft,
  Search,
  Settings,
  Share2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { BuatSuratButton } from "@/components/buat-surat-button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";


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

export default function SuratMasukPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [suratList, setSuratList] = useState<SuratMasuk[]>(initialSuratMasukData);
  const [selectedSurat, setSelectedSurat] = useState<SuratMasuk | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDisposisiOpen, setIsDisposisiOpen] = useState(false);
  const [isArsipConfirmOpen, setIsArsipConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("semua");


  const handleActionClick = (surat: SuratMasuk, action: 'detail' | 'disposisi' | 'arsip') => {
    setSelectedSurat(surat);
    if (action === 'detail') setIsDetailOpen(true);
    if (action === 'disposisi') setIsDisposisiOpen(true);
    if (action === 'arsip') setIsArsipConfirmOpen(true);
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

  const handleDisposisiSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tujuan = formData.get('tujuan') as string;
    
    if (!selectedSurat || !tujuan) return;

    setSuratList(prev => 
      prev.map(s => s.nomor === selectedSurat.nomor ? { ...s, status: 'Didisposisikan', disposisi: tujuan } : s)
    );
     toast({
        title: "Disposisi Berhasil",
        description: `Surat nomor ${selectedSurat.nomor} telah didisposisikan ke ${tujuan}.`,
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


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
              <span className="">SuratHub</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/surat-masuk"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Surat Masuk
              </Link>
              <Link
                href="/surat-keluar"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Surat Keluar
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Laporan
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/pengaturan"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Pengaturan
              </Link>
            </nav>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                  <span className="sr-only">SuratHub</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/surat-masuk"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <FileText className="h-5 w-5" />
                  Surat Masuk
                </Link>
                <Link
                  href="/surat-keluar"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Surat Keluar
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Laporan
                </Link>
                 <Link
                  href="/pengaturan"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Pengaturan
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari surat..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <BuatSuratButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/32x32.png" alt="User" data-ai-hint="user avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profil')}>Profil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/pengaturan')}>Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/')}>Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
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
              </TabsList>
            </div>
            <TabsContent value={activeTab}>
                 <Card>
                    <CardHeader>
                        <CardTitle>Daftar Surat Masuk</CardTitle>
                        <CardDescription>Kelola semua surat yang diterima.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nomor Surat</TableHead>
                            <TableHead>Perihal</TableHead>
                            <TableHead>Pengirim</TableHead>
                            <TableHead className="text-center">Tanggal</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Disposisi</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
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
                                  <Badge variant={statusVariant[surat.status]}>{surat.status}</Badge>
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
                                        Lihat Detail
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleActionClick(surat, 'disposisi')} disabled={surat.status !== 'Baru'}>
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Buat Disposisi
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleActionClick(surat, 'arsip')} disabled={surat.status === 'Diarsipkan'}>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Arsipkan
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
        </main>
      </div>

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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Disposisi Surat</DialogTitle>
            <DialogDescription>
              Teruskan surat ke bagian atau pejabat terkait.
            </DialogDescription>
          </DialogHeader>
           <form onSubmit={handleDisposisiSubmit}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="tujuan">Disposisi Kepada</Label>
                    <Select name="tujuan" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Tujuan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Direktur Utama">Direktur Utama</SelectItem>
                            <SelectItem value="Bagian Keuangan">Bagian Keuangan</SelectItem>
                            <SelectItem value="Bagian Pengadaan">Bagian Pengadaan</SelectItem>
                            <SelectItem value="Bagian Rekam Medis">Bagian Rekam Medis</SelectItem>
                            <SelectItem value="HRD">HRD</SelectItem>
                        </SelectContent>
                    </Select>
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

    </div>
  );
}
