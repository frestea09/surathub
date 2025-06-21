
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Bell,
  Download,
  FilePenLine,
  FileSearch,
  FileText,
  Home,
  LineChart,
  MoreHorizontal,
  Package,
  PanelLeft,
  Search,
  Send,
  Settings,
  UserCheck,
  UserCog,
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
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const initialSuratKeluarData = [
    {
        nomor: "001/SP/RSUD-O/VII/2024",
        perihal: "Surat Perintah Pengadaan ATK",
        tujuan: "Pejabat Pengadaan Barang Jasa",
        tanggal: "2024-07-28",
        status: "Terkirim"
    },
    {
        nomor: "002/SP-V/RSUD-O/VII/2024",
        perihal: "Pesanan Barang Farmasi",
        tujuan: "PT. Medika Jaya",
        tanggal: "2024-07-29",
        status: "Terkirim"
    },
    {
        nomor: "003/BA/RSUD-O/VII/2024",
        perihal: "Berita Acara Pemeriksaan Barang",
        tujuan: "Internal",
        tanggal: "2024-07-30",
        status: "Draft"
    },
    {
        nomor: "004/BASTB/RSUD-O/VII/2024",
        perihal: "Berita Acara Serah Terima Barang",
        tujuan: "Internal",
        tanggal: "2024-07-31",
        status: "Diarsipkan"
    },
     {
        nomor: "005/SPP/RSUD-O/VIII/2024",
        perihal: "Surat Perintah Perjalanan Dinas",
        tujuan: "Dr. Budi Santoso",
        tanggal: "2024-08-01",
        status: "Terkirim"
    },
     {
        nomor: "006/ND/RSUD-O/VIII/2024",
        perihal: "Nota Dinas Rapat Evaluasi",
        tujuan: "Seluruh Kepala Bagian",
        tanggal: "2024-08-02",
        status: "Draft"
    },
];

type SuratKeluar = typeof initialSuratKeluarData[0];

const usersData = [
  {
    id: "user1",
    nama: "Saep Trian Prasetia.S.Si.Apt",
    jabatan: "Pejabat Pembuat Komitmen",
  },
  {
    id: "user2",
    nama: "dr. H. Yani Sumpena Muchtar, SH, MH.Kes",
    jabatan: "Kuasa Pengguna Anggaran",
  },
  {
    id: "user3",
    nama: "Deti Hapitri, A.Md.Gz",
    jabatan: "Pejabat Pengadaan Barang Jasa",
  },
  {
    id: "user4",
    nama: "Admin",
    jabatan: "Direktur",
  },
  {
    id: "user5",
    nama: "Jane Doe",
    jabatan: "Kepala Bagian Keuangan",
  },
];

const notifications = [
  {
    title: "Surat Baru Diterima",
    description: "Surat dari Kemenkes perihal Undangan Rapat.",
    time: "5 menit lalu",
  },
  {
    title: "Disposisi Berhasil",
    description: "Surat 005/B/FIN/2024 telah didisposisikan.",
    time: "1 jam lalu",
  },
  {
    title: "Surat Telah Diarsipkan",
    description: "Surat BAST-2024-04-098 telah diarsipkan.",
    time: "Kemarin",
  },
];


const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Terkirim: "default",
  Draft: "secondary",
  Diarsipkan: "outline",
};

export default function SuratKeluarPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [suratList, setSuratList] = useState<SuratKeluar[]>([]);
  const [selectedSurat, setSelectedSurat] = useState<SuratKeluar | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLacakOpen, setIsLacakOpen] = useState(false);
  const [isArsipConfirmOpen, setIsArsipConfirmOpen] = useState(false);
  const [isKirimDialogOpen, setIsKirimDialogOpen] = useState(false);
  const [penerima, setPenerima] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("semua");
  const [kirimSearchTerm, setKirimSearchTerm] = useState("");
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  useEffect(() => {
    const loadSuratData = () => {
        try {
            if (typeof window === 'undefined') return;

            const suratPerintahList = JSON.parse(localStorage.getItem('suratPerintahList') || '[]').map((s: any) => ({
                nomor: s.nomor,
                perihal: s.perihal,
                tujuan: s.penerima,
                tanggal: s.tempatTanggal ? s.tempatTanggal.split(', ')[1].replace(/\//g, '-') : new Date().toISOString().split('T')[0],
                status: s.status || 'Draft'
            }));
            const suratPesananList = JSON.parse(localStorage.getItem('suratPesananList') || '[]').map((s: any) => ({
                nomor: s.formData.nomor,
                perihal: s.formData.perihal,
                tujuan: s.formData.penerima,
                tanggal: s.formData.tempatTanggal ? s.formData.tempatTanggal.split(', ')[1].replace(/\//g, '-') : new Date().toISOString().split('T')[0],
                status: s.formData.status || 'Draft'
            }));
            const suratPesananFinalList = JSON.parse(localStorage.getItem('suratPesananFinalList') || '[]').map((s: any) => ({
                nomor: s.formData.nomor,
                perihal: s.formData.perihal,
                tujuan: s.formData.penerima,
                tanggal: s.formData.tempatTanggal ? s.formData.tempatTanggal.split(', ')[1].replace(/\//g, '-') : new Date().toISOString().split('T')[0],
                status: s.formData.status || 'Draft'
            }));
             const beritaAcaraList = JSON.parse(localStorage.getItem('beritaAcaraList') || '[]').map((s: any) => ({
                nomor: s.formData.nomor,
                perihal: "Berita Acara Pemeriksaan",
                tujuan: s.formData.vendorNama,
                tanggal: s.formData.tanggalSuratReferensi ? s.formData.tanggalSuratReferensi.replace(/\//g, '-') : new Date().toISOString().split('T')[0],
                status: s.formData.status || 'Draft'
            }));
            const bastbList = JSON.parse(localStorage.getItem('bastbList') || '[]').map((s: any) => ({
                nomor: s.formData.nomor,
                perihal: "Berita Acara Serah Terima",
                tujuan: "Internal",
                tanggal: s.formData.tanggalSuratPesanan ? s.formData.tanggalSuratPesanan.replace(/\//g, '-') : new Date().toISOString().split('T')[0],
                status: s.formData.status || 'Draft'
            }));

            const allSurat = [
                ...initialSuratKeluarData,
                ...suratPerintahList, 
                ...suratPesananList, 
                ...suratPesananFinalList, 
                ...beritaAcaraList, 
                ...bastbList
            ];
            
            const uniqueSurat = allSurat.filter((surat, index, self) =>
                index === self.findIndex((s) => s.nomor === surat.nomor)
            );

            setSuratList(uniqueSurat.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
        } catch (e) {
            console.error("Failed to load surat from localStorage", e);
            setSuratList(initialSuratKeluarData);
        }
    };
    loadSuratData();
  }, []);

  const handleActionClick = (surat: SuratKeluar, action: 'detail' | 'lacak' | 'arsip' | 'kirim') => {
    setSelectedSurat(surat);
    if (action === 'detail') setIsDetailOpen(true);
    if (action === 'lacak') setIsLacakOpen(true);
    if (action === 'arsip') setIsArsipConfirmOpen(true);
    if (action === 'kirim') {
        setPenerima([]);
        setKirimSearchTerm("");
        setIsKirimDialogOpen(true);
    }
  };

  const handleDownloadPdf = () => {
    toast({
        title: "Fitur Dalam Pengembangan",
        description: "Fungsi unduh PDF akan segera tersedia.",
    });
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

  const handleKirimSubmit = () => {
    if (!selectedSurat || penerima.length === 0) {
        toast({
            variant: "destructive",
            title: "Gagal Mengirim",
            description: "Silakan pilih setidaknya satu penerima.",
        });
        return;
    }
    setSuratList(prev => 
      prev.map(s => s.nomor === selectedSurat.nomor ? { ...s, status: 'Terkirim', tujuan: penerima.join(', ') } : s)
    );
    toast({
        title: "Berhasil Terkirim",
        description: `Surat nomor ${selectedSurat.nomor} telah dikirim ke ${penerima.length} penerima.`,
    });
    setIsKirimDialogOpen(false);
    setSelectedSurat(null);
  };
  
  const filteredSurat = suratList.filter(surat => {
    if (activeTab === "semua") return true;
    if (activeTab === "draft") return surat.status === "Draft";
    if (activeTab === "terkirim") return surat.status === "Terkirim";
    if (activeTab === "diarsipkan") return surat.status === "Diarsipkan";
    return true;
  });

  const filteredUsers = usersData.filter(
    user =>
      user.nama.toLowerCase().includes(kirimSearchTerm.toLowerCase()) ||
      user.jabatan.toLowerCase().includes(kirimSearchTerm.toLowerCase())
  );

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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Surat Masuk
              </Link>
              <Link
                href="/surat-keluar"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Surat Keluar
              </Link>
              <Link
                href="/laporan"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Laporan
              </Link>
              <Link
                href="/notifikasi"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Bell className="h-4 w-4" />
                Notifikasi
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <UserCog className="h-4 w-4" />
                Admin
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
                  href="/dashboard"
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
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-5 w-5" />
                  Surat Masuk
                </Link>
                <Link
                  href="/surat-keluar"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Surat Keluar
                </Link>
                <Link
                  href="/laporan"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Laporan
                </Link>
                 <Link
                  href="/notifikasi"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Bell className="h-5 w-5" />
                  Notifikasi
                </Link>
                <Link
                  href="/admin"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <UserCog className="h-5 w-5" />
                  Admin
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
                  placeholder="Cari surat keluar..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu onOpenChange={(open) => { if (open) setShowNotificationBadge(false); }}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-8 w-8 rounded-full">
                {showNotificationBadge && notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">{notifications.length}</Badge>
                )}
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notif, index) => (
                <DropdownMenuItem key={index} className="flex flex-col items-start gap-1 whitespace-normal" onClick={() => router.push('/surat-masuk')}>
                  <p className="font-semibold">{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{notif.description}</p>
                  <p className="text-xs text-muted-foreground">{notif.time}</p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm text-primary" onClick={() => router.push('/notifikasi')}>
                Lihat semua notifikasi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <h1 className="text-lg font-semibold md:text-2xl">Surat Keluar</h1>
          </div>
          <Tabs defaultValue="semua" onValueChange={setActiveTab}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="semua">Semua</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="terkirim">Terkirim</TabsTrigger>
                <TabsTrigger value="diarsipkan">Diarsipkan</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={activeTab}>
                 <Card>
                    <CardHeader>
                        <CardTitle>Daftar Surat Keluar</CardTitle>
                        <CardDescription>Kelola semua surat yang dibuat dan dikirim.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nomor Surat</TableHead>
                            <TableHead>Perihal</TableHead>
                            <TableHead>Tujuan</TableHead>
                            <TableHead className="text-center">Tanggal</TableHead>
                            <TableHead className="text-center">Status</TableHead>
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
                                <TableCell>{surat.tujuan}</TableCell>
                                <TableCell className="text-center">{surat.tanggal}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant={statusVariant[surat.status as keyof typeof statusVariant]}>{surat.status}</Badge>
                                </TableCell>
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
                                      <DropdownMenuItem onClick={() => handleActionClick(surat, 'kirim')} disabled={surat.status !== 'Draft'}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Kirim
                                      </DropdownMenuItem>
                                       <DropdownMenuItem onClick={() => handleActionClick(surat, 'lacak')}>
                                        <FileSearch className="mr-2 h-4 w-4" />
                                        Lacak Alur Pengiriman
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={handleDownloadPdf}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Unduh PDF
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
            <DialogTitle>Detail Surat Keluar</DialogTitle>
            <DialogDescription>
              Detail lengkap dari surat keluar yang dipilih.
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
                <Label htmlFor="tujuan" className="text-right">Tujuan</Label>
                <Input id="tujuan" value={selectedSurat.tujuan} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tanggal" className="text-right">Tanggal</Label>
                <Input id="tanggal" value={selectedSurat.tanggal} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Input id="status" value={selectedSurat.status} readOnly className="col-span-3" />
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
      
      {/* Lacak Pengiriman Dialog */}
      <Dialog open={isLacakOpen} onOpenChange={setIsLacakOpen}>
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
                        <p className="text-sm">Surat berhasil dikirim ke {selectedSurat?.tujuan}.</p>
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
      
      {/* Kirim Surat Dialog */}
      <Dialog open={isKirimDialogOpen} onOpenChange={setIsKirimDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kirim Surat</DialogTitle>
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
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleKirimSubmit}>Kirim Surat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Arsip Confirm Dialog */}
      <AlertDialog open={isArsipConfirmOpen} onOpenChange={setIsArsipConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Arsip Surat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengarsipkan surat ini? Status akan diubah menjadi &quot;Diarsipkan&quot;.
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
